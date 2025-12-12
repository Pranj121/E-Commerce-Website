// src/pages/BookDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function BookDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchBook() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (mounted) setBook(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchBook();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div className="container">
      <div className="card card--detail">
        <div className="card-image">
          <img src={book.image} alt={book.title} />
        </div>
        <div className="card-body">
          <h1>{book.title}</h1>
          <p className="muted">by {book.author}</p>
          <p className="muted">{book.category}</p>
          <div className="price">₹ {book.price}</div>
          <p>{book.description}</p>

          <div className="actions">
            <button className="btn btn-primary" onClick={() => addToCart(book, 1)}>
              Add to Cart
            </button>
            <button className="btn btn-ghost" onClick={() => window.scrollTo(0, 0)}>
              Save for later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

