import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart } = useCart();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🟢 Razorpay Payment Handler (Vercel-safe)
  const handlePayment = async () => {
    if (totalPrice <= 0) {
      alert("Cart amount is invalid");
      return;
    }

    try {
      // 1️⃣ Create order (backend API)
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const endpoint = `${apiBase}/api/payment/create-order`;

      console.log('[Cart] creating order ->', endpoint, 'amount:', totalPrice);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalPrice }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('[Cart] create-order failed', res.status, text);
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const order = await res.json();

      if (!order || !order.id) {
        console.error('[Cart] invalid order response', order);
        throw new Error("Order creation failed");
      }

      // 2️⃣ Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 🔐 ENV variable
        amount: order.amount,
        currency: order.currency,
        name: "BookBazaar",
        description: "Book Purchase",
        order_id: order.id,

        handler: function (response) {
          console.log("Payment Success:", response);
          alert("Payment Successful 🎉");
          clearCart();
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  // 🟡 Empty cart state
  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: "center" }}>
        <h1>🛒 Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1.5rem" }}>🛒 Your Cart</h1>

      <div className="grid">
        {items.map((item) => (
          <div key={item._id} className="card fade-in">
            <div className="card-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="card-body">
              <h3>{item.title}</h3>
              <p className="muted">₹ {item.price}</p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0.5rem 0",
                }}
              >
                <button
                  className="btn"
                  disabled={item.qty <= 1}
                  onClick={() => updateQty(item._id, item.qty - 1)}
                >
                  −
                </button>

                <span>{item.qty}</span>

                <button
                  className="btn"
                  onClick={() => updateQty(item._id, item.qty + 1)}
                >
                  +
                </button>
              </div>

              <p>
                Subtotal: <strong>₹ {item.price * item.qty}</strong>
              </p>

              <button
                className="btn btn-ghost"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart summary */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          borderRadius: "12px",
          background: "#0f172a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <h2>Total: ₹ {totalPrice}</h2>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn btn-ghost" onClick={clearCart}>
            Clear Cart
          </button>

          <button className="btn btn-primary" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

