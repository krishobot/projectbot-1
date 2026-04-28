"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Currency = "usd" | "inr";

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const CurrencyContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "astack:packs:currency";

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency: Currency;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<Currency>(initialCurrency);

  // Restore from localStorage on mount — user's explicit choice persists across visits
  // and overrides geo-detection. Done after hydration to avoid SSR/CSR mismatch.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "usd" || stored === "inr") setCurrencyState(stored);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    window.localStorage.setItem(STORAGE_KEY, c);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}

export function CurrencyToggle({ className = "" }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/40 p-0.5 text-xs ${className}`}
      role="radiogroup"
      aria-label="Currency"
    >
      <button
        type="button"
        role="radio"
        aria-checked={currency === "usd"}
        onClick={() => setCurrency("usd")}
        className={`px-3 py-1 rounded-full font-mono transition ${
          currency === "usd"
            ? "bg-zinc-800 text-zinc-100"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        USD
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={currency === "inr"}
        onClick={() => setCurrency("inr")}
        className={`px-3 py-1 rounded-full font-mono transition ${
          currency === "inr"
            ? "bg-zinc-800 text-zinc-100"
            : "text-zinc-500 hover:text-zinc-300"
        }`}
      >
        INR
      </button>
    </div>
  );
}
