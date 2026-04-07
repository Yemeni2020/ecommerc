import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Truck, Star, Award, Users, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CartDrawer from "../components/product/CartDrawer";
import { useCart } from "@/lib/cartContext";

const STATS = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "1,200+", label: "Premium Products" },
  { value: "14", label: "Cities Across KSA" },
  { value: "4.9★", label: "Average Rating" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Every product is hand-picked and tested to meet our strict quality standards before it reaches you.",
  },
  {
    icon: Truck,
    title: "Free Nationwide Delivery",
    description: "We ship across all of Saudi Arabia at no extra cost. Express delivery available in major cities.",
  },
  {
    icon: Star,
    title: "Curated Selection",
    description: "Our team of automotive enthusiasts carefully selects only the finest accessories from global brands.",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description: "Recognized as Saudi Arabia's top automotive accessories retailer in 2024 and 2025.",
  },
];

const TEAM = [
  {
    name: "Sultan Al-Rashidi",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Reema Al-Zahrani",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Faris Al-Otaibi",
    role: "Chief of Operations",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Nora Al-Harbi",
    role: "Customer Experience Lead",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
];

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function About() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={totalItems} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fade}>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Our Story</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mt-4 leading-tight">
              Elevating Every Drive<br />
              <span className="text-primary">Across Saudi Arabia</span>
            </h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              DriveLuxe was founded in 2018 with a simple mission: give Saudi drivers access to the world's finest automotive accessories — delivered to their door, hassle-free.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <Button asChild className="rounded-full h-12 px-8 font-semibold">
                <Link to="/products">Shop Now <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full h-12 px-8 font-semibold border-border/60">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50 bg-card/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="font-display text-4xl font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-primary text-xs font-semibold uppercase tracking-widest">Our Mission</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 leading-snug">
                Making Premium Accessible to Every Saudi Driver
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                We believe your car is an extension of your personality. Whether you drive a family SUV or a performance sports car, you deserve accessories that reflect your taste. We bridge the gap between luxury automotive brands and Saudi consumers — with fair prices, genuine products, and world-class service.
              </p>
              <div className="mt-7 space-y-3">
                {[
                  "100% authentic products — no counterfeits, ever",
                  "Partnerships with 80+ global automotive brands",
                  "Dedicated product experts available 7 days a week",
                  "Free returns and hassle-free exchanges",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop"
                  alt="Luxury car interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-card border border-border/60 rounded-2xl px-5 py-4 shadow-xl">
                <p className="text-xs text-muted-foreground">Est.</p>
                <p className="font-display text-3xl font-bold text-primary">2018</p>
                <p className="text-xs text-muted-foreground mt-0.5">Riyadh, KSA</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Why DriveLuxe</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">Built on Four Pillars</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">The People</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">Meet Our Team</h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto text-sm">
              Passionate automotive enthusiasts dedicated to serving Saudi drivers every day.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-border/40 group-hover:border-primary/30 transition-colors">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Upgrade Your Ride?</h2>
          <p className="text-muted-foreground mb-8 text-sm">Browse over 1,200 premium products — shipped free anywhere in KSA.</p>
          <Button asChild size="lg" className="rounded-full px-10 font-semibold">
            <Link to="/products">Explore All Products <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}