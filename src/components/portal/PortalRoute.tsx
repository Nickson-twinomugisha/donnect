import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDonorAuth } from "@/contexts/DonorAuthContext";
import { Skeleton } from "@/components/ui/skeleton";

export function PortalProtectedRoute() {
  const { donor, loadingDonor } = useDonorAuth();
  if (loadingDonor) return <div className="p-8"><Skeleton className="h-8 w-64" /></div>;
  if (!donor) return <Navigate to="/portal/login" replace />;
  return <Outlet />;
}

export function PortalLoginGuard({ children }: { children: React.ReactNode }) {
  const { donor, loadingDonor } = useDonorAuth();
  if (loadingDonor) return <div className="p-8"><Skeleton className="h-8 w-64" /></div>;
  if (donor) return <Navigate to="/portal/dashboard" replace />;
  return <>{children}</>;
}
