import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getDonorByNameAndEmail, type Donor } from "@/lib/mock-data";

interface DonorAuthContextType {
  donor: Donor | null;
  loadingDonor: boolean;
  donorLogin: (fullName: string, email: string) => Promise<{ error: string | null }>;
  donorLogout: () => void;
}

const DonorAuthContext = createContext<DonorAuthContextType | null>(null);

const STORAGE_KEY = "donnect_portal_donor";

export function DonorAuthProvider({ children }: { children: React.ReactNode }) {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loadingDonor, setLoadingDonor] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDonor(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoadingDonor(false);
    }
  }, []);

  const donorLogin = useCallback(async (fullName: string, email: string) => {
    try {
      const found = await getDonorByNameAndEmail(fullName, email);
      if (!found) {
        return { error: "No donor record found with that name and email. Please check your details." };
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      setDonor(found);
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error && err.name === "AbortError"
          ? "Request timed out. Please check your connection."
          : "Something went wrong. Please try again.",
      };
    }
  }, []);

  const donorLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDonor(null);
  }, []);

  return (
    <DonorAuthContext.Provider value={{ donor, loadingDonor, donorLogin, donorLogout }}>
      {children}
    </DonorAuthContext.Provider>
  );
}

export function useDonorAuth() {
  const ctx = useContext(DonorAuthContext);
  if (!ctx) throw new Error("useDonorAuth must be used within DonorAuthProvider");
  return ctx;
}
