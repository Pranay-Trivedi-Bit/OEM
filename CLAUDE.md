# Koenig Solutions — Microsoft Training Landing Page

## Project
Single-page React landing page for Koenig Solutions Microsoft certification training.

## Stack
- React 18, single JSX file (no TypeScript, no Tailwind)
- CSS-in-JS via template literal `CSS` const injected via `<style>`
- All assets base64-embedded (logo PNG) or inline SVG — zero external image deps

## Main file
`src/MicrosoftLandingPage.jsx` — all components, CSS, and logic in one file.

## Dev
```bash
npm install
npm start        # opens localhost:3000
npm run build    # production build → build/
```

## Brand
- Primary: #0694D1 (blue), #093148 (navy), #071e2e (ink)
- Font: Plus Jakarta Sans (Google Fonts CDN)
- Logo: base64-embedded PNG in nav

## Key sections (top → bottom)
1. Fixed Nav — logo + MS Partner badge (left) | Request More Information CTA (right)
2. Hero — headline + LeadForm (3-step)
3. Ticker — scrolling credentials
4. Stats strip — animated counters
5. Companies marquee — dual row, 20 brand SVG logos
6. Features — 3-col grid
7. Cert Paths — tabbed sidebar
8. Cert Showcase — sample cert with unlock flow
9. Testimonials — drag carousel
10. Awards Slider — 5 Microsoft awards
11. Bottom CTA + Footer
12. Sticky FAB — Request More Info

## Do NOT change
- LeadForm step logic and validation
- generateCertPDF() canvas function
- Brand colours (use CSS vars)
