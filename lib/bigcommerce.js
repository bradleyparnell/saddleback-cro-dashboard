export async function fetchBCRevenue() {
  const hash  = process.env.BIGCOMMERCE_STORE_HASH;
  const token = process.env.BIGCOMMERCE_ACCESS_TOKEN;
  if (!hash || !token) return null;

  const now   = new Date();
  const start = new Date(); start.setDate(now.getDate() - 30);
  const fmt   = d => d.toISOString().split('T')[0];

  const url = `https://api.bigcommerce.com/stores/${hash}/v2/orders?min_date_created=${fmt(start)}&status_id=10&limit=250`;

  const res = await fetch(url, {
    headers: {
      'X-Auth-Token': token,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) return null;

  const orders = await res.json();
  if (!Array.isArray(orders)) return null;

  const revenue      = orders.reduce((s, o) => s + parseFloat(o.total_inc_tax || 0), 0);
  const orderCount   = orders.length;
  const aov          = orderCount > 0 ? revenue / orderCount : 0;

  return {
    revenue:    Math.round(revenue),
    orderCount,
    aov:        Math.round(aov),
    periodDays: 30,
  };
}
