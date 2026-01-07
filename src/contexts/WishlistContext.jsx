// src/contexts/WishlistContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookbazaar_wishlist");
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem(
      "bookbazaar_wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  // ✅ TOGGLE wishlist (add/remove)
  const toggleWishlist = (book) => {
    setWishlist((prev) => {
      const exists = prev.find((b) => b._id === book._id);

      if (exists) {
        // remove
        return prev.filter((b) => b._id !== book._id);
      } else {
        // add
        return [...prev, book];
      }
    });
  };

  const isInWishlist = (id) => {
    return wishlist.some((b) => b._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
