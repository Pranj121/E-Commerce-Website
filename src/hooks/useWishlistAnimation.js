// src/hooks/useWishlistAnimation.js
import { useCallback } from "react";

/**
 * Small helper to animate a heart/element by toggling `.wishlist-animate`.
 * Usage:
 *   const animate = useWishlistAnimation();
 *   // pass either a DOM element or a ref-like object { current: element }
 *   animate(domElement);
 *   // or
 *   animate({ current: domElement });
 *
 * duration (ms) controls fallback cleanup (default 420ms).
 */
export default function useWishlistAnimation(duration = 420) {
  return useCallback(
    (refLike) => {
      // support both { current: el } or an element directly
      const el = refLike && refLike.current ? refLike.current : refLike;
      if (!el || !(el instanceof HTMLElement)) return;

      // remove first so animation can restart on repeated clicks
      el.classList.remove("wishlist-animate");

      // force reflow to allow restarting the animation
      // eslint-disable-next-line no-unused-expressions
      void el.offsetWidth;

      el.classList.add("wishlist-animate");

      // cleanup function triggered on animationend
      const onEnd = () => {
        el.classList.remove("wishlist-animate");
        el.removeEventListener("animationend", onEnd);
      };
      el.addEventListener("animationend", onEnd);

      // safety fallback: remove class after `duration + 200` ms
      const timeoutId = window.setTimeout(() => {
        el.classList.remove("wishlist-animate");
        el.removeEventListener("animationend", onEnd);
      }, Math.max(300, duration + 200));

      // optional: return a cancel function (not required by caller)
      return () => {
        clearTimeout(timeoutId);
        el.classList.remove("wishlist-animate");
        el.removeEventListener("animationend", onEnd);
      };
    },
    [duration]
  );
}

