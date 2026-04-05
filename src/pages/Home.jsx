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

const HERO_IMAGE = "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/c651a0491_generated_c10d0264.png";

const CATEGORIES = [
  { name: "Interior", count: 124, image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/831dcfe2c_generated_f7bcb75c.png" },
  { name: "Exterior", count: 98, image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/23da1b993_generated_22837407.png" },
  { name: "Performance", count: 76, image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/d8b2a3319_generated_bd81f413.png" },
  { name: "Technology", count: 53, image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/500d7c8f4_generated_cf951c92.png" },
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
    image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/bd168a385_generated_c8cb9b12.png",
  },
  {
    id: "leather-seat-covers",
    name: "Premium Leather Seat Covers",
    category: "Interior",
    price: 899,
    rating: 5,
    reviews: 89,
    badge: "New",
    image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/46de2be99_generated_2d8b6ffd.png",
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
    image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/c2109a003_generated_240a6197.png",
  },
  {
    id: "alloy-wheel-set",
    name: "Forged Alloy Wheel Set",
    category: "Exterior",
    price: 4500,
    rating: 5,
    reviews: 34,
    image: "https://media.base44.com/images/public/69c90313080b6a8a2755e1b6/b0854fd7f_generated_85a434f3.png",
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
      <RecommendedSection />
      <WhyChooseUs />
      <Newsletter />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BottomNavbar onCartClick={() => setCartOpen(true)} onSearchClick={() => setSearchOpen(true)} />
    </div>
  );
}