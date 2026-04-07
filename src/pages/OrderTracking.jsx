import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Calendar, MapPin, ArrowLeft, Truck, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TrackingTimeline from "../components/tracking/TrackingTimeline";
import TrackingMap from "../components/tracking/TrackingMap";
import { lookupOrder } from "../lib/orderTrackingData";
import ChatWidget from "../components/chat/ChatWidget";

const STATUS_LABELS = {
  ordered: "Order Placed",
  confirmed: "Confirmed",
  packed: "Packed & Dispatched",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
};

const STATUS_COLORS = {
  ordered: "bg-secondary text-muted-foreground",
  confirmed: "bg-blue-500/10 text-blue-400",
  packed: "bg-yellow-500/10 text-yellow-400",
  in_transit: "bg-primary/10 text-primary",
  out_for_delivery: "bg-orange-500/10 text-orange-400",
  delivered: "bg-green-500/10 text-green-400",
};

const STATUS_PROGRESS = {
  ordered: 1, confirmed: 2, packed: 3, in_transit: 4, out_for_delivery: 5, delivered: 6,
};

export default function OrderTracking() {
  const [orderNum, setOrderNum] = useState("");
  const [contact, setContact] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    setError("");
    setOrder(null);

    const result = lookupOrder(orderNum, contact);
    if (result.error === "not_found") {
      setError("No order found with that number. Please check and try again.");
    } else if (result.error === "mismatch") {
      setError("Email or phone doesn't match our records for this order.");
    } else {
      setOrder(result.order);
    }
  };

  const tryDemo = (num, c) => { setOrderNum(num); setContact(c); };

  const progress = order ? STATUS_PROGRESS[order.currentStatus] : 0;
  const isDelivered = order?.currentStatus === "delivered";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <div className="border-b border-border/50 bg-card/60 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Drive<span className="text-primary">Luxe</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Track Your Order</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your order number and email (or phone) to see real-time shipment updates.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-3 mb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Order number (e.g. DL-ORDER1)"
              value={orderNum}
              onChange={(e) => setOrderNum(e.target.value)}
              className="pl-11 h-12 rounded-2xl bg-card border-border/50 text-sm"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Email or phone used at checkout"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="pl-11 h-12 rounded-2xl bg-card border-border/50 text-sm"
            />
          </div>
          <Button type="submit" disabled={!orderNum.trim()} className="w-full h-12 rounded-full font-semibold">
            <Truck className="w-4 h-4 mr-2" /> Track Shipment
          </Button>
        </form>

        <div className="text-xs text-muted-foreground text-center mb-8 space-y-1">
          <p>Demo orders — click to prefill:</p>
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            <button className="text-primary hover:underline" onClick={() => tryDemo("DL-ORDER1", "ahmed@example.com")}>DL-ORDER1 (In Transit)</button>
            <button className="text-primary hover:underline" onClick={() => tryDemo("DL-SAMPLE", "khalid@example.com")}>DL-SAMPLE (Packed)</button>
            <button className="text-primary hover:underline" onClick={() => tryDemo("DL-DELIVERED", "rayan@example.com")}>DL-DELIVERED (Done)</button>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {searched && error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              key={order.orderNumber}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-5"
            >
              {/* Order Card */}
              <div className="bg-card border border-border/50 rounded-3xl p-5 sm:p-6 flex items-center gap-4">
                <img src={order.image} alt={order.product} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-mono">{order.orderNumber}</p>
                  <p className="font-semibold text-sm mt-0.5 line-clamp-1">{order.product}</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mt-2 ${STATUS_COLORS[order.currentStatus]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {STATUS_LABELS[order.currentStatus]}
                  </span>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {isDelivered ? "Delivered On" : "Est. Delivery"}
                  </div>
                  <p className="font-bold text-sm mt-0.5">{order.estimatedDelivery}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {order.destination.name}
                  </div>
                </div>
              </div>

              {/* ETA + Progress Bar */}
              <div className="bg-card border border-border/50 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isDelivered
                      ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                      : <Clock className="w-4 h-4 text-primary" />
                    }
                    <h3 className="font-semibold text-sm">
                      {isDelivered ? "Successfully Delivered" : "Estimated Arrival"}
                    </h3>
                  </div>
                  <span className={`text-sm font-bold ${isDelivered ? "text-green-400" : "text-primary"}`}>
                    {order.estimatedDelivery}
                  </span>
                </div>
                {/* Step progress bar */}
                <div className="flex items-center gap-1">
                  {Object.keys(STATUS_LABELS).map((key, idx) => {
                    const stepNum = idx + 1;
                    const isComplete = stepNum <= progress;
                    const isActive = stepNum === progress;
                    return (
                      <React.Fragment key={key}>
                        <div
                          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                            isComplete ? "bg-primary" : "bg-secondary"
                          }`}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                  <span>Ordered</span>
                  <span>In Transit</span>
                  <span>Delivered</span>
                </div>
                {!isDelivered && (
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    📍 Your package is currently <span className="text-foreground font-semibold">{STATUS_LABELS[order.currentStatus]}</span>
                  </p>
                )}
              </div>

              {/* Mobile delivery info */}
              <div className="flex gap-3 sm:hidden">
                <div className="flex-1 bg-card border border-border/50 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Calendar className="w-3.5 h-3.5 text-primary" /> {isDelivered ? "Delivered" : "Est. Delivery"}</div>
                  <p className="font-bold text-sm">{order.estimatedDelivery}</p>
                </div>
                <div className="flex-1 bg-card border border-border/50 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><MapPin className="w-3.5 h-3.5 text-primary" /> Destination</div>
                  <p className="font-bold text-sm">{order.destination.name}</p>
                </div>
              </div>

              {/* Map */}
              <div className="bg-card border border-border/50 rounded-3xl overflow-hidden">
                <div className="px-5 pt-5 pb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Package Journey</h3>
                </div>
                <div className="px-5 pb-5">
                  <TrackingMap journey={order.journey} destination={order.destination} />
                  <div className="flex items-center gap-5 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary rounded-full inline-block" /> Completed</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-muted-foreground/40 border-dashed inline-block border-t-2" /> Remaining</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-card border border-border/50 rounded-3xl p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Shipping Timeline</h3>
                </div>
                <TrackingTimeline steps={order.steps} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ChatWidget />
    </div>
  );
}