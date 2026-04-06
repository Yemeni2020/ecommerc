import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Flame, TrendingUp, Star } from "lucide-react";
import { PRODUCTS_DB } from "@/lib/productData";
import { getSortedByCount } from "@/lib/wishlistStore";
import { useWishlist } from "@/lib/wishlistContext";
import { useCurrency } from "@/lib/currencyContext";

const URGENCY = [
  "🔥 Trending this week",
  "⚡ Almost out of stock",
  "👀 52 people viewing now",
  "💛 Top saved item",
];

export default function WishlistTrends() {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { format } = useCurrency();

  const ranked = useMemo(() => {
    const sorted = getSortedByCount(PRODUCTS_DB.map((p) => p.id));
    return sorted
      .slice(0, 4)
      .map((item, i) => ({
        ...PRODUCTS_DB.find((p) => p.id === item.id),
        saveCount: item.count,
        urgency: URGENCY[i % URGENCY.length],
      }));
  }, []);

  return (
    <section className="py-20 md:py-24 bg-card/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-semibold uppercase tracking-widest">Most Wanted</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Wishlist Trends</h2>
            <p className="text-muted-foreground text-sm mt-2">Products shoppers are saving the most right now</p>
          </div>
          <Link to="/products" className="text-sm text-primary hover:underline hidden sm:block">
            Shop all →
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {ranked.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all duration-300"
            >
              {/* Image */}
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary/50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Save count badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  <Heart className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                  {product.saveCount.toLocaleString()} saves
                </div>
                {/* Rank badge */}
                {i === 0 && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-2.5 h-2.5" /> #1
                  </div>
                )}
                {/* Wishlist toggle */}
                <button
                  onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                  className={`absolute bottom-2 right-2 w-7 h-7 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                    isWishlisted(product.id) ? "bg-red-500/80 opacity-100" : "bg-black/40 opacity-0 group-hover:opacity-100 hover:bg-primary"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted(product.id) ? "fill-white text-white" : "text-white"}`} />
                </button>
              </Link>

              {/* Info */}
              <div className="p-3 md:p-4">
                <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">{product.urgency}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-xs md:text-sm text-foreground mt-1 line-clamp-2 hover:text-primary transition-colors leading-snug">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm md:text-base font-bold text-foreground">{format(product.price)}</p>
                  {product.oldPrice && (
                    <p className="text-xs text-muted-foreground line-through">{format(product.oldPrice)}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}