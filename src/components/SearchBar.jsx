// src/components/SearchBar.jsx
import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  const handleChange = (e) => setValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: ".5rem",
        alignItems: "center",
        width: "100%",
        maxWidth: "420px"
      }}
    >
      <input
        className="search-input"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search by title or author…"
        aria-label="Search books"
      />
      <button type="submit" className="btn btn-ghost">
        Search
      </button>
    </form>
  );
}

