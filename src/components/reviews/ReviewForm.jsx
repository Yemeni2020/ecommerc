import React, { useState } from "react";
import { Star, Upload, X, Check } from "lucide-react";
import { addReviewPoints } from "@/lib/rewardsStore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// verifiedPurchase: pass true if the user has purchased this product
export default function ReviewForm({ onSubmit, verifiedPurchase = true }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 4 - photos.length);
    const previews = files.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setPhotos((prev) => [...prev, ...previews].slice(0, 4));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim() || !name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      addReviewPoints();
      onSubmit({ name, rating, comment, photos: photos.map((p) => p.url), date: "Apr 2026", avatar: name[0].toUpperCase(), verified: verifiedPurchase });
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20 flex flex-col items-center gap-3 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <Check className="w-6 h-6 text-green-500" />
        </div>
        <p className="font-semibold text-foreground">Review submitted!</p>
        <p className="text-sm text-muted-foreground">Thank you! You earned <span className="text-primary font-semibold">+50 reward points</span> for this review.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 rounded-2xl bg-secondary/30 border border-border/50">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base">Write a Review</h3>
        {verifiedPurchase && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
            <Check className="w-3 h-3" /> Verified Purchase
          </span>
        )}
      </div>

      {/* Star Rating */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Your Rating *</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  s <= (hovered || rating) ? "fill-primary text-primary" : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Your Name *</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ahmed Al-Rashidi"
          className="w-full h-10 rounded-xl bg-card border border-border/50 px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Comment */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Your Review *</p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product…"
          rows={3}
          className="w-full rounded-xl bg-card border border-border/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>

      {/* Photo Upload */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Photos (optional, max 4)</p>
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/50">
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5 text-white" />
              </button>
            </div>
          ))}
          {photos.length < 4 && (
            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-[9px] text-muted-foreground mt-0.5">Add</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
            </label>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={!rating || !comment.trim() || !name.trim() || loading}
        className="w-full h-10 rounded-full font-semibold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            Submitting…
          </span>
        ) : "Submit Review"}
      </Button>
    </form>
  );
}