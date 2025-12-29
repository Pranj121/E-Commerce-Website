import "./BookSkeleton.css";

export default function BookSkeleton() {
  return (
    <div
      className="skeleton-card"
      aria-hidden="true"
      role="status"
    >
      {/* Image placeholder */}
      <div className="skeleton-image"></div>

      {/* Text placeholders */}
      <div className="skeleton-text title"></div>
      <div className="skeleton-text author"></div>
      <div className="skeleton-text category"></div>

      {/* Footer placeholders */}
      <div className="skeleton-footer">
        <div className="skeleton-price"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
}

