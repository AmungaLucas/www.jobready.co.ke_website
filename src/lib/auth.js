import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { findOrCreateUser, linkWalkInOrders, getMissingProfileFields } from "@/lib/account-merge";

export const authOptions = {
  // Use JWT strategy for scalability (no database sessions)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom JWT + session callbacks to embed user data
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign-in: embed user data into JWT token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.avatar = user.avatar;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.phoneVerified = user.phoneVerified;
        token.missingFields = user.missingFields || null;
        token.linkedOrders = user.linkedOrders || null;
        token.merged = user.merged || false;
        // Store a timestamp for freshness checks
        token.issuedAt = Date.now();
      }
      return token;
    },

    async session({ session, token }) {
      // Expose embedded user data to client session
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.phone = token.phone;
        session.user.avatar = token.avatar;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
        session.user.phoneVerified = token.phoneVerified;
        session.user.missingFields = token.missingFields;
        session.user.linkedOrders = token.linkedOrders;
        session.user.merged = token.merged;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in: use merge logic
      if (account?.provider === "google") {
        const email = profile?.email?.toLowerCase().trim();

        if (!email) {
          return false;
        }

        console.log(`[Auth] Google OAuth sign-in attempt: ${email}`);

        // Use findOrCreateUser — handles merge, link, create
        const result = await findOrCreateUser({
          email,
          name: profile?.name,
          avatar: profile?.picture,
          provider: "google",
          providerAccountId: account.providerAccountId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          idToken: account.id_token,
          scope: account.scope,
          expiresAt: account.expires_at,
        });

        const dbUser = result.user;
        const missingFields = getMissingProfileFields(dbUser);
        const linkedOrders = await linkWalkInOrders(dbUser.id, email, dbUser.phone);

        console.log(
          `[Auth] Google OAuth: user=${dbUser.id}, created=${result.created}, merged=${result.merged}, linked=${result.linkedProvider}`
        );

        // Attach user data so jwt callback picks it up
        user.id = dbUser.id;
        user.name = dbUser.name;
        user.email = dbUser.email;
        user.phone = dbUser.phone;
        user.avatar = dbUser.avatar || profile?.picture;
        user.role = dbUser.role;
        user.emailVerified = dbUser.emailVerified;
        user.phoneVerified = dbUser.phoneVerified;
        user.missingFields = missingFields;
        user.linkedOrders = linkedOrders;
        user.merged = result.merged;
      }

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
    // Email/Password credentials provider
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
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
          missingFields,
        };
      },
    }),

    // Google OAuth provider
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
