// src/contexts/CartContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const CART_KEY = "bookbazaar_cart_v1";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);

  // auto-close cart on route change
  const location = useLocation();
  useEffect(() => {
    // close cart whenever user navigates to a new route
    setCartOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product._id) return;
    setItems((prev) => {
      const idx = prev.findIndex((p) => p._id === product._id);
      if (idx === -1) return [...prev, { ...product, qty: quantity }];
      const copy = prev.slice();
      copy[idx] = { ...copy[idx], qty: (Number(copy[idx].qty) || 0) + Number(quantity) };
      return copy;
    });
  };

  const updateQty = (id, qty) => {
    setItems((prev) => prev.map((p) => (p._id === id ? { ...p, qty } : p)));
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((s, it) => s + (Number(it.qty) || 0), 0), [items]);

  const toggleCart = () => setCartOpen((s) => !s);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalItems,
        cartOpen,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

