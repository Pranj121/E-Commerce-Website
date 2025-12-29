import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import Spinner from "../components/Spinner";

export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PRODUCTS_API}`)
      .then((res) => res.json())
      .then((data) => {
        const foundBook = data.find((b) => b._id === id);
        if (!foundBook) {
          setError("Book not found");
        } else {
          setBook(foundBook);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load book details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>{error}</p>
        <Link to="/" className="btn">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="book-details">
      <img src={book.image} alt={book.title} className="book-details-image" />

      <div className="book-details-info">
        <h1>{book.title}</h1>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Category:</strong> {book.category}</p>

        <h2>₹ {book.price}</h2>

        <div className="book-details-actions">
          <button className="btn btn-primary" onClick={() => addToCart(book)}>
            Add to Cart
          </button>

          <button className="btn btn-ghost" onClick={() => addToWishlist(book)}>
            ❤️ Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

