import React from "react";
import { motion } from "framer-motion";

const brands = [
  "3M Automotive",
  "Meguiar's",
  "WeatherTech",
  "Borla",
  "K&N Filters",
  "Thule",
  "Pioneer",
  "Brembo",
];

export default function BrandsBar() {
  return (
    <section className="py-14 border-y border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
          Trusted Brands We Carry
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
        >
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-sm md:text-base font-bold text-muted-foreground/40 hover:text-primary/60 transition-colors duration-300 cursor-default tracking-wide uppercase"
            >
              {brand}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}