import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle, HeadphonesIcon } from "lucide-react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CartDrawer from "../components/product/CartDrawer";
import { useCart } from "@/lib/cartContext";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["King Fahd Road, Al Olaya District", "Riyadh 12211, Saudi Arabia"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+966 50 000 0000", "+966 11 000 0001 (Landline)"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@driveluxe.sa", "support@driveluxe.sa"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Sunday – Thursday: 9 AM – 9 PM", "Friday – Saturday: 11 AM – 8 PM"],
  },
];

const TOPICS = ["General Inquiry", "Order Support", "Returns & Refunds", "Product Question", "Partnership", "Other"];

export default function Contact() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1200);
  };

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={totalItems} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary text-xs font-semibold uppercase tracking-widest">Get in Touch</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mt-4">We'd Love to Hear<br />From You</h1>
            <p className="mt-5 text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              Have a question, feedback, or need help with your order? Our team is here to help, 7 days a week.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_INFO.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                {item.lines.map((line) => (
                  <p key={line} className="text-xs text-muted-foreground leading-relaxed">{line}</p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-card border border-border/50 rounded-3xl p-6 sm:p-8"
            >
              <h2 className="font-display text-2xl font-bold mb-1">Send a Message</h2>
              <p className="text-sm text-muted-foreground mb-7">We typically respond within 2 hours during working hours.</p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-10 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="font-bold text-xl">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Thank you for reaching out. One of our team members will get back to you shortly.
                  </p>
                  <Button variant="outline" className="rounded-full mt-2" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", topic: "", message: "" }); }}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Full Name *</label>
                      <Input value={form.name} onChange={update("name")} placeholder="Ahmed Al-Rashidi" required className="rounded-xl bg-background border-border/50 h-11" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Email Address *</label>
                      <Input type="email" value={form.email} onChange={update("email")} placeholder="ahmed@example.com" required className="rounded-xl bg-background border-border/50 h-11" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Phone Number</label>
                      <Input value={form.phone} onChange={update("phone")} placeholder="+966 50 000 0000" className="rounded-xl bg-background border-border/50 h-11" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Topic *</label>
                      <select
                        value={form.topic}
                        onChange={update("topic")}
                        required
                        className="w-full h-11 rounded-xl bg-background border border-border/50 px-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="">Select a topic…</option>
                        {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell us how we can help you…"
                      required
                      rows={5}
                      className="w-full rounded-xl bg-background border border-border/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-semibold">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Send Message</span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Side Panel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 flex flex-col gap-5"
            >
              {/* Map embed placeholder */}
              <div className="flex-1 min-h-52 bg-card border border-border/50 rounded-3xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1598539086046-28bc5e96ca4a?w=600&h=400&fit=crop"
                  alt="Riyadh, Saudi Arabia"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="bg-card/90 backdrop-blur rounded-xl px-4 py-2 text-center">
                    <p className="font-semibold text-sm">DriveLuxe HQ</p>
                    <p className="text-xs text-muted-foreground">King Fahd Road, Riyadh</p>
                  </div>
                </div>
              </div>

              {/* Quick support options */}
              <div className="bg-card border border-border/50 rounded-2xl p-5">
                <h3 className="font-semibold text-sm mb-4">Prefer Instant Support?</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+966500000000"
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Phone className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Call Now</p>
                      <p className="text-xs text-muted-foreground">+966 50 000 0000</p>
                    </div>
                  </a>
                  <a
                    href="mailto:support@driveluxe.sa"
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-primary/10 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Mail className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Email Support</p>
                      <p className="text-xs text-muted-foreground">support@driveluxe.sa</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/40">
                    <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Live Chat</p>
                      <p className="text-xs text-green-400">Online — click the chat bubble</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}