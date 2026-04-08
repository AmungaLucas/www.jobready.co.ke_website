import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Kill anything on 3000
try { execSync('fuser -k 3000/tcp 2>/dev/null', { timeout: 5000 }); } catch {}
await new Promise(r => setTimeout(r, 2000));

// Start production server with env vars from .env
const envLines = readFileSync('/home/z/my-project/.env', 'utf8').split('\n');
const env = { ...process.env, NODE_ENV: 'production', PORT: '3000' };
for (const line of envLines) {
  const t = line.trim();
  if (t && !t.startsWith('#') && t.includes('=')) {
    const i = t.indexOf('=');
    let k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    env[k] = v;
  }
}

console.log('DATABASE_URL:', env.DATABASE_URL ? 'SET' : 'MISSING');
console.log('MPESA_ENV:', env.MPESA_ENV || 'MISSING');

const server = Bun.spawn(['node', 'server.js'], {
  cwd: '/home/z/my-project/.next/standalone',
  env,
  stdout: 'inherit',
  stderr: 'inherit',
});

// Wait for server
for (let i = 0; i < 30; i++) {
  try {
    const r = await fetch('http://127.0.0.1:3000/', { signal: AbortSignal.timeout(2000) });
    console.log('Server ready! Status:', r.status);
    break;
  } catch {
    await new Promise(r => setTimeout(r, 1000));
  }
}

const B = 'http://127.0.0.1:3000';
const results = [];

async function test(name, fn) {
  try {
    const { pass, detail } = await fn();
    results.push({ name, pass, detail });
    console.log(`${pass ? '✅' : '❌'} ${name}: ${detail}`);
  } catch(e) {
    results.push({ name, pass: false, detail: e.message });
    console.log(`❌ ${name}: ${e.message}`);
  }
}

await test('Homepage', async () => {
  const r = await fetch(B + '/', { signal: AbortSignal.timeout(30000) });
  return { pass: r.status === 200, detail: `HTTP ${r.status}` };
});

await test('Jobs API', async () => {
  const r = await fetch(B + '/api/jobs?limit=2', { signal: AbortSignal.timeout(30000) });
  const d = await r.json();
  return { pass: r.status === 200, detail: `HTTP ${r.status}, jobs: ${d.jobs?.length || 0}` };
});

await test('Register amungalucas@gmail.com', async () => {
  const r = await fetch(B + '/api/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Lucas Amunga', email: 'amungalucas@gmail.com', password: 'Amush@100%', phone: '0705922979' }),
    signal: AbortSignal.timeout(30000)
  });
  const d = await r.json();
  const msg = d.message || d.error || '';
  return { pass: r.status < 500, detail: `HTTP ${r.status} — ${msg.slice(0, 80)}` };
});

await test('Register lucasamunga@gmail.com', async () => {
  const r = await fetch(B + '/api/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Lucas M Amunga', email: 'lucasamunga@gmail.com', password: 'Amush@100%', phone: '0706356633' }),
    signal: AbortSignal.timeout(30000)
  });
  const d = await r.json();
  const msg = d.message || d.error || '';
  return { pass: r.status < 500, detail: `HTTP ${r.status} — ${msg.slice(0, 80)}` };
});

await test('Contact Form', async () => {
  const r = await fetch(B + '/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Lucas', email: 'amungalucas@gmail.com', subject: 'E2E Test', message: 'Testing contact form' }),
    signal: AbortSignal.timeout(30000)
  });
  const d = await r.json();
  return { pass: r.status === 200, detail: `HTTP ${r.status} — ${d.message || ''}` };
});

await test('Newsletter lucasamunga', async () => {
  const r = await fetch(B + '/api/newsletter', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'lucasamunga@gmail.com', type: 'career_tips' }),
    signal: AbortSignal.timeout(30000)
  });
  const d = await r.json();
  return { pass: r.status < 500, detail: `HTTP ${r.status} — ${d.message || d.error || ''}` };
});

await test('M-Pesa Callback POST', async () => {
  const r = await fetch(B + '/api/payments/mpesa/callback', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Body: { stkCallback: { CheckoutRequestID: 'test_' + Date.now(), MerchantRequestID: 'm1', ResultCode: 0, ResultDesc: 'OK', CallbackMetadata: { Item: [{ Name: 'MpesaReceiptNumber', Value: 'SHK001' }, { Name: 'Amount', Value: 1 }, { Name: 'PhoneNumber', Value: 254705922979 }] } } } }),
    signal: AbortSignal.timeout(30000)
  });
  const d = await r.json();
  return { pass: d.ResultCode === 0, detail: `HTTP ${r.status} — ResultCode: ${d.ResultCode}, ${d.ResultDesc}` };
});

await test('Callback Health GET', async () => {
  const r = await fetch(B + '/api/payments/mpesa/callback', { signal: AbortSignal.timeout(30000) });
  const d = await r.json();
  return { pass: d.status === 'ok', detail: `HTTP ${r.status} — env: ${d.environment}` };
});

await test('M-Pesa OAuth (sandbox)', async () => {
  const creds = btoa('F7UkbGbZ6a2HD5wzT2rlVSPhu0TTVPzg2KYbHzY9quzeNdbc:UO6COSBwVex0AXO4ceBH0ds0MqyrX6qVAO3RUAXkGIpkvnmLjQmkkYvGPwahhPm7');
  const r = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: 'Basic ' + creds },
    signal: AbortSignal.timeout(15000)
  });
  const d = await r.json();
  return { pass: !!d.access_token, detail: `HTTP ${r.status} — token: ${d.access_token ? d.access_token.slice(0,25) + '...' : 'NONE'} ${d.error || ''}` };
});

await test('Send OTP 0706356633', async () => {
  const r = await fetch(B + '/api/auth/send-otp', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '0706356633' }),
    signal: AbortSignal.timeout(30000)
  });
  const d = await r.json();
  return { pass: r.status < 500, detail: `HTTP ${r.status} — ${d.message || d.error || ''}` };
});

await test('Forgot Password lucasamunga', async () => {
  const r = await fetch(B + '/api/auth/forgot-password', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'lucasamunga@gmail.com' }),
    signal: AbortSignal.timeout(30000)
  });
  const d = await r.json();
  return { pass: r.status < 500, detail: `HTTP ${r.status} — ${d.message || d.error || ''}` };
});

await test('Opportunities API', async () => {
  const r = await fetch(B + '/api/opportunities?limit=2', { signal: AbortSignal.timeout(30000) });
  const d = await r.json();
  return { pass: r.status === 200, detail: `HTTP ${r.status} — count: ${d.opportunities?.length || 0}` };
});

await test('Search API', async () => {
  const r = await fetch(B + '/api/search?q=accountant', { signal: AbortSignal.timeout(30000) });
  return { pass: r.status === 200, detail: `HTTP ${r.status}` };
});

// Summary
console.log('\n' + '═'.repeat(55));
const p = results.filter(r => r.pass).length;
const f = results.length - p;
console.log(`RESULTS: ${results.length} tests | ✅ ${p} passed | ❌ ${f} failed`);
results.forEach(r => console.log(`  ${r.pass ? '✅' : '❌'} ${r.name}`));
console.log('═'.repeat(55));

server.kill();
process.exit(0);
