// In-memory gift card store (persisted in localStorage)
const STORAGE_KEY = "dl_gift_cards";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}

function save(cards) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)); } catch {}
}

export function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DLG-";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function purchaseGiftCard(value, recipientEmail, recipientName, senderName, message) {
  const cards = load();
  const code = generateCode();
  cards[code] = {
    code,
    value,
    balance: value,
    recipientEmail,
    recipientName,
    senderName,
    message,
    purchasedAt: new Date().toISOString(),
    used: false,
  };
  save(cards);
  return code;
}

export function redeemGiftCard(code, amount) {
  const cards = load();
  const card = cards[code.toUpperCase().trim()];
  if (!card) return { ok: false, error: "Invalid gift card code." };
  if (card.balance <= 0) return { ok: false, error: "This gift card has been fully used." };
  const deduct = Math.min(amount, card.balance);
  cards[code] = { ...card, balance: card.balance - deduct, used: card.balance - deduct <= 0 };
  save(cards);
  return { ok: true, deducted: deduct, remaining: card.balance - deduct };
}

export function checkGiftCard(code) {
  const cards = load();
  const card = cards[code.toUpperCase().trim()];
  if (!card) return null;
  return card;
}

// Pre-seed a demo card so users can try it
export function seedDemoCard() {
  const cards = load();
  if (!cards["DLG-DEMO-CARD"]) {
    cards["DLG-DEMO-CARD"] = {
      code: "DLG-DEMO-CARD",
      value: 200,
      balance: 200,
      recipientEmail: "demo@driveluxe.sa",
      recipientName: "Guest",
      senderName: "DriveLuxe",
      message: "Welcome! Enjoy 200 SAR off your order.",
      purchasedAt: new Date().toISOString(),
      used: false,
    };
    save(cards);
  }
}