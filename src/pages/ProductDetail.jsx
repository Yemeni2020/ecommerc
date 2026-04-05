import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import BottomNavbar from "../components/home/BottomNavbar";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductSpecs from "../components/product/ProductSpecs";
import ProductReviews from "../components/product/ProductReviews";
import RelatedProducts from "../components/product/RelatedProducts";
import CartDrawer from "../components/product/CartDrawer";
import { getProductById, getRelatedProducts } from "../lib/productData";
import { useCart } from "@/lib/cartContext";
import { recordView } from "../lib/browsingHistory";
import { useEffect } from "react";

export default function ProductDetail() {
  const { productId } = useParams();
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const product = getProductById(productId);
  const related = product ? getRelatedProducts(product.id, product.category) : [];

  useEffect(() => {
    if (product) recordView(product.id);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <p className="text-lg">Product not found.</p>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar onCartClick={() => setCartOpen(true)} cartCount={totalItems} />

      <main className="pt-20 pb-10">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>

        {/* Product Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <ProductImageGallery images={product.images} badge={product.badge} />
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabs: Specs & Reviews */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <ProductSpecs specs={product.specs} />
            <ProductReviews
              reviews={product.reviews}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </div>
        </div>
      </main>

      {/* Related Products */}
      <RelatedProducts products={related} />

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <BottomNavbar onCartClick={() => setCartOpen(true)} onSearchClick={() => {}} />
    </div>
  );
}