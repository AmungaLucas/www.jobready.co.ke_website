// Mock data for the Job Detail page

export const jobDetail = {
  id: 1,
  slug: "senior-software-engineer-safaricom-plc",
  title: "Senior Software Engineer",
  location: "Nairobi",
  address: "Safaricom House, Waiyaki Way, Nairobi 00100",
  jobType: "Full-time",
  experienceLevel: "Senior",
  category: "Technology",
  isFeatured: true,
  isNew: false,
  isUrgent: false,
  isRemote: false,
  publishedAt: "2026-03-25T10:00:00.000Z",
  deadline: "2026-04-25T23:59:00.000Z",
  salaryMin: 200000,
  salaryMax: 350000,
  salaryCurrency: "KES",
  showSalary: true,
  applicantCount: 47,
  description: `<h3>About the Role</h3>
<p>Join Safaricom's Technology division as a Senior Software Engineer. Lead the design and development of mission-critical platforms serving 40M+ Kenyans through M-PESA, voice, and data services. This is an opportunity to work at scale on systems that impact millions of lives daily.</p>

<h3>Responsibilities</h3>
<ul>
<li>Architect microservices in Java, Python, and Node.js for high-traffic platforms processing 50M+ daily transactions</li>
<li>Mentor junior and mid-level engineers, driving technical excellence across squads</li>
<li>Design and implement cloud-native solutions on AWS/Azure with 99.99% uptime SLA targets</li>
<li>Lead code reviews, technical design discussions, and architecture decision records</li>
<li>Collaborate with product managers, data scientists, and DevOps teams in an Agile environment</li>
<li>Optimize database performance and implement caching strategies for sub-100ms response times</li>
<li>Drive innovation through proof-of-concept development and technology evaluation</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>BSc Computer Science, Software Engineering, or equivalent; 5+ years of professional experience</li>
<li>Mastery in at least two of: Java (Spring Boot), Python (Django/Flask), or Node.js (Express/NestJS)</li>
<li>Strong experience with Docker, Kubernetes, and CI/CD pipelines</li>
<li>Cloud platform experience (AWS, Azure, or GCP) with Infrastructure as Code (Terraform/CloudFormation)</li>
<li>Proficiency in SQL and NoSQL databases (PostgreSQL, MongoDB, Redis, Elasticsearch)</li>
<li>Experience with message queues (Kafka, RabbitMQ) and event-driven architecture</li>
<li>Excellent problem-solving skills with a strong focus on clean, maintainable code</li>
</ul>

<h3>Nice to Have</h3>
<ul>
<li>Experience with telecom systems (HLR, billing, provisioning)</li>
<li>Knowledge of machine learning and data engineering pipelines</li>
<li>Contributions to open-source projects</li>
<li>AWS or Azure professional-level certification</li>
</ul>

<h3>What We Offer</h3>
<ul>
<li>Competitive salary: KSh 200,000 – 350,000/month plus performance bonuses</li>
<li>Comprehensive medical cover for you and your family (including dental and optical)</li>
<li>25 days annual leave + 5 days personal wellness days</li>
<li>Learning and development budget of KSh 200,000/year for conferences, courses, and certifications</li>
<li>Hybrid working model (3 days in-office, 2 days remote)</li>
<li>Access to Safaricom's state-of-the-art innovation lab and hackathon events</li>
</ul>

<h3>How to Apply</h3>
<p>Submit your application through JobReady.co.ke or apply directly via WhatsApp. Ensure your CV highlights relevant experience and projects. Shortlisted candidates will be contacted within 2 weeks.</p>`,
  tags: ["Java", "Python", "AWS", "Microservices", "Spring Boot", "Kubernetes"],
  company: {
    name: "Safaricom PLC",
    slug: "safaricom-plc",
    logoColor: "#00a254",
    isVerified: true,
    description:
      "Safaricom is East Africa's leading telecommunications company, providing mobile voice, data, and financial services to over 40 million subscribers in Kenya.",
    industry: "Telecommunications",
    size: "5,000+",
    foundedYear: 1999,
    website: "https://www.safaricom.co.ke",
  },
};

export const similarJobs = [
  {
    id: 5,
    slug: "software-engineer-backend-java-safaricom",
    title: "Software Engineer — Backend (Java)",
    location: "Nairobi",
    jobType: "Full-time",
    experienceLevel: "Mid",
    category: "Technology",
    isFeatured: false,
    isNew: true,
    isUrgent: false,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    company: {
      name: "Safaricom PLC",
      slug: "safaricom-plc",
      logoColor: "#00a254",
      isVerified: true,
    },
  },
  {
    id: 3,
    slug: "data-scientist-kcb-group",
    title: "Data Scientist",
    location: "Nairobi",
    jobType: "Full-time",
    experienceLevel: "Mid",
    category: "Technology",
    isFeatured: false,
    isNew: true,
    isUrgent: false,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    company: {
      name: "KCB Group",
      slug: "kcb-group",
      logoColor: "#1a56db",
      isVerified: true,
    },
  },
  {
    id: 9,
    slug: "project-manager-unep-nairobi",
    title: "Project Manager — Climate Adaptation",
    location: "Nairobi",
    jobType: "Contract",
    experienceLevel: "Senior",
    category: "NGO",
    isFeatured: false,
    isNew: true,
    isUrgent: false,
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    company: {
      name: "UNEP Kenya",
      slug: "unep-kenya",
      logoColor: "#009688",
      isVerified: true,
    },
  },
  {
    id: 11,
    slug: "product-manager-m-pesa-safaricom",
    title: "Product Manager — M-PESA",
    location: "Nairobi",
    jobType: "Full-time",
    experienceLevel: "Senior",
    category: "Technology",
    isFeatured: true,
    isNew: false,
    isUrgent: false,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    company: {
      name: "Safaricom PLC",
      slug: "safaricom-plc",
      logoColor: "#00a254",
      isVerified: true,
    },
  },
];

export const companyJobs = [
  {
    id: 11,
    slug: "product-manager-m-pesa-safaricom",
    title: "Product Manager — M-PESA",
    location: "Nairobi",
    jobType: "Full-time",
    experienceLevel: "Senior",
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    slug: "software-engineer-backend-java-safaricom",
    title: "Software Engineer — Backend (Java)",
    location: "Nairobi",
    jobType: "Full-time",
    experienceLevel: "Mid",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 16,
    slug: "it-support-intern-ncba",
    title: "IT Support Intern",
    location: "Nairobi",
    jobType: "Internship",
    experienceLevel: "Entry",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
