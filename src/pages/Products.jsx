import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, GitCompare, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS_DB } from "@/lib/productData";
import { useWishlist } from "@/lib/wishlistContext";
import { useCart } from "@/lib/cartContext";
import { useCompare } from "@/lib/compareContext";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import CompareBar from "../components/product/CompareBar";
import CompareDrawer from "../components/product/CompareDrawer";
import BottomNavbar from "../components/home/BottomNavbar";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

const CATEGORIES = ["All", "Interior", "Exterior", "Performance", "Technology"];
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under 500 SAR", min: 0, max: 500 },
  { label: "500 – 1,000 SAR", min: 500, max: 1000 },
  { label: "1,000 – 5,000 SAR", min: 1000, max: 5000 },
  { label: "Over 5,000 SAR", min: 5000, max: Infinity },
];
const RATINGS = [
  { label: "All Ratings", min: 0 },
  { label: "4.5+ Stars", min: 4.5 },
  { label: "4.0+ Stars", min: 4.0 },
  { label: "3.5+ Stars", min: 3.5 },
];

export default function Products() {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart } = useCart();
  const { toggleCompare, isInCompare } = useCompare();
  const [compareOpen, setCompareOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS_DB];
    if (selectedCategory !== "All") list = list.filter((p) => p.category === selectedCategory);
    const priceRange = PRICE_RANGES[selectedPrice];
    list = list.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);
    list = list.filter((p) => p.rating >= RATINGS[selectedRating].min);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    if (onSaleOnly) list = list.filter((p) => p.oldPrice);

    switch (sortBy) {
      case "price_asc": return list.sort((a, b) => a.price - b.price);
      case "price_desc": return list.sort((a, b) => b.price - a.price);
      case "rating": return list.sort((a, b) => b.rating - a.rating);
      default: return list;
    }
  }, [selectedCategory, selectedPrice, selectedRating, sortBy, inStockOnly, onSaleOnly]);

  const activeFiltersCount = (selectedCategory !== "All" ? 1 : 0) + (selectedPrice !== 0 ? 1 : 0) + (selectedRating !== 0 ? 1 : 0) + (inStockOnly ? 1 : 0) + (onSaleOnly ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("All"); setSelectedPrice(0); setSelectedRating(0); setInStockOnly(false); setOnSaleOnly(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <CompareDrawer open={compareOpen} onClose={() => setCompareOpen(false)} />
      <BottomNavbar />

      <main className="pt-24 pb-32 md:pb-16">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <nav className="text-xs text-muted-foreground mb-2">
                <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">All Products</span>
              </nav>
              <h1 className="font-display text-3xl md:text-4xl font-bold">All Products</h1>
              <p className="text-muted-foreground text-sm mt-1">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>
            </div>
            {/* Sort */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card border border-border/50 rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={resetFilters} className="text-xs text-primary hover:underline">Reset ({activeFiltersCount})</button>
                )}
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${selectedCategory === cat ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Price Range</p>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range, i) => (
                    <button key={i} onClick={() => setSelectedPrice(i)} className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${selectedPrice === i ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Rating</p>
                <div className="space-y-2">
                  {RATINGS.map((r, i) => (
                    <button key={i} onClick={() => setSelectedRating(i)} className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${selectedRating === i ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Availability</p>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-primary w-3.5 h-3.5" />
                  <span className="text-sm text-muted-foreground">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={onSaleOnly} onChange={(e) => setOnSaleOnly(e.target.checked)} className="accent-primary w-3.5 h-3.5" />
                  <span className="text-sm text-muted-foreground">On Sale Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile filter / sort bar */}
            <div className="flex md:hidden items-center gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => setFilterOpen(!filterOpen)} className="rounded-full border-border/50 gap-1.5 flex-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 bg-card border border-border/50 rounded-full px-3 py-2 text-sm text-foreground outline-none">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Mobile filters panel */}
            {filterOpen && (
              <div className="md:hidden bg-card border border-border/50 rounded-2xl p-4 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Filters</span>
                  <div className="flex gap-2">
                    {activeFiltersCount > 0 && <button onClick={resetFilters} className="text-xs text-primary">Reset</button>}
                    <button onClick={() => setFilterOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Category</p>
                    {CATEGORIES.map((cat) => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`block w-full text-left text-xs px-2 py-1.5 rounded-lg mb-1 ${selectedCategory === cat ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>{cat}</button>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Price</p>
                    {PRICE_RANGES.map((r, i) => (
                      <button key={i} onClick={() => setSelectedPrice(i)} className={`block w-full text-left text-xs px-2 py-1.5 rounded-lg mb-1 ${selectedPrice === i ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"}`}>{r.label}</button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                    <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-primary" /> In Stock
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                    <input type="checkbox" checked={onSaleOnly} onChange={(e) => setOnSaleOnly(e.target.checked)} className="accent-primary" /> On Sale
                  </label>
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <p className="font-semibold text-lg">No products found</p>
                <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
                <Button onClick={resetFilters} className="rounded-full">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.25) }}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-400"
                  >
                    <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary/50">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105" />
                      {product.badge && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider rounded-full">{product.badge}</span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isWishlisted(product.id) ? "opacity-100 bg-red-500/80" : "opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-primary"}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? "fill-white text-white" : "text-white"}`} />
                      </button>
                    </Link>
                    <div className="p-3 md:p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category}</p>
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-xs md:text-sm text-foreground mt-1 line-clamp-2 hover:text-primary transition-colors leading-snug">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-sm md:text-base font-bold">{product.price.toLocaleString()} SAR</span>
                          {product.oldPrice && <span className="text-xs text-muted-foreground line-through ml-1.5">{product.oldPrice}</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleCompare(product)}
                            title="Compare"
                            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${isInCompare(product.id) ? "bg-primary border-primary text-primary-foreground" : "border-border/50 text-muted-foreground hover:border-primary hover:text-primary"}`}
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 transition-colors"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CompareBar onOpenCompare={() => setCompareOpen(true)} />
    </div>
  );
}
