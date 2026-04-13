import React, { useState } from "react";
import Navbar from "../components/home/Navbar";
import CartDrawer from "../components/product/CartDrawer";
import BottomNavbar from "../components/home/BottomNavbar";
import SearchOverlay from "../components/home/SearchOverlay";
import { useCart } from "@/lib/cartContext";
import HeroSection from "../components/home/HeroSection";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandsBar from "../components/home/BrandsBar";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/home/Footer";
import RecommendedSection from "../components/home/RecommendedSection";
import WishlistTrends from "../components/home/WishlistTrends";
import NewsletterPopup from "../components/home/NewsletterPopup";
import ChatWidget from "../components/chat/ChatWidget";
import WishlistNotifier from "../components/notifications/WishlistNotifier";


const HERO_IMAGE = "././imgs/hero_img.png";

const CATEGORIES = [
  { name: "Interior", count: 124, image: "././imgs/seats1.png" },
  { name: "Exterior", count: 98, image: "././imgs/Exterior.png" },
  { name: "Performance", count: 76, image: "././imgs/performance.png" },
  { name: "Technology", count: 53, image: "././imgs/Technology.png" },
];

const PRODUCTS = [
  {
    id: "carbon-phone-mount",
    name: "Carbon Fiber Phone Mount Pro",
    category: "Technology",
    price: 189,
    oldPrice: "249",
    rating: 5,
    reviews: 142,
    badge: "Best Seller",
    image: "././imgs/holder.png",
  },
  {
    id: "leather-seat-covers",
    name: "Premium Leather Seat Covers",
    category: "Interior",
    price: 899,
    rating: 5,
    reviews: 89,
    badge: "New",
    image: "././imgs/seats.png",
  },
  {
    id: "led-ambient-kit",
    name: "LED Ambient Light Kit",
    category: "Technology",
    price: 349,
    oldPrice: "449",
    rating: 4,
    reviews: 67,
    badge: "Sale",
    image: "././imgs/led-ambient-kit.png",
  },
  {
    id: "alloy-wheel-set",
    name: "Forged Alloy Wheel Set",
    category: "Exterior",
    price: 4500,
    rating: 5,
    reviews: 34,
    image: "././imgs/wheels.png",
  },
];

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={totalItems} onSearchOpen={() => setSearchOpen(true)} />
      <HeroSection heroImage={HERO_IMAGE} />
      <BrandsBar />
      <CategoryGrid categories={CATEGORIES} />
      <FeaturedProducts products={PRODUCTS} />
      <WishlistTrends />
      <RecommendedSection />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <NewsletterPopup />
      <ChatWidget />
      <WishlistNotifier />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BottomNavbar onCartClick={() => setCartOpen(true)} onSearchClick={() => setSearchOpen(true)} />
    </div>
  );
}