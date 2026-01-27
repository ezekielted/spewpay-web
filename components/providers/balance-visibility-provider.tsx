"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface BalanceVisibilityContextType {
  isPrivate: boolean;
  togglePrivacy: () => void;
}

const BalanceVisibilityContext = createContext<BalanceVisibilityContextType | undefined>(undefined);

export function BalanceVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("balance_privacy");
    if (saved !== null) {
      setIsPrivate(saved === "true");
    }
  }, []);

  const togglePrivacy = () => {
    setIsPrivate((prev) => {
      const newVal = !prev;
      localStorage.setItem("balance_privacy", newVal.toString());
      return newVal;
    });
  };

  return (
    <BalanceVisibilityContext.Provider value={{ isPrivate, togglePrivacy }}>
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext);
  if (context === undefined) {
    throw new Error("useBalanceVisibility must be used within a BalanceVisibilityProvider");
  }
  return context;
}
