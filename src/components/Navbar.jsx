import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

// Small inline SVG cart icon component
function CartIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 4h-2v2h2l3 9h8l3-7H8.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10.5" cy="19.5" r="1.25" />
      <circle cx="18.5" cy="19.5" r="1.25" />
    </svg>
  );
}

export default function Navbar() {
  const { totalItems = 0 } = useCart() || {};
  const { user, logout } = useAuth(); // 🔑 AUTH STATE

  return (
    <nav className="site-header">
      {/* Brand */}
      <Link to="/" className="brand">
        <span className="brand-name">📚 BookBazaar</span>
      </Link>

      {/* Navigation */}
      <div className="site-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "navlink navlink--active" : "navlink"}>
          Home
        </NavLink>

        <NavLink to="/wishlist" className={({ isActive }) => isActive ? "navlink navlink--active" : "navlink"}>
          Wishlist
        </NavLink>

        <NavLink to="/support" className={({ isActive }) => isActive ? "navlink navlink--active" : "navlink"}>
          Support
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => isActive ? "navlink navlink--active" : "navlink"}>
          Contact
        </NavLink>
      </div>

      {/* Actions */}
      <div className="site-actions">
        {/* Cart */}
        <Link to="/cart" className="cart-link">
          <CartIcon />
          <span>Cart</span>
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </Link>

        {/* AUTH SECTION */}
        {user ? (
          <div className="profile-menu">
            <span className="profile-name">👤 {user.name} ▾</span>

            <div className="profile-dropdown">
              <Link to="/wishlist">Wishlist</Link>
              <button onClick={logout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>

            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

