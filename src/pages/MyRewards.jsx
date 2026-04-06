import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Star, ShoppingBag, TrendingUp, Zap, ChevronRight, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRewards, sarFromPoints, redeemPoints, REDEMPTION_RATE } from "@/lib/rewardsStore";

const TIERS = [
  { name: "Silver", min: 0, max: 499, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/30" },
  { name: "Gold", min: 500, max: 1499, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
  { name: "Platinum", min: 1500, max: Infinity, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
];

function getTier(pts) {
  return TIERS.find((t) => pts >= t.min && pts <= t.max) || TIERS[0];
}

export default function MyRewards() {
  const [rewards, setRewards] = useState(getRewards());
  const [redeemAmt, setRedeemAmt] = useState(100);
  const [redeemMsg, setRedeemMsg] = useState("");

  // Seed demo points for first visit
  useEffect(() => {
    const r = getRewards();
    if (r.transactions.length === 0) {
      const seed = { points: 250, transactions: [
        { id: 1, type: "earn", label: "Purchase reward", points: 150, date: "Apr 3, 2026" },
        { id: 2, type: "earn", label: "Review submitted", points: 50, date: "Apr 2, 2026" },
        { id: 3, type: "earn", label: "Purchase reward", points: 50, date: "Apr 1, 2026" },
      ]};
      localStorage.setItem("dl_rewards", JSON.stringify(seed));
      setRewards(seed);
    }
  }, []);

  const tier = getTier(rewards.points);
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const ptsToNext = nextTier ? nextTier.min - rewards.points : 0;
  const tierProgress = nextTier
    ? Math.round(((rewards.points - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100;

  const maxRedeemable = Math.floor(rewards.points / 100) * 100;
  const sarValue = sarFromPoints(redeemAmt);

  const handleRedeem = () => {
    const result = redeemPoints(redeemAmt);
    if (result) {
      setRewards(getRewards());
      setRedeemMsg(`✅ Redeemed! You saved ${result.discount} SAR. Use code REWARD at checkout.`);
      setTimeout(() => setRedeemMsg(""), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-display text-lg font-bold">My <span className="text-primary">Rewards</span></span>
          </div>
          <Link to="/products">
            <Button size="sm" className="rounded-full text-xs h-8">Shop & Earn</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl border p-6 ${tier.border} ${tier.bg}`}
        >
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-start justify-between relative">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Points Balance</p>
              <p className="font-display text-6xl font-bold">{rewards.points.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">≈ {sarFromPoints(rewards.points)} SAR redeemable value</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${tier.color} ${tier.border} ${tier.bg}`}>
              <Trophy className="w-4 h-4" />
              {tier.name}
            </div>
          </div>

          {/* Tier Progress */}
          {nextTier && (
            <div className="mt-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>{tier.name}</span>
                <span>{ptsToNext} pts to {nextTier.name}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${tierProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* How to Earn */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShoppingBag, label: "Make a Purchase", desc: "Earn 10 pts per 100 SAR spent", color: "text-primary" },
            { icon: Star, label: "Write a Review", desc: "Earn 50 pts per product review", color: "text-yellow-400" },
            { icon: Zap, label: "Redeem Points", desc: "100 pts = 10 SAR discount", color: "text-cyan-400" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              className="bg-card border border-border/50 rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Redeem */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Gift className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base">Redeem Points</h2>
          </div>

          {rewards.points < 100 ? (
            <p className="text-sm text-muted-foreground">You need at least 100 points to redeem. Keep shopping!</p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Points to redeem</span>
                  <span className="text-sm font-bold text-primary">{redeemAmt} pts → {sarValue} SAR off</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={maxRedeemable}
                  step={100}
                  value={redeemAmt}
                  onChange={(e) => setRedeemAmt(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100 pts</span>
                  <span>{maxRedeemable} pts</span>
                </div>
              </div>
              <Button onClick={handleRedeem} className="w-full rounded-full h-11 font-semibold">
                Redeem {redeemAmt} pts for {sarValue} SAR discount
              </Button>
              {redeemMsg && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-400 text-center">{redeemMsg}</motion.p>
              )}
            </div>
          )}
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border/50 rounded-3xl overflow-hidden"
        >
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border/50">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-base">Points History</h2>
          </div>
          {rewards.transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-8 text-center">No transactions yet. Start shopping to earn points!</p>
          ) : (
            <div className="divide-y divide-border/30">
              {rewards.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "earn" ? "bg-green-500/10" : "bg-primary/10"}`}>
                      {tx.type === "earn" ? <TrendingUp className="w-4 h-4 text-green-400" /> : <Gift className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.label}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.type === "earn" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "earn" ? "+" : ""}{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}