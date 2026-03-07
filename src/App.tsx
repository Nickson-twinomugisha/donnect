import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import DonorsPage from "@/pages/DonorsPage";
import DonorProfilePage from "@/pages/DonorProfilePage";
import DonationsPage from "@/pages/DonationsPage";
import TestResultsPage from "@/pages/TestResultsPage";
import MedicalNotesPage from "@/pages/MedicalNotesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/donors" element={<DonorsPage />} />
              <Route path="/donors/:id" element={<DonorProfilePage />} />
              <Route path="/donations" element={<DonationsPage />} />
              <Route path="/test-results" element={<TestResultsPage />} />
              <Route path="/medical-notes" element={<MedicalNotesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
