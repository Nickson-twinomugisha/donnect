import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "./AppSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Droplets } from "lucide-react";

export default function AppLayout() {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar className="fixed left-0 top-0 z-40 hidden h-screen w-64 lg:flex" />

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <AppSidebar onClose={() => setIsMobileOpen(false)} className="h-full w-full border-none" />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-display font-bold">
          <Droplets className="h-5 w-5 text-primary" />
          <span>Donnect</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen p-6 lg:ml-64">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
