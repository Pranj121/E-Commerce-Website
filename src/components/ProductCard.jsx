import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

export default function ProductCard({ book }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const liked = isInWishlist(book._id);

  return (
    <div className="card">
      <div className="card-image">
        <img src={book.image} alt={book.title} />
      </div>

      <div className="card-body">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">by {book.author}</p>
        <p className="card-category">{book.category}</p>

        <div className="card-footer">
          <span className="price">₹ {book.price}</span>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {/* ❤️ WISHLIST TOGGLE */}
            <button
              className="btn btn-ghost"
              onClick={() => toggleWishlist(book)}
              style={{
                color: liked ? "red" : "#94a3b8",
                fontSize: "18px",
              }}
            >
              ❤️
            </button>

            {/* 👁 View Details */}
            <Link to={`/books/${book._id}`} className="btn btn-ghost">
              View
            </Link>

            {/* 🛒 Add to Cart */}
            <button
              className="btn btn-primary"
              onClick={() => addToCart(book)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
