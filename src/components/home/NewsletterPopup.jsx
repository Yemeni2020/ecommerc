import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Check, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generatePromoCode, isSubscribed, setSubscribed } from "@/lib/promoStore";

const TIME_TRIGGER_MS = 30000; // 30 seconds on site

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);
  const shownRef = useRef(false);

  const triggerPopup = () => {
    if (shownRef.current || isSubscribed()) return;
    shownRef.current = true;
    setShow(true);
  };

  useEffect(() => {
    if (isSubscribed()) return;

    // Time-based trigger
    timerRef.current = setTimeout(triggerPopup, TIME_TRIGGER_MS);

    // Exit-intent trigger
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) triggerPopup();
    };
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    const code = generatePromoCode();
    setPromoCode(code);
    setSubscribed();
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setShow(false);
    // If they close without subscribing, delay re-show by marking session-only
    if (!submitted) sessionStorage.setItem("dl_popup_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-md bg-card border border-border/50 rounded-3xl overflow-hidden shadow-2xl">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Decorative header */}
              <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-8 pb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute w-24 h-24 rounded-full border border-primary" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
                  ))}
                </div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold">Get 10% Off</h2>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    Subscribe to our newsletter and receive an exclusive discount code for your first order.
                  </p>
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          required
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-12 rounded-xl bg-secondary/40 border-border/50"
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 rounded-full font-semibold">
                        Claim My 10% Discount
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        No spam. Unsubscribe anytime. We respect your privacy.
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto">
                        <Check className="w-7 h-7 text-green-500" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">You're subscribed!</p>
                        <p className="text-muted-foreground text-sm mt-1">Use this code at checkout for 10% off:</p>
                      </div>
                      <div className="bg-secondary/50 border border-border/50 rounded-2xl p-4">
                        <p className="font-mono text-xl font-bold text-primary tracking-widest">{promoCode}</p>
                      </div>
                      <Button onClick={handleCopy} variant="outline" className="rounded-full gap-2 w-full">
                        {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Gift className="w-4 h-4" /> Copy Code</>}
                      </Button>
                      <Button onClick={() => setShow(false)} className="rounded-full w-full">
                        Start Shopping
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}