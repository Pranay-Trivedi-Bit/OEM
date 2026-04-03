/**
 * PricingTiersSection — Koenig Solutions Microsoft Training
 *
 * HOW TO INTEGRATE:
 * 1. Copy the CSS block from PRICING_CSS below into the main `CSS` template
 *    literal in MicrosoftLandingPage.jsx, just before the closing backtick.
 * 2. Add this import at the top of MicrosoftLandingPage.jsx:
 *    import PricingTiersSection from "./PricingSection";
 * 3. Render it in the App component JSX, between
 *    {/* UNIFIED CERT EXPLORER *\/} and {/* ENROLLMENT INSIGHTS *\/}:
 *    <PricingTiersSection onCTA={() => setModal(true)} />
 *
 * WHY THIS PLACEMENT:
 *   After the cert explorer, the visitor has just browsed courses and seen prices.
 *   Showing the packaging summary here consolidates intent and triggers the inquiry.
 */

import React from "react";

/* ── Inline CSS block — paste into the main CSS const ── */
export const PRICING_CSS = `
.pricing-sec { background: var(--light-bg); padding: 96px 0 80px; border-top: 1px solid #ebebeb; position: relative; overflow: hidden; }
.pricing-sec::before { content: ''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse 900px 400px at 50% 0%, rgba(6,148,209,0.06), transparent 70%); }
.pricing-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; position: relative; z-index: 1; }
.pricing-head { text-align: center; margin-bottom: 16px; }
.pricing-eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--blue); background: rgba(6,148,209,0.08); border: 1px solid rgba(6,148,209,0.2); padding: 4px 14px; border-radius: 20px; margin-bottom: 18px; }
.pricing-title { font-family: var(--display); font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; color: var(--light-text); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 14px; }
.pricing-title em { font-style: normal; color: var(--blue); }
.pricing-sub { font-size: 15px; color: var(--light-sub); max-width: 560px; margin: 0 auto 44px; line-height: 1.65; }
.pricing-anchor-strip { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 36px; flex-wrap: wrap; }
.pricing-anchor-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: var(--light-sub); background: #ffffff; border: 1px solid rgba(6,148,209,0.14); padding: 6px 14px; border-radius: 20px; }
.pricing-anchor-pill.featured-pill { color: var(--blue); background: rgba(6,148,209,0.06); border-color: rgba(6,148,209,0.25); }
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start; }
.pricing-card { background: #ffffff; border: 1.5px solid rgba(6,148,209,0.12); border-radius: 20px; padding: 32px 28px 28px; display: flex; flex-direction: column; position: relative; transition: box-shadow 0.28s, transform 0.28s, border-color 0.28s; }
.pricing-card:hover { box-shadow: 0 12px 40px rgba(6,148,209,0.10); transform: translateY(-3px); border-color: rgba(6,148,209,0.28); }
.pricing-card.featured { border-color: var(--blue); border-width: 2px; box-shadow: 0 8px 32px rgba(6,148,209,0.14); background: linear-gradient(160deg, #f0f8ff 0%, #ffffff 60%); }
.pricing-card.featured:hover { box-shadow: 0 16px 48px rgba(6,148,209,0.2); transform: translateY(-5px); }
.pricing-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: linear-gradient(90deg, #0694D1, #50c8f0); color: #fff; font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 16px; border-radius: 20px; white-space: nowrap; box-shadow: 0 3px 12px rgba(6,148,209,0.35); }
.pricing-card.enterprise { background: linear-gradient(160deg, #0b2840 0%, #071e2e 100%); border-color: rgba(6,148,209,0.25); }
.pricing-card.enterprise:hover { border-color: rgba(6,148,209,0.55); box-shadow: 0 16px 48px rgba(6,148,209,0.2); }
.pricing-card.enterprise .pricing-card-level { color: rgba(255,255,255,0.45); }
.pricing-card.enterprise .pricing-card-name { color: #ffffff; }
.pricing-card.enterprise .pricing-card-desc { color: rgba(255,255,255,0.55); }
.pricing-card.enterprise .pricing-divider { border-color: rgba(255,255,255,0.07); }
.pricing-card.enterprise .pricing-feature { color: rgba(255,255,255,0.75); }
.pricing-card.enterprise .pricing-check { color: #50e6ff; }
.pricing-card.enterprise .pricing-example-cert { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
.pricing-card.enterprise .pricing-esi-note { color: rgba(255,255,255,0.5); background: rgba(80,230,255,0.06); border-color: rgba(80,230,255,0.15); }
.pricing-card-level { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--light-sub); margin-bottom: 8px; }
.pricing-card-name { font-family: var(--display); font-size: 22px; font-weight: 800; color: var(--light-text); letter-spacing: -0.01em; line-height: 1.1; margin-bottom: 8px; }
.pricing-card-desc { font-size: 13px; color: var(--light-sub); line-height: 1.55; margin-bottom: 24px; }
.pricing-price-from { font-size: 11px; font-weight: 600; color: var(--light-sub); margin-bottom: 4px; }
.pricing-price-row { display: flex; align-items: flex-end; gap: 4px; margin-bottom: 6px; }
.pricing-price-curr { font-size: 18px; font-weight: 700; color: var(--light-sub); line-height: 1; margin-bottom: 7px; }
.pricing-card.enterprise .pricing-price-curr { color: rgba(255,255,255,0.45); }
.pricing-price-amount { font-family: var(--display); font-size: 40px; font-weight: 900; color: var(--light-text); letter-spacing: -0.03em; line-height: 1; }
.pricing-card.enterprise .pricing-price-amount { color: #ffffff; }
.pricing-price-unit { font-size: 11px; font-weight: 500; color: var(--light-sub); line-height: 1; margin-bottom: 7px; white-space: nowrap; }
.pricing-roi-callout { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600; color: #059669; background: rgba(5,150,105,0.07); border: 1px solid rgba(5,150,105,0.18); border-radius: 8px; padding: 5px 12px; margin-bottom: 22px; }
.pricing-card.enterprise .pricing-roi-callout { color: #50e6ff; background: rgba(80,230,255,0.07); border-color: rgba(80,230,255,0.18); }
.pricing-divider { border: none; border-top: 1px solid rgba(6,148,209,0.1); margin: 0 0 18px; }
.pricing-features { display: flex; flex-direction: column; gap: 9px; margin-bottom: 20px; flex: 1; }
.pricing-feature { display: flex; align-items: flex-start; gap: 8px; font-size: 12.5px; color: var(--light-text); line-height: 1.45; }
.pricing-check { color: var(--blue); flex-shrink: 0; margin-top: 1px; font-size: 13px; }
.pricing-example-certs { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 22px; }
.pricing-example-cert { font-size: 10.5px; font-weight: 700; color: var(--light-sub); background: rgba(6,148,209,0.06); border: 1px solid rgba(6,148,209,0.15); padding: 3px 9px; border-radius: 6px; }
.pricing-esi-note { display: flex; align-items: flex-start; gap: 7px; font-size: 11px; color: var(--light-sub); background: rgba(6,148,209,0.04); border: 1px solid rgba(6,148,209,0.12); border-radius: 10px; padding: 10px 12px; margin-bottom: 20px; line-height: 1.5; }
.pricing-esi-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
.pricing-cta { width: 100%; padding: 13px 20px; border-radius: 12px; font-family: var(--body); font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.22s; border: 2px solid var(--blue); background: transparent; color: var(--blue); margin-top: auto; }
.pricing-cta:hover { background: rgba(6,148,209,0.1); border-color: var(--blue-dark); transform: translateY(-1px); }
.pricing-card.featured .pricing-cta { background: var(--blue); color: #ffffff; border-color: var(--blue); }
.pricing-card.featured .pricing-cta:hover { background: var(--blue-dark); border-color: var(--blue-dark); }
.pricing-card.enterprise .pricing-cta { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
.pricing-card.enterprise .pricing-cta:hover { background: rgba(255,255,255,0.13); border-color: rgba(80,230,255,0.5); color: #fff; }
.pricing-footer-note { text-align: center; margin-top: 36px; font-size: 12px; color: var(--light-sub); display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
.pricing-footer-note .pfn-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--light-sub); opacity: 0.4; flex-shrink: 0; }
@media (max-width: 960px) { .pricing-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; } .pricing-card.featured { order: -1; } }
@media (max-width: 640px) { .pricing-inner { padding: 0 20px; } .pricing-sec { padding: 64px 0 56px; } .pricing-price-amount { font-size: 34px; } }
`;

/* ── Check icon ── */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.12" />
    <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   TIER DATA
   Designed with three anchoring principles:
   1. Expert tier shown last = anchors high, makes Associate look moderate
   2. Associate tier highlighted as "Most Popular" = decoy effect
   3. Enterprise shown as a dark premium card = premium framing
   Price points use $795 / $1,095–$1,295 / $1,595 from context doc
───────────────────────────────────────────────────────────────────*/
const PRICING_TIERS = [
  {
    cls: "",
    level: "Fundamentals",
    name: "Foundation",
    desc: "For IT pros exploring Azure, AI, or Microsoft 365. No prerequisites — get certified in as little as 1–2 days.",
    priceFrom: "795",
    priceUnit: "per person · USD",
    roi: "Pays back in < 1 month of salary boost",
    features: [
      "AZ-900, AI-900, SC-900, MS-900 & more",
      "1–2 day instructor-led sessions",
      "MCT-certified trainer included",
      "Official Microsoft MOC courseware",
      "Live Online or 1-on-1 format",
      "95% exam pass rate guarantee",
    ],
    exampleCerts: ["AZ-900", "AI-900", "SC-900", "MS-900", "PL-900"],
    cta: "Enquire for Fundamentals",
    featured: false,
    enterprise: false,
  },
  {
    cls: "featured",
    level: "Associate — Most Popular",
    name: "Professional",
    desc: "For practicing cloud engineers, admins and security teams. The sweet spot: deepest ROI, highest employer demand.",
    priceFrom: "1,095",
    priceUnit: "per person · USD",
    roi: "Avg. 26% salary boost · 91% employer preference",
    features: [
      "AZ-104, AI-102, SC-300, PL-300 & 30+ more",
      "3–5 day instructor-led programs",
      "MCT-certified trainer included",
      "Official Microsoft MOC courseware",
      "Live Online, 1-on-1, or Classroom",
      "Flexi schedule — start any day",
      "95% exam pass rate guarantee",
      "Exam prep + practice sessions",
    ],
    exampleCerts: ["AZ-104", "AI-102", "SC-300", "AZ-500", "PL-300"],
    cta: "Enquire for Associate",
    featured: true,
    enterprise: false,
  },
  {
    cls: "enterprise",
    level: "Enterprise / Expert",
    name: "Enterprise",
    desc: "For teams and organisations needing Expert-level certification, volume pricing, and on-site delivery.",
    priceFrom: null, // custom pricing
    priceUnit: null,
    roi: "EA & ESI credits accepted — may cost you $0 out of pocket",
    features: [
      "AZ-305, AZ-400, SC-100, MS-102 & more",
      "Custom schedule — any format, any location",
      "Fly-Me-A-Trainer on-site delivery",
      "Microsoft EA / ESI / TSPv credits accepted",
      "Volume & group discounts available",
      "Dedicated account manager",
      "Team dashboards & progress tracking",
      "95% exam pass rate guarantee",
    ],
    exampleCerts: ["AZ-305", "AZ-400", "SC-100", "MS-102", "DP-100"],
    esiNote: "Already have Microsoft Enterprise Agreement credits? Your Koenig training may cost $0 out of pocket. We accept TSPv and ESI credits from Microsoft.",
    cta: "Request Enterprise Quote",
    featured: false,
    enterprise: true,
  },
];

export default function PricingTiersSection({ onCTA }) {
  return (
    <section className="pricing-sec" id="pricing">
      <div className="pricing-inner">

        {/* Section header */}
        <div className="pricing-head">
          <div className="pricing-eyebrow">Transparent Pricing</div>
          <h2 className="pricing-title">
            Training Packages for<br /><em>Every Microsoft Career Stage</em>
          </h2>
          <p className="pricing-sub">
            All prices are indicative. Final pricing depends on format, duration, and group size.
            Enterprise customers may pay $0 with existing Microsoft EA credits.
          </p>
        </div>

        {/* Trust anchor strip — social proof above cards */}
        <div className="pricing-anchor-strip">
          <span className="pricing-anchor-pill">
            <span>🏆</span> Microsoft Partner of the Year FY24
          </span>
          <span className="pricing-anchor-pill featured-pill">
            <span>✓</span> 95% Exam Pass Rate
          </span>
          <span className="pricing-anchor-pill">
            <span>👥</span> 500,000+ Certified Professionals
          </span>
          <span className="pricing-anchor-pill">
            <span>🌍</span> 50+ Countries · Start Any Day
          </span>
        </div>

        {/* 3-column tier grid */}
        <div className="pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card${tier.featured ? " featured" : ""}${tier.enterprise ? " enterprise" : ""}`}
            >
              {/* "Most Popular" badge on featured card */}
              {tier.featured && (
                <div className="pricing-badge">Most Popular</div>
              )}

              {/* Card header */}
              <div className="pricing-card-level">{tier.level}</div>
              <div className="pricing-card-name">{tier.name}</div>
              <p className="pricing-card-desc">{tier.desc}</p>

              {/* Price block */}
              {tier.priceFrom ? (
                <>
                  <div className="pricing-price-from">Starting from</div>
                  <div className="pricing-price-row">
                    <span className="pricing-price-curr">$</span>
                    <span className="pricing-price-amount">{tier.priceFrom}</span>
                  </div>
                  <div className="pricing-price-unit">{tier.priceUnit}</div>
                </>
              ) : (
                <>
                  <div className="pricing-price-from">Custom Pricing</div>
                  <div className="pricing-price-row">
                    <span className="pricing-price-amount" style={{ fontSize: 28 }}>Contact Us</span>
                  </div>
                  <div className="pricing-price-unit" style={{ marginBottom: 7 }}>&nbsp;</div>
                </>
              )}

              {/* ROI micro-callout */}
              <div className="pricing-roi-callout">
                <span>↑</span>
                <span>{tier.roi}</span>
              </div>

              <hr className="pricing-divider" />

              {/* Feature list */}
              <ul className="pricing-features" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {tier.features.map((f) => (
                  <li key={f} className="pricing-feature">
                    <span className="pricing-check"><CheckIcon /></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Example cert codes */}
              <div className="pricing-example-certs">
                {tier.exampleCerts.map((c) => (
                  <span key={c} className="pricing-example-cert">{c}</span>
                ))}
              </div>

              {/* ESI note on enterprise card */}
              {tier.esiNote && (
                <div className="pricing-esi-note">
                  <span className="pricing-esi-icon">💳</span>
                  <span>{tier.esiNote}</span>
                </div>
              )}

              {/* CTA button */}
              <button className="pricing-cta" onClick={onCTA}>
                {tier.cta} →
              </button>
            </div>
          ))}
        </div>

        {/* Footer footnote */}
        <div className="pricing-footer-note">
          <span>All training includes official Microsoft MOC courseware</span>
          <span className="pfn-dot" />
          <span>MCT-certified instructors on every session</span>
          <span className="pfn-dot" />
          <span>Microsoft exam fee ($165) not included</span>
          <span className="pfn-dot" />
          <span>Group & enterprise discounts available</span>
        </div>

      </div>
    </section>
  );
}
