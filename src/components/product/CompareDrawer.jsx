import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Check, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compareContext";
import { Link } from "react-router-dom";

const ALL_SPEC_LABELS = ["Material", "Warranty", "Weight", "Colors", "Origin", "IP Rating", "Finish", "Stitching"];

export default function CompareDrawer({ open, onClose }) {
  const { compareList, toggleCompare, clearCompare } = useCompare();

  if (!open || compareList.length === 0) return null;

  // Collect all unique spec labels across compared products
  const specLabels = [];
  compareList.forEach((p) => {
    p.specs?.forEach((s) => {
      if (!specLabels.includes(s.label)) specLabels.push(s.label);
    });
  });

  const getSpec = (product, label) => product.specs?.find((s) => s.label === label)?.value || null;

  // Highlight differences: if all values are same → not highlighted, else → highlight
  const isDifferent = (label) => {
    const vals = compareList.map((p) => getSpec(p, label));
    return new Set(vals.filter(Boolean)).size > 1;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-3xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 flex-shrink-0">
              <h2 className="font-bold text-lg">Compare Products ({compareList.length})</h2>
              <div className="flex items-center gap-2">
                <button onClick={clearCompare} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                  Clear all
                </button>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1 p-4">
              <table className="w-full min-w-[500px]">
                {/* Product Headers */}
                <thead>
                  <tr>
                    <th className="w-32 text-left pb-4 text-sm text-muted-foreground font-medium">Feature</th>
                    {compareList.map((p) => (
                      <th key={p.id} className="pb-4 px-3">
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative">
                            <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-cover rounded-xl" />
                            <button
                              onClick={() => toggleCompare(p)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-secondary border border-border rounded-full flex items-center justify-center hover:bg-destructive hover:border-destructive transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <Link to={`/product/${p.id}`} onClick={onClose} className="text-xs font-semibold text-center line-clamp-2 hover:text-primary transition-colors leading-tight max-w-[100px]">
                            {p.name}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {/* Price */}
                  <tr className="border-t border-border/50">
                    <td className="py-3 text-muted-foreground text-xs font-semibold uppercase tracking-wider">Price</td>
                    {compareList.map((p) => {
                      const prices = compareList.map((x) => x.price);
                      const isLowest = p.price === Math.min(...prices);
                      return (
                        <td key={p.id} className="py-3 px-3 text-center">
                          <span className={`font-bold text-base ${isLowest ? "text-green-400" : "text-foreground"}`}>
                            {p.price.toLocaleString()} SAR
                          </span>
                          {isLowest && compareList.length > 1 && (
                            <div className="text-[10px] text-green-400 mt-0.5">Lowest price</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Rating */}
                  <tr className="border-t border-border/30 bg-secondary/20">
                    <td className="py-3 text-muted-foreground text-xs font-semibold uppercase tracking-wider">Rating</td>
                    {compareList.map((p) => {
                      const ratings = compareList.map((x) => x.rating);
                      const isHighest = p.rating === Math.max(...ratings);
                      return (
                        <td key={p.id} className="py-3 px-3 text-center">
                          <div className={`flex items-center justify-center gap-1 ${isHighest ? "text-primary" : "text-muted-foreground"}`}>
                            <Star className={`w-3.5 h-3.5 ${isHighest ? "fill-primary" : "fill-muted-foreground"}`} />
                            <span className="font-bold">{p.rating}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">({p.reviewCount} reviews)</div>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category */}
                  <tr className="border-t border-border/30">
                    <td className="py-3 text-muted-foreground text-xs font-semibold uppercase tracking-wider">Category</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-3 text-center text-xs">{p.category}</td>
                    ))}
                  </tr>

                  {/* In Stock */}
                  <tr className="border-t border-border/30 bg-secondary/20">
                    <td className="py-3 text-muted-foreground text-xs font-semibold uppercase tracking-wider">In Stock</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="py-3 px-3 text-center">
                        {p.inStock
                          ? <Check className="w-4 h-4 text-green-400 mx-auto" />
                          : <Minus className="w-4 h-4 text-muted-foreground mx-auto" />}
                      </td>
                    ))}
                  </tr>

                  {/* Specs */}
                  {specLabels.map((label, i) => {
                    const diff = isDifferent(label);
                    return (
                      <tr key={label} className={`border-t border-border/30 ${diff ? "bg-primary/5" : i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                        <td className="py-3 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            {label}
                            {diff && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" title="Difference" />}
                          </span>
                        </td>
                        {compareList.map((p) => {
                          const val = getSpec(p, label);
                          return (
                            <td key={p.id} className="py-3 px-3 text-center text-xs text-muted-foreground">
                              {val || <Minus className="w-3 h-3 mx-auto text-muted-foreground/40" />}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer CTA */}
            <div className="flex gap-2 px-5 py-4 border-t border-border/50 flex-shrink-0">
              {compareList.map((p) => (
                <Button key={p.id} asChild className="flex-1 rounded-full h-10 text-xs font-semibold" onClick={onClose}>
                  <Link to={`/product/${p.id}`}>
                    View {p.name.split(" ")[0]} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}