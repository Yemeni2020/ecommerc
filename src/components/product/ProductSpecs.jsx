import React from "react";
import { motion } from "framer-motion";

export default function ProductSpecs({ specs }) {
  return (
    <div>
      <h2 className="text-xl font-bold font-display mb-6">Technical Specifications</h2>
      <div className="rounded-2xl border border-border/50 overflow-hidden">
        {specs.map((spec, i) => (
          <motion.div
            key={spec.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`flex items-center ${
              i % 2 === 0 ? "bg-secondary/30" : "bg-card"
            } px-5 py-4 border-b border-border/30 last:border-b-0`}
          >
            <span className="w-1/2 text-sm font-semibold text-muted-foreground">{spec.label}</span>
            <span className="w-1/2 text-sm font-medium text-foreground">{spec.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}