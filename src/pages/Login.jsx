import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fake login (project-level)
    localStorage.setItem(
      "bookbazaar_user",
      JSON.stringify({
        name: "Pranjal",
        email,
      })
    );

    alert("Login successful!");
    navigate("/");
  };

  return (
    <div className="container" style={{ maxWidth: "420px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="search-input"
          type="password"
          placeholder="Password"
          required
        />

        <button className="btn btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

