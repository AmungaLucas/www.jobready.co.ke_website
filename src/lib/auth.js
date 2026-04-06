import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  findUserByGoogleId,
  findUserByEmail,
  createUser,
  getMissingProfileFields,
  linkWalkInOrders,
  migrateExistingGoogleUsers,
} from "@/lib/auth-identity";

// ---------------------------------------------------------------------------
// One-time migration: populate googleId from AuthAccount table
// ---------------------------------------------------------------------------
// Idempotent — skips users who already have googleId set.
// Runs when this module is first imported (server-side only).
migrateExistingGoogleUsers().catch((err) => {
  console.error("[Auth] Migration of existing Google users failed:", err);
});

// ---------------------------------------------------------------------------
// Helper: upsert AuthAccount for Google OAuth token storage
// ---------------------------------------------------------------------------
// NextAuth JWT strategy doesn't use an adapter, so we manually
// persist Google tokens for potential future use (API calls, etc.).
async function upsertGoogleAuthAccount(userId, account) {
  if (!account?.providerAccountId) return;

  const expiresAt = account.expires_at
    ? new Date(account.expires_at * 1000)
    : null;

  await db.authAccount.upsert({
    where: { providerAccountId: account.providerAccountId },
    create: {
      userId,
      provider: "google",
      providerAccountId: account.providerAccountId,
      accessToken: account.access_token || null,
      refreshToken: account.refresh_token || null,
      idToken: account.id_token || null,
      expiresAt,
      scope: account.scope || null,
    },
    update: {
      accessToken: account.access_token || null,
      refreshToken: account.refresh_token || null,
      idToken: account.id_token || null,
      expiresAt,
      scope: account.scope || null,
    },
  });
}

// ---------------------------------------------------------------------------
// Attach DB user fields to NextAuth user stub so the jwt callback picks them up
// ---------------------------------------------------------------------------
function attachUserFields(target, dbUser, googlePicture) {
  target.id = dbUser.id;
  target.name = dbUser.name;
  target.email = dbUser.email;
  target.phone = dbUser.phone;
  target.avatar = dbUser.avatar || googlePicture || null;
  target.role = dbUser.role;
  target.googleId = dbUser.googleId || null;
  target.emailVerified = dbUser.emailVerified;
  target.phoneVerified = dbUser.phoneVerified;
  // Safe flag — never expose the actual hash to the client JWT,
  // just a boolean so getMissingProfileFields can calculate correctly.
  target.hasPassword = !!dbUser.passwordHash;
}

// ===========================================================================
// NextAuth Configuration
// ===========================================================================

export const authOptions = {
  // Use JWT strategy for scalability (no database sessions)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom JWT + session callbacks to embed user data
  callbacks: {
    // -----------------------------------------------------------------------
    // JWT callback — embeds user data into the JWT on every sign-in
    // -----------------------------------------------------------------------
    async jwt({ token, user, trigger }) {
      // Initial sign-in: embed user data into JWT token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.avatar = user.avatar;
        token.role = user.role;
        token.googleId = user.googleId || null;
        token.emailVerified = user.emailVerified;
        token.phoneVerified = user.phoneVerified;
        token.hasPassword = user.hasPassword || false;
        token.missingFields = user.missingFields || getMissingProfileFields(user);
        // Store a timestamp for freshness checks
        token.issuedAt = Date.now();
      }

      // Always refresh from DB when session.update() is called,
      // OR when the token is older than 5 minutes (ensures post-merge
      // identity changes are picked up without requiring logout).
      const needsRefresh =
        (trigger === "update") ||
        !token.issuedAt ||
        (Date.now() - (token.issuedAt || 0)) > 5 * 60 * 1000;

      if (needsRefresh && token?.id) {
        try {
          const freshUser = await db.user.findUnique({
            where: { id: token.id },
          });
          if (freshUser) {
            token.email = freshUser.email;
            token.name = freshUser.name;
            token.phone = freshUser.phone;
            token.avatar = freshUser.avatar;
            token.role = freshUser.role;
            token.googleId = freshUser.googleId || null;
            token.emailVerified = freshUser.emailVerified;
            token.phoneVerified = freshUser.phoneVerified;
            token.hasPassword = !!freshUser.passwordHash;
            token.missingFields = getMissingProfileFields(freshUser);
            token.issuedAt = Date.now();
          }
        } catch (err) {
          console.error("[Auth] JWT refresh from DB failed:", err.message);
          // Continue with existing token data — don't break the session
        }
      }

      return token;
    },

    // -----------------------------------------------------------------------
    // Session callback — expose JWT data to the client session
    // -----------------------------------------------------------------------
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.avatar = token.avatar;
        session.user.role = token.role;
        session.user.googleId = token.googleId || null;
        session.user.emailVerified = token.emailVerified;
        session.user.phoneVerified = token.phoneVerified;
        session.user.hasPassword = token.hasPassword || false;
        session.user.missingFields = token.missingFields;
      }
      return session;
    },

    // -----------------------------------------------------------------------
    // signIn callback — Google OAuth identity resolution
    // -----------------------------------------------------------------------
    // Three cases:
    //   1. User found by googleId → login (return true)
    //   2. User found by email but no googleId → redirect to link page
    //   3. No user found → create new user with googleId
    async signIn({ user, account, profile }) {
      // Only handle Google OAuth
      if (account?.provider !== "google") {
        return true;
      }

      const googleId = profile?.sub;
      const email = profile?.email?.toLowerCase().trim();

      if (!email || !googleId) {
        console.warn("[Auth] Google OAuth: missing email or sub in profile");
        return false;
      }

      console.log(`[Auth] Google OAuth sign-in attempt: ${email}`);

      // ------------------------------------------------------------------
      // Case 1: Existing Google user — found by googleId → just login
      // ------------------------------------------------------------------
      let dbUser = await findUserByGoogleId(googleId);
      if (dbUser) {
        console.log(
          `[Auth] Google OAuth: existing user (googleId match) id=${dbUser.id}`
        );
        await upsertGoogleAuthAccount(dbUser.id, account);
        attachUserFields(user, dbUser, profile?.picture);
        return true;
      }

      // ------------------------------------------------------------------
      // Case 2: Email exists but no googleId → needs linking
      // ------------------------------------------------------------------
      // Create an orphaned auth account (userId: null) so the
      // /api/auth/link-google endpoint can find it after password
      // verification.  Then redirect to the login linking page.
      dbUser = await findUserByEmail(email);
      if (dbUser && !dbUser.googleId) {
        console.log(
          `[Auth] Google OAuth: email exists but no googleId — creating orphaned auth account and redirecting to link page (user ${dbUser.id})`
        );
        await upsertGoogleAuthAccount(null, account);
        return `/login?link=google&email=${encodeURIComponent(email)}`;
      }

      // ------------------------------------------------------------------
      // Case 3: No user found → create new Google user
      // ------------------------------------------------------------------
      if (!dbUser) {
        dbUser = await createUser({
          email,
          googleId,
          name: profile?.name || "Google User",
          emailVerified: true,
        });

        await upsertGoogleAuthAccount(dbUser.id, account);
        await linkWalkInOrders(dbUser.id, email, null);

        console.log(`[Auth] Google OAuth: created new user id=${dbUser.id}`);
        attachUserFields(user, dbUser, profile?.picture);
        return true;
      }

      // Edge case: user exists and already has googleId (race condition)
      return true;
    },
  },

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Secret for JWT signing
  secret: process.env.NEXTAUTH_SECRET,

  // Providers
  providers: [
    // -----------------------------------------------------------------------
    // Email/Password credentials provider
    // -----------------------------------------------------------------------
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email.toLowerCase().trim();

        // Find user by email
        const user = await db.user.findUnique({
          where: { email },
          include: { authAccounts: true },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Get missing profile fields
        const missingFields = getMissingProfileFields(user);

        // Return user object (NextAuth merges this into token)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          googleId: user.googleId || null,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          hasPassword: true, // just authenticated with password
          missingFields,
        };
      },
    }),

    // -----------------------------------------------------------------------
    // Google OAuth provider
    // -----------------------------------------------------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],

  // Custom events for logging
  events: {
    async signIn({ user }) {
      console.log(`[Auth] User signed in: ${user.email || user.id}`);
    },
    async signOut({ token }) {
      console.log(`[Auth] User signed out: ${token?.email}`);
    },
  },
};
