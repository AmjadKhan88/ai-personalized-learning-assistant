// components/WeakAreasTracker.js
"use client";

export default function WeakAreasTracker({ weakAreas, onSelectTopic }) {
  return (
    <div style={{ padding: "1rem", marginTop: "0.5rem" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.75rem", color: "#333" }}>
        🔍 Review These
      </h2>
      {!weakAreas || weakAreas.length === 0 ? (
        <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
          None yet — keep learning! 💪
        </p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {weakAreas.map((area, i) => (
              <li key={i}>
                <button
                  onClick={() => onSelectTopic(area)}
                  style={{
                    width: "100%", textAlign: "left",
                    padding: "0.6rem 0.85rem", borderRadius: "8px",
                    border: "2px solid #fde68a", background: "#fffbeb",
                    color: "#92400e", cursor: "pointer", fontSize: "0.85rem",
                    fontWeight: "500", transition: "all 0.15s"
                  }}
                >
                  ⚠️ {area}
                </button>
              </li>
            ))}
          </ul>
          <p style={{ color: "#aaa", fontSize: "0.75rem", marginTop: "0.5rem" }}>
            Click any topic to review it
          </p>
        </>
      )}
    </div>
  );
}