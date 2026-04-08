import { siteConfig } from "@/config/site-config";

export const testimonials = [
  {
    name: "Sarah Ochieng",
    initials: "SO",
    role: "Marketing Professional",
    rating: 5,
    text: "I had been applying for jobs for 6 months without success. After JobReady rewrote my CV, I got 3 interview calls in the first week! The investment was worth every shilling.",
    color: "bg-blue-500",
  },
  {
    name: "David Kamau",
    initials: "DK",
    role: "Software Engineer",
    rating: 5,
    text: "The professional CV package was exactly what I needed. They highlighted my technical skills perfectly and I landed a job at a top tech company in Nairobi. Highly recommended!",
    color: "bg-emerald-500",
  },
  {
    name: "Mary Wairimu",
    initials: "MW",
    role: "Recent Graduate",
    rating: 5,
    text: "As a fresh graduate, I didn't know how to present myself. The JobReady team created an amazing CV that showcased my potential. I got my first job within 2 weeks!",
    color: "bg-violet-500",
  },
];

export const faqs = [
  {
    question: "How long does it take to get my CV?",
    answer:
      "Delivery times depend on the package you choose. Basic CVs are delivered within 48 hours, Professional CVs within 24 hours, and Premium CVs within 12 hours. Rush delivery may be available on request.",
  },
  {
    question: "What information do you need from me?",
    answer:
      "We'll need your current CV (if you have one), your target job description(s), educational background, work experience details, and any specific achievements you'd like highlighted. We'll send you a simple form to fill out after you order.",
  },
  {
    question: "Do you offer revisions?",
    answer:
      "Yes! Basic packages include 1 revision, Professional packages include 2 revisions, and Premium packages include unlimited revisions within 30 days. We want to make sure you're 100% satisfied with the result.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. We process payments through M-Pesa and bank transfer. You pay only after confirming your order details. If you're not satisfied with the first draft, we'll revise it at no extra charge.",
  },
  {
    question: "Can you write a CV for a specific industry?",
    answer:
      "Yes! Our team has experience across all major industries in Kenya including banking, ICT, healthcare, education, engineering, government, and NGOs. Just mention your target industry when ordering.",
  },
  {
    question: "What makes JobReady CVs different?",
    answer:
      "Our CVs are specifically designed for the Kenyan job market. We optimize for both ATS systems used by major employers and human recruiters. We understand what Kenyan hiring managers look for and tailor each CV accordingly.",
  },
];

export const howItWorks = [
  {
    step: 1,
    title: "Choose Your Service",
    description: "Select the service and package that best fits your needs — CV writing, cover letter, or LinkedIn optimization.",
    icon: "choose",
  },
  {
    step: 2,
    title: "Share Your Details",
    description: "Fill out a simple form with your current CV, target job, and career goals. We'll guide you through the process.",
    icon: "share",
  },
  {
    step: 3,
    title: "Expert Writes Your CV",
    description: "Our professional writers craft your documents, optimizing for ATS systems and Kenyan recruiter preferences.",
    icon: "write",
  },
  {
    step: 4,
    title: "Receive & Apply",
    description: "Get your polished CV via email, review it, request revisions if needed, and start applying with confidence.",
    icon: "receive",
  },
];

export function getWhatsAppLink(service, tier) {
  const message = encodeURIComponent(
    `Hi JobReady, I'd like to order a ${tier || ""} ${service} service. Please share the details.`
  );
  return `https://wa.me/${siteConfig.whatsapp.number}?text=${message}`;
}
