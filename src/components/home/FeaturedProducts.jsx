import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useWishlist } from "@/lib/wishlistContext";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FeaturedProducts({ products }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  return (
    <section id="products" className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
          <div>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Featured</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
              Best Sellers
            </h2>
          </div>
          <Button variant="outline" className="rounded-full border-border/50 hover:bg-secondary w-fit">
            View All Products
          </Button>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {products.map((product) => (
            <motion.div
              key={product.name}
              variants={itemVariants}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              {/* Image */}
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary/50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={(e) => { e.preventDefault(); toggleWishlist({ ...product, images: [product.image] }); }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${isWishlisted(product.id) ? "opacity-100 bg-red-500/80" : "opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-primary"}`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-white text-white" : "text-white"}`} />
                </button>
              </Link>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-foreground mt-1 line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
                </Link>

                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < product.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-foreground">{product.price} SAR</span>
                    {product.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through">{product.oldPrice}</span>
                    )}
                  </div>
                  <Button size="icon" className="w-9 h-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/80">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}