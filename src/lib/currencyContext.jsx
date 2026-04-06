import React, { createContext, useContext, useState, useEffect } from "react";

// Mock exchange rates (SAR as base)
const RATES = {
  SAR: 1,
  USD: 0.2667,
  EUR: 0.2449,
};

export const CURRENCIES = [
  { code: "SAR", symbol: "SAR", flag: "🇸🇦", name: "Saudi Riyal" },
  { code: "USD", symbol: "$", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", name: "Euro" },
];

// Mock geo-detection: SA → SAR, US → USD, EU countries → EUR
function detectCurrencyFromLocale() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const locale = navigator.language || "";
    if (tz.startsWith("Asia/Riyadh") || tz.startsWith("Asia/Kuwait") || locale.startsWith("ar")) return "SAR";
    if (tz.startsWith("America/") || locale.startsWith("en-US")) return "USD";
    if (tz.startsWith("Europe/")) return "EUR";
  } catch {}
  return "SAR";
}

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("dl_currency") || detectCurrencyFromLocale();
  });

  useEffect(() => {
    localStorage.setItem("dl_currency", currency);
  }, [currency]);

  const convert = (sarAmount) => {
    const rate = RATES[currency] ?? 1;
    return sarAmount * rate;
  };

  const format = (sarAmount) => {
    const converted = convert(sarAmount);
    const curr = CURRENCIES.find((c) => c.code === currency);
    if (currency === "SAR") return `${Math.round(converted).toLocaleString()} SAR`;
    return `${curr.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);