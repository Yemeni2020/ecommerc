import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/cartContext';
import { WishlistProvider } from '@/lib/wishlistContext';
import { CompareProvider } from '@/lib/compareContext';
import { CurrencyProvider } from '@/lib/currencyContext';
import { UIProvider } from '@/lib/uiContext';
import Wishlist from './pages/Wishlist';
import Products from './pages/Products';
import GiftCard from './pages/GiftCard';
import AdminDashboard from './pages/AdminDashboard';
import MyRewards from './pages/MyRewards';
import ComparePage from './pages/ComparePage';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

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

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:productId" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/track" element={<OrderTracking />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/products" element={<Products />} />
      <Route path="/gift-card" element={<GiftCard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/rewards" element={<MyRewards />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <CurrencyProvider>
      <WishlistProvider>
      <CompareProvider>
      <CartProvider>
        <UIProvider>
          <QueryClientProvider client={queryClientInstance}>
            <Router basename={import.meta.env.BASE_URL}>
              <AuthenticatedApp />
            </Router>
            <Toaster />
            <SonnerToaster />
          </QueryClientProvider>
        </UIProvider>
      </CartProvider>
      </CompareProvider>
      </WishlistProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App
