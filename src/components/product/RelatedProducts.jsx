import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cartContext";
import { motion } from "framer-motion";

export default function RelatedProducts({ products }) {
  const { addToCart } = useCart();
  if (!products.length) return null;

  return (
    <section className="py-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold font-display mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              <Link to={`/product/${p.id}`} className="block aspect-square overflow-hidden bg-secondary/50">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </Link>
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{p.category}</p>
                <Link to={`/product/${p.id}`}>
                  <h3 className="font-semibold mt-1 hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                </Link>
                <div className="flex items-center gap-1 mt-1.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-3 h-3 ${j < Math.floor(p.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({p.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold">{p.price.toLocaleString()} SAR</span>
                  <Button
                    size="icon"
                    className="w-8 h-8 rounded-full"
                    onClick={() => addToCart(p, 1)}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}