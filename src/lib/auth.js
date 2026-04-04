import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

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
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in: create/find user + auth account
      if (account?.provider === "google") {
        const email = profile?.email?.toLowerCase().trim();

        if (!email) {
          return false;
        }

        // Find or create user
        const existingUser = await db.user.findUnique({
          where: { email },
          include: { authAccounts: true },
        });

        if (existingUser) {
          // User exists — link Google account if not already linked
          const hasGoogleAccount = existingUser.authAccounts.some(
            (a) => a.provider === "google"
          );

          if (!hasGoogleAccount) {
            await db.authAccount.create({
              data: {
                userId: existingUser.id,
                provider: "google",
                providerAccountId: account.providerAccountId,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                idToken: account.id_token,
                expiresAt: account.expires_at
                  ? new Date(account.expires_at * 1000)
                  : null,
                scope: account.scope,
              },
            });
          } else {
            // Update tokens for existing Google account
            const googleAccount = existingUser.authAccounts.find(
              (a) => a.provider === "google"
            );
            await db.authAccount.update({
              where: { id: googleAccount.id },
              data: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token || googleAccount.refreshToken,
                idToken: account.id_token,
                expiresAt: account.expires_at
                  ? new Date(account.expires_at * 1000)
                  : null,
                scope: account.scope,
              },
            });
          }

          // Update last login and mark email as verified
          await db.user.update({
            where: { id: existingUser.id },
            data: {
              lastLoginAt: new Date(),
              emailVerified: true,
              name: existingUser.name || profile?.name || null,
              avatar: existingUser.avatar || profile?.picture || null,
            },
          });

          // ── Link any unlinked walk-in orders matching this email ──
          try {
            await db.order.updateMany({
              where: { email, userId: null },
              data: { userId: existingUser.id },
            });
          } catch (linkErr) {
            console.error("[Auth] Order linking failed:", linkErr.message);
          }

          // Attach user ID to the user object so jwt callback picks it up
          user.id = existingUser.id;
          user.name = existingUser.name || profile?.name;
          user.email = existingUser.email;
          user.phone = existingUser.phone;
          user.avatar = existingUser.avatar || profile?.picture;
          user.role = existingUser.role;
          user.emailVerified = existingUser.emailVerified;
          user.phoneVerified = existingUser.phoneVerified;
        } else {
          // Create new user from Google profile
          const newUser = await db.user.create({
            data: {
              email,
              name: profile?.name || "",
              avatar: profile?.picture || null,
              emailVerified: true, // Google emails are verified
            },
          });

          // Create auth account
          await db.authAccount.create({
            data: {
              userId: newUser.id,
              provider: "google",
              providerAccountId: account.providerAccountId,
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              idToken: account.id_token,
              expiresAt: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
              scope: account.scope,
            },
          });

          // Attach to user object for jwt callback
          user.id = newUser.id;
          user.name = newUser.name;
          user.email = newUser.email;
          user.phone = newUser.phone;
          user.avatar = newUser.avatar;
          user.role = newUser.role;
          user.emailVerified = newUser.emailVerified;
          user.phoneVerified = newUser.phoneVerified;
        }
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
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        // ── Phone OTP login path ──
        // When phone is provided and password is the special OTP marker,
        // authenticate via phone (OTP already verified by /api/auth/verify-otp)
        if (credentials?.phone && credentials.password === "__phone_otp_verified__") {
          const phone = credentials.phone;
          const user = await db.user.findUnique({
            where: { phone },
          });

          if (!user) {
            throw new Error("User not found for this phone number");
          }

          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            emailVerified: user.emailVerified,
            phoneVerified: true,
          };
        }

        // ── Email/Password login path ──
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
      // Log successful sign-in (could be extended for analytics)
      console.log(`[Auth] User signed in: ${user.email}`);
    },
    async signOut({ token }) {
      console.log(`[Auth] User signed out: ${token?.email}`);
    },
  },
};
