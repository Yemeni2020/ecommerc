import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCTS_DB } from "@/lib/productData";

const ALL_CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS_DB.map((p) => p.category)))];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveCategory("All");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = PRODUCTS_DB.filter((p) => {
    const matchesQuery =
      query.trim() === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const matchesCat = activeCategory === "All" || p.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border/60 shadow-2xl"
          >
            {/* Search Input */}
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories…"
                className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filters */}
            <div className="max-w-3xl mx-auto px-4 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-w-3xl mx-auto px-4 pb-5">
              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No products found for "{query}"
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filtered.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {product.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground">·</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                            <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-foreground">{product.price} SAR</p>
                        {product.oldPrice && (
                          <p className="text-[10px] text-muted-foreground line-through">{product.oldPrice} SAR</p>
                        )}
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}

              {filtered.length > 0 && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}