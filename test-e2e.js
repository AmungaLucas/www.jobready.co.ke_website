/**
 * End-to-end test script for JobReady.co.ke
 * Starts production server and runs all tests
 */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load .env from standalone directory
const envPath = "/home/z/my-project/.env";
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        // Remove surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

const BASE = "http://127.0.0.1:3000";
const results = [];

function log(msg) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, ok: res.ok };
}

async function test(name, fn) {
  try {
    const result = await fn();
    results.push({ name, pass: result.pass, detail: result.detail });
    const icon = result.pass ? "✅" : "❌";
    log(`${icon} ${name}: ${result.detail}`);
  } catch (err) {
    results.push({ name, pass: false, detail: err.message });
    log(`❌ ${name}: ${err.message}`);
  }
}

async function runTests() {
  // Wait for server to be ready
  for (let i = 0; i < 30; i++) {
    try {
      await fetch(BASE, { signal: AbortSignal.timeout(2000) });
      log("Server is ready!");
      break;
    } catch {
      if (i === 29) { log("Server failed to start!"); process.exit(1); }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // ── Test 1: Homepage ──
  await test("Homepage loads", async () => {
    const { status } = await fetch(BASE, { signal: AbortSignal.timeout(30000) });
    return { pass: status === 200, detail: `HTTP ${status}` };
  });

  // ── Test 2: Jobs API ──
  await test("GET /api/jobs", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/jobs?limit=2`);
    return { pass: status === 200, detail: `HTTP ${status}, jobs: ${Array.isArray(data?.jobs) ? data.jobs.length : "N/A"}` };
  });

  // ── Test 3: Register Account 1 ──
  await test("POST /api/auth/register (amungalucas@gmail.com)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name: "Lucas Amunga", email: "amungalucas@gmail.com", password: "Amush@100%", phone: "0705922979" })
    });
    const detail = data?.message || data?.error || JSON.stringify(data).slice(0, 100);
    return { pass: status === 201 || status === 200 || (status === 409 && String(detail).includes("exists")), detail: `HTTP ${status} — ${detail}` };
  });

  // ── Test 4: Register Account 2 ──
  await test("POST /api/auth/register (lucasamunga@gmail.com)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name: "Lucas M Amunga", email: "lucasamunga@gmail.com", password: "Amush@100%", phone: "0706356633" })
    });
    const detail = data?.message || data?.error || JSON.stringify(data).slice(0, 100);
    return { pass: status === 201 || status === 200 || (status === 409 && String(detail).includes("exists")), detail: `HTTP ${status} — ${detail}` };
  });

  // ── Test 5: Login Account 1 ──
  let sessionToken1 = null;
  await test("POST /api/auth/[...nextauth] (login amungalucas)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/auth/callback/credentials`, {
      method: "POST",
      body: JSON.stringify({ email: "amungalucas@gmail.com", password: "Amush@100%", redirect: false })
    });
    // Try signin endpoint
    const { status: s2, data: d2 } = await fetchJSON(`${BASE}/api/auth/signin/credentials`, {
      method: "POST",
      body: JSON.stringify({ email: "amungalucas@gmail.com", password: "Amush@100%", redirect: false })
    });
    const detail = data?.url || data?.error || d2?.url || d2?.error || `HTTP ${status}/${s2}`;
    if (data?.url || d2?.url) sessionToken1 = "obtained";
    return { pass: status === 200 || status === 302 || s2 === 200 || s2 === 302, detail: `${detail}` };
  });

  // ── Test 6: Contact Form ──
  await test("POST /api/contact", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/contact`, {
      method: "POST",
      body: JSON.stringify({ name: "Lucas Amunga", email: "amungalucas@gmail.com", subject: "E2E Test", message: "Testing contact form from end-to-end test script" })
    });
    const detail = data?.message || data?.error || "sent";
    return { pass: status === 200, detail: `HTTP ${status} — ${detail}` };
  });

  // ── Test 7: Newsletter ──
  await test("POST /api/newsletter (amungalucas)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/newsletter`, {
      method: "POST",
      body: JSON.stringify({ email: "amungalucas@gmail.com", type: "career_tips" })
    });
    const detail = data?.message || data?.error || "subscribed";
    return { pass: status === 200 || status === 201, detail: `HTTP ${status} — ${detail}` };
  });

  // ── Test 8: Newsletter Account 2 ──
  await test("POST /api/newsletter (lucasamunga)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/newsletter`, {
      method: "POST",
      body: JSON.stringify({ email: "lucasamunga@gmail.com", type: "job_alerts" })
    });
    const detail = data?.message || data?.error || "subscribed";
    return { pass: status === 200 || status === 201, detail: `HTTP ${status} — ${detail}` };
  });

  // ── Test 9: M-Pesa Callback POST ──
  await test("POST /api/payments/mpesa/callback", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/payments/mpesa/callback`, {
      method: "POST",
      body: JSON.stringify({
        Body: { stkCallback: { CheckoutRequestID: "test_e2e_" + Date.now(), MerchantRequestID: "test_merchant", ResultCode: 0, ResultDesc: "Test success", CallbackMetadata: { Item: [{ Name: "MpesaReceiptNumber", Value: "TEST001" }, { Name: "Amount", Value: 1 }, { Name: "PhoneNumber", Value: 254705922979 }] } } }
      })
    });
    return { pass: status === 200 && data?.ResultCode === 0, detail: `HTTP ${status} — ResultCode: ${data?.ResultCode}` };
  });

  // ── Test 10: OTP Send ──
  await test("POST /api/auth/send-otp (0705922979)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/auth/send-otp`, {
      method: "POST",
      body: JSON.stringify({ phone: "0705922979" })
    });
    const detail = data?.message || data?.error || "sent";
    return { pass: status === 200 || status === 201, detail: `HTTP ${status} — ${detail}` };
  });

  // ── Test 11: Forgot Password ──
  await test("POST /api/auth/forgot-password (amungalucas)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email: "amungalucas@gmail.com" })
    });
    const detail = data?.message || data?.error || "email sent";
    return { pass: status === 200, detail: `HTTP ${status} — ${detail}` };
  });

  // ── Test 12: M-Pesa OAuth Token ──
  await test("M-Pesa OAuth token (sandbox)", async () => {
    const creds = Buffer.from("F7UkbGbZ6a2HD5wzT2rlVSPhu0TTVPzg2KYbHzY9quzeNdbc:UO6COSBwVex0AXO4ceBH0ds0MqyrX6qVAO3RUAXkGIpkvnmLjQmkkYvGPwahhPm7").toString("base64");
    const res = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${creds}` },
      signal: AbortSignal.timeout(15000)
    });
    const json = await res.json();
    return { pass: res.status === 200 && !!json.access_token, detail: `HTTP ${res.status} — token: ${json.access_token ? json.access_token.slice(0, 20) + "..." : "NONE"}${json.error ? " — " + json.error : ""}` };
  });

  // ── Test 13: Callback GET (health check) ──
  await test("GET /api/payments/mpesa/callback (health)", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/payments/mpesa/callback`);
    return { pass: status === 200 && data?.status === "ok", detail: `HTTP ${status} — env: ${data?.environment}` };
  });

  // ── Test 14: Opportunities API ──
  await test("GET /api/opportunities", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/opportunities?limit=2`);
    return { pass: status === 200, detail: `HTTP ${status}` };
  });

  // ── Test 15: Search API ──
  await test("GET /api/search?q=accountant", async () => {
    const { status, data } = await fetchJSON(`${BASE}/api/search?q=accountant`);
    return { pass: status === 200, detail: `HTTP ${status}` };
  });

  // ── Print Summary ──
  console.log("\n" + "═".repeat(60));
  console.log("  END-TO-END TEST RESULTS — JobReady.co.ke");
  console.log("═".repeat(60));
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`  Total: ${results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  console.log("─".repeat(60));
  results.forEach(r => {
    console.log(`  ${r.pass ? "✅" : "❌"} ${r.name}`);
    if (!r.pass) console.log(`      → ${r.detail}`);
  });
  console.log("═".repeat(60));

  // Exit
  setTimeout(() => process.exit(0), 2000);
}

// Start production server
log("Starting production server...");
const server = spawn("node", ["server.js"], {
  cwd: "/home/z/my-project/.next/standalone",
  env: { ...process.env, NODE_ENV: "production", PORT: "3000" },
  stdio: ["pipe", "pipe", "pipe"]
});

server.stdout.on("data", (d) => process.stdout.write(d));
server.stderr.on("data", (d) => process.stderr.write(d));

// Run tests after delay
setTimeout(runTests, 3000);
