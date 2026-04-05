import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Image, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewForm from "../reviews/ReviewForm";

function StarRow({ rating, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-2">{rating}</span>
      <Star className="w-3 h-3 text-primary fill-primary flex-shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full rounded-full bg-primary"
        />
      </div>
      <span className="text-xs text-muted-foreground w-6">{count}</span>
    </div>
  );
}

const FILTER_OPTIONS = ["All", "5 ★", "4 ★", "3 ★", "2 ★", "1 ★", "With Photos"];

export default function ProductReviews({ reviews: initialReviews, rating, reviewCount }) {
  const [helpful, setHelpful] = useState({});
  const [filter, setFilter] = useState("All");
  const [reviews, setReviews] = useState(initialReviews);

  const handleNewReview = (review) => {
    setReviews((prev) => [{ ...review }, ...prev]);
  };

  const filtered = reviews.filter((r) => {
    if (filter === "All") return true;
    if (filter === "With Photos") return r.photos?.length > 0;
    const stars = parseInt(filter);
    return r.rating === stars;
  });

  const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => { ratingDist[r.rating] = (ratingDist[r.rating] || 0) + 1; });
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : rating;

  return (
    <div>
      <h2 className="text-xl font-bold font-display mb-6">Customer Reviews</h2>

      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 p-6 rounded-2xl bg-secondary/30 border border-border/50 mb-6">
        <div className="flex flex-col items-center justify-center text-center min-w-[120px]">
          <span className="text-6xl font-bold font-display text-foreground">{avgRating}</span>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</span>
        </div>
        <div className="flex-1 flex flex-col gap-2 justify-center">
          {[5, 4, 3, 2, 1].map((r) => (
            <StarRow key={r} rating={r} count={ratingDist[r] || 0} total={reviews.length} />
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === opt ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt === "With Photos" && <Image className="w-3 h-3" />}
            {opt}
          </button>
        ))}
      </div>

      {/* Review Form */}
      <div className="mb-6">
        <ReviewForm onSubmit={handleNewReview} />
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No reviews match this filter.</p>
        )}
        {filtered.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.3) }}
            className="p-5 rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-foreground">{review.name}</p>
                    {review.verified !== false && (
                      <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" title="Verified Purchase" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
            {review.photos?.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {review.photos.map((url, pi) => (
                  <img key={pi} src={url} alt="" className="w-14 h-14 rounded-lg object-cover border border-border/50" />
                ))}
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHelpful((h) => ({ ...h, [i]: !h[i] }))}
                className={`text-xs gap-1.5 h-7 px-3 rounded-full ${helpful[i] ? "text-primary" : "text-muted-foreground"}`}
              >
                <ThumbsUp className="w-3 h-3" /> Helpful
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}