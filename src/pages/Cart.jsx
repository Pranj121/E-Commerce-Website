import React from "react";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart } = useCart();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 🟢 Razorpay Payment Handler (FINAL + VERIFIED)
  const handlePayment = async () => {
    if (totalPrice <= 0) {
      alert("Cart amount is invalid");
      return;
    }

    try {
      // 1️⃣ Create order on backend
      const apiBase = import.meta.env.VITE_API_URL;
      const orderRes = await fetch(`${apiBase}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      if (!orderRes.ok) {
        const text = await orderRes.text();
        throw new Error(`Order creation failed: ${text}`);
      }

      const order = await orderRes.json();
      if (!order?.id) {
        throw new Error("Invalid order response from server");
      }

      // 2️⃣ Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // TEST KEY
        amount: order.amount,
        currency: order.currency,
        name: "BookBazaar",
        description: "Book Purchase",
        order_id: order.id,

        handler: async function (response) {
          try {
            // 3️⃣ VERIFY PAYMENT ON BACKEND (IMPORTANT)
            const verifyRes = await fetch(
              `${apiBase}/api/payment/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              alert("Payment Verified & Successful 🎉");
              clearCart();
            } else {
              alert("Payment verification failed ❌");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification error");
          }
        },

        modal: {
          ondismiss: function () {
            console.warn("Razorpay popup closed by user");
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);

      // ❌ Handle payment failure
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed: " + response.error.description);
      });

      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  // 🟡 Empty cart
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
          <div key={item._id} className="card">
            <div className="card-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="card-body">
              <h3>{item.title}</h3>
              <p className="muted">₹ {item.price}</p>

              <div style={{ display: "flex", gap: "0.5rem" }}>
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

      {/* Summary */}
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
