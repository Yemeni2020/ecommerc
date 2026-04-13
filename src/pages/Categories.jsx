import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingBag, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import CartDrawer from "../components/product/CartDrawer";
import BottomNavbar from "../components/home/BottomNavbar";
import { useCart } from "@/lib/cartContext";
import { PRODUCTS_DB } from "@/lib/productData";
import { useCurrency } from "@/lib/currencyContext";

const CATEGORIES = [
  {
    name: "Interior",
    description: "Transform your cabin with hand-picked premium interior accessories, from leather seat covers to ambient lighting.",
    image: "././imgs/seats1.png",
    accent: "from-amber-500/20 to-orange-500/10",
    highlights: ["Seat Covers", "Steering Wheels", "Floor Mats", "Ambient Lighting"],
  },
  {
    name: "Exterior",
    description: "Make a statement on the road with our curated exterior upgrades, from forged alloy wheels to carbon fiber body kits.",
    image: "././imgs/Exterior.png",
    accent: "from-blue-500/20 to-cyan-500/10",
    highlights: ["Alloy Wheels", "Body Kits", "Window Tints", "Spoilers"],
  },
  {
    name: "Performance",
    description: "Unlock your vehicle's true potential with performance-grade upgrades tested and certified for Saudi roads.",
    image: "././imgs/performance.png",
    accent: "from-red-500/20 to-rose-500/10",
    highlights: ["Air Filters", "Exhaust Systems", "Suspension Kits", "Brake Upgrades"],
  },
  {
    name: "Technology",
    description: "Stay connected and in control with the latest automotive tech — from smart phone mounts to full HUD displays.",
    image: "././imgs/Technology.png",
    accent: "from-purple-500/20 to-indigo-500/10",
    highlights: ["Phone Mounts", "Dash Cams", "HUD Displays", "Car Audio"],
  },
];

const PRODUCT_COUNTS = CATEGORIES.reduce((acc, cat) => {
  acc[cat.name] = PRODUCTS_DB.filter((p) => p.category === cat.name).length;
  return acc;
}, {});

export default function Categories() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { format } = useCurrency();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={totalItems} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNavbar onCartClick={() => setCartOpen(true)} onSearchClick={() => {}} />

      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
              <Layers className="w-3.5 h-3.5" /> Browse Collections
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight">
              Shop by Category
            </h1>
            <p className="mt-5 text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              Explore our four signature collections — each curated to deliver premium quality for every part of your vehicle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Cards — alternating layout */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {CATEGORIES.map((cat, i) => {
            const catProducts = PRODUCTS_DB.filter((p) => p.category === cat.name);
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border/50 bg-card ${isEven ? "" : "lg:[&>*:first-child]:order-2"}`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden min-h-64">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Product count badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-card/90 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold">
                    <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    {PRODUCT_COUNTS[cat.name] || 0} Products
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <span className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">Collection</span>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">{cat.name}</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-6">{cat.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {cat.highlights.map((h) => (
                      <span key={h} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground border border-border/50">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Featured product from this category */}
                  {catProducts[0] && (
                    <Link
                      to={`/product/${catProducts[0].id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/40 hover:border-primary/30 transition-colors mb-6 group"
                    >
                      <img src={catProducts[0].images[0]} alt={catProducts[0].name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">Featured</p>
                        <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">{catProducts[0].name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Star className="w-3 h-3 fill-primary text-primary" />
                          <span className="text-xs text-muted-foreground">{catProducts[0].rating} · {format(catProducts[0].price)}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  )}

                  <Button
                    onClick={() => navigate(`/products?category=${cat.name}`)}
                    className="rounded-full font-semibold group w-fit"
                  >
                    Shop {cat.name}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}