import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site-config";

/**
 * Email service utility for JobReady.co.ke
 *
 * Uses Nodemailer with SMTP transport. Falls back gracefully
 * if SMTP is not configured (logs to console in development).
 */

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  // Check if SMTP is configured
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;

  if (host && port) {
    transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: parseInt(port, 10) === 465,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
      // Connection timeout — fail fast
      connectionTimeout: 5000,
      greetingTimeout: 3000,
      socketTimeout: 10000,
    });
  }

  return transporter;
}

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text fallback
 * @param {string} [options.from] - Override sender (default: noreply@jobready.co.ke)
 * @param {string} [options.replyTo] - Reply-to address
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendEmail({ to, subject, html, text, from, replyTo }) {
  const transport = getTransporter();

  const mailOptions = {
    from: from || `"JobReady Kenya" <${siteConfig.email.noreply}>`,
    to,
    subject,
    replyTo: replyTo || siteConfig.email.support,
    html,
    text: text || stripHtml(html),
  };

  // If no SMTP configured, log and return success (dev mode)
  if (!transport) {
    console.log(`[Email Service] SMTP not configured. Would have sent:`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  From: ${mailOptions.from}`);
    if (process.env.NODE_ENV === "development") {
      console.log(`  HTML preview: ${html?.substring(0, 200)}...`);
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
        <p><strong>JobReady Kenya</strong> — Kenya's #1 Job Board</p>
        <p>
          <a href="${BASE_URL}">${BASE_URL}</a> ·
          <a href="${BASE_URL}/privacy">Privacy</a> ·
          <a href="${BASE_URL}/terms">Terms</a> ·
          <a href="${BASE_URL}/contact">Contact</a>
        </p>
        <p style="margin-top:8px;color:#9ca3af;">
          You're receiving this because you have an account on JobReady.co.ke.
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
      <p>We received a request to reset the password for your JobReady account. Click the button below to choose a new password:</p>
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
  return { html, text: `Reset your JobReady password: ${resetUrl}` };
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
    job_alerts: "Job Alerts",
    career_tips: "Career Tips",
    opportunity_alerts: "Opportunity Alerts",
    employer_updates: "Employer Updates",
  };
  const label = typeLabels[type] || "Newsletter";

  const html = wrapEmail(
    "You're Subscribed!",
    `${label} — JobReady Kenya`,
    `
      <p>Welcome to JobReady!</p>
      <p>You've been successfully subscribed to <strong>${label}</strong> on JobReady.co.ke.</p>
      <p>Here's what to expect:</p>
      <ul>
        <li>Curated ${type === "job_alerts" ? "job openings" : type === "opportunity_alerts" ? "opportunities" : "career insights"} delivered to your inbox</li>
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
  return { html, text: `You're subscribed to ${label} on JobReady.co.ke!` };
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
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted through JobReady.co.ke.</p>
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
  return { html, text: `Your application for ${jobTitle} at ${companyName} has been submitted via JobReady.co.ke.` };
}

/**
 * Welcome email for new registrations
 */
export function welcomeTemplate(name, email) {
  const html = wrapEmail(
    "Welcome to JobReady!",
    "Your account has been created",
    `
      <p>Welcome${name ? ` ${name}` : ""} to JobReady.co.ke!</p>
      <p>Your account has been successfully created. You're now part of Kenya's fastest-growing job board and career platform.</p>
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
      <p style="font-size:13px;color:#6b7280;margin-top:8px;">
        Need professional help? Check out our{" "}
        <a href="${BASE_URL}/cv-services">CV Writing Services</a> starting from KSh 500.
      </p>
    `
  );
  return { html, text: `Welcome to JobReady.co.ke! Complete your profile at ${BASE_URL}/dashboard` };
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
  const transport = getTransporter();
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
