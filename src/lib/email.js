import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site-config";

/**
 * Email service utility for JobReady.co.ke
 *
 * Uses Nodemailer with SMTP transport via the configured SMTP_HOST.
 * Supports contextual sender addresses (noreply, payments, cv, support).
 * Falls back gracefully in development if SMTP is not configured.
 */

// ─── Transporter cache (keyed by auth user) ───────────────────────────
const transporters = {};

/**
 * Get or create a transporter for a specific SMTP user.
 * Defaults to the main SMTP_USER if no user specified.
 */
function getTransporter(smtpUser, smtpPass) {
  const cacheKey = smtpUser || "default";
  if (transporters[cacheKey]) return transporters[cacheKey];

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;

  if (host && port) {
    transporters[cacheKey] = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: parseInt(port, 10) === 465,
      auth: {
        user: smtpUser || process.env.SMTP_USER || "",
        pass: smtpPass || process.env.SMTP_PASS || "",
      },
      connectionTimeout: 5000,
      greetingTimeout: 3000,
      socketTimeout: 10000,
    });
  }

  return transporters[cacheKey] || null;
}

// Backward-compatible alias
function getTransporterLegacy() {
  return getTransporter(process.env.SMTP_USER, process.env.SMTP_PASS);
}

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text fallback
 * @param {string} [options.from] - Override sender (default: noreply from siteConfig)
 * @param {string} [options.replyTo] - Reply-to address
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendEmail({ to, subject, html, text, from, replyTo, senderType }) {
  // Resolve contextual SMTP credentials based on sender type
  let smtpUser = process.env.SMTP_USER;
  let smtpPass = process.env.SMTP_PASS;

  if (senderType === "payments" && process.env.SMTP_USER_PAYMENTS) {
    smtpUser = process.env.SMTP_USER_PAYMENTS;
    smtpPass = process.env.SMTP_PASS_PAYMENTS;
  } else if (senderType === "cv" && process.env.SMTP_USER_CV) {
    smtpUser = process.env.SMTP_USER_CV;
    smtpPass = process.env.SMTP_PASS_CV;
  } else if (senderType === "support" && process.env.SMTP_USER_SUPPORT) {
    smtpUser = process.env.SMTP_USER_SUPPORT;
    smtpPass = process.env.SMTP_PASS_SUPPORT;
  }

  const transport = getTransporter(smtpUser, smtpPass);

  const mailOptions = {
    from: from || `"${siteConfig.companyName}" <${smtpUser || siteConfig.email.noreply}>`,
    to,
    subject,
    replyTo: replyTo || siteConfig.email.support,
    html,
    text: text || stripHtml(html),
  };

  // If no SMTP configured, log warning and return failure in production
  if (!transport) {
    console.warn(`[Email Service] SMTP not configured — email NOT sent:`);
    console.warn(`  To: ${to}`);
    console.warn(`  Subject: ${subject}`);
    console.warn(`  From: ${mailOptions.from}`);
    if (process.env.NODE_ENV === "development") {
      console.log(`  HTML preview: ${html?.substring(0, 200)}...`);
    }
    // In production, return failure so callers know the email wasn't sent
    if (process.env.NODE_ENV === "production") {
      return { success: false, error: "SMTP not configured — set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS" };
    }
    return { success: true, messageId: `dev-${Date.now()}` };
  }

  try {
    const info = await transport.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// ─── Email Templates ────────────────────────────────────────────────

const BASE_URL = process.env.NEXTAUTH_URL || siteConfig.url;

const BRAND_STYLES = `
  body { margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  .header { background: linear-gradient(135deg, #1a56db, #1e40af); padding: 30px 30px 20px; text-align: center; }
  .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
  .header p { margin: 5px 0 0; color: rgba(255,255,255,0.85); font-size: 14px; }
  .body { padding: 30px; color: #374151; font-size: 15px; line-height: 1.6; }
  .body h2 { font-size: 18px; color: #111827; margin: 20px 0 10px; }
  .btn { display: inline-block; background: #1a56db; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 16px 0; }
  .btn:hover { background: #1648b8; }
  .footer { padding: 20px 30px; text-align: center; border-top: 1px solid #f3f4f6; color: #6b7280; font-size: 12px; line-height: 1.5; }
  .footer a { color: #1a56db; text-decoration: none; }
`;

function wrapEmail(title, subtitle, bodyHtml) {
  return `<!DOCTYPE html><html><head><style>${BRAND_STYLES}</style></head><body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
      <div class="body">${bodyHtml}</div>
      <div class="footer">
        <p><strong>${siteConfig.companyName}</strong> — Kenya's #1 Job Board</p>
        <p>
          <a href="${BASE_URL}">${BASE_URL}</a> ·
          <a href="${BASE_URL}/privacy">Privacy</a> ·
          <a href="${BASE_URL}/terms">Terms</a> ·
          <a href="${BASE_URL}/contact">Contact</a>
        </p>
        <p style="margin-top:8px;color:#9ca3af;">
          You're receiving this because you have an account on ${siteConfig.brandName}.
          If you did not initiate this action, please ignore this email.
        </p>
      </div>
    </div>
  </div></body></html>`;
}

/**
 * Password reset email
 */
export function passwordResetTemplate(name, resetUrl) {
  const html = wrapEmail(
    "Reset Your Password",
    "Use the link below to set a new password",
    `
      <p>Hello${name ? ` ${name}` : ""},</p>
      <p>We received a request to reset the password for your ${siteConfig.shortName} account. Click the button below to choose a new password:</p>
      <p style="text-align:center;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </p>
      <p style="font-size:13px;color:#6b7280;">
        This link will expire in <strong>1 hour</strong>. After that, you'll need to request a new reset link.
      </p>
      <p style="font-size:13px;color:#6b7280;">
        If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
      </p>
      <p style="font-size:13px;color:#9ca3af;margin-top:16px;">
        If the button doesn't work, copy and paste this URL into your browser:<br/>
        <a href="${resetUrl}" style="word-break:break-all;font-size:12px;">${resetUrl}</a>
      </p>
    `
  );
  return { html, text: `Reset your ${siteConfig.shortName} password: ${resetUrl}` };
}

/**
 * Contact form submission notification (to support team)
 */
export function contactFormTemplate({ name, email, subject, message }) {
  const html = wrapEmail(
    "New Contact Form Submission",
    subject,
    `
      <h2>Submission Details</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <h2>Message</h2>
      <div style="background:#f9fafb;border-left:4px solid #1a56db;padding:16px;border-radius:0 8px 8px 0;">
        <p style="margin:0;white-space:pre-wrap;">${message}</p>
      </div>
      <p style="margin-top:16px;font-size:13px;color:#6b7280;">
        Reply directly to this email to respond to ${name}.
      </p>
    `
  );
  return { html, text: `New contact from ${name} (${email}): ${subject}\n\n${message}` };
}

/**
 * Newsletter confirmation email
 */
export function newsletterConfirmationTemplate(email, type) {
  const typeLabels = {
    JOB_ALERTS: "Job Alerts",
    CAREER_TIPS: "Career Tips",
    OPPORTUNITY_ALERTS: "Opportunity Alerts",
    EMPLOYER_UPDATES: "Employer Updates",
  };
  const label = typeLabels[type] || "Newsletter";

  const html = wrapEmail(
    "You're Subscribed!",
    `${label} — ${siteConfig.companyName}`,
    `
      <p>Welcome to ${siteConfig.shortName}!</p>
      <p>You've been successfully subscribed to <strong>${label}</strong> on ${siteConfig.brandName}.</p>
      <p>Here's what to expect:</p>
      <ul>
        <li>Curated ${type === "JOB_ALERTS" ? "job openings" : type === "OPPORTUNITY_ALERTS" ? "opportunities" : "career insights"} delivered to your inbox</li>
        <li>Tips and resources to advance your career</li>
        <li>No spam — only relevant, high-quality content</li>
      </ul>
      <p style="text-align:center;">
        <a href="${BASE_URL}/jobs" class="btn">Browse Jobs Now</a>
      </p>
      <p style="font-size:13px;color:#6b7280;">
        To unsubscribe at any time, click the unsubscribe link in any email,
        or visit your <a href="${BASE_URL}/dashboard/alerts">dashboard</a>.
      </p>
    `
  );
  return { html, text: `You're subscribed to ${label} on ${siteConfig.brandName}!` };
}

/**
 * Application receipt email (to job seeker)
 */
export function applicationReceiptTemplate({ userName, jobTitle, companyName, slug }) {
  const html = wrapEmail(
    "Application Submitted",
    `You applied to ${jobTitle}`,
    `
      <p>Congratulations${userName ? ` ${userName}` : ""}!</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted through ${siteConfig.brandName}.</p>
      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;color:#166534;font-weight:600;">
          Your application is now in the employer's review queue.
        </p>
      </div>
      <h2>What happens next?</h2>
      <ol>
        <li>The employer will review your profile and application</li>
        <li>You'll be notified of any status updates via email</li>
        <li>You can track all your applications in your <a href="${BASE_URL}/dashboard/applications">dashboard</a></li>
      </ol>
      <p style="text-align:center;margin-top:8px;">
        <a href="${BASE_URL}/job/${slug}" class="btn">View Job Listing</a>
      </p>
      <p style="text-align:center;margin-top:4px;">
        <a href="${BASE_URL}/dashboard/applications" style="font-size:14px;color:#1a56db;">Track Your Applications</a>
      </p>
    `
  );
  return { html, text: `Your application for ${jobTitle} at ${companyName} has been submitted via ${siteConfig.brandName}.` };
}

// ═══════════════════════════════════════════════════════════════
// SCENARIO-SPECIFIC WELCOME & ACCOUNT EMAILS
// ═══════════════════════════════════════════════════════════════

/**
 * 1. Credential sign-up welcome — user has email + phone + password
 *    but nothing is verified yet.
 */
export function welcomeCredentialSignup({ name, email, hasPhone }) {
  const html = wrapEmail(
    `Welcome to ${siteConfig.shortName}! 👋`,
    "Your account has been created",
    `
      <p>Welcome${name ? ` ${name}` : ""} to ${siteConfig.brandName}!</p>
      <p>Your account has been successfully created. You're now part of Kenya's fastest-growing job board and career platform.</p>

      <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#92400e;">
          ⚡ To get the most out of your account, complete these steps:
        </p>
      </div>

      <h2>Complete Your Account</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0;">
        <tr>
          <td style="padding:8px 0;color:#374151;">
            ${hasPhone ? "✅" : "⬜"} &nbsp; <strong>Verify your email</strong> — Check your inbox for a verification code
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#374151;">
            ${hasPhone ? "⬜" : "✅"} &nbsp; <strong>Verify your phone</strong> — Enables SMS alerts and phone-based sign-in
          </td>
        </tr>
      </table>

      <p style="font-size:13px;color:#6b7280;margin-top:8px;">
        You can verify both from your <a href="${BASE_URL}/dashboard/settings" style="color:#1a56db;">Account Settings</a>.
      </p>

      <h2>Get Started</h2>
      <ul>
        <li><a href="${BASE_URL}/jobs" style="color:#1a56db;">Browse Jobs</a> — Find your next opportunity from thousands of listings</li>
        <li><a href="${BASE_URL}/profile" style="color:#1a56db;">Complete Your Profile</a> — Help employers find you with a detailed profile</li>
        <li><a href="${BASE_URL}/dashboard/alerts" style="color:#1a56db;">Set Up Job Alerts</a> — Get notified when new jobs match your preferences</li>
        <li><a href="${BASE_URL}/career-advice" style="color:#1a56db;">Career Advice</a> — Access tips, guides, and resources to advance your career</li>
      </ul>
      <p style="text-align:center;margin-top:16px;">
        <a href="${BASE_URL}/dashboard" class="btn">Go to Dashboard</a>
      </p>
    `
  );
  return { html, text: `Welcome to ${siteConfig.brandName}! Verify your email and phone from your account settings. ${BASE_URL}/dashboard/settings` };
}

/**
 * 2. Google sign-up welcome — email verified via Google, no phone, no password.
 */
export function welcomeGoogleSignup({ name, email }) {
  const html = wrapEmail(
    `Welcome to ${siteConfig.shortName}! 🎉`,
    "Signed in with Google",
    `
      <p>Welcome${name ? ` ${name}` : ""} to ${siteConfig.brandName}!</p>
      <p>Your account has been created via Google sign-in. Your email is already verified — great start!</p>

      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;font-size:14px;color:#166534;">
          ✅ Email verified via Google
        </p>
      </div>

      <h2>Complete Your Account</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0;">
        <tr>
          <td style="padding:8px 0;color:#374151;">
            ✅ &nbsp; <strong>Email verified</strong> — Connected via Google
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#374151;">
            ⬜ &nbsp; <strong>Set a password</strong> — Sign in without Google anytime
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#374151;">
            ⬜ &nbsp; <strong>Add your phone</strong> — Enable SMS alerts and phone sign-in
          </td>
        </tr>
      </table>

      <p style="text-align:center;margin-top:16px;">
        <a href="${BASE_URL}/onboarding" class="btn">Complete Setup</a>
      </p>
      <p style="font-size:13px;color:#6b7280;margin-top:8px;">
        Or set up later from your <a href="${BASE_URL}/dashboard/settings" style="color:#1a56db;">Account Settings</a>.
      </p>

      <h2>Get Started</h2>
      <ul>
        <li><a href="${BASE_URL}/jobs" style="color:#1a56db;">Browse Jobs</a> — Find your next opportunity from thousands of listings</li>
        <li><a href="${BASE_URL}/profile" style="color:#1a56db;">Complete Your Profile</a> — Help employers find you with a detailed profile</li>
        <li><a href="${BASE_URL}/dashboard/alerts" style="color:#1a56db;">Set Up Job Alerts</a> — Get notified when new jobs match your preferences</li>
      </ul>
    `
  );
  return { html, text: `Welcome to ${siteConfig.brandName}! Set a password and add your phone to complete your account. ${BASE_URL}/onboarding` };
}

/**
 * 3. Phone OTP user adds real email — account is now "complete"
 *    This doubles as a welcome email since they never got one.
 */
export function accountCompleteEmail({ name, email, phone, hasPassword }) {
  const missing = [];
  if (!hasPassword) missing.push("set a password to sign in with email");
  if (!phone) missing.push("add your phone number for SMS alerts");

  const html = wrapEmail(
    "Your Account is Ready! ✅",
    `All set on ${siteConfig.shortName}`,
    `
      <p>${name ? `Hi ${name}` : "Hello"}!</p>
      <p>Your email has been verified and your account is now fully set up on ${siteConfig.brandName}. You can sign in with your email anytime.</p>

      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">
          ✅ Email verified — ${email}
          ${phone ? `<br>✅ Phone verified — ${phone}` : ""}
          ${hasPassword ? `<br>✅ Password set` : ""}
        </p>
      </div>

      ${missing.length > 0 ? `
      <h2>Recommended Next Steps</h2>
      <ul>
        ${missing.map(m => `<li>${m}</li>`).join("")}
      </ul>
      <p style="font-size:13px;color:#6b7280;">
        Update these from your <a href="${BASE_URL}/dashboard/settings" style="color:#1a56db;">Account Settings</a>.
      </p>
      ` : `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:16px 0;text-align:center;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#166534;">
          🎉 Your account is fully complete!
        </p>
      </div>
      `}

      <h2>What's Next?</h2>
      <ul>
        <li><a href="${BASE_URL}/jobs" style="color:#1a56db;">Browse Jobs</a> — Find your next opportunity</li>
        <li><a href="${BASE_URL}/profile" style="color:#1a56db;">Complete Your Profile</a> — Stand out to employers</li>
        <li><a href="${BASE_URL}/dashboard/alerts" style="color:#1a56db;">Set Up Job Alerts</a> — Get matched automatically</li>
        <li><a href="${BASE_URL}/cv-services" style="color:#1a56db;">CV Writing</a> — Professional CV from KSh 500</li>
      </ul>
      <p style="text-align:center;margin-top:16px;">
        <a href="${BASE_URL}/dashboard" class="btn">Go to Dashboard</a>
      </p>
    `
  );
  return { html, text: `Your ${siteConfig.shortName} account is ready! ${BASE_URL}/dashboard` };
}

/**
 * 4. Email verified confirmation — credential user verifies their email.
 */
export function emailVerifiedConfirmation({ name, email, phoneVerified }) {
  const html = wrapEmail(
    "Email Verified ✅",
    "Your email is now confirmed",
    `
      <p>${name ? `Hi ${name}` : "Hello"}!</p>
      <p>Your email address <strong>${email}</strong> has been successfully verified.</p>

      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;font-size:14px;color:#166534;">
          ✅ Email verified — ${email}
        </p>
      </div>

      ${!phoneVerified ? `
      <h2>One More Thing</h2>
      <p>Verify your phone number to enable SMS job alerts and phone-based sign-in. It only takes a minute!</p>
      <p style="text-align:center;">
        <a href="${BASE_URL}/dashboard/settings#phone" class="btn">Verify Phone Number</a>
      </p>
      ` : `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:16px 0;text-align:center;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#166534;">
          🎉 Your account is fully verified!
        </p>
      </div>
      `}

      <p style="text-align:center;margin-top:16px;">
        <a href="${BASE_URL}/dashboard" class="btn">Go to Dashboard</a>
      </p>
    `
  );
  return { html, text: `Your email ${email} has been verified on ${siteConfig.brandName}!` };
}

/**
 * 5. Phone verified confirmation — user adds/verifies a phone number.
 */
export function phoneVerifiedConfirmation({ name, phone, emailVerified }) {
  const html = wrapEmail(
    "Phone Verified ✅",
    "Your phone number is now confirmed",
    `
      <p>${name ? `Hi ${name}` : "Hello"}!</p>
      <p>Your phone number <strong>${phone}</strong> has been successfully verified.</p>

      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;font-size:14px;color:#166534;">
          ✅ Phone verified — ${phone}
        </p>
      </div>

      ${!emailVerified ? `
      <h2>One More Thing</h2>
      <p>Verify your email address to secure your account and receive important notifications.</p>
      <p style="text-align:center;">
        <a href="${BASE_URL}/dashboard/settings#email" class="btn">Verify Email Address</a>
      </p>
      ` : `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:16px 0;text-align:center;">
        <p style="margin:0;font-size:15px;font-weight:600;color:#166534;">
          🎉 Your account is fully verified!
        </p>
      </div>
      `}

      <p style="font-size:13px;color:#6b7280;margin-top:16px;">
        You'll now receive job alert notifications via SMS. Manage your alerts in your
        <a href="${BASE_URL}/dashboard/settings" style="color:#1a56db;">Account Settings</a>.
      </p>
    `
  );
  return { html, text: `Your phone ${phone} has been verified on ${siteConfig.brandName}!` };
}

/**
 * 6. Accounts merged — two accounts combined into one.
 */
export function accountsMergedEmail({ name, email, mergedInto }) {
  const html = wrapEmail(
    "Accounts Merged 🔗",
    "Your data has been combined",
    `
      <p>${name ? `Hi ${name}` : "Hello"}!</p>
      <p>Great news! We've detected that you have multiple ${siteConfig.shortName} accounts and merged them into one. All your data has been safely combined.</p>

      <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px;border-radius:0 8px 8px 0;margin:16px 0;">
        <p style="margin:0;font-size:14px;color:#1e40af;">
          <strong>What was merged:</strong><br>
          Saved jobs, applications, job alerts, and notifications have been combined into your primary account.
        </p>
      </div>

      <h2>Your Account</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:8px 0;">
        <tr>
          <td style="padding:8px 0;color:#6b7280;">Email</td>
          <td style="padding:8px 0;text-align:right;font-weight:600;">${email}</td>
        </tr>
        ${mergedInto?.phone ? `
        <tr>
          <td style="padding:8px 0;color:#6b7280;">Phone</td>
          <td style="padding:8px 0;text-align:right;font-weight:600;">${mergedInto.phone}</td>
        </tr>
        ` : ""}
      </table>

      <p style="font-size:13px;color:#6b7280;margin-top:16px;">
        No action needed from you. Everything is in one place now.
        Visit your <a href="${BASE_URL}/dashboard/settings" style="color:#1a56db;">Account Settings</a> to review.
      </p>
      <p style="text-align:center;margin-top:16px;">
        <a href="${BASE_URL}/dashboard" class="btn">Go to Dashboard</a>
      </p>
    `
  );
  return { html, text: `Your ${siteConfig.shortName} accounts have been merged. All data is now in one place.` };
}

/**
 * Legacy welcome template — kept for backward compatibility.
 * @deprecated Use scenario-specific templates instead.
 */
export function welcomeTemplate(name, email) {
  return welcomeCredentialSignup({ name, email, hasPhone: true });
}

/**
 * Payment confirmation email (after M-Pesa STK Push success)
 */
export function paymentConfirmationTemplate({ name, orderNumber, amount, receiptNumber, services, paymentStatus, balanceDue, date }) {
  const html = wrapEmail(
    "Payment Confirmed ✓",
    `Order ${orderNumber}`,
    `
      <p>Hello${name ? ` ${name}` : ""},</p>
      <p>We've received your payment. Here are the details:</p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin:16px 0;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#6b7280;">Order Number</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;">${orderNumber}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;">Amount Paid</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;color:#16a34a;">KSh ${amount}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;">M-Pesa Receipt</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;">${receiptNumber}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6b7280;">Date</td>
            <td style="padding:8px 0;text-align:right;">${date}</td>
          </tr>
          ${Number(balanceDue) > 0 ? `
          <tr>
            <td style="padding:8px 0;color:#6b7280;">Balance Due</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;color:#dc2626;">KSh ${balanceDue}</td>
          </tr>
          ` : `
          <tr>
            <td style="padding:8px 0;color:#6b7280;">Status</td>
            <td style="padding:8px 0;text-align:right;font-weight:600;color:#16a34a;">✓ PAID IN FULL</td>
          </tr>
          `}
        </table>
      </div>

      ${services ? `
      <h2>Services Ordered</h2>
      <p>${services}</p>
      ` : ""}

      <p style="font-size:14px;color:#6b7280;">
        Keep this email as your payment receipt. If you have any questions about your order,
        reply to this email or visit your <a href="${BASE_URL}/dashboard/billing">billing dashboard</a>.
      </p>

      <p style="text-align:center;margin-top:16px;">
        <a href="${BASE_URL}/dashboard/billing" class="btn">View Your Orders</a>
      </p>
    `
  );
  return { html, text: `Payment confirmed — Order ${orderNumber}: KSh ${amount}. Receipt: ${receiptNumber}. Date: ${date}.` };
}

/**
 * Email verification code (6-digit code sent to verify user's own email address)
 */
export function emailVerificationCodeTemplate(name, code) {
  const html = wrapEmail(
    "Verify Your Email Address",
    `Confirm your ${siteConfig.shortName} account`,
    `
      <p>Hello${name ? ` ${name}` : ""},</p>
      <p>Please verify your email address to confirm your ${siteConfig.shortName} account and receive important notifications. Enter the code below:</p>
      <div style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;background:#f3f4f6;border-radius:8px;padding:12px 24px;font-size:28px;font-weight:700;letter-spacing:6px;color:#111827;">
          ${code}
        </span>
      </div>
      <p style="font-size:13px;color:#6b7280;">
        This code will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.
      </p>
    `
  );
  return { html, text: `Verify your ${siteConfig.shortName} email address. Code: ${code}` };
}

/**
 * Email link verification code (6-digit code sent to email for account linking)
 */
export function emailLinkVerificationTemplate(name, code) {
  const html = wrapEmail(
    "Verify Your Email to Link Accounts",
    "Account linking request",
    `
      <p>Hello${name ? ` ${name}` : ""},</p>
      <p>We received a request to link your email address to an existing ${siteConfig.shortName} account. To confirm this is your email, enter the code below:</p>
      <div style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;background:#f3f4f6;border-radius:8px;padding:12px 24px;font-size:28px;font-weight:700;letter-spacing:6px;color:#111827;">
          ${code}
        </span>
      </div>
      <p style="font-size:13px;color:#6b7280;">
        This code will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email — no changes will be made to your account.
      </p>
    `
  );
  return { html, text: `Verify your email to link ${siteConfig.shortName} accounts. Code: ${code}` };
}

// ─── Helpers ─────────────────────────────────────────────────────────

/** Strip HTML tags for plain text fallback */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "  • ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Verify SMTP configuration is valid
 * Call this at startup or from an admin endpoint
 */
export async function verifyEmailConnection() {
  const transport = getTransporter(process.env.SMTP_USER, process.env.SMTP_PASS);
  if (!transport) {
    return { ok: false, reason: "SMTP not configured" };
  }
  try {
    await transport.verify();
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}
