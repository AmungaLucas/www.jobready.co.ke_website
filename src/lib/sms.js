/**
 * SMS service utility for JobReady.co.ke
 *
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
  // Normalize recipient(s) to array
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
  try {
    const response = await fetch(`${API_URL}/sms/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        recipients: recipients,
        message: message.trim(),
        sender_id: from,
      }),
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    const data = await response.json();

    if (response.ok && (data.success || data.status === "success" || data.code === 200)) {
      console.log(`[SMS Service] Sent to ${recipients.length} recipient(s): ${recipients.join(", ")}`);
      return {
        success: true,
        messageId: data.message_id || data.id || `sms-${Date.now()}`,
        data,
      };
    }

    // API returned an error
    const errorMsg = data.message || data.error || data.description || JSON.stringify(data);
    console.error(`[SMS Service] API error (${response.status}):`, errorMsg);
    return { success: false, error: `SMS API error: ${errorMsg}` };
  } catch (error) {
    // Network / timeout error
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
  const message = `Your JobReady.co.ke verification code is ${otp}. Valid for 10 minutes. Do not share this code.`;
  return sendSMS({ to: phone, message });
}
