// Rewards system — persisted to localStorage
// Points: 10 pts per 100 SAR spent, 50 pts per review submitted
// Redemption: 100 pts = 10 SAR discount

const KEY = "dl_rewards";

const DEFAULT = { points: 0, transactions: [] };

function load() {
  try {
    const d = localStorage.getItem(KEY);
    return d ? JSON.parse(d) : { ...DEFAULT };
  } catch { return { ...DEFAULT }; }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export const POINTS_PER_100_SAR = 10;
export const POINTS_PER_REVIEW = 50;
export const REDEMPTION_RATE = 10; // 100 pts = 10 SAR

export function getRewards() {
  return load();
}

export function addPurchasePoints(totalSAR) {
  const data = load();
  const pts = Math.floor((totalSAR / 100) * POINTS_PER_100_SAR);
  if (pts <= 0) return data;
  data.points += pts;
  data.transactions.unshift({
    id: Date.now(),
    type: "earn",
    label: `Purchase reward`,
    points: pts,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  });
  save(data);
  return data;
}

export function addReviewPoints() {
  const data = load();
  data.points += POINTS_PER_REVIEW;
  data.transactions.unshift({
    id: Date.now(),
    type: "earn",
    label: "Review submitted",
    points: POINTS_PER_REVIEW,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  });
  save(data);
  return data;
}

export function redeemPoints(pointsToRedeem) {
  const data = load();
  if (data.points < pointsToRedeem) return null;
  const discount = Math.floor(pointsToRedeem / 100) * REDEMPTION_RATE;
  data.points -= pointsToRedeem;
  data.transactions.unshift({
    id: Date.now(),
    type: "redeem",
    label: `Redeemed for ${discount} SAR off`,
    points: -pointsToRedeem,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  });
  save(data);
  return { discount, remaining: data.points };
}

export function sarFromPoints(pts) {
  return Math.floor(pts / 100) * REDEMPTION_RATE;
}