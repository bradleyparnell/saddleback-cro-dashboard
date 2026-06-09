import { fetchBCRevenue } from '../../lib/bigcommerce';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const data = await fetchBCRevenue();
    if (!data) return res.status(200).json({ connected: false });
    return res.status(200).json({ connected: true, ...data });
  } catch (err) {
    console.error('BigCommerce API error:', err.message);
    return res.status(200).json({ connected: false, error: err.message });
  }
}
