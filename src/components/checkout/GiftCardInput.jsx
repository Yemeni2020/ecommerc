import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redeemGiftCard } from "@/lib/giftCardStore";
import { checkPromoCode } from "@/lib/promoStore";

export default function GiftCardInput({ subtotal, onDiscountChange }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    // Try gift card first
    const giftCardResult = redeemGiftCard(code.trim(), subtotal);
    if (giftCardResult.ok) {
      onDiscountChange(giftCardResult.deducted, code.trim(), "gift_card");
      setCode("");
      setLoading(false);
      return;
    }

    // Try promo code
    const promo = checkPromoCode(code.trim());
    if (promo && !promo.used) {
      const discount = promo.type === "percent" ? subtotal * promo.discount : promo.discount;
      onDiscountChange(discount, code.trim(), "promo");
      setCode("");
      setLoading(false);
      return;
    }

    // Neither worked
    setError("Invalid gift card or promo code");
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Enter gift card or promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          size="sm"
        >
          {loading ? "Applying..." : "Apply"}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
