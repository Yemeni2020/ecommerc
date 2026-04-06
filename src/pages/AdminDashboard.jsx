import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, TrendingUp, Package, ArrowLeft, BarChart2,
  Star, ShoppingCart, ArrowUpRight, ArrowDownRight, Flame
} from "lucide-react";
import { PRODUCTS_DB } from "@/lib/productData";
import { getCounts } from "@/lib/wishlistStore";

const STATS = [
  { label: "Total Products", value: "4", icon: Package, change: "+2 this month", up: true },
  { label: "Total Saves", value: "1,253", icon: Heart, change: "+18% this week", up: true },
  { label: "Avg. Rating", value: "4.8", icon: Star, change: "Across all products", up: true },
  { label: "Active Wishlists", value: "342", icon: ShoppingCart, change: "+5% today", up: true },
];

function StatCard({ stat, i }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
      className="bg-card border border-border/50 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? "text-green-400" : "text-red-400"}`}>
          {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        </span>
      </div>
      <p className="text-2xl font-bold font-display">{stat.value}</p>
      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
      <p className="text-xs text-muted-foreground/60 mt-1">{stat.change}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [sortBy, setSortBy] = useState("saves");

  const ranked = useMemo(() => {
    const counts = getCounts();
    return PRODUCTS_DB
      .map((p) => ({ ...p, saveCount: counts[p.id] || 0 }))
      .sort((a, b) => sortBy === "saves" ? b.saveCount - a.saveCount : b.rating - a.rating);
  }, [sortBy]);

  const totalSaves = ranked.reduce((s, p) => s + p.saveCount, 0);
  const maxSaves = ranked[0]?.saveCount || 1;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-display text-lg font-bold">Drive<span className="text-primary">Luxe</span></span>
              <span className="text-muted-foreground text-sm ml-2">/ Admin Dashboard</span>
            </div>
          </div>
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold">Admin</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Wishlist Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Track which products are being saved the most across the store.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => <StatCard key={s.label} stat={s} i={i} />)}
        </div>

        {/* Wishlist Trends Table */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Wishlist Trends</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-secondary border border-border/50 rounded-xl px-3 py-1.5 text-xs text-foreground outline-none"
              >
                <option value="saves">Most Saved</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-border/30">
            {ranked.map((product, i) => {
              const pct = Math.round((product.saveCount / maxSaves) * 100);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
                >
                  {/* Rank */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i === 0 ? "bg-primary text-primary-foreground" :
                    i === 1 ? "bg-secondary text-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {i + 1}
                  </div>

                  {/* Image */}
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{product.name}</p>
                      <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{product.category}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden max-w-[200px]">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </div>

                  {/* Saves */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      <span className="font-bold text-sm">{product.saveCount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {totalSaves > 0 ? Math.round((product.saveCount / totalSaves) * 100) : 0}% of total
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                      <span className="font-semibold text-sm">{product.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.reviewCount} reviews</p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0 hidden md:block">
                    <p className="font-bold text-sm">{product.price.toLocaleString()} SAR</p>
                    {product.oldPrice && (
                      <p className="text-xs text-muted-foreground line-through">{product.oldPrice.toLocaleString()} SAR</p>
                    )}
                  </div>

                  <Link to={`/product/${product.id}`} className="text-primary hover:text-primary/80 transition-colors flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Doughnut-style summary */}
          <div className="px-6 py-4 bg-secondary/20 border-t border-border/30">
            <div className="flex flex-wrap gap-4">
              {ranked.map((p) => {
                const pct = totalSaves > 0 ? Math.round((p.saveCount / totalSaves) * 100) : 0;
                return (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary opacity-80 flex-shrink-0" style={{ opacity: 0.4 + pct / 100 }} />
                    <span className="text-xs text-muted-foreground">{p.name.split(" ").slice(0, 2).join(" ")} <strong>{pct}%</strong></span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bar Chart Visual */}
        <div className="bg-card border border-border/50 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base">Save Distribution</h2>
          </div>
          <div className="flex items-end gap-4 h-40">
            {ranked.map((product, i) => {
              const pct = Math.round((product.saveCount / maxSaves) * 100);
              return (
                <div key={product.id} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-primary">{product.saveCount}</span>
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.1 }}
                    className="w-full rounded-t-xl bg-primary/20 border border-primary/30 relative overflow-hidden"
                    style={{ minHeight: 8 }}
                  >
                    <motion.div
                      initial={{ height: "0%" }} animate={{ height: "100%" }}
                      transition={{ duration: 0.7, delay: i * 0.1 + 0.3 }}
                      className="absolute bottom-0 left-0 right-0 bg-primary/60 rounded-t-xl"
                      style={{ height: `${pct}%` }}
                    />
                  </motion.div>
                  <p className="text-[10px] text-muted-foreground text-center line-clamp-2 leading-snug">
                    {product.name.split(" ").slice(0, 2).join(" ")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}