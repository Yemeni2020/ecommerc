// Mock order tracking data keyed by order number
// Phone numbers map: orderNumber -> phone (last 4 digits for verification)
export const ORDER_PHONES = {
  "DL-ORDER1": "5500",
  "DL-SAMPLE": "5512",
  "DL-DELIVERED": "5599",
};

// Email map for email-based lookup
export const ORDER_EMAILS = {
  "DL-ORDER1": "ahmed@example.com",
  "DL-SAMPLE": "khalid@example.com",
  "DL-DELIVERED": "rayan@example.com",
};

export const MOCK_ORDERS = {
  "DL-ORDER1": {
    orderNumber: "DL-ORDER1",
    estimatedDelivery: "April 8, 2026",
    product: "Carbon Fiber Phone Mount Pro",
    image: "././imgs/holder.png",
    destination: { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
    currentStatus: "in_transit",
    steps: [
      { id: "ordered", label: "Order Placed", sub: "Apr 1, 2026 · 10:15 AM", done: true },
      { id: "confirmed", label: "Order Confirmed", sub: "Apr 1, 2026 · 11:30 AM", done: true },
      { id: "packed", label: "Packed & Dispatched", sub: "Apr 2, 2026 · 9:00 AM", done: true },
      { id: "in_transit", label: "In Transit", sub: "Apr 3, 2026 · 7:45 AM · Jeddah Hub", done: true, active: true },
      { id: "out_for_delivery", label: "Out for Delivery", sub: "Est. Apr 8, 2026", done: false },
      { id: "delivered", label: "Delivered", sub: "Est. Apr 8, 2026", done: false },
    ],
    journey: [
      { name: "Jeddah Warehouse", lat: 21.4858, lng: 39.1925, done: true },
      { name: "Mecca Hub", lat: 21.3891, lng: 39.8579, done: true },
      { name: "Riyadh Sorting Center", lat: 24.6877, lng: 46.7219, done: false },
      { name: "Riyadh — Destination", lat: 24.7136, lng: 46.6753, done: false },
    ],
  },
  "DL-SAMPLE": {
    orderNumber: "DL-SAMPLE",
    estimatedDelivery: "April 9, 2026",
    product: "Premium Leather Seat Covers",
    image: "././imgs/seats.png",
    destination: { name: "Dammam", lat: 26.4207, lng: 50.0888 },
    currentStatus: "packed",
    steps: [
      { id: "ordered", label: "Order Placed", sub: "Apr 2, 2026 · 3:00 PM", done: true },
      { id: "confirmed", label: "Order Confirmed", sub: "Apr 2, 2026 · 4:15 PM", done: true },
      { id: "packed", label: "Packed & Dispatched", sub: "Apr 3, 2026 · 8:30 AM", done: true, active: true },
      { id: "in_transit", label: "In Transit", sub: "Est. Apr 5, 2026", done: false },
      { id: "out_for_delivery", label: "Out for Delivery", sub: "Est. Apr 9, 2026", done: false },
      { id: "delivered", label: "Delivered", sub: "Est. Apr 9, 2026", done: false },
    ],
    journey: [
      { name: "Riyadh Warehouse", lat: 24.7136, lng: 46.6753, done: true },
      { name: "Eastern Province Hub", lat: 26.4207, lng: 50.0888, done: false },
      { name: "Dammam — Destination", lat: 26.4207, lng: 50.0888, done: false },
    ],
  },
  "DL-DELIVERED": {
    orderNumber: "DL-DELIVERED",
    estimatedDelivery: "Apr 3, 2026",
    product: "Forged Alloy Wheel Set",
    image: "././imgs/wheels.png",
    destination: { name: "Jeddah", lat: 21.4858, lng: 39.1925 },
    currentStatus: "delivered",
    steps: [
      { id: "ordered", label: "Order Placed", sub: "Mar 28, 2026 · 9:00 AM", done: true },
      { id: "confirmed", label: "Order Confirmed", sub: "Mar 28, 2026 · 10:00 AM", done: true },
      { id: "packed", label: "Packed & Dispatched", sub: "Mar 29, 2026 · 8:00 AM", done: true },
      { id: "in_transit", label: "In Transit", sub: "Mar 30, 2026 · 6:00 AM", done: true },
      { id: "out_for_delivery", label: "Out for Delivery", sub: "Apr 3, 2026 · 8:30 AM", done: true },
      { id: "delivered", label: "Delivered", sub: "Apr 3, 2026 · 2:15 PM", done: true, active: true },
    ],
    journey: [
      { name: "Riyadh Warehouse", lat: 24.7136, lng: 46.6753, done: true },
      { name: "Mecca Hub", lat: 21.3891, lng: 39.8579, done: true },
      { name: "Jeddah — Destination", lat: 21.4858, lng: 39.1925, done: true },
    ],
  },
};

export function lookupOrder(orderNumber, emailOrPhone) {
  const key = orderNumber.trim().toUpperCase();
  const order = MOCK_ORDERS[key];
  if (!order) return { error: "not_found" };

  if (emailOrPhone) {
    const input = emailOrPhone.trim().toLowerCase();
    // Email check
    if (input.includes("@")) {
      const expected = ORDER_EMAILS[key];
      if (expected && input !== expected) return { error: "mismatch" };
    } else {
      // Phone check — last 4 digits
      const digits = input.replace(/\D/g, "").slice(-4);
      const expected = ORDER_PHONES[key];
      if (expected && digits !== expected) return { error: "mismatch" };
    }
  }

  return { order };
}