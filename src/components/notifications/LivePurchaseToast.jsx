import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { PRODUCTS_DB } from "@/lib/productData";

const SAUDI_NAMES = [
  "Ahmed", "Mohammed", "Khalid", "Abdullah", "Faisal",
  "Omar", "Saad", "Turki", "Rayan", "Nasser",
  "Sara", "Noura", "Lina", "Fatima", "Maha",
  "Yazeed", "Majed", "Tariq", "Hani", "Waleed",
];

const SAUDI_CITIES = [
  "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam",
  "Khobar", "Tabuk", "Abha", "Khamis Mushait", "Buraidah",
];

const TIME_LABELS = [
  "just now", "2 min ago", "5 min ago", "8 min ago", "12 min ago",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateNotification() {
  const product = randomItem(PRODUCTS_DB);
  return {
    id: Date.now() + Math.random(),
    name: randomItem(SAUDI_NAMES),
    city: randomItem(SAUDI_CITIES),
    product: product.name,
    image: product.images[0],
    time: randomItem(TIME_LABELS),
    productId: product.id,
  };
}

export default function LivePurchaseToast() {
  const [notifications, setNotifications] = useState([]);

  const pushNotification = useCallback(() => {
    const notif = generateNotification();
    setNotifications((prev) => [notif, ...prev].slice(0, 3));
    // Auto-dismiss after 5s
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 5000);
  }, []);

  useEffect(() => {
    // Initial delay before first notification
    const initial = setTimeout(pushNotification, 3000);

    // Recurring interval: every 8–15 seconds
    const interval = setInterval(() => {
      pushNotification();
    }, 8000 + Math.random() * 7000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [pushNotification]);

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 z-40 space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.92 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="pointer-events-auto flex items-center gap-3 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-xl px-3.5 py-3 w-72 max-w-[calc(100vw-2rem)]"
          >
            <img
              src={notif.image}
              alt={notif.product}
              className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-border/40"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-[10px] text-green-400 font-semibold">Live Purchase</span>
              </div>
              <p className="text-xs font-semibold text-foreground leading-tight">
                <span className="text-primary">{notif.name}</span> from {notif.city}
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{notif.product}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{notif.time}</p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
              className="w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}