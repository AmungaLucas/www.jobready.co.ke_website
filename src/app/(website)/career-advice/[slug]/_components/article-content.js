// Rich article HTML content for the blog article detail page
export function getArticleHtml() {
  return `
<h2 id="why-cv-matters" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">Why Your CV Matters More Than You Think</h2>
<p class="mb-[18px]">Your CV is often the first impression you make on a potential employer. In Kenya's competitive job market, where a single job posting can attract <strong class="text-gray-900 font-bold">hundreds of applications</strong>, your CV needs to do more than just list your qualifications — it needs to tell your story and prove you're the right fit.</p>

<blockquote class="border-l-4 border-blue-600 bg-blue-50 p-5 my-6 rounded-r-xl italic text-gray-700">
  <p class="mb-0">"Recruiters spend an average of 6-8 seconds scanning a CV before deciding whether to shortlist it. If your CV doesn't immediately communicate your value, you've already lost the opportunity." — Kenya HR Professionals Survey, 2025</p>
</blockquote>

<p class="mb-[18px]">According to recent data from the Kenya Private Sector Alliance (KEPSA), over <strong class="text-gray-900 font-bold">78% of employers in Kenya now use Applicant Tracking Systems (ATS)</strong> to filter CVs before a human ever sees them. This means your CV needs to be both machine-readable and human-compelling.</p>

<div class="bg-emerald-100 border-2 border-emerald-600 rounded-xl p-5 my-6 flex gap-3.5">
  <div class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
    <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
  </div>
  <div>
    <strong class="block text-sm text-emerald-800 mb-1">Pro Tip:</strong>
    <p class="m-0 text-sm text-gray-700 leading-relaxed">Before writing your CV, research the company and role. Understanding what they value helps you highlight the most relevant skills and achievements.</p>
  </div>
</div>

<h2 id="understanding-ats" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">Understanding ATS Systems in Kenya</h2>
<p class="mb-[18px]">Applicant Tracking Systems are software applications used by companies to manage their recruitment process. Major Kenyan employers like <strong class="text-gray-900 font-bold">Safaricom, Equity Bank, KCB Group, and KenGen</strong> all use ATS to manage the thousands of applications they receive monthly.</p>
<p class="mb-[18px]">Here's what ATS systems look for:</p>
<ul class="mb-[18px] pl-6 space-y-2">
  <li><strong class="text-gray-900 font-bold">Keywords:</strong> Match the job description's terminology</li>
  <li><strong class="text-gray-900 font-bold">Formatting:</strong> Simple layouts with standard section headers</li>
  <li><strong class="text-gray-900 font-bold">File type:</strong> PDF is safest, though some ATS prefer .docx</li>
  <li><strong class="text-gray-900 font-bold">Contact info:</strong> Must be in a standard, recognizable format</li>
  <li><strong class="text-gray-900 font-bold">Date formats:</strong> Use consistent date formatting throughout</li>
</ul>

<div class="bg-red-100 border-2 border-red-600 rounded-xl p-5 my-6 flex gap-3.5">
  <div class="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
    <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  </div>
  <div>
    <strong class="block text-sm text-red-600 mb-1">Warning:</strong>
    <p class="m-0 text-sm text-gray-700 leading-relaxed">Avoid tables, columns, graphics, and headers/footers in your CV. These can confuse ATS software and cause your CV to be rejected even if you're qualified.</p>
  </div>
</div>

<h2 id="perfect-structure" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">The Perfect CV Structure for 2026</h2>
<p class="mb-[18px]">A well-structured CV follows a logical flow that makes it easy for recruiters to find the information they need. Here's the ideal structure for a Kenyan CV in 2026:</p>
<ol class="mb-[18px] pl-6 space-y-2 list-decimal list-inside">
  <li><strong class="text-gray-900 font-bold">Contact Information</strong> — Name, phone, email, LinkedIn, location</li>
  <li><strong class="text-gray-900 font-bold">Professional Summary</strong> — 3-4 lines summarizing your value proposition</li>
  <li><strong class="text-gray-900 font-bold">Work Experience</strong> — Reverse chronological, with achievements</li>
  <li><strong class="text-gray-900 font-bold">Education</strong> — Degrees, certifications, relevant coursework</li>
  <li><strong class="text-gray-900 font-bold">Skills</strong> — Hard skills, soft skills, technical tools</li>
  <li><strong class="text-gray-900 font-bold">Professional Development</strong> — Certifications, training, workshops</li>
</ol>

<h2 id="writing-each-section" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">Step-by-Step: Writing Each Section</h2>
<h3 class="text-lg font-bold text-gray-900 mt-7 mb-3 leading-snug">Professional Summary</h3>
<p class="mb-[18px]">Your professional summary is the most important section of your CV. It should be a <strong class="text-gray-900 font-bold">3-4 line paragraph</strong> that immediately tells the recruiter who you are, what you do, and what value you bring.</p>
<p class="mb-[18px]">Use the <strong class="text-gray-900 font-bold">STAR method</strong> to frame your achievements: Situation, Task, Action, Result. Quantify everything possible — numbers stand out in a sea of text.</p>

<h3 class="text-lg font-bold text-gray-900 mt-7 mb-3 leading-snug">Work Experience</h3>
<p class="mb-[18px]">For each role, include:</p>
<ul class="mb-[18px] pl-6 space-y-2 list-disc list-inside">
  <li>Job title and company name</li>
  <li>Employment dates (month/year format)</li>
  <li>3-5 bullet points with quantifiable achievements</li>
  <li>Action verbs: Led, Managed, Developed, Increased, Implemented</li>
</ul>

<div class="bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-400 rounded-xl p-6 my-7 text-center">
  <h4 class="text-base font-extrabold text-amber-900 mb-1.5 flex items-center justify-center gap-2">
    <svg class="w-5 h-5 text-amber-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    Not Sure Where to Start?
  </h4>
  <p class="text-sm text-amber-900 leading-relaxed mb-4">Our expert CV writers have helped 5,000+ Kenyan professionals create interview-winning CVs. Starting from just KSh 500.</p>
  <a href="/cv-services" class="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-amber-900 text-white text-sm font-bold hover:bg-amber-800 transition-colors no-underline">Get Your CV Done — KSh 500</a>
</div>

<h2 id="common-mistakes" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">10 Common CV Mistakes Kenyan Job Seekers Make</h2>
<ol class="mb-[18px] pl-6 space-y-2 list-decimal list-inside">
  <li><strong class="text-gray-900 font-bold">Using an unprofessional email address</strong> — Use firstname.lastname@gmail.com</li>
  <li><strong class="text-gray-900 font-bold">Including a photo</strong> — Unless specifically requested, skip it</li>
  <li><strong class="text-gray-900 font-bold">Generic objective statements</strong> — Replace with a targeted professional summary</li>
  <li><strong class="text-gray-900 font-bold">Listing duties instead of achievements</strong> — Show results, not responsibilities</li>
  <li><strong class="text-gray-900 font-bold">Poor formatting</strong> — Use consistent fonts, spacing, and alignment</li>
  <li><strong class="text-gray-900 font-bold">Spelling and grammar errors</strong> — Always proofread, then proofread again</li>
  <li><strong class="text-gray-900 font-bold">Making it too long</strong> — 2 pages maximum for experienced professionals</li>
  <li><strong class="text-gray-900 font-bold">Not tailoring for each application</strong> — Customize your CV for every job</li>
  <li><strong class="text-gray-900 font-bold">Using outdated information</strong> — Keep your CV current and relevant</li>
  <li><strong class="text-gray-900 font-bold">Missing contact information</strong> — Ensure phone and email are correct and professional</li>
</ol>

<h2 id="free-templates" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">Free CV Templates for Kenyan Job Seekers</h2>
<p class="mb-[18px]">We've created free, ATS-optimized CV templates specifically designed for the Kenyan job market. These templates are tested with popular ATS systems and have helped thousands of job seekers get shortlisted.</p>

<h2 id="tailor-cv" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">How to Tailor Your CV for Each Application</h2>
<p class="mb-[18px]">Tailoring your CV doesn't mean rewriting it from scratch each time. Here's a quick process:</p>
<ul class="mb-[18px] pl-6 space-y-2 list-disc list-inside">
  <li><strong class="text-gray-900 font-bold">Step 1:</strong> Read the job description carefully — highlight key requirements</li>
  <li><strong class="text-gray-900 font-bold">Step 2:</strong> Match your skills and experience to those requirements</li>
  <li><strong class="text-gray-900 font-bold">Step 3:</strong> Reorder bullet points to lead with the most relevant achievements</li>
  <li><strong class="text-gray-900 font-bold">Step 4:</strong> Adjust your professional summary to reflect the specific role</li>
  <li><strong class="text-gray-900 font-bold">Step 5:</strong> Mirror the job description's language and keywords</li>
</ul>

<h2 id="professional-vs-diy" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">Professional CV Writing vs. DIY</h2>
<p class="mb-[18px]">While writing your own CV is possible, professional CV writers offer several advantages:</p>
<ul class="mb-[18px] pl-6 space-y-2 list-disc list-inside">
  <li>Industry-specific knowledge of what recruiters look for</li>
  <li>ATS optimization expertise</li>
  <li>Professional formatting and language</li>
  <li>Objective feedback on your career narrative</li>
  <li>Time savings — let experts handle it while you focus on interviews</li>
</ul>

<h2 id="final-checklist" class="text-[1.35rem] font-extrabold text-gray-900 mt-9 mb-4 leading-tight tracking-tight">Final CV Checklist Before Applying</h2>
<ul class="list-none pl-0 m-0">
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    Contact information is complete and correct
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    Professional summary is targeted and compelling
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    Work experience uses action verbs and quantified achievements
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    Education section includes relevant certifications
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    Skills section matches the job description keywords
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    No spelling or grammar errors
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    Formatting is consistent throughout
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    CV is 1-2 pages maximum
  </li>
  <li class="flex items-start gap-2.5 py-2.5 border-b border-gray-100 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    File is saved as PDF with professional filename
  </li>
  <li class="flex items-start gap-2.5 py-2.5 text-sm text-gray-700">
    <svg class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
    Customized for the specific role and company
  </li>
</ul>

<p class="mt-[18px]">Following this guide will significantly improve your chances of getting shortlisted for interviews. Remember, your CV is a living document — keep it updated and tailored for each opportunity. Good luck with your job search!</p>
  `;
}
