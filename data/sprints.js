export const BASELINE_CVR = 0.91;
export const TARGET_CVR = 2.0;
export const AOV = 350;
export const MONTHLY_SESSIONS = 50000;
export const PROJECT_START = '2026-06-09';

export const sprints = [
  {
    id: 1,
    name: 'Sprint 1',
    dates: 'Jun 9 – Jun 29',
    focus: 'Quick Wins & Highest-Impact Fixes',
    status: 'active',
    tasks: [
      { id: 't1', title: 'A/B Test: Remove PDP hero banner so product info & ATC appear above fold', priority: 'HIGH', status: 'in-progress', impact: '+0.15% CVR est.' },
      { id: 't2a', title: 'Add Apple Pay to checkout', priority: 'HIGH', status: 'backlog', impact: '+0.08% CVR est.' },
      { id: 't2b', title: 'Scope Google Pay re-implementation (prior error/refund issues on BC)', priority: 'MEDIUM', status: 'needs-scoping', impact: '+0.06% CVR est.' },
      { id: 't3', title: 'Fix dead-end empty cart — add product recommendations', priority: 'HIGH', status: 'backlog', impact: '+0.08% CVR est.' },
      { id: 't4', title: 'Add "Join Club" CTA next to Club Member Price display', priority: 'MEDIUM', status: 'backlog', impact: '+0.06% CVR est.' },
      { id: 't5', title: 'Build out 404 page with product suggestions', priority: 'MEDIUM', status: 'backlog', impact: '+0.04% CVR est.' },
      { id: 't6', title: 'Delay "Stay in the Know" slide-in to 30s / exit intent', priority: 'MEDIUM', status: 'backlog', impact: '+0.03% CVR est.' },
    ]
  },
  {
    id: 2,
    name: 'Sprint 2',
    dates: 'Jun 30 – Jul 20',
    focus: 'A/B Testing & Social Proof',
    status: 'upcoming',
    tasks: [
      { id: 't7', title: 'A/B Test: Product-first hero vs. current lifestyle hero', priority: 'HIGH', status: 'backlog', impact: '+0.18% CVR est.' },
      { id: 't8', title: 'A/B Test: Sticky ATC bar on scroll vs. current', priority: 'HIGH', status: 'backlog', impact: '+0.10% CVR est.' },
      { id: 't9', title: 'Add trust badges (lifetime warranty, free returns) near ATC', priority: 'MEDIUM', status: 'backlog', impact: '+0.07% CVR est.' },
      { id: 't10', title: 'Display review count & stars on product cards in collections', priority: 'MEDIUM', status: 'backlog', impact: '+0.05% CVR est.' },
      { id: 't11', title: 'Add urgency messaging on low-stock products', priority: 'LOW', status: 'backlog', impact: '+0.04% CVR est.' },
    ]
  },
  {
    id: 3,
    name: 'Sprint 3',
    dates: 'Jul 21 – Aug 10',
    focus: 'Checkout Optimization & Retention',
    status: 'upcoming',
    tasks: [
      { id: 't12', title: 'Optimize checkout flow — reduce steps & form fields', priority: 'HIGH', status: 'backlog', impact: '+0.20% CVR est.' },
      { id: 't13', title: 'Add post-purchase upsell (leather care kit)', priority: 'MEDIUM', status: 'backlog', impact: '+$12 AOV est.' },
      { id: 't14', title: 'Implement cart abandonment email sequence (3-step)', priority: 'HIGH', status: 'backlog', impact: '+0.08% CVR est.' },
      { id: 't15', title: 'A/B Test: Free shipping threshold messaging in cart', priority: 'MEDIUM', status: 'backlog', impact: '+0.06% CVR est.' },
      { id: 't16', title: 'Add "Recently Viewed" section on product pages', priority: 'LOW', status: 'backlog', impact: '+0.03% CVR est.' },
    ]
  }
];

export const abTests = [
  {
    id: 'ab0',
    name: 'PDP Hero Banner: Hidden vs. Current',
    hypothesis: 'Removing the full-bleed lifestyle hero banner on product pages puts the product image, price, and ATC button above the fold immediately — reducing scroll friction and increasing add-to-cart rate',
    status: 'building',
    sprint: 1,
    startDate: null,
    endDate: null,
    control: { name: 'Current: full-bleed lifestyle hero above product details', cvr: null },
    variant: { name: 'Variant: hero banner hidden via CSS, product info loads above fold', cvr: null },
    winner: null,
    confidence: null,
    implementationNotes: 'Use Convert.com visual editor to inject CSS: hide .heroCarousel or equivalent hero container on /product/* URLs. No BC theme changes needed. Target: product detail pages only.',
  },
  {
    id: 'ab1',
    name: 'Product-First Hero Layout',
    hypothesis: 'Showing products + prices above fold vs. lifestyle imagery will increase CVR by removing a navigation step',
    status: 'planned',
    sprint: 2,
    startDate: null,
    endDate: null,
    control: { name: 'Current lifestyle hero', cvr: null },
    variant: { name: 'Product grid above fold', cvr: null },
    winner: null,
    confidence: null,
  },
  {
    id: 'ab2',
    name: 'Sticky ATC Bar',
    hypothesis: 'A sticky "Add to Cart" bar that follows users as they scroll product descriptions will reduce drop-off',
    status: 'planned',
    sprint: 2,
    startDate: null,
    endDate: null,
    control: { name: 'Standard ATC below fold', cvr: null },
    variant: { name: 'Sticky ATC bar on scroll', cvr: null },
    winner: null,
    confidence: null,
  },
  {
    id: 'ab3',
    name: 'Free Shipping Threshold Bar',
    hypothesis: 'Showing a dynamic progress bar toward free shipping threshold in cart will increase AOV and reduce abandonment',
    status: 'planned',
    sprint: 3,
    startDate: null,
    endDate: null,
    control: { name: 'Current cart page', cvr: null },
    variant: { name: 'Shipping progress bar in cart', cvr: null },
    winner: null,
    confidence: null,
  }
];

// SBL Team's prior & ongoing work — logged for coordination / test contamination awareness
export const sblActivity = [
  {
    category: 'UI/UX & Website Experience',
    emoji: '🎨',
    status: 'completed',
    items: [
      {
        title: 'Navigation Bar Updates',
        status: 'completed',
        notes: 'A/B tested and heatmap analysis confirmed the "Shop All" navigation outperformed the previous structure. Now implemented as the live site navigation.',
      },
      {
        title: 'Wallet Page Improvements',
        status: 'completed',
        notes: 'Added tabs to the Wallet page so users can browse specific wallet categories (including Classic Wallet designs) more easily.',
      },
      {
        title: 'Discover Tab',
        status: 'completed',
        notes: 'Heatmap analysis confirmed users are actively engaging with the Discover tab while still accessing Saddleback and featured links. No changes needed.',
      },
    ],
  },
  {
    category: 'SEO',
    emoji: '🔍',
    status: 'ongoing',
    items: [
      {
        title: 'Collection & Product Page Optimization',
        status: 'ongoing',
        notes: 'Aligning pages with customer search intent to improve discoverability, navigation clarity, and purchase decision support.',
      },
      {
        title: 'Keyword Expansion & Keyword Mapping',
        status: 'ongoing',
        notes: 'Identifying high-intent search terms and mapping them to the most relevant pages to attract users closer to purchase.',
      },
      {
        title: 'Metadata Optimization',
        status: 'ongoing',
        notes: 'Improving title tags and meta descriptions across key pages to increase organic click-through rates.',
      },
      {
        title: 'Ongoing Content Production',
        status: 'ongoing',
        notes: 'Continuous creation and optimization of content addressing customer questions, product use cases, and search intent.',
      },
    ],
  },
  {
    category: 'Paid Media',
    emoji: '📣',
    status: 'ongoing',
    items: [
      {
        title: 'Retargeting — Meta & Google',
        status: 'ongoing',
        notes: 'Retargeting users who added to cart or initiated checkout but did not complete purchase. Campaigns target high-intent visitors to drive return conversions.',
      },
    ],
  },
];

// Monthly CVR data — will be replaced by live GA4 data once connected
// Format: { month: 'MMM YY', cvr: number, sessions: number }
export const cvrHistory = [
  { month: 'Jun 25', cvr: 0.88, sessions: 48200 },
  { month: 'Jul 25', cvr: 0.91, sessions: 51000 },
  { month: 'Aug 25', cvr: 0.89, sessions: 53400 },
  { month: 'Sep 25', cvr: 0.93, sessions: 49800 },
  { month: 'Oct 25', cvr: 0.95, sessions: 52100 },
  { month: 'Nov 25', cvr: 1.02, sessions: 68000 },
  { month: 'Dec 25', cvr: 1.18, sessions: 81000 },
  { month: 'Jan 26', cvr: 0.87, sessions: 44200 },
  { month: 'Feb 26', cvr: 0.90, sessions: 46500 },
  { month: 'Mar 26', cvr: 0.91, sessions: 49000 },
  { month: 'Apr 26', cvr: 0.88, sessions: 47300 },
  { month: 'May 26', cvr: 0.91, sessions: 50000 },
];
