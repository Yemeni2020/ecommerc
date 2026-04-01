import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

const CITIES = [
  "Riyadh", "Jeddah", "Mecca", "Medina", "Dammam",
  "Khobar", "Tabuk", "Abha", "Buraidah", "Najran",
];

export default function ShippingStep({ data, onChange, onNext }) {
  const update = (field, val) => onChange({ ...data, [field]: val });

  const valid =
    data.fullName && data.phone && data.address && data.city && data.postalCode;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold font-display">Shipping Address</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Full Name</Label>
          <Input
            placeholder="e.g. Ahmed Al-Rashidi"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="bg-secondary/40 border-border/50 h-11 rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Phone Number</Label>
          <Input
            placeholder="+966 5X XXX XXXX"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="bg-secondary/40 border-border/50 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Street Address</Label>
        <Input
          placeholder="Building no., street name, district"
          value={data.address}
          onChange={(e) => update("address", e.target.value)}
          className="bg-secondary/40 border-border/50 h-11 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>City</Label>
          <select
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
            className="w-full h-11 rounded-xl bg-secondary/40 border border-border/50 text-sm px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Select city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Postal Code</Label>
          <Input
            placeholder="e.g. 12345"
            value={data.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            className="bg-secondary/40 border-border/50 h-11 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Apartment / Floor (optional)</Label>
        <Input
          placeholder="Apt, suite, unit, floor, etc."
          value={data.apartment}
          onChange={(e) => update("apartment", e.target.value)}
          className="bg-secondary/40 border-border/50 h-11 rounded-xl"
        />
      </div>

      <div className="pt-2">
        <Button
          onClick={onNext}
          disabled={!valid}
          className="w-full h-12 rounded-full font-semibold group"
        >
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
