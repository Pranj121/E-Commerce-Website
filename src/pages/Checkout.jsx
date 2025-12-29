import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items = [] } = useCart(); // ✅ SAFE DEFAULT
  const navigate = useNavigate();

  // 🟡 If cart is empty → go back
  if (!items || items.length === 0) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h1>🧾 Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/cart" className="btn btn-primary">
          Go to Cart
        </Link>
      </div>
    );
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1.5rem" }}>🧾 Checkout</h1>

      {/* Order Summary */}
      <div
        style={{
          background: "#0f172a",
          padding: "1.5rem",
          borderRadius: "12px",
          marginBottom: "2rem",
        }}
      >
        <h2>Order Summary</h2>

        {items.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "0.5rem 0",
            }}
          >
            <span>
              {item.title} × {item.qty}
            </span>
            <span>₹ {item.price * item.qty}</span>
          </div>
        ))}

        <hr style={{ margin: "1rem 0", opacity: 0.3 }} />

        <h3>Total: ₹ {totalPrice}</h3>
      </div>

      {/* Checkout Form */}
      <div
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "12px",
        }}
      >
        <h2>Shipping Details</h2>

        <input className="search-input" placeholder="Full Name" />
        <br /><br />

        <input className="search-input" placeholder="Email" />
        <br /><br />

        <input className="search-input" placeholder="Address" />
        <br /><br />

        <button
          className="btn btn-primary"
          onClick={() => {
            alert("✅ Order placed successfully!");
            navigate("/");
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

