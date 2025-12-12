// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";

/**
 * ProductCard component
 * Props:
 *  - book: the product object (expects _id, title, author, image, price, description, category)
 *  - onAddToCart: function(book) (optional)
 */
export default function ProductCard({ book, onAddToCart }) {
  const { _id, title, author, image, price, description, category } = book || {};
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // local UI animation flag (small pop when toggling)
  const [anim, setAnim] = useState(false);

  const wished = isInWishlist(_id);

  const toggleWishlist = () => {
    if (!book || !_id) return;

    if (wished) {
      removeFromWishlist(_id);
    } else {
      addToWishlist(book);
    }

    // briefly animate the heart
    setAnim(true);
    window.setTimeout(() => setAnim(false), 500);
  };

  return (
    <article className="card" aria-labelledby={`book-${_id}-title`}>
      <Link to={`/books/${_id}`} className="card-image" aria-label={title}>
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span>No image</span>
          </div>
        )}
      </Link>

      <div className="card-body">
        <h3 id={`book-${_id}-title`} className="card-title">{title}</h3>
        <p className="card-author">by {author}</p>
        <p className="card-category">{category}</p>

        <p className="card-description" style={{ marginTop: ".5rem" }}>
          {description ? (description.length > 120 ? description.slice(0, 120) + "…" : description) : ""}
        </p>

        <div className="card-footer" style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="price">₹ {price}</div>

          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            {/* Wishlist toggle */}
            <button
              type="button"
              className={
                "wishlist-btn " +
                (wished ? "wishlist-btn--active " : "") +
                (anim ? "wishlist-animate" : "")
              }
              onClick={toggleWishlist}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              title={wished ? "Remove from wishlist" : "Add to wishlist"}
            >
              <span className="heart" aria-hidden>{wished ? "❤️" : "🤍"}</span>
              <span style={{ display: "none" }}>{wished ? "Saved" : "Save"}</span>
            </button>

            {/* View details */}
            <Link to={`/books/${_id}`} className="btn btn-ghost" aria-label={`View ${title}`}>
              View
            </Link>

            {/* Add to cart */}
            <button
              className="btn btn-primary"
              onClick={() => onAddToCart && onAddToCart(book)}
              aria-label={`Add ${title} to cart`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
