"use client";

export default function WebsiteError({
  error,
  reset,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        background: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: 600, width: "100%", textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#fef2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}
        >
          <span style={{ fontSize: 28 }}>⚠️</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
          An error occurred while loading this page.
        </p>

        {/* Show actual error details for debugging */}
        <div
          style={{
            background: "#1f2937",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            textAlign: "left",
            overflow: "auto",
            maxHeight: 300,
          }}
        >
          <p style={{ color: "#f87171", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Error Details:
          </p>
          <p style={{ color: "#fca5a5", fontSize: 12, fontFamily: "monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {error?.message || "Unknown error"}
          </p>
          {error?.digest && (
            <p style={{ color: "#9ca3af", fontSize: 11, marginTop: 8 }}>
              Digest: {error.digest}
            </p>
          )}
          {error?.stack && (
            <pre style={{ color: "#9ca3af", fontSize: 10, marginTop: 8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {error.stack}
            </pre>
          )}
        </div>

        <button
          onClick={reset}
          style={{
            background: "#5B21B6",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
