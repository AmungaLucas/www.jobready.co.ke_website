import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Database connection — DATABASE_URL must be set in environment.
// IMPORTANT: Special characters in passwords MUST be URL-encoded:
//   @ → %40    % → %25    # → %23    ? → %3F
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
    "The application cannot start without a database connection. " +
    "Please set DATABASE_URL in your .env file or hosting environment."
  );
}

export const db = globalForPrisma.prisma || new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
  log: process.env.NODE_ENV === "development" ? ["error"] : [],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
