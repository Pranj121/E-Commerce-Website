// src/pages/Home.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useWishlistAnimation from "../hooks/useWishlistAnimation";

const API_URL = "/api/products";
const PAGE_SIZE = 6;

export default function Home() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // animation handler
  const animateWishlist = useWishlistAnimation();

  // store DOM refs for all heart icons
  const heartRefs = useRef({});

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [itemsToShow, setItemsToShow] = useState(PAGE_SIZE);

  /* ---------------- Fetch Books ---------------- */
  useEffect(() => {
    let mounted = true;

    async function fetchBooks() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        if (mounted) setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Could not load books. Please try again later.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBooks();
    return () => (mounted = false);
  }, []);

  /* ---------------- Compute Categories ---------------- */
  const categories = useMemo(() => {
    const set = new Set();
    books.forEach((b) => b.category && set.add(b.category));
    return ["all", ...Array.from(set)];
  }, [books]);

  /* ---------------- Filtering + Sorting ---------------- */
  const filtered = useMemo(() => {
    let list = [...books];

    // search
    if (query.trim() !== "") {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          (b.title && b.title.toLowerCase().includes(q)) ||
          (b.author && b.author.toLowerCase().includes(q))
      );
    }

    // category filter
    if (category !== "all") {
      list = list.filter((b) => b.category === category);
    }

    // sorting
    if (sort === "price_asc") {
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "price_desc") {
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sort === "alpha") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return list;
  }, [books, query, category, sort]);

  /* ---------------- Reset itemsToShow on filter change ---------------- */
  useEffect(() => {
    setItemsToShow(PAGE_SIZE);
  }, [query, category, sort, books]);

  /* ---------------- Infinite Scroll ---------------- */
  const loadMore = () => {
    setItemsToShow((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  };

  const hasMore = itemsToShow < filtered.length;

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    enabled: hasMore,
    rootMargin: "300px",
  });

  /* ---------------- Handlers ---------------- */
  const handleAddToCart = (book) => addToCart(book, 1);

  const handleToggleWishlist = (book) => {
    toggleWishlist(book);

    // animate heart icon
    const el = heartRefs.current[book._id];
    if (el) animateWishlist({ current: el });
  };

  const setHeartRef = (id) => (el) => {
    if (el) heartRefs.current[id] = el;
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setSort("default");
    setItemsToShow(PAGE_SIZE);
  };

  /* ---------------- UI ---------------- */
  return (
    <main className="container">
      <header className="site-header" style={{ marginBottom: "1.25rem" }}>
        <div>
          <h1>Welcome to BookBazaar</h1>
          <p className="site-sub">Your online bookstore for amazing reads.</p>
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <SearchBar onSearch={setQuery} />
        </div>
      </header>

      {/* --- TEST WISHLIST ANIMATION (temporary) --- */}
      {/* Paste this block only for testing. Remove it after you confirm the animation works. */}
      <div style={{ margin: "1.25rem 0", padding: "1rem", background: "#111827", borderRadius: 8 }}>
        <p style={{ color: "var(--text)", margin: 0 }}>Test Heart Animation:</p>

        <div style={{ marginTop: ".6rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
          <span
            id="testHeart"
            style={{ fontSize: "1.6rem", cursor: "pointer", userSelect: "none" }}
            onClick={() => {
              const el = document.getElementById("testHeart");
              if (el) {
                // call the hook with element (hook supports element or { current: el })
                animateWishlist(el);
              }
            }}
            aria-hidden
          >
            ❤️
          </span>

          <small style={{ color: "var(--muted)" }}>Click the heart — it should play the pop animation.</small>
        </div>
      </div>

      {/* Filter Bar */}
      <section
        className="flex"
        style={{
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <label>
          Category:&nbsp;
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All" : cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort:&nbsp;
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </label>

        <button
          className="btn btn-ghost"
          type="button"
          onClick={resetFilters}
          style={{ marginLeft: "auto" }}
        >
          Reset filters
        </button>
      </section>

      {/* Main Content */}
      {loading && <p className="info">Loading books...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p className="info">No books found. Try changing filters.</p>
          ) : (
            <>
              <div className="grid">
                {filtered.slice(0, itemsToShow).map((book) => {
                  const wished = isInWishlist(book._id);

                  return (
                    <article className="card" key={book._id}>
                      <Link
                        to={`/books/${book._id}`}
                        className="card-image"
                        aria-label={book.title}
                      >
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            style={{
                              width: "100%",
                              height: "180px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              height: 180,
                              background: "var(--glass)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span>No image</span>
                          </div>
                        )}
                      </Link>

                      <div className="card-body">
                        <h3 className="card-title">{book.title}</h3>
                        <p className="card-author">by {book.author}</p>
                        <p className="card-category">{book.category}</p>
                        <p className="card-description">
                          {book.description
                            ? book.description.length > 120
                              ? book.description.slice(0, 120) + "…"
                              : book.description
                            : ""}
                        </p>
                      </div>

                      <div className="card-footer">
                        <span className="price">₹ {book.price}</span>

                        <div style={{ display: "flex", gap: ".5rem" }}>
                          {/* Wishlist Button */}
                          <button
                            type="button"
                            className={
                              wished
                                ? "btn btn-ghost wishlist-btn wishlist-btn--active"
                                : "btn btn-ghost wishlist-btn"
                            }
                            onClick={() => handleToggleWishlist(book)}
                          >
                            <span
                              ref={setHeartRef(book._id)}
                              className="heart"
                              aria-hidden
                            >
                              {wished ? "❤️" : "🤍"}
                            </span>
                            <span style={{ marginLeft: 8 }}>
                              {wished ? "Saved" : "Save"}
                            </span>
                          </button>

                          {/* Add to Cart */}
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleAddToCart(book)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} style={{ height: 1 }} />

              {hasMore ? (
                <p className="text-muted" style={{ textAlign: "center" }}>
                  Loading more…
                </p>
              ) : (
                <p className="text-muted" style={{ textAlign: "center" }}>
                  End of results.
                </p>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

