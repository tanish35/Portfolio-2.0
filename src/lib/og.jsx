import { SITE_HOST } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const ACCENT = "#E94B30";

export function OgCard({ eyebrow, title, subtitle, tags = [] }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #101013 55%, #060606 100%)",
        color: "#ffffff",
      }}
    >
      {/* top accent bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 9999,
            background: ACCENT,
            boxShadow: `0 0 24px ${ACCENT}`,
          }}
        />
        <div
          style={{
            fontSize: 30,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          {eyebrow}
        </div>
      </div>

      {/* headline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 38,
              color: "#cbd5e1",
              maxWidth: 960,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      {/* tags + footer */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {tags.slice(0, 6).map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 26,
                color: "#e2e8f0",
                padding: "8px 22px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 30,
            color: "#94a3b8",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", color: "#ffffff", fontWeight: 700 }}>
            Tanish Majumdar
          </div>
          <div style={{ display: "flex" }}>{SITE_HOST}</div>
        </div>
      </div>
    </div>
  );
}
