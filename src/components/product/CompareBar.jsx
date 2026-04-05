import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/lib/compareContext";

export default function CompareBar({ onOpenCompare }) {
  const { compareList, toggleCompare } = useCompare();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 260 }}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card border border-border/80 rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3"
        >
          <div className="flex items-center gap-2">
            {compareList.map((p) => (
              <div key={p.id} className="relative">
                <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-border/50" />
                <button
                  onClick={() => toggleCompare(p)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-secondary border border-border rounded-full flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {compareList.length < 3 && (
              <div className="w-10 h-10 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center text-muted-foreground text-xs">
                +
              </div>
            )}
          </div>
          <div className="w-px h-8 bg-border/50" />
          <Button onClick={onOpenCompare} className="rounded-xl h-9 px-4 text-xs font-semibold gap-1.5">
            <GitCompare className="w-3.5 h-3.5" />
            Compare ({compareList.length})
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}