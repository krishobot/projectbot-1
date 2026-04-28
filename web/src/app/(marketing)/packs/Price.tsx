"use client";

import { useCurrency } from "./CurrencyToggle";
import { formatPrice } from "@/lib/packs";

export function Price({
  price,
  className = "",
}: {
  price: { usd: number; inr: number };
  className?: string;
}) {
  const { currency } = useCurrency();
  return <span className={`tabular-nums ${className}`}>{formatPrice(price, currency)}</span>;
}
