import { siteConfig } from "@/config/site-config";

/**
 * SMS service utility
 * Uses Talk-Sasa BulkSMS API v3 (OAuth 2.0)
 * Docs: https://bulksms.talksasa.com/api/v3/
 *
 * Falls back to console logging in development if API is not configured.
 */

const API_URL = process.env.SMS_API_URL || "https://bulksms.talksasa.com/api/v3";
const API_TOKEN = process.env.SMS_API_TOKEN || "";
const SENDER_ID = process.env.SMS_SENDER_ID || "TALK-SASA";

/**
 * Send an SMS to one or more recipients
 *
 * @param {Object} options
 * @param {string|string[]} options.to - Phone number(s) in 2547XXXXXXXX format
 * @param {string} options.message - SMS text (max 160 chars per segment)
 * @param {string} [options.senderId] - Override sender ID (default: SENDER_ID)
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendSMS({ to, message, senderId }) {
  // Normalize: API accepts single recipient (string) or batch via multiple calls
  const recipients = Array.isArray(to) ? to : [to];

  // Validate each recipient
  for (const phone of recipients) {
    if (!/^254\d{9}$/.test(phone)) {
      return {
        success: false,
        error: `Invalid phone number format: ${phone}. Expected 254XXXXXXXXX.`,
      };
    }
  }

  // Validate message
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return { success: false, error: "Message is required and cannot be empty" };
  }

  const from = senderId || SENDER_ID;

  // ── Development fallback ────────────────────────────
  if (!API_TOKEN || process.env.NODE_ENV === "development" && !process.env.SMS_API_TOKEN) {
    console.log(`[SMS Service] API not configured. Would have sent:`);
    console.log(`  From: ${from}`);
    console.log(`  To: ${recipients.join(", ")}`);
    console.log(`  Message: ${message}`);
    return { success: true, messageId: `dev-${Date.now()}` };
  }

  // ── Production: Call Talk-Sasa API ──────────────────
  // Note: Talk-Sasa API uses "recipient" (singular string), not "recipients" (array)
  // For multiple recipients, we send individual requests in parallel
  try {
    const results = await Promise.all(
      recipients.map(async (phone) => {
        const response = await fetch(`${API_URL}/sms/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            recipient: phone,
            message: message.trim(),
            sender_id: from,
          }),
          signal: AbortSignal.timeout(15000),
        });

        const data = await response.json();
        return { phone, response, data };
      })
    );

    // Check results
    const successes = results.filter(
      (r) => r.response.ok && (r.data.success || r.data.status === "success")
    );
    const failures = results.filter(
      (r) => !r.response.ok || !(r.data.success || r.data.status === "success")
    );

    if (failures.length === 0) {
      console.log(`[SMS Service] Sent to ${successes.length} recipient(s): ${recipients.join(", ")}`);
      return {
        success: true,
        messageId: successes[0]?.data?.data?.uid || `sms-${Date.now()}`,
        data: results.map((r) => r.data),
      };
    }

    // Some or all failed
    const errorMsg = failures
      .map((f) => f.data.message || f.data.error || JSON.stringify(f.data))
      .join("; ");
    console.error(`[SMS Service] API error (${failures.length}/${results.length}):`, errorMsg);
    return {
      success: successes.length > 0, // partial success
      error: successes.length > 0
        ? `SMS partially sent. Failed: ${errorMsg}`
        : `SMS API error: ${errorMsg}`,
    };
  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      console.error("[SMS Service] Request timed out");
      return { success: false, error: "SMS request timed out. Please try again." };
    }
    console.error("[SMS Service] Failed to send SMS:", error.message);
    return { success: false, error: `SMS send failed: ${error.message}` };
  }
}

/**
 * Send an OTP via SMS with JobReady branding
 *
 * @param {string} phone - Recipient phone in 254XXXXXXXXX format
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendOTP(phone, otp) {
  const message = `Your ${siteConfig.brandName} verification code is ${otp}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS({ to: phone, message });
}
