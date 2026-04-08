import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testHomepage() {
  try {
    console.log("1. Testing latestJobs query...");
    const latestJobs = await prisma.job.findMany({
      where: { status: "Published", isActive: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        company: {
          select: { name: true, slug: true, logo: true, logoColor: true, isVerified: true },
        },
      },
    });
    console.log("  OK:", latestJobs.length, "jobs");

    console.log("2. Testing featuredJobs query...");
    const featuredJobs = await prisma.job.findMany({
      where: { status: "Published", isActive: true, isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        company: {
          select: { name: true, slug: true, logo: true, logoColor: true, isVerified: true },
        },
      },
    });
    console.log("  OK:", featuredJobs.length, "featured jobs");

    console.log("3. Testing deadlineJobs query...");
    const deadlineJobs = await prisma.job.findMany({
      where: { status: "Published", isActive: true, applicationDeadline: { gte: new Date() } },
      orderBy: { applicationDeadline: "asc" },
      take: 3,
      include: { company: { select: { name: true, slug: true } } },
    });
    console.log("  OK:", deadlineJobs.length, "deadline jobs");

    console.log("4. Testing opportunities query...");
    const latestOpportunities = await prisma.opportunity.findMany({
      where: { status: "Published", isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { company: { select: { name: true } } },
    });
    console.log("  OK:", latestOpportunities.length, "opportunities");

    console.log("5. Testing companies query...");
    const topCompanies = await prisma.company.findMany({
      where: { isActive: true },
      orderBy: { jobCount: "desc" },
      take: 5,
      select: {
        id: true, name: true, slug: true, logo: true, logoColor: true,
        isVerified: true, jobCount: true,
        _count: { select: { jobs: { where: { status: "Published", isActive: true } } } },
      },
    });
    console.log("  OK:", topCompanies.length, "companies");

    console.log("6. Testing counts...");
    const totalJobs = await prisma.job.count({ where: { status: "Published", isActive: true } });
    const totalCompanies = await prisma.company.count({ where: { isActive: true } });
    console.log("  OK:", totalJobs, "jobs,", totalCompanies, "companies");

    console.log("\n✅ ALL QUERIES PASSED!");
  } catch(e) {
    console.error("\n❌ ERROR:", e.message);
    console.error("Code:", e.code);
    console.error("Stack:", e.stack);
  }
  await prisma.$disconnect();
}
testHomepage();
