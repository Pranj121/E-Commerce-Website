import React, { useEffect, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import BookSkeleton from "../components/BookSkeleton";
import Spinner from "../components/Spinner";
import SearchBar from "../components/SearchBar";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const PAGE_SIZE = 6;

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books once
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PRODUCTS_API}`
        );
        if (!res.ok) throw new Error("Failed to fetch books");

        const data = await res.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        console.error(err);
        setError("Could not load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Apply search + category filters
  const applyFilters = useCallback(
    (query, category) => {
      let filtered = [...books];

      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(q) ||
            book.author.toLowerCase().includes(q)
        );
      }

      if (category !== "All") {
        filtered = filtered.filter(
          (book) => book.category === category
        );
      }

      setFilteredBooks(filtered);
      setVisibleCount(PAGE_SIZE); // reset scroll
    },
    [books]
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(searchQuery, category);
  };

  // Load more books when scrolling
  const loadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    enabled: visibleCount < filteredBooks.length,
  });

  return (
    <div className="container">
      <h1 style={{ marginBottom: "1rem" }}>📚 BookBazaar</h1>

      {/* Search + Filter */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <SearchBar onSearch={handleSearch} />

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{
            padding: "0.6rem",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#fff",
          }}
        >
          <option value="All">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Finance">Finance</option>
          <option value="Self Help">Self Help</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <>
          <Spinner />
          <div className="grid">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        </>
      )}

      {/* Error */}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      )}

      {/* Books */}
      {!loading && !error && (
        <>
          {filteredBooks.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No books found.
            </p>
          ) : (
            <>
              <div className="grid">
                {filteredBooks
                  .slice(0, visibleCount)
                  .map((book) => (
                    <ProductCard key={book._id} book={book} />
                  ))}
              </div>

              {/* Sentinel */}
              <div ref={sentinelRef} style={{ height: 1 }} />

              {/* Loading more indicator */}
              {visibleCount < filteredBooks.length && (
                <Spinner />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

