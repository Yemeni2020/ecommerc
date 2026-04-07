import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useWishlist } from "@/lib/wishlistContext";
import { PRODUCTS_DB } from "@/lib/productData";
import { getRewards } from "@/lib/rewardsStore";
import {
  hasSeenSaleNotification,
  markSaleNotificationSeen,
  hasSeenRestockNotification,
  markRestockNotificationSeen,
  hasSeenTierNotification,
  markTierNotificationSeen,
} from "@/lib/notificationStore";

// Reward tiers
const TIERS = [
  { name: "Silver", minPoints: 500, emoji: "🥈" },
  { name: "Gold", minPoints: 1500, emoji: "🥇" },
  { name: "Platinum", minPoints: 3000, emoji: "💎" },
];

function getCurrentTier(points) {
  return [...TIERS].reverse().find((t) => points >= t.minPoints) || null;
}

export default function WishlistNotifier() {
  const { wishlist } = useWishlist();
  const prevPointsRef = useRef(null);

  // --- 1. Wishlist sale & restock alerts ---
  useEffect(() => {
    if (!wishlist.length) return;

    wishlist.forEach((item) => {
      const product = PRODUCTS_DB.find((p) => p.id === item.id);
      if (!product) return;

      // Sale alert: product now has an oldPrice (= went on sale)
      if (product.oldPrice && !hasSeenSaleNotification(product.id)) {
        markSaleNotificationSeen(product.id);
        const discount = Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        );
        toast.custom(
          () => (
            <div className="flex items-start gap-3 bg-card border border-primary/30 rounded-2xl shadow-xl px-4 py-3 w-80">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                    🔥 Wishlist Sale
                  </span>
                </div>
                <p className="text-sm font-semibold line-clamp-1 text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Now{" "}
                  <span className="text-primary font-bold">{discount}% off</span> — don't miss it!
                </p>
              </div>
            </div>
          ),
          { duration: 6000, position: "top-right" }
        );
      }

      // Restock alert: product is inStock but we track items that were previously saved as OOS
      // We simulate this by checking a "was_oos" flag we store on the wishlist item
      if (product.inStock && item.wasOutOfStock && !hasSeenRestockNotification(product.id)) {
        markRestockNotificationSeen(product.id);
        toast.custom(
          () => (
            <div className="flex items-start gap-3 bg-card border border-green-500/30 rounded-2xl shadow-xl px-4 py-3 w-80">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                    ✅ Back in Stock
                  </span>
                </div>
                <p className="text-sm font-semibold line-clamp-1 text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your saved item is available again — grab it before it sells out!
                </p>
              </div>
            </div>
          ),
          { duration: 6000, position: "top-right" }
        );
      }
    });
  }, [wishlist]);

  // --- 2. Reward tier change alerts ---
  useEffect(() => {
    const interval = setInterval(() => {
      const { points } = getRewards();
      const tier = getCurrentTier(points);

      if (tier && !hasSeenTierNotification(tier.name)) {
        markTierNotificationSeen(tier.name);
        toast.custom(
          () => (
            <div className="flex items-center gap-3 bg-card border border-primary/30 rounded-2xl shadow-xl px-4 py-3 w-80">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl flex-shrink-0">
                {tier.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">
                  You've reached {tier.name} status!
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Congratulations — enjoy exclusive {tier.name} member perks.
                </p>
              </div>
            </div>
          ),
          { duration: 8000, position: "top-right" }
        );
      }
    }, 3000); // poll every 3s to catch tier upgrades quickly

    return () => clearInterval(interval);
  }, []);

  return null; // purely side-effect component
}