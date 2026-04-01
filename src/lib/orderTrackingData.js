// Mock order tracking data keyed by order number
export const MOCK_ORDERS = {
  "DL-ORDER1": {
    orderNumber: "DL-ORDER1",
    estimatedDelivery: "April 2, 2026",
    product: "Carbon Fiber Phone Mount Pro",
    image: "https://picsum.photos/seed/bd168a385_generated_c8cb9b12.png/1200/1200",
    destination: { name: "Riyadh", lat: 24.7136, lng: 46.6753 },
    currentStatus: "in_transit",
    steps: [
      { id: "ordered", label: "Order Placed", sub: "Mar 28, 2026 · 10:15 AM", done: true },
      { id: "confirmed", label: "Order Confirmed", sub: "Mar 28, 2026 · 11:30 AM", done: true },
      { id: "packed", label: "Packed & Dispatched", sub: "Mar 29, 2026 · 9:00 AM", done: true },
      { id: "in_transit", label: "In Transit", sub: "Mar 30, 2026 · 7:45 AM · Jeddah Hub", done: true, active: true },
      { id: "out_for_delivery", label: "Out for Delivery", sub: "Est. Apr 2, 2026", done: false },
      { id: "delivered", label: "Delivered", sub: "Est. Apr 2, 2026", done: false },
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
    estimatedDelivery: "April 3, 2026",
    product: "Premium Leather Seat Covers",
    image: "https://picsum.photos/seed/46de2be99_generated_2d8b6ffd.png/1200/1200",
    destination: { name: "Dammam", lat: 26.4207, lng: 50.0888 },
    currentStatus: "packed",
    steps: [
      { id: "ordered", label: "Order Placed", sub: "Mar 29, 2026 · 3:00 PM", done: true },
      { id: "confirmed", label: "Order Confirmed", sub: "Mar 29, 2026 · 4:15 PM", done: true },
      { id: "packed", label: "Packed & Dispatched", sub: "Mar 30, 2026 · 8:30 AM", done: true, active: true },
      { id: "in_transit", label: "In Transit", sub: "Est. Apr 1, 2026", done: false },
      { id: "out_for_delivery", label: "Out for Delivery", sub: "Est. Apr 3, 2026", done: false },
      { id: "delivered", label: "Delivered", sub: "Est. Apr 3, 2026", done: false },
    ],
    journey: [
      { name: "Riyadh Warehouse", lat: 24.7136, lng: 46.6753, done: true },
      { name: "Eastern Province Hub", lat: 26.4207, lng: 50.0888, done: false },
      { name: "Dammam — Destination", lat: 26.4207, lng: 50.0888, done: false },
    ],
  },
};

export function lookupOrder(orderNumber) {
  const key = orderNumber.trim().toUpperCase();
  return MOCK_ORDERS[key] || null;
}
