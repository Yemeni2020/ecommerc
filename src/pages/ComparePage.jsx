import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Check, Minus, ShoppingCart, X, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compareContext";
import { useCart } from "@/lib/cartContext";
import { useCurrency } from "@/lib/currencyContext";
import { PRODUCTS_DB } from "@/lib/productData";
import Navbar from "../components/home/Navbar";

export default function ComparePage() {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { format } = useCurrency();

  // All unique spec labels across compared products
  const specLabels = [];
  compareList.forEach((p) => {
    p.specs?.forEach((s) => {
      if (!specLabels.includes(s.label)) specLabels.push(s.label);
    });
  });

  const getSpec = (product, label) => product.specs?.find((s) => s.label === label)?.value || null;
  const isDifferent = (label) => new Set(compareList.map((p) => getSpec(p, label)).filter(Boolean)).size > 1;

  // Suggestions: products not in compare list
  const suggestions = PRODUCTS_DB.filter((p) => !compareList.find((c) => c.id === p.id)).slice(0, 3);

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar onCartClick={() => {}} cartCount={0} />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
          <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center">
            <GitCompare className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">No Products to Compare</h2>
            <p className="text-muted-foreground text-sm mt-2">Add up to 3 products using the compare button on any product card.</p>
          </div>
          <Button asChild className="rounded-full">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => {}} cartCount={0} />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">Compare Products</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{compareList.length} of 3 products selected</p>
            </div>
          </div>
          <button onClick={clearCompare} className="text-xs text-muted-foreground hover:text-destructive transition-colors border border-border/50 rounded-full px-4 py-2">
            Clear all
          </button>
        </div>

        {/* Compare Table */}
        <div className="overflow-x-auto rounded-3xl border border-border/50 bg-card">
          <table className="w-full min-w-[500px]">
            {/* Product Headers */}
            <thead>
              <tr className="border-b border-border/50">
                <th className="w-36 text-left p-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Feature</th>
                {compareList.map((p) => (
                  <th key={p.id} className="p-4 text-center border-l border-border/30">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <img src={p.images[0]} alt={p.name} className="w-24 h-24 object-cover rounded-2xl border border-border/50" />
                        <button
                          onClick={() => toggleCompare(p)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-destructive hover:border-destructive hover:text-white transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <Link to={`/product/${p.id}`} className="text-sm font-semibold text-center line-clamp-2 hover:text-primary transition-colors leading-tight max-w-[130px]">
                        {p.name}
                      </Link>
                      <Button size="sm" onClick={() => addToCart(p, 1)} className="rounded-full h-8 text-xs w-full max-w-[130px]">
                        <ShoppingCart className="w-3 h-3 mr-1" /> Add to Cart
                      </Button>
                    </motion.div>
                  </th>
                ))}
                {/* Empty slot */}
                {compareList.length < 3 && (
                  <th className="p-4 text-center border-l border-border/30">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                      <Link to="/products" className="w-24 h-24 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                        <span className="text-3xl">+</span>
                      </Link>
                      <span className="text-xs text-muted-foreground">Add product</span>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="text-sm">
              {/* Price */}
              <tr className="border-b border-border/30">
                <td className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">Price</td>
                {compareList.map((p) => {
                  const isLowest = p.price === Math.min(...compareList.map((x) => x.price));
                  return (
                    <td key={p.id} className="p-4 text-center border-l border-border/30">
                      <div className={`font-bold text-lg ${isLowest && compareList.length > 1 ? "text-green-400" : "text-foreground"}`}>{format(p.price)}</div>
                      {p.oldPrice && <div className="text-xs text-muted-foreground line-through mt-0.5">{format(p.oldPrice)}</div>}
                      {isLowest && compareList.length > 1 && <div className="text-[10px] text-green-400 mt-1 font-semibold">✓ Best Price</div>}
                    </td>
                  );
                })}
                {compareList.length < 3 && <td className="border-l border-border/30" />}
              </tr>

              {/* Rating */}
              <tr className="border-b border-border/30 bg-secondary/10">
                <td className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">Rating</td>
                {compareList.map((p) => {
                  const isHighest = p.rating === Math.max(...compareList.map((x) => x.rating));
                  return (
                    <td key={p.id} className="p-4 text-center border-l border-border/30">
                      <div className="flex items-center justify-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(p.rating) ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
                        ))}
                      </div>
                      <div className={`text-sm font-bold mt-1 ${isHighest && compareList.length > 1 ? "text-primary" : ""}`}>{p.rating}</div>
                      <div className="text-xs text-muted-foreground">({p.reviewCount} reviews)</div>
                      {isHighest && compareList.length > 1 && <div className="text-[10px] text-primary mt-1 font-semibold">✓ Top Rated</div>}
                    </td>
                  );
                })}
                {compareList.length < 3 && <td className="border-l border-border/30" />}
              </tr>

              {/* Category */}
              <tr className="border-b border-border/30">
                <td className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center text-xs border-l border-border/30">
                    <span className="px-2 py-1 bg-secondary rounded-full">{p.category}</span>
                  </td>
                ))}
                {compareList.length < 3 && <td className="border-l border-border/30" />}
              </tr>

              {/* In Stock */}
              <tr className="border-b border-border/30 bg-secondary/10">
                <td className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">In Stock</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-center border-l border-border/30">
                    {p.inStock
                      ? <Check className="w-5 h-5 text-green-400 mx-auto" />
                      : <Minus className="w-5 h-5 text-muted-foreground/40 mx-auto" />}
                  </td>
                ))}
                {compareList.length < 3 && <td className="border-l border-border/30" />}
              </tr>

              {/* Specs */}
              {specLabels.map((label, i) => {
                const diff = isDifferent(label);
                return (
                  <tr key={label} className={`border-b border-border/30 ${diff ? "bg-primary/5" : i % 2 === 0 ? "" : "bg-secondary/10"}`}>
                    <td className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30">
                      <span className="flex items-center gap-1.5">
                        {label}
                        {diff && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" title="Difference" />}
                      </span>
                    </td>
                    {compareList.map((p) => {
                      const val = getSpec(p, label);
                      return (
                        <td key={p.id} className="p-4 text-center text-xs text-muted-foreground border-l border-border/30">
                          {val || <Minus className="w-3 h-3 mx-auto text-muted-foreground/30" />}
                        </td>
                      );
                    })}
                    {compareList.length < 3 && <td className="border-l border-border/30" />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold mb-5">You might also want to compare</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestions.map((p) => (
                <div key={p.id} className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4">
                  <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                    <p className="font-semibold text-sm line-clamp-1 mt-0.5">{p.name}</p>
                    <p className="text-sm font-bold text-primary mt-1">{format(p.price)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleCompare(p)}
                    disabled={compareList.length >= 3}
                    className="rounded-full h-8 text-xs flex-shrink-0"
                  >
                    + Compare
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}