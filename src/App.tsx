import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { RequestProvider } from "@/contexts/RequestContext";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import RequestItem from "./pages/RequestItem";
import MyRequests from "./pages/MyRequests";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <RequestProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/request-item" element={<RequestItem />} />
                    <Route path="/my-requests" element={<MyRequests />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<SuperAdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </RequestProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
