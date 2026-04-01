import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/cartContext';
import { WishlistProvider } from '@/lib/wishlistContext';
import Wishlist from './pages/Wishlist';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import CartDrawer from "@/components/product/CartDrawer";
import BottomNavbar from "@/components/home/BottomNavbar";
import SearchOverlay from "@/components/home/SearchOverlay";
import { UIProvider, useUI } from "@/lib/uiContext";
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const { cartOpen, closeCart, searchOpen, closeSearch } = useUI();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Render the main app
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/track" element={<OrderTracking />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <BottomNavbar />
    </>
  );
};

function App() {

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <UIProvider>
            <QueryClientProvider client={queryClientInstance}>
              <Router>
                <AuthenticatedApp />
              </Router>
              <Toaster />
            </QueryClientProvider>
          </UIProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default App
