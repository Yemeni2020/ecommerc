import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, Check, Truck, Shield, Star } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Category & SKU */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {product.category}
        </span>
        <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
      </div>

      {/* Name */}
      <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating)
                  ? "fill-primary text-primary"
                  : i < product.rating
                  ? "fill-primary/50 text-primary/50"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">{product.rating}</span>
        <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-foreground">{product.price.toLocaleString()} SAR</span>
        {product.oldPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">{product.oldPrice.toLocaleString()} SAR</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-sm font-bold">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {product.highlights.map((h) => (
          <div key={h} className="flex items-center gap-2 text-sm text-foreground">
            <Check className="w-4 h-4 text-primary flex-shrink-0" />
            {h}
          </div>
        ))}
      </div>

      {/* Quantity + Add to Cart */}
      <div className="flex items-center gap-3 pt-2">
        <div className="flex items-center border border-border rounded-full overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            +
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          className="flex-1 h-11 rounded-full font-semibold relative overflow-hidden"
          style={{ background: added ? "hsl(142 76% 36%)" : undefined }}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Added to Cart!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleWishlist(product)}
          className={`h-11 w-11 rounded-full border-border/50 ${wishlisted ? "bg-red-500/10 border-red-500/30" : ""}`}
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
        </Button>

        <Button variant="outline" size="icon" className="h-11 w-11 rounded-full border-border/50">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Trust Strip */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {[
          { icon: Truck, text: "Free delivery across KSA" },
          { icon: Shield, text: "2-year manufacturer warranty" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/60 text-sm text-muted-foreground">
            <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}