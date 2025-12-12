// src/contexts/WishlistContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const WISHLIST_KEY = "bookbazaar_wishlist_v1";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToWishlist = (book) => {
    setItems((prev) => {
      if (!book || !book._id) return prev;
      if (prev.some((b) => b._id === book._id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromWishlist = (id) => {
    setItems((prev) => prev.filter((b) => b._id !== id));
  };

  const toggleWishlist = (book) => {
    if (!book || !book._id) return;
    setItems((prev) => {
      const exists = prev.some((b) => b._id === book._id);
      if (exists) return prev.filter((b) => b._id !== book._id);
      return [...prev, book];
    });
  };

  const isInWishlist = (id) => items.some((b) => b._id === id);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}

