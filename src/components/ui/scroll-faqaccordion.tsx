"use client";

import * as React from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category?: string;
}

interface ScrollFAQAccordionProps {
  data: FAQItem[];
  className?: string;
}

const CATEGORIES = ["All", "Certifications", "Training", "Pricing", "Enterprise"];

const CATEGORY_MAP: Record<number, string> = {
  1: "Certifications", 2: "Certifications", 3: "Certifications",
  4: "Training", 5: "Training",
  6: "Pricing", 7: "Pricing", 8: "Enterprise",
  9: "Certifications", 10: "Training",
};

export default function ScrollFAQAccordion({ data = [] }: ScrollFAQAccordionProps) {
  const [openItem, setOpenItem] = React.useState<number | null>(1);
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filtered = activeCategory === "All"
    ? data
    : data.filter(item => CATEGORY_MAP[item.id] === activeCategory);

  const half = Math.ceil(filtered.length / 2);
  const col1 = filtered.slice(0, half);
  const col2 = filtered.slice(half);

  return (
    <section className="faq-resp-sec" style={{ background: "#f8fafc", borderTop: "1px solid rgba(6,148,209,0.1)" }}>
      <style>{`
        .faq-resp-sec { padding: clamp(40px,7vw,80px) clamp(16px,4vw,48px); }
        .faq-two-col  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 48px; }
        .faq-cta-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
          background: linear-gradient(135deg,#071e2e 0%,#093148 100%);
          border-radius: 20px; padding: 28px 36px;
          box-shadow: 0 8px 32px rgba(6,148,209,0.15);
        }
        .faq-cta-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        @media(max-width:768px){
          .faq-two-col  { grid-template-columns: 1fr; }
          .faq-cta-bottom { flex-direction: column; align-items: stretch; padding: 20px; border-radius: 14px; }
          .faq-cta-btns { flex-direction: column; }
          .faq-cta-btns a, .faq-cta-btns button { width: 100%; justify-content: center; box-sizing: border-box; }
        }
        @media(max-width:480px){
          .faq-resp-sec { padding: 40px 14px; }
          .faq-two-col  { margin-bottom: 32px; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#0694D1",
            background: "rgba(6,148,209,0.08)", border: "1px solid rgba(6,148,209,0.2)",
            padding: "5px 14px", borderRadius: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0694D1", display: "inline-block" }} />
            FAQ
          </span>
          <h2 style={{
            fontSize: "clamp(22px,3vw,38px)", fontWeight: 800, color: "#071e2e",
            margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.2,
          }}>
            Got Questions?{" "}
            <em style={{
              fontStyle: "normal",
              background: "linear-gradient(90deg, #0694D1, #50e6ff)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              We've Got Answers.
            </em>
          </h2>
          <p style={{ fontSize: 15, color: "#6b8299", lineHeight: 1.65, margin: "0 auto", maxWidth: 500 }}>
            Everything you need to know about Microsoft certification training with Koenig Solutions.
          </p>
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenItem(null); }}
              style={{
                padding: "7px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                background: activeCategory === cat ? "#0694D1" : "#fff",
                color: activeCategory === cat ? "#fff" : "#4a6375",
                border: `1.5px solid ${activeCategory === cat ? "#0694D1" : "rgba(6,148,209,0.15)"}`,
                boxShadow: activeCategory === cat ? "0 4px 12px rgba(6,148,209,0.25)" : "none",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Two-column FAQ grid → single column on mobile */}
        <div className="faq-two-col">
          {[col1, col2].map((col, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.map(item => {
                const isOpen = openItem === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: 14,
                      border: `1.5px solid ${isOpen ? "rgba(6,148,209,0.4)" : "rgba(6,148,209,0.1)"}`,
                      background: "#fff",
                      overflow: "hidden",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      boxShadow: isOpen ? "0 6px 24px rgba(6,148,209,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
                    }}
                  >
                    <button
                      onClick={() => setOpenItem(isOpen ? null : item.id)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: 12,
                        padding: "16px 18px", background: "transparent",
                        border: "none", cursor: "pointer", textAlign: "left",
                        fontFamily: "inherit",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                        <span style={{
                          flexShrink: 0, width: 30, height: 30, borderRadius: 9,
                          background: isOpen ? "#0694D1" : "rgba(6,148,209,0.07)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 800,
                          color: isOpen ? "#fff" : "#0694D1",
                          transition: "all 0.2s",
                        }}>
                          {String(item.id).padStart(2, "0")}
                        </span>
                        <span style={{
                          fontSize: 13.5, fontWeight: isOpen ? 700 : 600,
                          color: isOpen ? "#071e2e" : "#1e3a4f",
                          lineHeight: 1.45, transition: "color 0.18s",
                        }}>
                          {item.question}
                        </span>
                      </div>
                      <span style={{
                        flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
                        border: `1.5px solid ${isOpen ? "#0694D1" : "#d5e5f0"}`,
                        background: isOpen ? "#0694D1" : "#f0f6fb",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: isOpen ? "#fff" : "#7a9ab0",
                        fontSize: 15, lineHeight: 1,
                        transition: "all 0.2s",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}>
                        +
                      </span>
                    </button>

                    <div style={{
                      maxHeight: isOpen ? 300 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1)",
                    }}>
                      <div style={{
                        padding: "14px 18px 18px 60px",
                        fontSize: 13.5, color: "#4a6375", lineHeight: 1.75,
                        borderTop: "1px solid rgba(6,148,209,0.08)",
                      }}>
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="faq-cta-bottom">
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              Still have questions?
            </div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)" }}>
              Talk to a Microsoft certification advisor — free, no obligation.
            </div>
          </div>
          <div className="faq-cta-btns">
            <a
              href="tel:+18005551234"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 22px", borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,0.2)",
                color: "#fff", fontSize: 13.5, fontWeight: 600,
                textDecoration: "none", background: "rgba(255,255,255,0.08)",
                transition: "background 0.2s",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.84a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call Us
            </a>
            <button
              onClick={() => {
                const el = document.getElementById("lead-form") || document.querySelector(".lf-wrap");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 22px", borderRadius: 10,
                background: "#0694D1", border: "none",
                color: "#fff", fontSize: 13.5, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(6,148,209,0.35)",
                transition: "background 0.2s, transform 0.15s",
              }}
            >
              Talk to an Advisor →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
