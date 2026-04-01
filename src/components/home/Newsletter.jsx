import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 md:p-14"
        >
          {/* Background Accent */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Stay Updated</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
              Get Exclusive Deals & Updates
            </h2>
            <p className="mt-4 text-muted-foreground">
              Subscribe to our newsletter for early access to new arrivals, special offers, and automotive tips.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 flex items-center justify-center gap-3 text-primary"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Thanks for subscribing!</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-secondary border-border/50 rounded-full px-5 h-12"
                  required
                />
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 h-12 font-semibold">
                  Subscribe
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}