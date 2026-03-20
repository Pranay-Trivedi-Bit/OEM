"use client";

import * as React from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
}

interface ScrollFAQAccordionProps {
  data: FAQItem[];
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export default function ScrollFAQAccordion({ data = [] }: ScrollFAQAccordionProps) {
  const [openItem, setOpenItem] = React.useState<number | null>(null);

  return (
    <div style={{ width: "100%", padding: "56px 0 48px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "#0694D1", marginBottom: 12,
        }}>
          <span style={{ width: 20, height: 2, background: "#0694D1", borderRadius: 2, display: "inline-block" }} />
          Frequently Asked Questions
        </span>
        <h2 style={{
          fontSize: "clamp(24px,2.8vw,34px)", fontWeight: 800, color: "#071e2e",
          margin: "0 0 10px", letterSpacing: "-0.025em", lineHeight: 1.2,
        }}>
          Got Questions? <span style={{ color: "#0694D1" }}>We've Got Answers.</span>
        </h2>
        <p style={{ fontSize: 15, color: "#6b8299", lineHeight: 1.65, margin: 0, maxWidth: 480 }}>
          Everything you need to know about Microsoft certification training with Koenig Solutions.
        </p>
      </div>

      {/* FAQ items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map((item) => {
          const isOpen = openItem === item.id;
          return (
            <div
              key={item.id}
              style={{
                borderRadius: 14,
                border: `1.5px solid ${isOpen ? "rgba(6,148,209,0.35)" : "rgba(6,148,209,0.1)"}`,
                background: isOpen ? "rgba(6,148,209,0.03)" : "#fff",
                overflow: "hidden",
                transition: "border-color 0.2s, background 0.2s",
                boxShadow: isOpen ? "0 4px 20px rgba(6,148,209,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {/* Question */}
              <button
                onClick={() => setOpenItem(isOpen ? null : item.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 16,
                  padding: "16px 20px", background: "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  {/* Number badge */}
                  <span style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8,
                    background: isOpen ? "#0694D1" : "rgba(6,148,209,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: isOpen ? "#fff" : "#0694D1",
                    transition: "all 0.2s", letterSpacing: 0,
                  }}>
                    {String(item.id).padStart(2, "0")}
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: isOpen ? 700 : 600,
                    color: isOpen ? "#071e2e" : "#1e3a4f",
                    lineHeight: 1.45, transition: "color 0.18s",
                  }}>
                    {item.question}
                  </span>
                </div>
                {/* Toggle icon */}
                <span style={{
                  flexShrink: 0, width: 30, height: 30, borderRadius: "50%",
                  border: `1.5px solid ${isOpen ? "#0694D1" : "#d5e5f0"}`,
                  background: isOpen ? "#0694D1" : "#f7f9fb",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isOpen ? "#fff" : "#7a9ab0",
                  fontSize: 16, fontWeight: 400, lineHeight: 1,
                  transition: "all 0.2s", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}>
                  +
                </span>
              </button>

              {/* Answer */}
              <div style={{
                maxHeight: isOpen ? 300 : 0,
                overflow: "hidden",
                transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <div style={{
                  padding: "0 20px 20px 60px",
                  fontSize: 14, color: "#4a6375", lineHeight: 1.75,
                }}>
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
