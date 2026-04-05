import React, { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const toggleCompare = (product) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) return prev; // max 3
      return [...prev, product];
    });
  };

  const isInCompare = (id) => compareList.some((p) => p.id === id);
  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);