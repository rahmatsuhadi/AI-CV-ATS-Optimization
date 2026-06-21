"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  hasBaseCv: boolean;
  onboardingSkipped: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string) => Promise<void>;
  logout: () => void;
  setHasBaseCv: (has: boolean) => void;
  skipOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("cv_optimizer_user");
    const hasBaseCv = localStorage.getItem("cv_has_base") === "true";
    const onboardingSkipped =
      localStorage.getItem("cv_onboard_skip") === "true";

    if (stored) {
      setUser({ email: stored, hasBaseCv, onboardingSkipped });
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    localStorage.setItem("cv_optimizer_user", email);
    const hasBaseCv = localStorage.getItem("cv_has_base") === "true";
    const onboardingSkipped =
      localStorage.getItem("cv_onboard_skip") === "true";

    const newUser = { email, hasBaseCv, onboardingSkipped };
    setUser(newUser);

    if (!hasBaseCv && !onboardingSkipped) {
      router.push("/setup");
    } else {
      router.push("/dashboard");
    }
  };

  const register = async (email: string) => {
    localStorage.setItem("cv_optimizer_user", email);
    const newUser = { email, hasBaseCv: false, onboardingSkipped: false };
    setUser(newUser);
    router.push("/setup");
  };

  const logout = () => {
    localStorage.removeItem("cv_optimizer_user");
    // Do not wipe base CV status so return visits are still valid demo
    setUser(null);
    router.push("/login");
  };

  const setHasBaseCv = (has: boolean) => {
    localStorage.setItem("cv_has_base", has ? "true" : "false");
    if (user) setUser({ ...user, hasBaseCv: has });
  };

  const skipOnboarding = () => {
    localStorage.setItem("cv_onboard_skip", "true");
    if (user) setUser({ ...user, onboardingSkipped: true });
    router.push("/dashboard");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setHasBaseCv,
        skipOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
