import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CreditCard, Smartphone, Clock } from "lucide-react";

const PAYMENT_METHODS = [
  {
    id: "credit_card",
    icon: CreditCard,
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard, Mada",
  },
  {
    id: "tabby",
    icon: Smartphone,
    label: "Tabby",
    sub: "Buy now, pay later in 4 installments — interest free",
    badge: "0% Interest",
  },
  {
    id: "tamara",
    icon: Clock,
    label: "Tamara",
    sub: "Split into 3 monthly payments — no hidden fees",
    badge: "Pay in 3",
  },
];

export default function PaymentStep({ data, onChange, onNext, onBack }) {
  const update = (field, val) => onChange({ ...data, [field]: val });

  const isCreditCard = data.method === "credit_card";
  const creditCardValid =
    !isCreditCard ||
    (data.cardNumber?.length >= 16 && data.expiry && data.cvv && data.cardName);

  const valid = data.method && creditCardValid;

  const formatCardNumber = (val) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-display">Payment Method</h2>

      {/* Method Selector */}
      <div className="space-y-3">
        {PAYMENT_METHODS.map((m) => {
          const Icon = m.icon;
          const selected = data.method === m.id;
          return (
            <button
              key={m.id}
              onClick={() => update("method", m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-secondary/30 hover:border-border"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{m.label}</span>
                  {m.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                  selected ? "border-primary bg-primary" : "border-border"
                }`}
              >
                {selected && <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Credit Card Form */}
      {isCreditCard && (
        <div className="space-y-4 p-5 rounded-2xl bg-secondary/30 border border-border/50">
          <div className="space-y-1.5">
            <Label>Cardholder Name</Label>
            <Input
              placeholder="Name as on card"
              value={data.cardName || ""}
              onChange={(e) => update("cardName", e.target.value)}
              className="bg-card border-border/50 h-11 rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Card Number</Label>
            <Input
              placeholder="1234 5678 9012 3456"
              value={data.cardNumber || ""}
              onChange={(e) => update("cardNumber", formatCardNumber(e.target.value))}
              className="bg-card border-border/50 h-11 rounded-xl font-mono"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input
                placeholder="MM/YY"
                value={data.expiry || ""}
                onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                className="bg-card border-border/50 h-11 rounded-xl font-mono"
                maxLength={5}
              />
            </div>
            <div className="space-y-1.5">
              <Label>CVV</Label>
              <Input
                placeholder="123"
                value={data.cvv || ""}
                onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="bg-card border-border/50 h-11 rounded-xl font-mono"
                maxLength={4}
                type="password"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            🔒 Your payment details are encrypted and secure
          </p>
        </div>
      )}

      {/* BNPL info */}
      {(data.method === "tabby" || data.method === "tamara") && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
          {data.method === "tabby"
            ? "You will be redirected to Tabby to complete your purchase and choose your installment plan."
            : "You will be redirected to Tamara to split your payment into 3 easy monthly installments."}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onBack} className="h-12 rounded-full px-6 border-border/50">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} disabled={!valid} className="flex-1 h-12 rounded-full font-semibold group">
          Review Order
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
