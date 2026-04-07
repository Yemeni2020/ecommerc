// Tracks what we've already notified the user about to avoid spam
const KEY = "dl_notifications_seen";

function load() {
  try {
    const d = localStorage.getItem(KEY);
    return d ? JSON.parse(d) : { sales: [], restock: [], tiers: [] };
  } catch {
    return { sales: [], restock: [], tiers: [] };
  }
}

function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function hasSeenSaleNotification(productId) {
  return load().sales.includes(productId);
}

export function markSaleNotificationSeen(productId) {
  const d = load();
  if (!d.sales.includes(productId)) {
    d.sales.push(productId);
    save(d);
  }
}

export function hasSeenRestockNotification(productId) {
  return load().restock.includes(productId);
}

export function markRestockNotificationSeen(productId) {
  const d = load();
  if (!d.restock.includes(productId)) {
    d.restock.push(productId);
    save(d);
  }
}

export function hasSeenTierNotification(tier) {
  return load().tiers.includes(tier);
}

export function markTierNotificationSeen(tier) {
  const d = load();
  if (!d.tiers.includes(tier)) {
    d.tiers.push(tier);
    save(d);
  }
}

// Reset all (useful for testing)
export function resetNotifications() {
  save({ sales: [], restock: [], tiers: [] });
}