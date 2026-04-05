import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, Sparkles } from "lucide-react";
import { PRODUCTS_DB } from "@/lib/productData";
import { getHistory } from "@/lib/browsingHistory";
import { useWishlist } from "@/lib/wishlistContext";

export default function RecommendedSection() {
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();

  const recommended = useMemo(() => {
    const history = getHistory();
    const wishlistIds = wishlist.map((p) => p.id);

    // Score each product
    const scored = PRODUCTS_DB.map((p) => {
      let score = 0;
      const historyIndex = history.indexOf(p.id);

      // Wishlist items get high priority for related category
      const wishlistCategories = wishlist.map((w) => w.category);
      if (wishlistCategories.includes(p.category) && !wishlistIds.includes(p.id)) score += 3;

      // Recently viewed (but not most recent — avoid showing what they just saw)
      if (historyIndex > 0 && historyIndex <= 3) score += 2;
      if (historyIndex > 3) score += 1;

      // High-rated products
      if (p.rating >= 4.8) score += 1;

      // Badge products
      if (p.badge) score += 0.5;

      return { ...p, score };
    });

    // Filter out items already in wishlist, sort by score, take top 4
    return scored
      .filter((p) => !wishlistIds.includes(p.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [wishlist]);

  if (recommended.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-semibold uppercase tracking-widest">Personalized</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Recommended for You</h2>
            <p className="text-muted-foreground text-sm mt-2">Based on your browsing history and wishlist</p>
          </div>
          <Link to="/products" className="text-sm text-primary hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {recommended.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-400"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary/50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider rounded-full">
                    {product.badge}
                  </span>
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
                <p className="text-sm md:text-base font-bold text-foreground mt-2">{product.price.toLocaleString()} SAR</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}