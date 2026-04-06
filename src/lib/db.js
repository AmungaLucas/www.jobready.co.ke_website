import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

// Force MySQL connection — system env DATABASE_URL points to local SQLite
// which has no data. The real database is on da27.host-ww.net.
const DATABASE_URL =
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.startsWith("mysql://")
    ? process.env.DATABASE_URL
    : "mysql://jobready_db_admin:Amush@100%@da27.host-ww.net:3306/jobready_db";

export const db = globalForPrisma.prisma || new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
  log: process.env.NODE_ENV === "development" ? ["error"] : [],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
