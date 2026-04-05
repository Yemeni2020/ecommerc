// Promo code store (newsletter 10% discount codes)
const STORAGE_KEY = "dl_promo_codes";
const SUBSCRIBED_KEY = "dl_newsletter_subscribed";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function save(codes) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(codes)); } catch {}
}

export function generatePromoCode() {
  const code = "WELCOME10-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const codes = load();
  codes[code] = { discount: 0.10, type: "percent", used: false, createdAt: new Date().toISOString() };
  save(codes);
  return code;
}

export function checkPromoCode(code) {
  const codes = load();
  return codes[code.toUpperCase().trim()] || null;
}

export function markPromoUsed(code) {
  const codes = load();
  if (codes[code]) { codes[code].used = true; save(codes); }
}

export function isSubscribed() {
  return localStorage.getItem(SUBSCRIBED_KEY) === "true";
}

export function setSubscribed() {
  localStorage.setItem(SUBSCRIBED_KEY, "true");
}