export default function ComingSoonPage() {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          🚧 Coming Soon
        </h1>
  
        <p style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "600px" }}>
          This feature or project page is currently under development.
          It will be available in a future update of PixelShield Agency.
        </p>
  
        <a
          href="/work"
          style={{
            marginTop: "2rem",
            padding: "12px 24px",
            backgroundColor: "#000",
            color: "#fff",
            borderRadius: "10px",
            textDecoration: "none",
            fontSize: "1rem",
          }}
        >
          ← Back to Projects
        </a>
      </div>
    );
  }
  