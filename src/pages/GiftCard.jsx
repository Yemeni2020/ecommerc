import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Check, Copy, ArrowLeft, Mail, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseGiftCard, seedDemoCard } from "@/lib/giftCardStore";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import { useCart } from "@/lib/cartContext";
import CartDrawer from "../components/product/CartDrawer";

const AMOUNTS = [100, 200, 500, 1000, 2000];

export default function GiftCard() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [amount, setAmount] = useState(200);
  const [customAmount, setCustomAmount] = useState("");
  const [form, setForm] = useState({ recipientName: "", recipientEmail: "", senderName: "", message: "" });
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { seedDemoCard(); }, []);

  const finalAmount = customAmount ? parseInt(customAmount) : amount;
  const valid = form.recipientName && form.recipientEmail && form.senderName && finalAmount >= 50;

  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      const code = purchaseGiftCard(finalAmount, form.recipientEmail, form.recipientName, form.senderName, form.message);
      setGeneratedCode(code);
      setLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={totalItems} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold">Gift Cards</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Give the gift of premium automotive accessories</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {generatedCode ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 flex flex-col items-center gap-6"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display">Gift Card Created!</h2>
                  <p className="text-muted-foreground text-sm mt-2">Share this code with {form.recipientName}</p>
                </div>

                {/* Card */}
                <div className="w-full max-w-sm bg-gradient-to-br from-primary/20 via-card to-secondary/50 border border-primary/30 rounded-3xl p-6 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">D</span>
                    </div>
                    <span className="font-display font-bold">Drive<span className="text-primary">Luxe</span></span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">Gift Card Value</p>
                  <p className="text-4xl font-bold text-foreground mb-4">{finalAmount.toLocaleString()} <span className="text-2xl text-muted-foreground">SAR</span></p>
                  <p className="text-xs text-muted-foreground mb-1">Redemption Code</p>
                  <p className="font-mono text-xl font-bold text-primary tracking-widest">{generatedCode}</p>
                  {form.message && (
                    <p className="mt-4 text-sm text-muted-foreground italic border-t border-border/40 pt-3">"{form.message}"</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">From: {form.senderName} → To: {form.recipientName}</p>
                </div>

                <Button onClick={handleCopy} variant="outline" className="rounded-full gap-2 px-8">
                  {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
                </Button>

                <div className="text-sm text-muted-foreground bg-secondary/40 rounded-2xl p-4 text-center max-w-sm">
                  Use code <span className="text-primary font-mono font-semibold">{generatedCode}</span> at checkout to deduct {finalAmount.toLocaleString()} SAR from any order.
                </div>

                <Button asChild className="rounded-full px-10">
                  <Link to="/products">Shop Now</Link>
                </Button>

                <button onClick={() => { setGeneratedCode(null); setForm({ recipientName: "", recipientEmail: "", senderName: "", message: "" }); }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Purchase another gift card
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Demo notice */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">Try it:</span> Use code <span className="font-mono font-bold text-primary">DLG-DEMO-CARD</span> at checkout for 200 SAR off (demo card).
                </div>

                {/* Amount Picker */}
                <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2"><Gift className="w-4 h-4 text-primary" /> Select Amount</h3>
                  <div className="flex flex-wrap gap-2">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustomAmount(""); }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${amount === a && !customAmount ? "bg-primary text-primary-foreground border-primary" : "border-border/50 text-muted-foreground hover:border-primary hover:text-primary"}`}
                      >
                        {a.toLocaleString()} SAR
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min={50}
                        placeholder="Custom amount (min 50 SAR)"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                        className="bg-secondary/40 border-border/50 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Recipient Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Recipient Name</Label>
                      <Input placeholder="e.g. Ahmed" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} className="bg-secondary/40 border-border/50 h-11 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Recipient Email</Label>
                      <Input type="email" placeholder="ahmed@example.com" value={form.recipientEmail} onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })} className="bg-secondary/40 border-border/50 h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Your Name</Label>
                    <Input placeholder="From..." value={form.senderName} onChange={(e) => setForm({ ...form, senderName: e.target.value })} className="bg-secondary/40 border-border/50 h-11 rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Personal Message (optional)</Label>
                    <textarea
                      placeholder="Write a heartfelt message..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={3}
                      className="w-full bg-secondary/40 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-secondary/30 border border-border/50 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gift Card Value</span>
                  <span className="text-xl font-bold text-primary">{(finalAmount || 0).toLocaleString()} SAR</span>
                </div>

                <Button onClick={handlePurchase} disabled={!valid || loading} className="w-full h-12 rounded-full font-semibold">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                      Generating Code…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Gift className="w-4 h-4" /> Purchase Gift Card — {(finalAmount || 0).toLocaleString()} SAR</span>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}