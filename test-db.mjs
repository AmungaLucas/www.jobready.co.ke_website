import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function test() {
  try {
    const jobs = await prisma.job.findMany({ where: { status: 'Published' }, take: 3 });
    console.log('JOBS OK:', jobs.length);
    const opps = await prisma.opportunity.findMany({ take: 3 });
    console.log('OPPS OK:', opps.length);
    const companies = await prisma.company.findMany({ take: 3 });
    console.log('COMPANIES OK:', companies.length);
  } catch(e) {
    console.error('ERROR:', e.message);
    console.error(e.stack);
  }
  await prisma.$disconnect();
}
test();
