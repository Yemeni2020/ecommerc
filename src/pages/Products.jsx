import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, ShoppingCart, GitCompare, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCTS_DB } from "@/lib/productData";
import { useWishlist } from "@/lib/wishlistContext";
import { useCart } from "@/lib/cartContext";
import { useCompare } from "@/lib/compareContext";
import { useCurrency } from "@/lib/currencyContext";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import BottomNavbar from "../components/home/BottomNavbar";
import CartDrawer from "../components/product/CartDrawer";
import CompareBar from "../components/product/CompareBar";
import ProductSidebar from "../components/product/ProductSidebar";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

const DEFAULT_FILTERS = {
  category: "All",
  brand: "All Brands",
  rating: 0,
  priceMin: 0,
  priceMax: 99999,
  inStock: false,
  onSale: false,
};

export default function Products() {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToCart, totalItems } = useCart();
  const { toggleCompare, isInCompare } = useCompare();
  const { format } = useCurrency();
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const activeCount = [
    filters.category !== "All",
    filters.brand !== "All Brands",
    filters.rating > 0,
    filters.priceMin > 0 || filters.priceMax < 99999,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length;

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS_DB];
    if (filters.category !== "All") list = list.filter((p) => p.category === filters.category);
    list = list.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax);
    list = list.filter((p) => p.rating >= filters.rating);
    if (filters.inStock) list = list.filter((p) => p.inStock);
    if (filters.onSale) list = list.filter((p) => p.oldPrice);
    // brand filter is cosmetic since PRODUCTS_DB doesn't have a brand field — skip silently

    switch (sortBy) {
      case "price_asc": return list.sort((a, b) => a.price - b.price);
      case "price_desc": return list.sort((a, b) => b.price - a.price);
      case "rating": return list.sort((a, b) => b.rating - a.rating);
      default: return list;
    }
  }, [filters, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={totalItems} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNavbar onCartClick={() => setCartOpen(true)} onSearchClick={() => {}} />

      <main className="pt-24 pb-32 md:pb-16">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <nav className="text-xs text-muted-foreground mb-2">
                <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">All Products</span>
              </nav>
              <h1 className="font-display text-3xl md:text-4xl font-bold">All Products</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                {activeCount > 0 && <span className="ml-1 text-primary">· {activeCount} filter{activeCount !== 1 ? "s" : ""} active</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sort — desktop */}
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
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
          {/* Sidebar — Desktop */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <div className="sticky top-24 bg-card border border-border/50 rounded-2xl p-4">
              <ProductSidebar
                filters={filters}
                onChange={setFilters}
                activeCount={activeCount}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={() => setMobileFilterOpen(!mobileFilterOpen)} className="rounded-full border-border/50 gap-1.5 flex-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters {activeCount > 0 && `(${activeCount})`}
              </Button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 bg-card border border-border/50 rounded-full px-3 py-2 text-sm text-foreground outline-none">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Mobile filter panel */}
            {mobileFilterOpen && (
              <div className="md:hidden bg-card border border-border/50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">Filters</span>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <ProductSidebar filters={filters} onChange={setFilters} activeCount={activeCount} onReset={resetFilters} />
              </div>
            )}

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category !== "All" && (
                  <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    {filters.category}
                    <button onClick={() => setFilters((f) => ({ ...f, category: "All" }))}><X className="w-3 h-3 ml-0.5" /></button>
                  </span>
                )}
                {(filters.priceMin > 0 || filters.priceMax < 99999) && (
                  <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    {filters.priceMin}–{filters.priceMax === 99999 ? "∞" : filters.priceMax} SAR
                    <button onClick={() => setFilters((f) => ({ ...f, priceMin: 0, priceMax: 99999 }))}><X className="w-3 h-3 ml-0.5" /></button>
                  </span>
                )}
                {filters.rating > 0 && (
                  <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    {filters.rating}+ Stars
                    <button onClick={() => setFilters((f) => ({ ...f, rating: 0 }))}><X className="w-3 h-3 ml-0.5" /></button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    In Stock
                    <button onClick={() => setFilters((f) => ({ ...f, inStock: false }))}><X className="w-3 h-3 ml-0.5" /></button>
                  </span>
                )}
                {filters.onSale && (
                  <span className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    On Sale
                    <button onClick={() => setFilters((f) => ({ ...f, onSale: false }))}><X className="w-3 h-3 ml-0.5" /></button>
                  </span>
                )}
                <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary underline px-1">Clear all</button>
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
                          <span className="text-sm md:text-base font-bold">{format(product.price)}</span>
                          {product.oldPrice && <span className="text-xs text-muted-foreground line-through ml-1.5">{format(product.oldPrice)}</span>}
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
      <CompareBar onOpenCompare={() => navigate("/compare")} />
    </div>
  );
}