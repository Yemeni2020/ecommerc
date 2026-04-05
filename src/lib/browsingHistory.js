const KEY = "dl_browsing_history";
const MAX = 10;

export function recordView(productId) {
  const history = getHistory();
  const updated = [productId, ...history.filter((id) => id !== productId)].slice(0, MAX);
  try { localStorage.setItem(KEY, JSON.stringify(updated)); } catch {}
}

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}