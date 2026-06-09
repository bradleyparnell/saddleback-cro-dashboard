import { BetaAnalyticsDataClient } from '@google-analytics/data';

export function getGA4Client() {
  const keyBase64 = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyBase64) return null;
  try {
    const credentials = JSON.parse(Buffer.from(keyBase64, 'base64').toString('utf8'));
    return new BetaAnalyticsDataClient({ credentials });
  } catch (e) {
    console.error('GA4 credential parse error:', e.message);
    return null;
  }
}

export async function fetchGA4Data() {
  const client = getGA4Client();
  if (!client) return null;

  const propertyId = process.env.GA4_PROPERTY_ID || '251439490';

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'sessions' },
      { name: 'transactions' },
      { name: 'purchaseRevenue' },
    ],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  if (!response.rows?.length) return null;

  const rows = response.rows.map(row => {
    const rawDate = row.dimensionValues[0].value; // YYYYMMDD
    const d = new Date(`${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}`);
    const sessions     = parseInt(row.metricValues[0].value) || 0;
    const transactions = parseInt(row.metricValues[1].value) || 0;
    const revenue      = parseFloat(row.metricValues[2].value) || 0;
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sessions,
      transactions,
      revenue: Math.round(revenue),
      cvr: sessions > 0 ? parseFloat(((transactions / sessions) * 100).toFixed(2)) : 0,
    };
  });

  const totalSessions     = rows.reduce((s, r) => s + r.sessions, 0);
  const totalTransactions = rows.reduce((s, r) => s + r.transactions, 0);
  const totalRevenue      = rows.reduce((s, r) => s + r.revenue, 0);
  const avgCVR            = totalSessions > 0
    ? parseFloat(((totalTransactions / totalSessions) * 100).toFixed(2))
    : 0;

  return { rows, totalSessions, totalTransactions, totalRevenue, avgCVR };
}
