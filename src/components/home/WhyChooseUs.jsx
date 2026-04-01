import React from "react";
import { motion } from "framer-motion";
import { Truck, Shield, Headphones, RotateCcw, Award, Zap } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Nationwide Shipping",
    description: "Complimentary delivery across all cities in Saudi Arabia within 2–5 business days.",
  },
  {
    icon: Shield,
    title: "Authentic Products",
    description: "Every item is 100% genuine with manufacturer warranty and quality certification.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated team is available around the clock to assist you in Arabic & English.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free 14-day return policy. No questions asked — your satisfaction guaranteed.",
  },
  {
    icon: Award,
    title: "Expert Curated",
    description: "Every product is hand-picked by automotive enthusiasts for quality and performance.",
  },
  {
    icon: Zap,
    title: "Fast Installation",
    description: "Partner with certified workshops across KSA for professional installation services.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-primary text-xs font-semibold uppercase tracking-widest">Why DriveLuxe</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3">
            The DriveLuxe Difference
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            We go above and beyond to deliver an unmatched automotive shopping experience
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}