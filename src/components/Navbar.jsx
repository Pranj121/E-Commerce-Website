// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext"; // adjust path if different

// Small inline SVG cart icon component
function CartIcon({ size = 18 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 4h-2v2h2l3 9h8l3-7H8.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10.5" cy="19.5" r="1.25" fill="currentColor" />
      <circle cx="18.5" cy="19.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const { totalItems = 0 } = useCart() || {}; // fallback if hook not present

  return (
    <nav className="site-header">
      <div className="site-title">
        <Link to="/" className="brand" aria-label="BookBazaar home">
          <span className="brand-icon" aria-hidden="true" />
          <span className="brand-name">BookBazaar</span>
        </Link>
      </div>

      <div className="site-nav" role="navigation" aria-label="Main">
        <NavLink to="/" className={({ isActive }) => "navlink" + (isActive ? " navlink--active" : "")}>Home</NavLink>
        <NavLink to="/books" className={({ isActive }) => "navlink" + (isActive ? " navlink--active" : "")}>Books</NavLink>
        <NavLink to="/support" className={({ isActive }) => "navlink" + (isActive ? " navlink--active" : "")}>Support</NavLink>
        <NavLink to="/contact" className={({ isActive }) => "navlink" + (isActive ? " navlink--active" : "")}>Contact</NavLink>
      </div>

      <div className="site-actions">
        {/* Cart link wrapper. Uses .cart-link + .cart-badge as requested */}
        <Link to="/cart" className="cart-link" aria-label={`Cart, ${totalItems} items`}>
          <CartIcon />
          <span>Cart</span>
          <span className="cart-badge" aria-hidden={totalItems === 0} aria-live="polite">
            {totalItems}
          </span>
        </Link>

        {/* Replace with login/profile button when ready */}
        <button className="btn" type="button">Login</button>
      </div>
    </nav>
  );
}

