import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlistContext";
import { useCart } from "@/lib/cartContext";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="pt-24 pb-32 md:pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-9 h-9 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-lg">Your wishlist is empty</p>
              <p className="text-muted-foreground text-sm mt-1">Save products you love by tapping the heart icon.</p>
            </div>
            <Button asChild className="rounded-full px-8">
              <Link to="/">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-card border border-border/50 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-secondary/50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {product.badge}
                    </span>
                  )}
                </Link>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-sm mt-1 line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-lg font-bold mt-2">{product.price.toLocaleString()} SAR</p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 rounded-full h-9 text-xs font-semibold"
                      onClick={() => addToCart(product, 1)}
                    >
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-full border-border/50 hover:bg-destructive/10 hover:border-destructive/30"
                      onClick={() => toggleWishlist(product)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
