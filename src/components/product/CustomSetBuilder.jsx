import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, ChevronDown, ChevronUp, Sparkles, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS_DB } from "@/lib/productData";
import { useCart } from "@/lib/cartContext";
import { useCurrency } from "@/lib/currencyContext";

// Discount tiers based on number of items in bundle
const DISCOUNT_TIERS = [
  { items: 2, discount: 0.08, label: "8% off" },
  { items: 3, discount: 0.12, label: "12% off" },
  { items: 4, discount: 0.18, label: "18% off" },
];

function getDiscount(count) {
  const tier = [...DISCOUNT_TIERS].reverse().find((t) => count >= t.items);
  return tier || null;
}

// Curated bundle suggestions by category
const BUNDLE_CATEGORIES = [
  { key: "Interior", label: "Interior Comfort", icon: "🪑" },
  { key: "Technology", label: "Tech Upgrades", icon: "⚡" },
  { key: "Exterior", label: "Exterior Style", icon: "✨" },
  { key: "Performance", label: "Performance", icon: "🏎️" },
];

export default function CustomSetBuilder({ currentProductId }) {
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([currentProductId]);
  const [added, setAdded] = useState(false);

  const currentProduct = PRODUCTS_DB.find((p) => p.id === currentProductId);
  const otherProducts = PRODUCTS_DB.filter((p) => p.id !== currentProductId && p.inStock);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedProducts = useMemo(
    () => PRODUCTS_DB.filter((p) => selected.includes(p.id)),
    [selected]
  );

  const subtotal = selectedProducts.reduce((s, p) => s + p.price, 0);
  const discountTier = getDiscount(selected.length);
  const discountAmount = discountTier ? Math.round(subtotal * discountTier.discount) : 0;
  const total = subtotal - discountAmount;

  const handleAddBundle = () => {
    selectedProducts.forEach((p) => addToCart(p, 1));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="mt-8 rounded-2xl border border-border/50 bg-secondary/20 overflow-hidden">
      {/* Header toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-bold text-sm">Build Your Custom Set</p>
            <p className="text-xs text-muted-foreground">Bundle accessories & save up to 18%</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5 border-t border-border/40">
              {/* Discount tier pills */}
              <div className="flex gap-2 pt-4 flex-wrap">
                {DISCOUNT_TIERS.map((tier) => {
                  const active = selected.length >= tier.items;
                  return (
                    <div
                      key={tier.items}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-secondary/40 border-border/40 text-muted-foreground"
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                      {tier.items}+ items → {tier.label}
                    </div>
                  );
                })}
              </div>

              {/* Current product — always selected */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Base Item (Current Product)
                </p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <img
                    src={currentProduct?.images[0]}
                    alt={currentProduct?.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1">{currentProduct?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentProduct?.category}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{format(currentProduct?.price)}</span>
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Add-on products grouped by category */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Add to Your Bundle
                </p>
                <div className="space-y-2">
                  {otherProducts.map((product) => {
                    const isSelected = selected.includes(product.id);
                    return (
                      <motion.button
                        key={product.id}
                        onClick={() => toggle(product.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          isSelected
                            ? "bg-primary/5 border-primary/30"
                            : "bg-secondary/30 border-border/30 hover:border-border"
                        }`}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="text-sm font-bold flex-shrink-0">{format(product.price)}</span>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-border/50"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 text-primary-foreground" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Summary & CTA */}
              <div className="rounded-2xl bg-card border border-border/50 p-4 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{selected.length} item{selected.length !== 1 ? "s" : ""} selected</span>
                  <span>{format(subtotal)}</span>
                </div>

                {discountTier && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Bundle discount ({discountTier.label})</span>
                    <span>−{format(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-base border-t border-border/40 pt-3">
                  <span>Bundle Total</span>
                  <span className="text-primary text-lg">{format(total)}</span>
                </div>

                {!discountTier && selected.length < 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    Add 1 more item to unlock <span className="text-primary font-semibold">8% off</span>
                  </p>
                )}

                <Button
                  onClick={handleAddBundle}
                  disabled={selected.length < 2 || added}
                  className="w-full h-11 rounded-full font-semibold"
                  style={{ background: added ? "hsl(142 76% 36%)" : undefined }}
                >
                  {added ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Bundle Added to Cart!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add Bundle to Cart
                      {discountTier && (
                        <span className="bg-primary-foreground/20 text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          SAVE {discountTier.label}
                        </span>
                      )}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}