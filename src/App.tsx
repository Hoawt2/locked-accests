import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SubscribePage from "./pages/SubscribePage";
import ActivePackagesPage from "./pages/ActivePackagesPage";
import InvestmentHistoryPage from "./pages/InvestmentHistoryPage";
import TransactionsPage from "./pages/TransactionsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminLiquidityPage from "./pages/admin/AdminLiquidityPage";
import AdminPendingPage from "./pages/admin/AdminPendingPage";
import AdminManualPage from "./pages/admin/AdminManualPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/subscribe" element={<SubscribePage />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/packages" element={<ActivePackagesPage />} />
            <Route path="/history" element={<InvestmentHistoryPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/liquidity" element={<AdminLiquidityPage />} />
            <Route path="/admin/pending" element={<AdminPendingPage />} />
            <Route path="/admin/manual" element={<AdminManualPage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
