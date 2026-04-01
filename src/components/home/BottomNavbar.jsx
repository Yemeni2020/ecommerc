import { Link, useLocation } from "react-router-dom";
import { Home, Heart, ShoppingCart, Search, MapPin } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { useWishlist } from "@/lib/wishlistContext";
import { useUI } from "@/lib/uiContext";

export default function BottomNavbar() {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { pathname } = useLocation();
  const { openCart, openSearch } = useUI();

  const links = [
    { icon: Home, label: "Home", to: "/" },
    { icon: Search, label: "Search", action: openSearch },
    { icon: Heart, label: "Wishlist", to: "/wishlist", badge: wishlist.length },
    { icon: MapPin, label: "Track", to: "/track" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-xl border-t border-border/50">
      <div className="flex items-center justify-around px-2 h-16">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = item.to && pathname === item.to;
          const content = (
            <div className={`flex flex-col items-center gap-0.5 relative py-1 px-3 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
            </div>
          );

          if (item.action) {
            return (
              <button key={item.label} onClick={item.action} className="flex-1 flex justify-center">
                {content}
              </button>
            );
          }
          return (
            <Link key={item.label} to={item.to} className="flex-1 flex justify-center">
              {content}
            </Link>
          );
        })}

        {/* Cart button */}
            <button onClick={openCart} className="flex-1 flex justify-center">
          <div className="flex flex-col items-center gap-0.5 relative py-1 px-3 text-muted-foreground">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-primary text-primary-foreground text-[8px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </div>
        </button>
      </div>
    </div>
  );
}
