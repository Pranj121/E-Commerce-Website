import React from "react";
import { useWishlist } from "../contexts/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1.5rem" }}>❤️ My Wishlist</h1>

      {items.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid">
          {items.map((book) => (
            <ProductCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

