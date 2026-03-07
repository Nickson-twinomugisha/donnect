import React, { createContext, useContext, useState, useCallback } from "react";
import type { User, UserRole } from "@/lib/mock-data";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string, role: UserRole) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEFAULT_USERS: User[] = [
  { id: "u1", email: "admin@donnect.com", name: "Admin User", role: "admin" },
  { id: "u2", email: "staff@donnect.com", name: "Staff User", role: "staff" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("donnect_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = useCallback((email: string, _password: string) => {
    const found = DEFAULT_USERS.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem("donnect_user", JSON.stringify(found));
      return true;
    }
    // Allow any email with password "password"
    if (_password === "password") {
      const newUser: User = { id: `u${Date.now()}`, email, name: email.split("@")[0], role: "staff" };
      setUser(newUser);
      localStorage.setItem("donnect_user", JSON.stringify(newUser));
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((email: string, _password: string, name: string, role: UserRole) => {
    const newUser: User = { id: `u${Date.now()}`, email, name, role };
    setUser(newUser);
    localStorage.setItem("donnect_user", JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("donnect_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
