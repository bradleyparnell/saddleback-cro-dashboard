// GA4 live data endpoint
// Returns live CVR and session data when GA4 service account is configured
// Falls back gracefully — dashboard uses baseline data if this returns an error

export default async function handler(req, res) {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!propertyId || !keyJson) {
    return res.status(503).json({ error: 'GA4 not configured' });
  }

  try {
    const { BetaAnalyticsDataClient } = await import('@google-analytics/data');
    const credentials = JSON.parse(keyJson);
    const client = new BetaAnalyticsDataClient({ credentials });

    const [monthlyResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '12monthsAgo', endDate: 'today' }],
      dimensions: [{ name: 'yearMonth' }],
      metrics: [
        { name: 'sessions' },
        { name: 'sessionConversionRate' },
      ],
      orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
    });

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const chartData = (monthlyResponse.rows || []).map(row => {
      const ym = row.dimensionValues[0].value; // YYYYMM
      const yr = ym.slice(2,4);
      const mo = MONTHS[parseInt(ym.slice(4,6)) - 1];
      return {
        month: `${mo} ${yr}`,
        sessions: parseInt(row.metricValues[0].value),
        cvr: parseFloat((parseFloat(row.metricValues[1].value) * 100).toFixed(2)),
      };
    });

    const latest = chartData[chartData.length - 1];

    res.status(200).json({
      cvr: latest?.cvr || null,
      sessions: latest?.sessions || null,
      chartData,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('GA4 error:', err.message);
    res.status(503).json({ error: 'GA4 fetch failed', detail: err.message });
  }
}
