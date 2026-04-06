import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Interior", "Exterior", "Performance", "Technology"];
const BRANDS = ["All Brands", "DriveLuxe", "CarbonTech", "LuxeLeather", "AutoGlow", "ForgeWheels"];
const RATINGS_OPTIONS = [
  { label: "Any Rating", min: 0 },
  { label: "4.5+ Stars", min: 4.5 },
  { label: "4.0+ Stars", min: 4.0 },
  { label: "3.5+ Stars", min: 3.5 },
];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 pb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${
        active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProductSidebar({ filters, onChange, activeCount, onReset }) {
  const { category, brand, rating, priceMin, priceMax, inStock, onSale } = filters;

  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm">Filters</h3>
        {activeCount > 0 && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs text-primary hover:underline">
            <RotateCcw className="w-3 h-3" /> Reset ({activeCount})
          </button>
        )}
      </div>

      {/* Category */}
      <Section title="Category">
        {CATEGORIES.map((cat) => (
          <FilterButton key={cat} active={category === cat} onClick={() => set("category", cat)}>
            {cat}
          </FilterButton>
        ))}
      </Section>

      {/* Price Range */}
      <Section title="Price Range (SAR)">
        <div className="px-1 pt-2 pb-3 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={priceMin}
              onChange={(e) => set("priceMin", Number(e.target.value))}
              placeholder="Min"
              className="w-full h-9 rounded-xl bg-card border border-border/50 px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
            <span className="text-muted-foreground text-xs flex-shrink-0">–</span>
            <input
              type="number"
              min={0}
              value={priceMax}
              onChange={(e) => set("priceMax", Number(e.target.value))}
              placeholder="Max"
              className="w-full h-9 rounded-xl bg-card border border-border/50 px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5">
            {[{ l: "<500", min: 0, max: 500 }, { l: "500–1K", min: 500, max: 1000 }, { l: "1K–5K", min: 1000, max: 5000 }, { l: "5K+", min: 5000, max: 99999 }].map((p) => (
              <button
                key={p.l}
                onClick={() => onChange({ ...filters, priceMin: p.min, priceMax: p.max })}
                className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${priceMin === p.min && priceMax === p.max ? "bg-primary/10 border-primary/30 text-primary font-semibold" : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary"}`}
              >
                {p.l}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Star Rating */}
      <Section title="Star Rating">
        {RATINGS_OPTIONS.map((r) => (
          <FilterButton key={r.label} active={rating === r.min} onClick={() => set("rating", r.min)}>
            <span className="flex items-center gap-2">
              {r.min > 0 ? (
                <>
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.min ? "fill-primary text-primary" : "text-muted-foreground/20"}`} />
                    ))}
                  </span>
                  <span className="text-xs">{r.min}+</span>
                </>
              ) : r.label}
            </span>
          </FilterButton>
        ))}
      </Section>

      {/* Brand */}
      <Section title="Brand" defaultOpen={false}>
        {BRANDS.map((b) => (
          <FilterButton key={b} active={brand === b} onClick={() => set("brand", b)}>
            {b}
          </FilterButton>
        ))}
      </Section>

      {/* Availability */}
      <Section title="Availability">
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
          <div
            onClick={() => set("inStock", !inStock)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${inStock ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}
          >
            {inStock && <span className="text-primary-foreground text-[9px] font-bold">✓</span>}
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
          <div
            onClick={() => set("onSale", !onSale)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${onSale ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}
          >
            {onSale && <span className="text-primary-foreground text-[9px] font-bold">✓</span>}
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">On Sale Only</span>
        </label>
      </Section>
    </div>
  );
}