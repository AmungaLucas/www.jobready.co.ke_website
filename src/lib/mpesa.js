/**
 * M-Pesa Daraja API Helper — STK Push for JobReady.co.ke
 *
 * Handles:
 *   - OAuth token acquisition with in-memory caching (expires in 50 min)
 *   - STK Push initiation (Lipa Na M-Pesa Online)
 *
 * The Express callback server on hosting handles M-Pesa callbacks.
 * This module only initiates payments.
 */

// ─── Config ──────────────────────────────────────────────
const SHORTCODE = process.env.NEXT_PUBLIC_MPESA_SHORTCODE || "174379";
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const PASSKEY = process.env.MPESA_PASSKEY || "";
const ENV = process.env.MPESA_ENV || "sandbox";

const BASE_URLS = {
  sandbox: "https://sandbox.safaricom.co.ke",
  production: "https://api.safaricom.co.ke",
};

const BASE_URL = BASE_URLS[ENV] || BASE_URLS.sandbox;

const CALLBACK_URL =
  ENV === "production"
    ? "https://jobready.co.ke/api/payments/mpesa/callback"
    : "https://jobready.co.ke/api/payments/mpesa/callback"; // same for now; can be changed

// ─── OAuth Token Cache ──────────────────────────────────
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Get OAuth access token from Daraja API.
 * Tokens are cached in-memory and refreshed before expiry.
 *
 * @returns {Promise<string>} Bearer access token
 */
export async function getAccessToken() {
  const now = Date.now();

  // Return cached token if still valid
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const url = `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[M-Pesa OAuth] Error:", response.status, errorText);
    throw new Error(`Failed to get M-Pesa access token: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;

  // Cache for 50 minutes (token lasts 60 min)
  tokenExpiresAt = now + 50 * 60 * 1000;

  return cachedToken;
}

/**
 * Generate the STK Push password.
 * Password = Base64(ShortCode + PassKey + Timestamp)
 *
 * @param {string} timestamp - Format "YYYYMMDDHHmmss"
 * @returns {string} Base64-encoded password
 */
function generatePassword(timestamp) {
  const raw = `${SHORTCODE}${PASSKEY}${timestamp}`;
  return Buffer.from(raw).toString("base64");
}

/**
 * Get current timestamp in the format required by Daraja.
 * Format: YYYYMMDDHHmmss
 *
 * @returns {string} e.g. "20260404120000"
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

/**
 * Initiate an STK Push (Lipa Na M-Pesa Online) request.
 *
 * @param {Object} params
 * @param {string} params.phoneNumber - Phone number in "2547XXXXXXXX" format
 * @param {number} params.amount - Amount in KES (integer)
 * @param {string} params.orderNumber - Order reference e.g. "JR-20260404-XXXX"
 * @param {string} params.description - Account reference e.g. "CV Writing - Professional"
 * @returns {Promise<Object>} Daraja API response including CheckoutRequestID
 */
export async function initiateSTKPush({ phoneNumber, amount, orderNumber, description }) {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = generatePassword(timestamp);

  const url = `${BASE_URL}/mpesa/stkpush/v1/processrequest`;

  const body = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.round(amount),
    PartyA: phoneNumber,
    PartyB: SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: CALLBACK_URL,
    AccountReference: orderNumber.slice(0, 12), // max 12 chars
    TransactionDesc: description.slice(0, 13),   // max 13 chars
  };

  console.log("[M-Pesa STK Push] Initiating:", {
    phoneNumber,
    amount,
    orderNumber: body.AccountReference,
    description: body.TransactionDesc,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok || data.ResponseCode !== "0") {
    console.error("[M-Pesa STK Push] Error:", data);
    throw new Error(
      data.errorMessage || data.ResponseDescription || `M-Pesa STK Push failed with code ${data.ResponseCode}`
    );
  }

  console.log("[M-Pesa STK Push] Success:", {
    checkoutRequestId: data.CheckoutRequestID,
    merchantRequestId: data.MerchantRequestID,
  });

  return {
    CheckoutRequestID: data.CheckoutRequestID,
    MerchantRequestID: data.MerchantRequestID,
    ResponseCode: data.ResponseCode,
    ResponseDescription: data.ResponseDescription,
  };
}

/**
 * Format a phone number to the 2547XXXXXXXX format.
 * Handles: +2547XX, 07XX, 7XX, +254 7XX, etc.
 *
 * @param {string} phone - Raw phone input
 * @returns {string|null} Formatted phone or null if invalid
 */
export function formatMpesaPhone(phone) {
  if (!phone) return null;

  // Strip all non-numeric characters
  const cleaned = phone.replace(/[^\d]/g, "");

  // If starts with 254 and is 12 digits (254XXXXXXXXX)
  if (cleaned.startsWith("254") && cleaned.length === 12) {
    return cleaned;
  }

  // If starts with 0 and is 10 digits (07XXXXXXXX)
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `254${cleaned.slice(1)}`;
  }

  // If starts with 7 and is 9 digits (7XXXXXXXX)
  if (cleaned.startsWith("7") && cleaned.length === 9) {
    return `254${cleaned}`;
  }

  return null;
}
