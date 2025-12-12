// src/pages/Checkout.jsx
import React from "react";
import { useCart } from "../contexts/CartContext";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();

  const handlePay = e => {
    e.preventDefault();
    // For now simulate success:
    alert("Payment simulated — order placed. Clearing cart.");
    clearCart();
    window.location.href = "/";
  };

  return (
    <div className="container">
      <h1>Checkout</h1>
      <p>Items: {cart.length}, total: ₹ {totalPrice.toFixed(2)}</p>

      <form onSubmit={handlePay}>
        <input name="name" placeholder="Full name" required />
        <input name="email" type="email" placeholder="Email" required />
        <button className="btn btn-primary" type="submit">Pay (simulate)</button>
      </form>
    </div>
  );
}

