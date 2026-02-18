"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#0a0a0a",
          color: "#ededed",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "4rem", fontWeight: "bold", color: "#c8ff00" }}>500</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#a0a0a0", marginTop: "0.5rem" }}>
            We hit an unexpected error. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              backgroundColor: "#c8ff00",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
