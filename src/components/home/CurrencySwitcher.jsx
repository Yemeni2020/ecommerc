import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCurrency } from "@/lib/currencyContext";

export default function CurrencySwitcher() {
  const { currency, setCurrency, CURRENCIES } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1.5 rounded-lg hover:bg-secondary"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:block">{current.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-40 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCurrency(c.code); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                  c.code === currency
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="text-base">{c.flag}</span>
                <div className="text-left">
                  <p className="font-semibold text-xs leading-none">{c.code}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{c.name}</p>
                </div>
                {c.code === currency && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}