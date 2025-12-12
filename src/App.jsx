// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
// import other pages if needed

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books/:id" element={<BookDetails />} />
        {/* Add more routes here */}
      </Routes>
    </>
  );
}

