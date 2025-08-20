
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import BookDesigner from "./pages/BookDesigner";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import OrderDetails from "./pages/OrderDetails";
import UserOrders from "./pages/UserOrders";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminContent from "./pages/admin/AdminContent";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminHistory from "./pages/admin/AdminHistory";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout";
import ContactForm from "./components/ContactForm";
import HowItWorks from "./components/HowItWorks";
import Offers from "./pages/Offers";
import ProcessPage from "./pages/ProcessPage";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import MockOrders from "./pages/MockOrders";
import ExtractorTool from "./components/ExtractorTool";
import FileUploaderPage from "./pages/FileUploaderPage";
import BookDesignerPage from "./pages/BookDesignerPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import InstagramBookInterface from "./components/InstagramBookInterface";
import FacebookBookInterface from "./components/FacebookInterface";
import WhatsAppBookInterface from "./components/WhatsAppBookInterface";
import TestAuth from "./pages/TestAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Routes publiques avec layout commun */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<ContactForm />} />
                <Route path="/process" element={<ProcessPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/designer" element={<BookDesigner />} />
                <Route path="/designer/upload" element={<FileUploaderPage />} />
                <Route path="/designer/book" element={<BookDesignerPage />} />
                <Route path="/instagram-guide" element={<InstagramBookInterface onBack={() => window.history.back()} />} />
                <Route path="/whatsApp-guide" element={<WhatsAppBookInterface onBack={() => window.history.back()} />} />
                <Route path="/facebook-guide" element={<FacebookBookInterface onBack={() => window.history.back()} />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/extractor" element={<ExtractorTool />} />
                <Route path="/mock-orders" element={<MockOrders />} />
                <Route path="/test-auth" element={<TestAuth />} />

                {/* Routes temporairement publiques - authentification désactivée */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfileSettings />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route path="/user-orders" element={<UserOrders />} />
              </Route>
              
              {/* Routes admin temporairement publiques - authentification désactivée */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="partners" element={<AdminPartners />} />
                <Route path="admin-accounts" element={<AdminAccounts />} />
                <Route path="history" element={<AdminHistory />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="testimonials" element={<AdminContent />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
