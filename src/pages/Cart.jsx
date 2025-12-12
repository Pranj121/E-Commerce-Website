// src/pages/Cart.jsx
import React from "react";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (!cart.length) return <p>Your cart is empty</p>;

  return (
    <div className="container">
      <h1>Cart</h1>
      <div className="grid">
        {cart.map(item => (
          <div key={item._id} className="card">
            <div className="card-image"><img src={item.image} alt={item.title} /></div>
            <div className="card-body">
              <h3>{item.title}</h3>
              <div>₹ {item.price}</div>
              <div>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Subtotal: ₹ {totalPrice.toFixed(2)}</h3>
        <button className="btn btn-primary" onClick={() => (window.location.href = "/checkout")}>Proceed to checkout</button>
      </div>
    </div>
  );
}

