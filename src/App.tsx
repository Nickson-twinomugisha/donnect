import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DonorsPage from "@/pages/DonorsPage";
import DonorProfilePage from "@/pages/DonorProfilePage";
import DonationsPage from "@/pages/DonationsPage";
import TestResultsPage from "@/pages/TestResultsPage";
import MedicalNotesPage from './pages/MedicalNotesPage';
import NotFound from "./pages/NotFound";
import { ProtectedRoute, LoginGuard } from './components/ProtectedRoute';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <GlobalErrorBoundary>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginGuard><LoginPage /></LoginGuard>} />
              <Route path="*" element={<NotFound />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/donors" element={<DonorsPage />} />
                <Route path="/donors/:id" element={<DonorProfilePage />} />
                <Route path="/donations" element={<DonationsPage />} />
                <Route path="/test-results" element={<TestResultsPage />} />
                <Route path="/medical-notes" element={<MedicalNotesPage />} />
              </Route>
            </Routes>
          </GlobalErrorBoundary>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
