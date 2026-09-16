/**
 * Static Dashboard Metrics, History, and Benchmark Factors
 */

export const trustHistory = [
  { month: "Dec", score: 71, average: 65 },
  { month: "Jan", score: 73, average: 66 },
  { month: "Feb", score: 72, average: 67 },
  { month: "Mar", score: 75, average: 68 },
  { month: "Apr", score: 78, average: 70 },
  { month: "May", score: 77, average: 71 },
  { month: "Jun", score: 79, average: 72 },
  { month: "Jul", score: 81, average: 73 },
  { month: "Aug", score: 80, average: 73 },
  { month: "Sep", score: 82, average: 74 },
  { month: "Oct", score: 85, average: 75 },
  { month: "Nov", score: 88, average: 76 },
];

export const trustBreakdown = [
  {
    factor: "KYC & Identity Verification",
    key: "kycScore",
    weight: 40,
    score: 38,
    max: 40,
    status: "Optimal",
  },
  {
    factor: "Regulatory & Tax Compliance",
    key: "complianceScore",
    weight: 20,
    score: 28,
    max: 20,
    status: "Optimal",
  },
  {
    factor: "Commercial Deal Performance",
    key: "dealPerformanceScore",
    weight: 30,
    score: 22,
    max: 30,
    status: "Good",
  },
  {
    factor: "Platform Activity & Recency",
    key: "activityScore",
    weight: 10,
    score: 8,
    max: 10,
    status: "Active",
  },
];

export const platformStats = {
  totalEntities: 1420,
  verifiedEntities: 1248,
  pendingVerifications: 142,
  flaggedEntities: 30,
  totalVolumeINR: 4850000000, // ₹485 Cr
  activeDeals: 384,
  verificationSuccessRate: 98.6,
  averageReviewTimeHours: 1.4,
};

export const formatINR = (amount) => {
  if (amount == null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const recentActivity = [
  {
    id: "r1",
    text: "Bank Statement uploaded — automated OCR matched",
    time: "12m ago",
    type: "upload",
  },
  {
    id: "r2",
    text: "Helios Trade Networks viewed your counterparty profile",
    time: "1h ago",
    type: "view",
  },
  {
    id: "r3",
    text: "Deal created: Q4 Component Supply Agreement (DL-2841)",
    time: "3h ago",
    type: "deal",
  },
  { id: "r4", text: "Trust score recalibrated (+3 to 88)", time: "Yesterday", type: "score" },
  {
    id: "r5",
    text: "GST Certificate REG06 verified by compliance officer",
    time: "2 days ago",
    type: "verify",
  },
];
