// src/ErrorCatcher.jsx
import React from "react";

export default class ErrorCatcher extends React.Component {
  state = { error: null, info: null };

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { error };
  }

  componentDidCatch(error, info) {
    // You can send this to a logging service here
    console.error("ErrorCatcher caught error:", error);
    console.error("ErrorCatcher info:", info);
    this.setState({ info });
  }

  // If children change (for example routing changed), clear previous error
  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.children !== this.props.children) {
      this.setState({ error: null, info: null });
    }
  }

  handleTryAgain = () => {
    this.setState({ error: null, info: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error, info } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <div
        role="alert"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          color: "#0b1220",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: 920, width: "100%", borderRadius: 12, padding: 20, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
          <h2 style={{ marginTop: 0, color: "#b91c1c" }}>Something went wrong</h2>

          <p style={{ color: "#374151" }}>
            The app encountered an unexpected error. You can try reloading the page or try again.
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 16 }}>
            <button onClick={this.handleTryAgain} style={{ padding: ".5rem .9rem", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: "#0ea5e9", color: "#fff", fontWeight: 700 }}>
              Try again
            </button>
            <button onClick={this.handleReload} style={{ padding: ".5rem .9rem", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: "#111827", color: "#fff", fontWeight: 700 }}>
              Reload page
            </button>
          </div>

          <details style={{ whiteSpace: "pre-wrap", background: "#f3f4f6", padding: 12, borderRadius: 8, color: "#111827" }}>
            <summary style={{ cursor: "pointer", fontWeight: 700 }}>Error details (click to expand)</summary>
            <div style={{ marginTop: 8 }}>
              <strong>Message:</strong>
              <div>{String(error)}</div>

              {info && (
                <>
                  <strong style={{ display: "block", marginTop: 8 }}>Stack / component trace:</strong>
                  <pre style={{ overflowX: "auto", margin: 0 }}>{info.componentStack}</pre>
                </>
              )}
            </div>
          </details>

          <p style={{ color: "#6b7280", marginTop: 12 }}>
            Check the browser console and terminal for the full stack trace. If this keeps happening, please copy the error and open an issue with the details.
          </p>
        </div>
      </div>
    );
  }
}

