import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, MapPin, CreditCard, Smartphone, Clock, Package } from "lucide-react";
import { motion } from "framer-motion";

const METHOD_LABELS = {
  credit_card: { label: "Credit / Debit Card", icon: CreditCard },
  tabby: { label: "Tabby — Pay in 4", icon: Smartphone },
  tamara: { label: "Tamara — Pay in 3", icon: Clock },
};

function OrderConfirmed({ orderNumber }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10 flex flex-col items-center gap-5"
    >
      <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
        <Check className="w-10 h-10 text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold font-display">Order Confirmed!</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
      </div>
      <div className="px-6 py-4 rounded-2xl bg-secondary/50 border border-border/50 w-full max-w-xs">
        <p className="text-xs text-muted-foreground">Order Number</p>
        <p className="font-bold text-lg font-mono text-primary mt-1">{orderNumber}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        You'll receive a confirmation SMS & email shortly.
      </p>
    </motion.div>
  );
}

export default function ReviewStep({ shipping, payment, cart, onBack, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping_fee = 0;
  const total = subtotal + shipping_fee;

  const PayIcon = METHOD_LABELS[payment.method]?.icon || CreditCard;

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      const num = "DL-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      setOrderNumber(num);
      setConfirmed(true);
      setLoading(false);
      onConfirm();
    }, 1800);
  };

  if (confirmed) return <OrderConfirmed orderNumber={orderNumber} />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-display">Review Your Order</h2>

      {/* Shipping summary */}
      <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 space-y-1">
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          <MapPin className="w-4 h-4 text-primary" /> Shipping To
        </div>
        <p className="text-sm text-foreground font-medium">{shipping.fullName}</p>
        <p className="text-sm text-muted-foreground">
          {shipping.address}{shipping.apartment ? `, ${shipping.apartment}` : ""}
        </p>
        <p className="text-sm text-muted-foreground">
          {shipping.city}{shipping.postalCode ? ` ${shipping.postalCode}` : ""}, Saudi Arabia
        </p>
        <p className="text-sm text-muted-foreground">{shipping.phone}</p>
      </div>

      {/* Payment summary */}
      <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50 space-y-1">
        <div className="flex items-center gap-2 text-sm font-semibold mb-2">
          <PayIcon className="w-4 h-4 text-primary" /> Payment
        </div>
        <p className="text-sm text-foreground">{METHOD_LABELS[payment.method]?.label}</p>
        {payment.method === "credit_card" && payment.cardNumber && (
          <p className="text-sm text-muted-foreground">
            •••• •••• •••• {payment.cardNumber.replace(/\s/g, "").slice(-4)}
          </p>
        )}
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Package className="w-4 h-4 text-primary" /> Items ({cart.length})
        </div>
        {cart.map((item) => (
          <div key={item.id} className="flex gap-3 items-center p-3 rounded-xl bg-secondary/30 border border-border/30">
            <img src={item.images[0]} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-bold text-foreground flex-shrink-0">
              {(item.price * item.quantity).toLocaleString()} SAR
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="rounded-2xl bg-secondary/30 border border-border/50 overflow-hidden">
        {[
          { label: "Subtotal", value: `${subtotal.toLocaleString()} SAR` },
          { label: "Shipping", value: "Free" },
          { label: "VAT (15%)", value: `${Math.round(subtotal * 0.15).toLocaleString()} SAR` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center px-4 py-3 border-b border-border/30 text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-4 text-base font-bold">
          <span>Total</span>
          <span className="text-primary text-xl">{Math.round(total * 1.15).toLocaleString()} SAR</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="h-12 rounded-full px-6 border-border/50" disabled={loading}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="flex-1 h-12 rounded-full font-semibold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Processing…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Confirm Order
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
