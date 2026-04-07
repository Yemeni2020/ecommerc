import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, ChevronDown, Phone, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_REPLIES = [
  "What's your shipping policy?",
  "How do I return a product?",
  "Where is my order?",
  "Do you offer warranty?",
  "How do I apply a promo code?",
];

const AUTO_RESPONSES = {
  shipping: {
    keywords: ["ship", "delivery", "deliver", "free shipping", "shipping policy"],
    reply: "🚚 **Shipping Policy**\n\nWe offer **free shipping** on all orders across Saudi Arabia (KSA). Standard delivery takes 2–5 business days. Express 1-day delivery is available in Riyadh and Jeddah for orders placed before 2 PM.",
  },
  return: {
    keywords: ["return", "refund", "exchange", "send back", "wrong item"],
    reply: "🔄 **Returns & Refunds**\n\nWe accept returns within **14 days** of delivery. Items must be unused and in original packaging.\n\n1. Email returns@driveluxe.sa\n2. Include your order number\n3. We'll arrange a free pickup\n\nRefunds are processed within 3–5 business days.",
  },
  order: {
    keywords: ["order", "track", "where is", "status", "tracking"],
    reply: "📦 **Track Your Order**\n\nYou can track your order on the **Track Order** page using your order number + email.\n\nLink: [Track Order →](/track)",
    action: { label: "Track Order →", to: "/track" },
  },
  warranty: {
    keywords: ["warranty", "guarantee", "defect", "broken", "damaged"],
    reply: "🛡️ **Warranty Policy**\n\nAll products include a manufacturer's warranty:\n- Accessories: **2 years**\n- LED & electronics: **1 year**\n- Wheels & performance: **3 years**\n\nFor claims, email us with your order number and photos.",
  },
  promo: {
    keywords: ["promo", "code", "discount", "coupon", "gift card", "voucher"],
    reply: "🎁 **Promo & Gift Card Codes**\n\n1. Add items to your cart\n2. Go to Checkout\n3. Enter code in the **Gift Card or Promo Code** field at the Review step\n\nCodes are automatically deducted from your total before VAT.",
  },
  payment: {
    keywords: ["pay", "payment", "tabby", "tamara", "installment", "card", "credit"],
    reply: "💳 **Payment Options**\n\nWe accept:\n- **Credit / Debit Cards** (Visa, Mastercard)\n- **Tabby** — Pay in 4 interest-free installments\n- **Tamara** — Pay in 3 installments\n\nAll payments are secured with SSL encryption.",
  },
  hours: {
    keywords: ["hours", "open", "working", "available", "when", "contact", "support"],
    reply: "🕐 **Support Hours**\n\nOur team is available **9 AM – 9 PM (Saudi time)**, 7 days a week.\n\n📞 Call: **+966 50 000 0000**\n📧 Email: **info@driveluxe.sa**",
  },
};

function getAutoResponse(message) {
  const lower = message.toLowerCase();
  for (const key of Object.keys(AUTO_RESPONSES)) {
    const { keywords, reply, action } = AUTO_RESPONSES[key];
    if (keywords.some((kw) => lower.includes(kw))) return { reply, action };
  }
  return {
    reply: "Thank you for your message! 😊 A support agent will get back to you within a few hours.\n\nWorking hours: **9 AM – 9 PM (Saudi time)**, 7 days a week.\n\n📞 Urgent? Call **+966 50 000 0000**",
  };
}

function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";
  const formatted = msg.text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "") // strip markdown links (handled via action)
    .replace(/\n/g, "<br/>");
  return (
    <div className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className={`max-w-[80%] flex flex-col gap-2`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? "bg-secondary/80 text-foreground rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm"
          }`}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
        {msg.action && (
          <Link
            to={msg.action.to}
            className="self-start flex items-center gap-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-full transition-colors font-semibold"
          >
            <ExternalLink className="w-3 h-3" />
            {msg.action.label}
          </Link>
        )}
      </div>
      {!isBot && (
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "👋 Hi! Welcome to **DriveLuxe** live support.\n\nHow can I help you today? Ask me about shipping, returns, your order status, or anything else!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  // Proactive greeting after 15s if chat is still closed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) setUnread((n) => n + 1);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const { reply, action } = getAutoResponse(text);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: reply, action }]);
      setTyping(false);
      if (!open) setUnread((n) => n + 1);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm bg-card border border-border/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "500px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-primary/5 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-card rounded-full" />
                </div>
                <div>
                  <p className="font-semibold text-sm">DriveLuxe Support</p>
                  <p className="text-xs text-green-400">Online · Replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href="tel:+966500000000"
                  className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                  title="Call support"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
              {typing && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary/80 px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex gap-1 items-center h-9">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto flex-shrink-0 scrollbar-hide">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="flex-shrink-0 text-[11px] px-2.5 py-1.5 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border/50 whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-2xl px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Type your message…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/80 transition-colors flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Powered by DriveLuxe AI · 9AM–9PM support
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}