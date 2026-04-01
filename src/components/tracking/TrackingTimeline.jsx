import React from "react";
import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function TrackingTimeline({ steps }) {
  return (
    <div className="relative">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.id} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all ${
                  step.done && !step.active
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.active
                    ? "bg-primary/10 border-primary text-primary ring-4 ring-primary/20"
                    : "bg-secondary border-border text-muted-foreground"
                }`}
              >
                {step.done && !step.active ? (
                  <Check className="w-4 h-4" />
                ) : step.active ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="w-2.5 h-2.5 rounded-full bg-primary"
                  />
                ) : (
                  <Circle className="w-4 h-4 opacity-30" />
                )}
              </motion.div>
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 min-h-[2rem] my-1 rounded-full transition-all ${
                    step.done ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.05 }}
              className={`pb-6 ${isLast ? "pb-0" : ""}`}
            >
              <p className={`font-semibold text-sm ${step.done || step.active ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </p>
              <p className={`text-xs mt-0.5 ${step.active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {step.sub}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}