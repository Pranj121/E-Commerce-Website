import React from "react";
import { useWishlist } from "../contexts/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist = [] } = useWishlist(); // ✅ DEFAULT EMPTY ARRAY

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1.5rem" }}>
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p style={{ textAlign: "center", color: "#9ca3af" }}>
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid">
          {wishlist.map((book) => (
            <ProductCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
