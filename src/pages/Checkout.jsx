import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import ShippingStep from "../components/checkout/ShippingStep";
import PaymentStep from "../components/checkout/PaymentStep";
import ReviewStep from "../components/checkout/ReviewStep";
import { useCart } from "@/lib/cartContext";

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function Checkout() {
  const { cart } = useCart();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const [shipping, setShipping] = useState({
    fullName: "", phone: "", address: "", apartment: "", city: "", postalCode: "",
  });
  const [payment, setPayment] = useState({ method: "", cardName: "", cardNumber: "", expiry: "", cvv: "" });

  const goNext = () => { setDir(1); setStep((s) => s + 1); };
  const goBack = () => { setDir(-1); setStep((s) => s - 1); };

  if (cart.length === 0 && step < 3) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <p>Your cart is empty.</p>
        <Link to="/" className="text-primary hover:underline text-sm">← Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Drive<span className="text-primary">Luxe</span>
          </Link>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Secure Checkout
          </span>
          <Link to="/" className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <CheckoutStepper currentStep={step} />

        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-card border border-border/50 rounded-3xl p-6 sm:p-8"
            >
              {step === 0 && (
                <ShippingStep data={shipping} onChange={setShipping} onNext={goNext} />
              )}
              {step === 1 && (
                <PaymentStep data={payment} onChange={setPayment} onNext={goNext} onBack={goBack} />
              )}
              {step === 2 && (
                <ReviewStep
                  shipping={shipping}
                  payment={payment}
                  cart={cart}
                  onBack={goBack}
                  onConfirm={() => {}}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          🔒 All transactions are secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}
