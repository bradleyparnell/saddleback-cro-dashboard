import crypto from 'crypto';

const APP_ID     = process.env.CONVERT_APP_ID;
const APP_SECRET = process.env.CONVERT_APP_SECRET;
const ACCOUNT_ID = process.env.CONVERT_ACCOUNT_ID;
const PROJECT_ID = process.env.CONVERT_PROJECT_ID;

function hmacSign(url, body = '') {
  const expires = String(Math.floor(Date.now() / 1000) + 300);
  const signString = [APP_ID, expires, url, body].join('\n');
  const signature  = crypto.createHmac('sha256', APP_SECRET).update(signString).digest('hex');
  return {
    'Convert-Application-ID': APP_ID,
    'Expires': expires,
    'Authorization': `Convert-HMAC-SHA256 Signature=${signature}`,
    'Content-Type': 'application/json',
  };
}

async function convertPost(path, body = {}) {
  const url     = `https://api.convert.com/api/v2${path}`;
  const bodyStr = JSON.stringify(body);
  const res     = await fetch(url, {
    method: 'POST',
    headers: hmacSign(url, bodyStr),
    body: bodyStr,
  });
  if (!res.ok) throw new Error(`Convert API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function convertGet(path) {
  const url = `https://api.convert.com/api/v2${path}`;
  const res = await fetch(url, { headers: hmacSign(url) });
  if (!res.ok) throw new Error(`Convert API ${res.status}: ${await res.text()}`);
  return res.json();
}

export default async function handler(req, res) {
  try {
    if (!APP_ID || !APP_SECRET || !ACCOUNT_ID || !PROJECT_ID) {
      return res.status(500).json({ error: 'Convert.com credentials not configured' });
    }

    // Fetch all experiences (any status)
    const expData = await convertPost(
      `/accounts/${ACCOUNT_ID}/projects/${PROJECT_ID}/experiences`,
      { results_per_page: 50, status: ['active', 'paused', 'completed', 'draft'] }
    );

    const experiences = expData.data || [];

    // For active/paused experiences, fetch report data
    const enriched = await Promise.all(
      experiences.map(async (exp) => {
        let report = null;
        if (['active', 'paused', 'completed'].includes(exp.status)) {
          try {
            const r = await convertPost(
              `/accounts/${ACCOUNT_ID}/projects/${PROJECT_ID}/experiences/${exp.id}/report`,
              {}
            );
            report = r.data || null;
          } catch (_) {
            // no report data yet
          }
        }
        return { ...exp, report };
      })
    );

    return res.status(200).json({ experiments: enriched, projectId: PROJECT_ID, accountId: ACCOUNT_ID });
  } catch (err) {
    console.error('Convert API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
