# Saddleback Leather — CRO Dashboard

Live performance dashboard tracking conversion rate optimization progress for SaddlebackLeather.com.

## Stack
- **Next.js 14** — React framework
- **Recharts** — CVR & revenue charts
- **Google Analytics 4 Data API** — live session/conversion data
- **BigCommerce V2/V3 API** — live order/revenue data
- **Vercel** — hosting & serverless API routes

## Setup

### 1. Clone & Install
```bash
git clone https://github.com/bradleyparnell/saddleback-cro-dashboard.git
cd saddleback-cro-dashboard
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
```
GA4_PROPERTY_ID=251439490
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
BC_STORE_HASH=uiywfsyvbe
BC_ACCESS_TOKEN=your_token_here
DASHBOARD_PASSWORD=gospel
```

### 3. Google Service Account (GA4)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → Enable **Google Analytics Data API**
3. Create a Service Account → download JSON key
4. In GA4: Admin → Property Access Management → Add the service account email with **Viewer** role
5. Paste the entire JSON key as the `GOOGLE_SERVICE_ACCOUNT_KEY` value (single line)

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy to Vercel
1. Push repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all env vars in Vercel project settings
4. Auto-deploys on every `git push`

## Project Structure
```
├── components/
│   ├── MetricCard.jsx      # KPI tiles
│   ├── CVRChart.jsx        # Conversion rate trend line
│   ├── SprintBoard.jsx     # Task tracking by sprint
│   └── ABTestTracker.jsx   # A/B test status & results
├── lib/
│   ├── ga4.js              # GA4 Data API client
│   └── bigcommerce.js      # BigCommerce API client
├── pages/
│   ├── api/analytics.js    # GA4 serverless endpoint
│   ├── api/bigcommerce.js  # BC serverless endpoint
│   ├── index.js            # Password gate
│   └── dashboard.js        # Main dashboard
└── data/
    └── sprints.js          # Sprint tasks & A/B test data
```
