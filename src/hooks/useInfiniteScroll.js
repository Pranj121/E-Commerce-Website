// src/hooks/useInfiniteScroll.js
import { useEffect, useRef } from "react";

/**
 * useInfiniteScroll
 * - onLoadMore: function called when sentinel becomes visible
 * - enabled: boolean (when false, observer is disconnected)
 * - rootMargin: intersection observer rootMargin string (e.g. "200px")
 *
 * Returns: { sentinelRef } — attach to a small <div ref={sentinelRef} />
 */
export default function useInfiniteScroll({ onLoadMore, enabled = true, root = null, rootMargin = "200px", threshold = 0.01 } = {}) {
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      // disconnect if previously created
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    const el = sentinelRef.current;
    if (!el) return;

    // create observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            try {
              onLoadMore && onLoadMore();
            } catch (err) {
              console.error("onLoadMore threw:", err);
            }
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observerRef.current.observe(el);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [onLoadMore, enabled, root, rootMargin, threshold]);

  return { sentinelRef };
}

