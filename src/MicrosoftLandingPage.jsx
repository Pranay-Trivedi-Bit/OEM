import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import createGlobe from "cobe";
import { motion, animate, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Award, Shield, Cloud, Sparkles, TrendingUp, Download, CheckCircle } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

/* ─────────────────────────────────────────────
   KOENIG × MICROSOFT — HIGH-CONVERTING LANDING PAGE
   Aesthetic: Refined dark-luxury B2B with electric accents
   Font: DM Sans + Bebas Neue display
   Conversion focus: urgency, social proof, progressive lead form
───────────────────────────────────────────── */

const CSS = `
/* ══════════════════════════════════════════════════════
   GT WALSHEIM PRO — Koenig's official brand font
   Loaded from /public/GT/ (local TTF files)
   Fallback: system-ui → sans-serif
══════════════════════════════════════════════════════ */
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-UltraLight.ttf') format('truetype');
  font-weight: 200; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-Thin.ttf') format('truetype');
  font-weight: 100; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-Light.ttf') format('truetype');
  font-weight: 300; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-Regular.ttf') format('truetype');
  font-weight: 400; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-Medium.ttf') format('truetype');
  font-weight: 500; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-Bold.ttf') format('truetype');
  font-weight: 700; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-UltraBold.ttf') format('truetype');
  font-weight: 800; font-style: normal; font-display: swap;
}
@font-face {
  font-family: 'GT Walsheim Pro';
  src: url('/GT/GTWalsheimPro-Black.ttf') format('truetype');
  font-weight: 900; font-style: normal; font-display: swap;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* ── Koenig Brand Primary Palette ── */
  --ink: #071e2e;        /* darkest navy — hero / deep sections */
  --ink-mid: #0b2840;    /* mid navy — alternating dark sections */
  --ink2: #093148;       /* brand navy — lighter dark sections */
  --navy: #093148;       /* Koenig primary dark */
  --light-bg: #f0f5fb;   /* light gray — odd light sections */
  --light-white: #ffffff; /* pure white — even light sections */
  --light-text: #071e2e; /* dark text on light sections */
  --light-sub: #4a6375;  /* muted text on light sections */
  --light-border: rgba(6,148,209,0.12); /* subtle border on light sections */
  --light-card: #ffffff; /* card bg on light-gray sections */
  --light-card-border: rgba(6,148,209,0.14);
  --blue: #0694D1;       /* Koenig primary blue */
  --blue-dark: #076D9D;  /* hover state */
  --charcoal: #465058;   /* logo/heading text colour */
  --sky: #45B0E1;        /* lighter blue accent */
  --teal: #0F9ED5;       /* brand secondary blue */
  --amber: #f59e0b;      /* stars */
  --red: #ef4444;
  --white: #ffffff;
  --off: #F0FAFF;        /* brand light bg tint */
  --sl: rgba(255,255,255,0.5);
  --sl2: rgba(255,255,255,0.12);
  --sl3: rgba(255,255,255,0.06);
  /* ── Brand Font: SF Pro Text (Apple system) → Inter fallback ── */
  --display: "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, 'Inter', "Helvetica Neue", sans-serif;
  --body: "SF Pro Text", -apple-system, BlinkMacSystemFont, 'Inter', "Helvetica Neue", sans-serif;
  --r8: 8px; --r12: 12px; --r16: 16px; --r24: 24px;
}

/* ══════════════════════════════════════════════════════
   GLOBAL TYPE SCALE — Inter (Apple SF Pro reference)
   H1  96px / 700  (-0.015em ls, 1.0 lh)   — hero display
   H2  64px / 700  (-0.009em ls, 1.05 lh)  — section titles
   H3  40px / 700  (-0.005em ls, 1.1 lh)   — subsection / card heading
   H4  24px / 600  (0 ls,        1.25 lh)  — label / card title
   p   17px / 400  (0 ls,        1.52 lh)  — body copy
   sm  14px / 400  (0 ls,        1.43 lh)  — secondary body
   xs  12px / 500  (0.04em ls,   1.33 lh)  — captions, pills
══════════════════════════════════════════════════════ */
html { scroll-behavior: smooth; }
body {
  font-family: var(--body);
  font-size: 14px; font-weight: 400; line-height: 1.52;
  background: #ffffff; color: var(--light-text); overflow-x: clip;
  -webkit-font-smoothing: subpixel-antialiased; -moz-osx-font-smoothing: auto;
  font-feature-settings: "kern" 1, "liga" 1;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--display);
  color: var(--light-text);
}

/* H1 — Hero / page-level headline */
h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.0;
}

/* H2 — Section titles */
h2 {
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.009em;
  line-height: 1.05;
}

/* H3 — Card / subsection */
h3 {
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 700;
  letter-spacing: -0.005em;
  line-height: 1.1;
}

/* H4 — Labels, card titles */
h4 {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1.25;
}

/* Body paragraph */
p {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.52;
  color: var(--light-sub);
}

/* Utility size classes */
.text-xs  { font-size: 12px; font-weight: 500; line-height: 1.33; letter-spacing: 0.04em; }
.text-sm  { font-size: 14px; font-weight: 400; line-height: 1.43; }
.text-base{ font-size: 14px; font-weight: 400; line-height: 1.52; }
.text-lg  { font-size: 16px; font-weight: 500; line-height: 1.47; }
.text-xl  { font-size: 24px; font-weight: 600; line-height: 1.3; }
.fw-thin  { font-weight: 100; }
.fw-light { font-weight: 300; }
.fw-reg   { font-weight: 400; }
.fw-med   { font-weight: 500; }
.fw-bold  { font-weight: 700; }
.fw-xbold { font-weight: 800; }
.fw-black { font-weight: 900; }

/* ── SCROLL PROGRESS BAR ── */
#scroll-progress {
  position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
  background: linear-gradient(90deg, var(--blue), #50e6ff, var(--blue));
  background-size: 200% 100%;
  animation: shimmerGrad 2s linear infinite;
  transition: width 0.1s linear;
  pointer-events: none;
}
@keyframes shimmerGrad { 0%{background-position:0% 0%} 100%{background-position:200% 0%} }

/* ── CURSOR GLOW ── */
#cursor-glow {
  position: fixed; pointer-events: none; z-index: 9998;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(6,148,209,0.07) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
  will-change: transform;
}

/* ── AURORA HERO BACKGROUND ── */
@keyframes aurora1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.1)} 66%{transform:translate(-40px,30px) scale(0.95)} }
@keyframes aurora2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-50px,60px) scale(1.05)} 66%{transform:translate(40px,-50px) scale(1.1)} }
@keyframes aurora3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,40px) scale(1.08)} }
.aurora-orb {
  position: absolute; border-radius: 50%; filter: blur(80px);
  pointer-events: none; mix-blend-mode: screen;
}
.aurora-1 { width: 600px; height: 600px; background: rgba(6,148,209,0.18); top: -100px; left: -150px; animation: aurora1 12s ease-in-out infinite; }
.aurora-2 { width: 500px; height: 500px; background: rgba(80,230,255,0.1); top: 30%; right: -100px; animation: aurora2 15s ease-in-out infinite; }
.aurora-3 { width: 400px; height: 400px; background: rgba(7,109,157,0.12); bottom: -50px; left: 40%; animation: aurora3 10s ease-in-out infinite; }

/* ── FLOATING PARTICLES ── */
@keyframes floatDot { 0%{transform:translateY(0) scale(1);opacity:0.4} 50%{transform:translateY(-20px) scale(1.2);opacity:0.7} 100%{transform:translateY(0) scale(1);opacity:0.4} }
.particle { position: absolute; border-radius: 50%; pointer-events: none; background: var(--blue); animation: floatDot linear infinite; }

/* ── TYPEWRITER ── */
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
.typewriter-cursor { display: inline-block; width: 3px; height: 1em; background: var(--blue); margin-left: 3px; vertical-align: text-bottom; animation: blink 1s step-end infinite; border-radius: 1px; }

/* ── ANIMATED GRADIENT BORDER BUTTONS ── */
.btn-glow {
  position: relative; overflow: hidden;
  background: var(--blue); color: white; border: none; cursor: pointer;
  font-family: var(--body); font-weight: 700; border-radius: var(--r8);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-glow::before {
  content: ''; position: absolute; inset: -2px; border-radius: inherit;
  background: linear-gradient(90deg, #0694D1, #50e6ff, #0078d4, #50e6ff, #0694D1);
  background-size: 300% 100%;
  animation: borderSpin 3s linear infinite;
  z-index: -1; border-radius: calc(var(--r8) + 2px);
}
@keyframes borderSpin { 0%{background-position:0% 50%} 100%{background-position:300% 50%} }
.btn-glow:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 40px rgba(6,148,209,0.5); }

/* ── SHIMMER SKELETON ── */
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(6,148,209,0.08) 50%, rgba(255,255,255,0.03) 75%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* ── MAGNETIC BUTTON EFFECT ── */
.magnetic { transition: transform 0.3s cubic-bezier(0.23,1,0.32,1); }

/* ══════════════════════════════════════════════
   SCROLL-REVEAL  —  IntersectionObserver system
   Base state: hidden. JS adds .in when in-viewport.
   data-delay="N" overrides per-element stagger ms.
══════════════════════════════════════════════ */
.reveal       { opacity: 0; transform: translateY(28px); }
.reveal-left  { opacity: 0; transform: translateX(-36px); }
.reveal-right { opacity: 0; transform: translateX(36px); }
.reveal-scale { opacity: 0; transform: scale(0.9) translateY(16px); }

.reveal,
.reveal-left,
.reveal-right,
.reveal-scale {
  will-change: opacity, transform;
  transition: opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
              transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal.in,
.reveal-left.in,
.reveal-right.in,
.reveal-scale.in {
  opacity: 1;
  transform: none;
}

/* ── GLOWING CARD BORDERS ── */
.glow-card {
  position: relative; overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s;
}
.glow-card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(6,148,209,0.15) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.3s; pointer-events: none;
}
.glow-card:hover::after { opacity: 1; }
.glow-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,148,209,0.2); }

/* ── ANIMATED GRADIENT TEXT ── */
@keyframes gradText { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
.grad-text {
  background: linear-gradient(135deg, #0694D1, #50e6ff, #ffffff, #0694D1);
  background-size: 300% 300%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradText 4s ease infinite;
}

/* ── PULSING DOT ── */
@keyframes pingRing { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
.ping-ring {
  position: absolute; inset: 0; border-radius: 50%;
  background: var(--blue); animation: pingRing 1.5s ease-out infinite;
}

/* ── NUMBER COUNTER POP ── */
@keyframes countPop { 0%{transform:scale(1)} 50%{transform:scale(1.08)} 100%{transform:scale(1)} }
.count-pop { animation: countPop 0.3s ease; }

/* ── TICKER PAUSE ON HOVER ── */
.ticker:hover .ticker-track { animation-play-state: paused; }

/* ── MATRIX RAIN CANVAS ── */
#matrix-canvas { position: absolute; inset: 0; opacity: 0.07; pointer-events: none; z-index: 0; width: 100%; height: 100%; }

/* ── GLITCH TEXT ── */
@keyframes glitch1 { 0%,100%{clip-path:inset(0 0 95% 0);transform:translate(-2px,0)} 20%{clip-path:inset(30% 0 50% 0);transform:translate(2px,0)} 60%{clip-path:inset(80% 0 5% 0);transform:translate(1px,0)} }
@keyframes glitch2 { 0%,100%{clip-path:inset(50% 0 30% 0);transform:translate(2px,0)} 50%{clip-path:inset(70% 0 10% 0);transform:translate(-1px,0)} }
.glitch { position: relative; }
.glitch::before,.glitch::after { content: attr(data-text); position: absolute; inset: 0; pointer-events: none; white-space: nowrap; overflow: hidden; }
.glitch::before { color: rgba(80,230,255,0.4); animation: glitch1 4s infinite linear; }
.glitch::after { color: rgba(255,45,85,0.3); animation: glitch2 4s infinite linear; }

/* ── HOLOGRAPHIC CARD ── */
@keyframes holoShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
.holo-card { position: relative; overflow: hidden; transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s; }
.holo-card::before { content: ''; position: absolute; inset: 0; opacity: 0; background: linear-gradient(135deg, transparent 20%, rgba(80,230,255,0.06) 35%, rgba(6,148,209,0.1) 50%, rgba(255,255,255,0.04) 65%, transparent 80%); background-size: 200% 200%; animation: holoShift 3s ease infinite; transition: opacity 0.3s; pointer-events: none; border-radius: inherit; z-index: 1; }
.holo-card:hover::before { opacity: 1; }

/* ── CIRCUIT BOARD PATTERN ── */
.circuit-bg { background-image: linear-gradient(rgba(6,148,209,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,148,209,0.04) 1px, transparent 1px); background-size: 40px 40px; }

/* ── SCANLINE OVERLAY ── */
.scanlines { position: relative; }
.scanlines::after { content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 1; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px); }

/* ── NEON GLOW TEXT ── */
.neon-text { text-shadow: 0 0 10px rgba(6,148,209,0.8), 0 0 20px rgba(6,148,209,0.5), 0 0 40px rgba(6,148,209,0.3); }

/* ── HEX GRID BACKGROUND ── */
@keyframes hexPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
.hex-bg { position: relative; overflow: hidden; }
.hex-bg::after { content: ''; position: absolute; inset: -20px; pointer-events: none; z-index: 0; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z' fill='none' stroke='%230694D1' stroke-width='0.4' opacity='0.3'/%3E%3Cpath d='M28 36 L56 52 L56 84 L28 100 L0 84 L0 52 Z' fill='none' stroke='%230694D1' stroke-width='0.4' opacity='0.3'/%3E%3C/svg%3E"); background-size: 56px 100px; animation: hexPulse 6s ease-in-out infinite; }

/* ── TERMINAL CARD STYLE ── */
.terminal-card { background: #060d14; border: 1px solid rgba(6,148,209,0.25); border-radius: 12px; position: relative; overflow: hidden; }
.terminal-header { position: relative; z-index: 2; display: flex; align-items: center; gap: 6px; padding: 10px 14px 8px; border-bottom: 1px solid rgba(6,148,209,0.12); background: rgba(6,148,209,0.04); }
.terminal-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.terminal-title { font-size: 11px; color: rgba(255,255,255,0.3); margin-left: 6px; font-family: monospace; letter-spacing: 1px; }

/* ── CERT CODE BADGES ── */
.cert-code { font-family: 'SF Mono','Fira Code','Courier New',monospace; font-size: 10px; font-weight: 700; background: rgba(6,148,209,0.12); color: #50e6ff; border: 1px solid rgba(80,230,255,0.2); border-radius: 4px; padding: 2px 7px; letter-spacing: 0.5px; display: inline-block; }
.cert-name { font-size: 13px; font-weight: 600; color: var(--white); margin-bottom: 6px; line-height: 1.4; }

/* ── LIVE DOT ── */
@keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,217,100,0.5)} 70%{box-shadow:0 0 0 6px rgba(16,217,100,0)} }
.live-dot { width: 7px; height: 7px; border-radius: 50%; background: #10d964; animation: livePulse 2s infinite; display: inline-block; flex-shrink: 0; }

/* ── TICKER NEON ── */
.ticker-item { font-family: 'SF Mono','Courier New',monospace; font-size: 12px; letter-spacing: 1px; color: rgba(80,230,255,0.8); font-weight: 600; }
.ticker-dot { background: #0694D1; box-shadow: 0 0 6px rgba(6,148,209,0.8); }
.ticker::before,.ticker::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
.ticker::before { left: 0; background: linear-gradient(90deg, rgba(4,10,18,1), transparent); }
.ticker::after { right: 0; background: linear-gradient(-90deg, rgba(4,10,18,1), transparent); }

/* ── SEC-LABEL TECH ── */
.sec-label { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--blue); margin-bottom: 16px; font-family: 'SF Mono','Courier New',monospace; }
.sec-label::before { content: '//'; color: rgba(6,148,209,0.5); margin-right: 2px; font-size: 10px; }
.sec-label::after { content: ''; display: block; width: 32px; height: 1px; background: var(--blue); opacity: 0.5; }

/* ── FEAT ICON HEX ── */
.feat-icon { width: 48px; height: 48px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%); background: rgba(6,148,209,0.15); border: none; padding: 10px; transition: all 0.3s; }
.feat-card:hover .feat-icon { background: rgba(6,148,209,0.3); filter: drop-shadow(0 0 8px rgba(6,148,209,0.5)); }

/* ── TEST CARD GLASS ── */
.test-card { background: rgba(6,20,35,0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; min-width: 360px; max-width: 380px; flex-shrink: 0; position: relative; overflow: hidden; transition: transform 0.3s, border-color 0.3s; }
.test-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(6,148,209,0.5), transparent); }
.test-card:hover { transform: translateY(-4px); border-color: rgba(6,148,209,0.25); }

/* ── BOTTOM CTA TECH ── */
.bottom-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 800px 400px at 50% 50%, rgba(6,148,209,0.08) 0%, transparent 70%); pointer-events: none; }

/* ══════════════════════════════════════════════
   SHINY BUTTON — adapted from emerald-ui
   Brand: #0694D1 (blue) · #50e6ff (sky) · #071e2e (ink)
   Core trick: background-size:280% auto + background-position transition
   No clsx / tailwind-merge / TypeScript needed
══════════════════════════════════════════════ */
.shiny-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 48px; padding: 0 32px;
  border: none; border-radius: 8px;
  font-family: var(--body); font-size: 15px; font-weight: 700; letter-spacing: 0.2px;
  color: #fff; white-space: nowrap; cursor: pointer;
  background: linear-gradient(325deg, #0578b3 0%, #50e6ff 55%, #0694D1 90%);
  background-size: 280% auto;
  background-position: left center;
  box-shadow:
    0px 0px 20px rgba(6,148,209,0.45),
    0px 5px 5px -1px rgba(6,148,209,0.25),
    inset 4px 4px 8px rgba(175,230,255,0.5),
    inset -4px -4px 8px rgba(5,100,160,0.35);
  transition: background-position 700ms ease, transform 0.2s, box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.shiny-btn::after {
  content: '';
  position: absolute; top: -50%; left: -60%;
  width: 40%; height: 200%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.22), transparent);
  transform: skewX(-20deg);
  transition: left 0.7s ease;
  pointer-events: none;
}
.shiny-btn:hover {
  background-position: right top;
  transform: translateY(-2px);
  box-shadow:
    0px 0px 28px rgba(80,230,255,0.55),
    0px 8px 12px -2px rgba(6,148,209,0.3),
    inset 4px 4px 8px rgba(175,230,255,0.55),
    inset -4px -4px 8px rgba(5,100,160,0.4);
}
.shiny-btn:hover::after { left: 130%; }
.shiny-btn:active  { transform: translateY(0); }
.shiny-btn:disabled { opacity: 0.6; pointer-events: none; }
.shiny-btn:focus-visible { outline: 2px solid #50e6ff; outline-offset: 2px; }

/* ── Outline / ghost variant ── */
.shiny-btn.shiny-outline {
  background: linear-gradient(325deg, #071e2e 0%, #093148 55%, #071e2e 90%);
  background-size: 280% auto;
  background-position: left center;
  border: 2px solid rgba(80,230,255,0.55);
  box-shadow: 0px 0px 14px rgba(6,148,209,0.25), inset 0 1px 0 rgba(255,255,255,0.07);
  color: #fff;
}
.shiny-btn.shiny-outline:hover {
  background-position: right top;
  border-color: #50e6ff;
  color: #fff;
  box-shadow: 0px 0px 24px rgba(80,230,255,0.45), inset 0 1px 0 rgba(255,255,255,0.1);
}

/* ── Sizes ── */
.shiny-btn.shiny-sm  { height: 38px; padding: 0 20px; font-size: 13px; border-radius: 7px; }
.shiny-btn.shiny-lg  { height: 56px; padding: 0 44px; font-size: 16px; border-radius: 10px; letter-spacing: 0.25px; }
.shiny-btn.shiny-full { width: 100%; }

/* ══════════════════════════════════════════════
   GRADIENT BUTTON — adapted from aceternity-ui
   Brand colours: #0694D1 (blue) / #093148 (navy) / #071e2e (ink)
   No Tailwind, no shadcn, no TS — pure CSS @property magic
══════════════════════════════════════════════ */

/* Registered custom properties (enables smooth CSS transitions) */
@property --gb-pos-x        { syntax: '<percentage>'; initial-value: 12%;     inherits: false; }
@property --gb-pos-y        { syntax: '<percentage>'; initial-value: 140%;    inherits: false; }
@property --gb-spread-x     { syntax: '<percentage>'; initial-value: 150%;    inherits: false; }
@property --gb-spread-y     { syntax: '<percentage>'; initial-value: 180%;    inherits: false; }
@property --gb-c1           { syntax: '<color>';      initial-value: #040f18; inherits: false; }
@property --gb-c2           { syntax: '<color>';      initial-value: #071e2e; inherits: false; }
@property --gb-c3           { syntax: '<color>';      initial-value: #093148; inherits: false; }
@property --gb-c4           { syntax: '<color>';      initial-value: #0694D1; inherits: false; }
@property --gb-c5           { syntax: '<color>';      initial-value: #50e6ff; inherits: false; }
@property --gb-stop1        { syntax: '<percentage>'; initial-value: 30%;     inherits: false; }
@property --gb-stop2        { syntax: '<percentage>'; initial-value: 55%;     inherits: false; }
@property --gb-stop3        { syntax: '<percentage>'; initial-value: 72%;     inherits: false; }
@property --gb-stop4        { syntax: '<percentage>'; initial-value: 86%;     inherits: false; }
@property --gb-stop5        { syntax: '<percentage>'; initial-value: 100%;    inherits: false; }
@property --gb-border-angle { syntax: '<angle>';      initial-value: 160deg;  inherits: true;  }
@property --gb-border-c1    { syntax: '<color>';      initial-value: hsla(204,96%,42%,0.25); inherits: true; }
@property --gb-border-c2    { syntax: '<color>';      initial-value: hsla(197,100%,66%,0.7); inherits: true; }

.gradient-button {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
  gap: 8px;
  padding: 11px 26px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: var(--body);
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  appearance: none;
  background: radial-gradient(
    var(--gb-spread-x) var(--gb-spread-y) at var(--gb-pos-x) var(--gb-pos-y),
    var(--gb-c1) var(--gb-stop1),
    var(--gb-c2) var(--gb-stop2),
    var(--gb-c3) var(--gb-stop3),
    var(--gb-c4) var(--gb-stop4),
    var(--gb-c5) var(--gb-stop5)
  );
  transition:
    --gb-pos-x .5s, --gb-pos-y .5s,
    --gb-spread-x .5s, --gb-spread-y .5s,
    --gb-c1 .5s, --gb-c2 .5s, --gb-c3 .5s, --gb-c4 .5s, --gb-c5 .5s,
    --gb-stop1 .5s, --gb-stop2 .5s, --gb-stop3 .5s, --gb-stop4 .5s, --gb-stop5 .5s,
    --gb-border-angle .5s, --gb-border-c1 .5s, --gb-border-c2 .5s,
    transform .2s, box-shadow .2s;
}

/* animated 1px gradient border */
.gradient-button::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(var(--gb-border-angle), var(--gb-border-c1), var(--gb-border-c2));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.gradient-button:hover {
  --gb-pos-x: 0%;
  --gb-pos-y: 92%;
  --gb-spread-x: 110%;
  --gb-spread-y: 100%;
  --gb-c1: #0694D1;
  --gb-c2: #50e6ff;
  --gb-c3: #0078d4;
  --gb-c4: #093148;
  --gb-c5: #040f18;
  --gb-stop1: 0%;
  --gb-stop2: 18%;
  --gb-stop3: 40%;
  --gb-stop4: 72%;
  --gb-stop5: 88%;
  --gb-border-angle: 340deg;
  --gb-border-c1: hsla(197,100%,66%,0.15);
  --gb-border-c2: hsla(204,96%,65%,0.75);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(6,148,209,0.45);
}
.gradient-button:active { transform: translateY(0); box-shadow: none; }
.gradient-button:disabled { opacity: 0.6; pointer-events: none; }

/* ── Outline / ghost variant ── */
.gradient-button.gb-outline {
  --gb-c1: #040f18;
  --gb-c2: #071e2e;
  --gb-c3: #0a2740;
  --gb-c4: #093148;
  --gb-c5: #071e2e;
  --gb-border-angle: 200deg;
  --gb-border-c1: hsla(204,96%,42%,0.45);
  --gb-border-c2: hsla(197,100%,66%,0.15);
  color: rgba(255,255,255,0.85);
}
.gradient-button.gb-outline:hover {
  --gb-c1: #093148;
  --gb-c2: #0a2740;
  --gb-c3: #0694D1;
  --gb-c4: #50e6ff;
  --gb-c5: #040f18;
  --gb-border-angle: 20deg;
  --gb-border-c1: hsla(197,100%,66%,0.55);
  --gb-border-c2: hsla(204,96%,42%,0.2);
  color: #fff;
}

/* ── Large (hero / bottom CTA) ── */
.gradient-button.gb-lg { font-size: 15px; padding: 16px 36px; border-radius: 11px; }

/* ── Small (nav) ── */
.gradient-button.gb-sm { font-size: 12px; font-weight: 700; padding: 9px 20px; border-radius: 8px; letter-spacing: 0.2px; }

/* ── NAV GLOW BORDER ── */
.nav::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(6,148,209,0.4) 20%, rgba(80,230,255,0.6) 50%, rgba(6,148,209,0.4) 80%, transparent 100%); }

/* ── BINARY DECO ── */
.binary-rain { position: absolute; font-family: monospace; font-size: 9px; color: rgba(6,148,209,0.1); pointer-events: none; user-select: none; line-height: 1.6; white-space: pre; overflow: hidden; }

/* ── STAT NUMBER UNDERLINE ── */
.stat-number-wrap { position: relative; display: inline-block; }
.stat-number-wrap::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--blue), transparent); animation: shimmerGrad 2s linear infinite; background-size: 200% 100%; }

/* ── AWARDS NEON BORDER ── */
.award-card::after { content: ''; position: absolute; inset: -1px; border-radius: 16px; background: linear-gradient(135deg, rgba(6,148,209,0.3), transparent 40%, rgba(80,230,255,0.2) 100%); opacity: 0; transition: opacity 0.3s; pointer-events: none; z-index: 0; }
.award-card:hover::after { opacity: 1; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--ink2); }
::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 64px;
  background: rgba(9,49,72,0.92); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--sl2);
  transition: all 0.3s;
}
.nav.scrolled { background: rgba(9,49,72,0.99); }
.nav-logo { display: flex; align-items: center; gap: 16px; text-decoration: none; }
.nav-logo-img { height: 40px; width: auto; display: block; object-fit: contain; }
.nav-logo-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
.nav-logo-text { font-family: var(--body); font-size: 22px; font-weight: 800; letter-spacing: 1px; line-height: 1; color: var(--white); }
.nav-logo-text span { color: var(--blue); }
/* Right side — just CTA now */
.nav-right { display: flex; align-items: center; gap: 24px; }
.nav-ms-badge { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.ms-flag { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; width: 16px; height: 16px; flex-shrink: 0; }
.ms-sq { border-radius: 1px; }
.nav-badge-text { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.65); letter-spacing: 0.3px; }
.nav-cta { display: inline-flex; align-items: center; gap: 7px; background: var(--blue); color: var(--white); font-family: var(--body); font-weight: 700; font-size: 14px; padding: 11px 24px; border-radius: var(--r8); border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; letter-spacing: 0.15px; }
.nav-cta:hover { background: #057ab5; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(6,148,209,0.4); }

/* urgency bar removed */
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

/* ══════════════════════════════════════════════
   HERO — 21st.dev "startup split" pattern
   Left: badge → h1 → subtitle → features → CTAs → social proof
   Right: floating glassmorphic lead-gen card
   Single viewport fold, no scroll needed
══════════════════════════════════════════════ */
.hero {
  min-height: 100vh; position: relative; overflow: hidden;
  display: grid;
  grid-template-columns: 1fr minmax(0, 400px);
  align-items: center;
  gap: 40px;
  padding: 80px 48px 60px 64px;
  background: var(--ink2);
}

/* ── Background dot grid (21st.dev staple) ── */
.hero-bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 700px 500px at 0% 50%, rgba(6,148,209,0.13) 0%, transparent 65%),
    radial-gradient(ellipse 500px 400px at 100% 20%, rgba(7,109,157,0.07) 0%, transparent 60%);
}
.hero-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 90% 90% at 30% 50%, black 0%, transparent 100%);
}

/* ── Vertical divider between cols ── */
.hero-sep {
  position: absolute; top: 10%; bottom: 10%;
  right: calc(420px + 0px);
  width: 1px;
  background: linear-gradient(to bottom,
    transparent,
    rgba(6,148,209,0.15) 25%,
    rgba(6,148,209,0.25) 50%,
    rgba(6,148,209,0.15) 75%,
    transparent);
  pointer-events: none; z-index: 3;
}

/* ══ LEFT COLUMN ══ */
.hero-left {
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  align-items: flex-start;
  padding-right: 56px;
}

/* ── Badge / pill (21st.dev animated border badge) ── */
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  position: relative; z-index: 1; overflow: hidden;
  padding: 5px 14px 5px 6px; border-radius: 40px;
  background: rgba(6,148,209,0.06);
  border: 1px solid rgba(6,148,209,0.22);
  margin-bottom: 22px;
  cursor: default;
  transition: border-color 0.25s, background 0.25s;
  animation: fadeUp 0.5s ease both;
}
.hero-badge:hover { border-color: rgba(6,148,209,0.45); background: rgba(6,148,209,0.1); }
/* animated border sweep */
.hero-badge::before {
  content: ''; position: absolute; inset: -1px; border-radius: 40px;
  background: conic-gradient(from var(--badge-angle, 0deg), transparent 80%, rgba(6,148,209,0.8) 90%, transparent 100%);
  animation: badgeSpin 4s linear infinite;
  z-index: -1;
}
@property --badge-angle { syntax: '<angle>'; inherits: false; initial-value: 0deg; }
@keyframes badgeSpin { to { --badge-angle: 360deg; } }
.hero-badge-chip {
  display: flex; align-items: center; gap: 5px;
  background: var(--blue); border-radius: 20px;
  padding: 2px 9px; font-size: 9px; font-weight: 800;
  letter-spacing: 1.5px; text-transform: uppercase; color: #fff;
}
.hero-badge-label {
  font-size: 12.5px; color: rgba(255,255,255,0.7); font-weight: 500;
}
.hero-badge-arrow { font-size: 12px; color: rgba(6,148,209,0.8); transition: transform 0.2s; }
.hero-badge:hover .hero-badge-arrow { transform: translateX(3px); }

/* ── Headline ── */
.hero-h1 {
  font-family: var(--display);
  font-size: 32px;
  font-weight: 800; line-height: 1.1;
  letter-spacing: -0.8px; color: var(--white);
  margin-bottom: 16px;
  animation: fadeUp 0.6s 0.1s ease both;
}
.hero-h1 .h1-plain { display: block; }
.hero-h1 .h1-grad {
  display: block;
  background: linear-gradient(90deg, #0694D1 0%, #50e6ff 45%, #a8d8ff 65%, #0694D1 100%);
  background-size: 250% 100%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradText 5s ease infinite;
}

/* ── Subtitle ── */
.hero-sub {
  font-size: 15px; line-height: 1.72;
  color: rgba(255,255,255,0.52);
  max-width: 460px; margin-bottom: 24px;
  animation: fadeUp 0.6s 0.18s ease both;
}

/* ── Feature list (21st.dev "icon + text" rows) ── */
.hero-features {
  display: flex; flex-direction: column; gap: 10px;
  margin-bottom: 30px;
  animation: fadeUp 0.6s 0.24s ease both;
}
.hero-feat-row {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: rgba(255,255,255,0.65); font-weight: 500;
}
.hero-feat-icon {
  width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0;
  background: rgba(6,148,209,0.12); border: 1px solid rgba(6,148,209,0.2);
  display: flex; align-items: center; justify-content: center;
}
.hero-feat-icon svg { width: 12px; height: 12px; color: var(--blue); }

/* ── CTA row ── */
.hero-ctas {
  display: flex; align-items: center; gap: 12px;
  flex-wrap: wrap; margin-bottom: 32px;
  animation: fadeUp 0.6s 0.3s ease both;
}
.hero-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--blue); color: #fff;
  font-family: var(--body); font-size: 14px; font-weight: 700;
  padding: 11px 24px; border-radius: 9px; border: none; cursor: pointer;
  position: relative; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(6,148,209,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
}
.hero-btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmerGrad 2.5s linear infinite;
}
.hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(6,148,209,0.55); }
.hero-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.75);
  font-family: var(--body); font-size: 14px; font-weight: 600;
  padding: 10px 20px; border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.1); cursor: pointer;
  backdrop-filter: blur(8px); transition: all 0.2s;
}
.hero-btn-ghost:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.2); transform: translateY(-1px); }

/* ── Social proof strip ── */
.hero-proof {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  animation: fadeUp 0.6s 0.36s ease both;
}
.hero-proof-divider {
  width: 1px; height: 36px;
  background: linear-gradient(to bottom, transparent, rgba(6,148,209,0.4), transparent);
}

/* Avatars */
.sp-avatars { display: flex; }
.sp-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  border: 2px solid var(--ink); object-fit: cover; background: var(--navy);
  margin-left: -8px; box-shadow: 0 0 0 1.5px rgba(6,148,209,0.35);
  transition: transform 0.2s; cursor: default;
}
.sp-avatar:first-child { margin-left: 0; }
.sp-avatars:hover .sp-avatar { transform: translateX(-2px); }
.sp-avatars:hover .sp-avatar:first-child { transform: none; }

/* Rating text */
.sp-text { font-size: 12.5px; color: rgba(255,255,255,0.75); line-height: 1.45; }
.sp-text strong { color: var(--white); font-size: 13.5px; }
.stars {
  color: #fbbf24; font-size: 13px; letter-spacing: 1.5px;
  text-shadow: 0 0 8px rgba(251,191,36,0.6);
}

/* ── Partner badge cards ── */
.proof-partner-badges { display: flex; align-items: center; gap: 10px; }
.proof-badge-card {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  padding: 8px 12px; border-radius: 12px;
  background: rgba(6,148,209,0.07);
  border: 1px solid rgba(6,148,209,0.22);
  box-shadow: 0 0 16px rgba(6,148,209,0.1), inset 0 1px 0 rgba(255,255,255,0.04);
  transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  cursor: default;
}
.proof-badge-card:hover {
  border-color: rgba(6,148,209,0.5);
  background: rgba(6,148,209,0.12);
  box-shadow: 0 0 24px rgba(6,148,209,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
}
.proof-partner-img {
  height: 58px; width: auto; object-fit: contain;
  filter: brightness(1.15) saturate(1.1) drop-shadow(0 2px 8px rgba(6,148,209,0.4));
  transition: filter 0.25s, transform 0.25s;
}
.proof-badge-card:hover .proof-partner-img {
  filter: brightness(1.25) saturate(1.2) drop-shadow(0 4px 14px rgba(6,148,209,0.55));
  transform: scale(1.04);
}
.proof-badge-label {
  font-size: 9.5px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase;
  color: rgba(6,148,209,0.85); text-align: center; line-height: 1.3;
}

/* ══ RIGHT COLUMN — Form card ══ */
.hero-form-col {
  position: relative; z-index: 4;
  align-self: center;
}
.hero-form-glow {
  position: absolute; inset: -80px; pointer-events: none; z-index: 0;
  background: radial-gradient(circle at 50% 50%, rgba(6,148,209,0.18) 0%, transparent 65%);
  filter: blur(30px);
}
/* Video card wrapper */
.hero-video-card {
  position: relative; z-index: 1;
  border-radius: 20px; overflow: hidden;
  border: 1px solid rgba(6,148,209,0.38);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03),
              0 28px 72px rgba(0,0,0,0.7),
              0 0 60px rgba(6,148,209,0.12);
  animation: fadeUp 0.7s 0.15s ease both;
  background: #000;
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 560px;
}
/* Animated top shimmer */
.hero-video-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; z-index: 3;
  background: linear-gradient(90deg,
    transparent 0%, rgba(6,148,209,0.8) 30%,
    rgba(80,230,255,0.6) 50%,
    rgba(6,148,209,0.8) 70%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmerGrad 3s linear infinite;
}
/* Corner glow */
.hero-video-card::after {
  content: ''; position: absolute; top: -1px; right: -1px; width: 100px; height: 100px;
  background: radial-gradient(circle at top right, rgba(6,148,209,0.18) 0%, transparent 70%);
  border-radius: 0 20px 0 0; pointer-events: none; z-index: 3;
}
.hero-video {
  width: 100%; height: 100%; display: block;
  object-fit: cover; border-radius: 20px;
}
/* Mute / unmute button */
.hero-video-mute {
  position: absolute; bottom: 14px; right: 14px; z-index: 4;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(7,30,46,0.72); backdrop-filter: blur(8px);
  border: 1px solid rgba(6,148,209,0.35);
  color: rgba(255,255,255,0.8); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, border-color 0.2s, transform 0.2s, color 0.2s;
}
.hero-video-mute:hover {
  background: rgba(6,148,209,0.25); border-color: rgba(6,148,209,0.7);
  color: #fff; transform: scale(1.1);
}
/* Quick form below video */
.hq-form-card {
  width: 100%; margin-top: 12px;
  background: rgba(4,14,22,0.82);
  border: 1px solid rgba(6,148,209,0.28);
  border-radius: 14px; padding: 16px;
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
  animation: fadeUp 0.7s 0.3s ease both;
}
.hq-form { display: flex; flex-direction: column; gap: 10px; }
.hq-row { display: flex; gap: 8px; }
.hq-input {
  flex: 1; min-width: 0;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(6,148,209,0.2);
  border-radius: 9px; padding: 10px 13px;
  font-size: 13px; color: var(--white); font-family: inherit; outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.hq-input::placeholder { color: rgba(255,255,255,0.28); }
.hq-input:focus { border-color: rgba(6,148,209,0.55); background: rgba(6,148,209,0.07); }
/* Individual / Enterprise toggle */
.hq-toggle-row { display: flex; justify-content: center; margin-bottom: 12px; }
.hq-toggle-track {
  position: relative; display: flex;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(6,148,209,0.2);
  border-radius: 10px; padding: 3px; gap: 0;
}
.hq-toggle-btn {
  position: relative; z-index: 1;
  flex: 1; padding: 7px 20px; border: none; background: transparent;
  font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.45);
  cursor: pointer; border-radius: 7px; transition: color 0.25s; font-family: inherit;
  white-space: nowrap;
}
.hq-toggle-btn.active { color: var(--white); }
.hq-toggle-pill {
  position: absolute; top: 3px; left: 3px;
  width: calc(50% - 3px); height: calc(100% - 6px);
  background: linear-gradient(135deg, #0694D1, #0578b3);
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(6,148,209,0.4);
  transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
  pointer-events: none;
}
.hq-success {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 12px 0; font-size: 14px; font-weight: 600; color: #10d964;
}
@media (max-width: 700px) {
  .hq-row { flex-direction: column; }
}
/* keep legacy selectors from breaking anything */
.hero-form-card { display: none; }

/* ── Trust strip under form ── */
.hero-trust-strip {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 5px 8px;
  margin-top: 14px;
  animation: fadeUp 0.6s 0.5s ease both;
}
.hero-trust-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 600;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  padding: 3px 9px; border-radius: 20px;
  transition: border-color 0.2s, color 0.2s;
}
.hero-trust-item:hover { border-color: rgba(6,148,209,0.3); color: rgba(255,255,255,0.8); }
.hero-trust-item svg { flex-shrink: 0; }

/* ── Stubs to avoid breaking old selectors ── */
.hero-left { } /* overridden above */
.hero-details { }
.hero-eyebrow { display: none; }
.hero-usp-row { display: none; }
.hero-partner-row { display: none; }
.trust-row { display: none; }
.social-proof { display: none; }
.lead-form-wrap { display: none; }
.dot-live { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); animation: pulse 1.5s infinite; }
.hero h1 { }
.hero-desc { }
.trust-pill { display: flex; align-items: center; gap: 6px; background: var(--sl3); border: 1px solid var(--sl2); color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 500; padding: 7px 14px; border-radius: 20px; }
.trust-pill .check { color: var(--blue); font-size: 14px; }
/* spotlight / old class stubs */
.hero-spotlight { display: none; }
.hero-21-h1 { display: none; }
.hero-21-sub { display: none; }
.hero-21-ctas { display: none; }
.hero-21-proof { display: none; }
.hero-21-form-wrap { display: none; }
.hero-21-form-glow { display: none; }
.hero-21-form-card { display: none; }
.proof-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.12); }

@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

/* ── LEAD FORM (revamped) ── */
.lead-form-wrap { flex-shrink: 0; width: 440px; position: relative; z-index: 1; animation: fadeUp 0.8s 0.15s ease both; }
.form-glow { position: absolute; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(6,148,209,0.18), transparent 65%); top: -80px; left: -80px; pointer-events: none; filter: blur(50px); }
.lead-form {
  background: rgba(6,18,30,0.92);
  border: 1px solid rgba(6,148,209,0.32);
  border-radius: 20px; padding: 28px 26px 24px;
  backdrop-filter: blur(28px);
  position: relative; overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
}
.lead-form::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #0694D1 30%, #50e6ff 50%, #0694D1 70%, transparent);
  background-size: 200% 100%; animation: shimmerGrad 3s linear infinite;
}

/* ── Progress bar ── */
.lf-progress-wrap { margin-bottom: 24px; }
.lf-progress-steps { display: flex; align-items: center; gap: 0; margin-bottom: 10px; }
.lf-step-pill {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  font-size: 11px; font-weight: 700; transition: all 0.3s;
  border: 2px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.35);
}
.lf-step-pill.active { border-color: #0694D1; color: #0694D1; background: rgba(6,148,209,0.1); }
.lf-step-pill.done { border-color: #0694D1; background: #0694D1; color: var(--ink); }
.lf-step-connector { flex: 1; height: 2px; background: rgba(255,255,255,0.08); margin: 0 6px; border-radius: 1px; overflow: hidden; }
.lf-step-connector-fill { height: 100%; background: #0694D1; width: 0%; transition: width 0.4s ease; border-radius: 1px; }
.lf-step-connector-fill.done { width: 100%; }
.lf-step-labels { display: flex; justify-content: space-between; padding: 0 2px; }
.lf-step-lbl { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: rgba(255,255,255,0.25); transition: color 0.3s; flex: 1; text-align: center; white-space: nowrap; }
.lf-step-lbl:first-child { text-align: left; }
.lf-step-lbl:last-child { text-align: right; }
.lf-step-lbl.active { color: rgba(255,255,255,0.65); }

/* ── Header ── */
.lf-header { margin-bottom: 18px; }
.lf-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #0694D1; margin-bottom: 6px; }
.lf-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #10d964; animation: livePulse 2s infinite; flex-shrink: 0; }
.lf-title { font-family: var(--display); font-size: 20px; font-weight: 800; color: var(--white); line-height: 1.2; letter-spacing: -0.3px; }
.lf-title span { background: linear-gradient(90deg, #0694D1, #50e6ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.lf-sub { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 4px; }

/* ── Fields ── */
.lf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.lf-field { margin-bottom: 12px; }
.lf-field:last-of-type { margin-bottom: 0; }
.lf-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 6px; display: block; }
.lf-input-wrap { position: relative; }
.lf-input-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: rgba(255,255,255,0.3); pointer-events: none; }
.lf-input-icon.top { top: 14px; transform: none; }
.lf-input {
  width: 100%; padding: 11px 14px 11px 38px; box-sizing: border-box;
  background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 10px; color: var(--white); font-family: var(--body); font-size: 13px;
  outline: none; transition: all 0.2s;
}
.lf-input.no-icon { padding-left: 14px; }
.lf-input::placeholder { color: rgba(255,255,255,0.2); }
.lf-input:focus { border-color: #0694D1; background: rgba(6,148,209,0.07); box-shadow: 0 0 0 3px rgba(6,148,209,0.12); }
.lf-input.err { border-color: #f87171; }
.lf-err { font-size: 11px; color: #fca5a5; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
.lf-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.35)' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; cursor: pointer; }
.lf-select option { background: #071e2e; }
.lf-textarea { resize: vertical; min-height: 80px; padding-top: 11px; padding-bottom: 11px; line-height: 1.6; }

/* ── Course chips ── */
.lf-chips-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); margin-bottom: 8px; display: block; }
.lf-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
.lf-chip {
  padding: 6px 13px; border-radius: 20px; font-size: 12px; font-weight: 600;
  border: 1.5px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.45);
  cursor: pointer; transition: all 0.18s; background: transparent; font-family: var(--body);
}
.lf-chip:hover { border-color: rgba(6,148,209,0.4); color: rgba(255,255,255,0.75); background: rgba(6,148,209,0.05); }
.lf-chip.sel { border-color: #0694D1; color: #0694D1; background: rgba(6,148,209,0.12); }

/* ── Summary box ── */
.lf-summary {
  background: rgba(6,148,209,0.06); border: 1px solid rgba(6,148,209,0.18);
  border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;
}
.lf-summary-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.35); margin-bottom: 8px; }
.lf-summary-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,0.65); margin-bottom: 4px; }
.lf-summary-row:last-child { margin-bottom: 0; }
.lf-summary-row svg { flex-shrink: 0; color: #0694D1; }
.lf-summary-val { color: var(--white); font-weight: 600; }

/* ── Buttons ── */
.lf-btn-primary {
  width: 100%; padding: 13px; border-radius: 10px; border: none; cursor: pointer;
  font-family: var(--body); font-size: 14px; font-weight: 700; letter-spacing: 0.3px;
  background: linear-gradient(135deg, #0694D1, #076d9d);
  color: var(--white); transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 20px rgba(6,148,209,0.3);
}
.lf-btn-primary:hover { background: linear-gradient(135deg, #0578b3, #065a82); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(6,148,209,0.4); }
.lf-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.lf-btn-back { background: transparent; border: 1.5px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.5); font-family: var(--body); font-size: 12px; font-weight: 600; padding: 9px 18px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.lf-btn-back:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.75); }
.lf-nav { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
.lf-nav .lf-btn-primary { flex: 1; }

/* ── Trust row ── */
.lf-trust { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 14px; font-size: 11px; color: rgba(255,255,255,0.28); }
.lf-trust svg { color: rgba(255,255,255,0.25); }

/* ── Success state ── */
.lf-success { text-align: center; padding: 8px 0; }
.lf-success-icon { font-size: 48px; margin-bottom: 14px; animation: countPop 0.5s ease; }
.lf-success-title { font-family: var(--display); font-size: 24px; font-weight: 800; color: var(--white); margin-bottom: 8px; }
.lf-success-msg { font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.7; margin-bottom: 20px; }
.lf-success-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; text-align: left; }
.lf-success-step { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; }
.lf-success-step-num { width: 24px; height: 24px; border-radius: 50%; background: rgba(6,148,209,0.15); border: 1px solid rgba(6,148,209,0.3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #0694D1; flex-shrink: 0; }
.lf-success-step-text { font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.5; }
.lf-success-step-text strong { color: var(--white); display: block; font-size: 13px; margin-bottom: 2px; }
.lf-success-dl { display: flex; align-items: center; gap: 12px; background: rgba(6,148,209,0.08); border: 1px solid rgba(6,148,209,0.2); border-radius: 12px; padding: 14px 16px; }
.lf-success-dl-icon { font-size: 28px; flex-shrink: 0; }
.lf-success-dl-text { flex: 1; text-align: left; }
.lf-success-dl-title { font-size: 13px; font-weight: 700; color: var(--white); }
.lf-success-dl-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.lf-success-dl-btn { padding: 8px 16px; background: #0694D1; color: var(--white); border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.2s; white-space: nowrap; font-family: var(--body); }
.lf-success-dl-btn:hover { background: #0578b3; }

/* ── TICKER ── */
.ticker { background: var(--blue); padding: 11px 0; overflow: hidden; }
.ticker-track { display: flex; width: max-content; animation: ticker 35s linear infinite; }
@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.ticker-item { white-space: nowrap; padding: 0 40px; color: var(--white); font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 12px; }
.ticker-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.4); }

/* ══════════════════════════════
   PLATFORM PREVIEW  (ContainerScroll)
══════════════════════════════ */
.preview-sec {
  background: var(--light-bg); position: relative; overflow: hidden;
  border-top: 1px solid var(--light-border);
}
.preview-sec::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(ellipse 1000px 500px at 50% 0%, rgba(6,148,209,0.07), transparent 65%);
}
.preview-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 14px; border-radius: 20px; margin-bottom: 16px;
  font-size: 10px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;
  color: #0694D1; background: rgba(6,148,209,0.1); border: 1px solid rgba(6,148,209,0.22);
}
.preview-title {
  font-family: var(--display); font-size: clamp(28px, 4vw, 48px);
  font-weight: 800; color: var(--light-text); line-height: 1.15;
  letter-spacing: -0.03em; margin-bottom: 12px;
}
.preview-sub {
  font-size: 15px; color: var(--light-sub); max-width: 480px;
  margin: 0 auto; line-height: 1.7;
}
.preview-card-outer {
  border: 3px solid rgba(255,255,255,0.1);
  border-radius: 24px; padding: 6px;
  background: #1a1a1a;
  box-shadow:
    0 0 0 0 transparent,
    0 9px 20px rgba(0,0,0,0.5),
    0 37px 37px rgba(0,0,0,0.42),
    0 84px 50px rgba(0,0,0,0.26),
    0 149px 60px rgba(0,0,0,0.1);
}
.preview-card-inner {
  border-radius: 18px; overflow: hidden;
  background: #0d1117;
  height: 100%;
}
/* browser chrome mockup */
.preview-chrome {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.preview-chrome-dot { width: 10px; height: 10px; border-radius: 50%; }
.preview-chrome-bar {
  flex: 1; height: 22px; border-radius: 6px;
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; padding: 0 10px;
  font-size: 10px; color: rgba(255,255,255,0.2);
}
.preview-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: top;
  display: block;
}

/* ── STATS STRIP ── */
.stats-strip { background: var(--light-white); border-top: 1px solid var(--light-border); border-bottom: 1px solid var(--light-border); }
.stats-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(5,1fr); }
.stat-item { padding: 36px 24px; border-right: 1px solid var(--light-border); text-align: center; position: relative; }
.stat-item:last-child { border-right: none; }
.stat-number { font-family: var(--display); font-size: clamp(28px, 4vw, 52px); letter-spacing: 1px; color: var(--light-text); line-height: 1; }
.stat-number .unit { font-size: clamp(18px, 2.5vw, 32px); color: var(--blue); }
.stat-label { font-size: 13px; color: var(--light-sub); margin-top: 6px; font-weight: 500; }
.stat-source { font-size: 10px; color: rgba(0,0,0,0.3); margin-top: 4px; }

/* ── WHY KOENIG (Features) ── */
.features-sec { background: var(--light-bg); padding: 100px 48px; }
.sec-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: var(--blue); margin-bottom: 14px; }
.sec-title { font-family: var(--display); font-weight: 700; font-size: 21px; color: var(--light-text); letter-spacing: -0.009em; line-height: 1.05; margin-bottom: 16px; }
/* ── GLOBAL BLUE EM SHIMMER ── */
@keyframes em-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.sec-title em,
.edge-left-heading em,
.enroll-title em,
.companies-headline em,
.lgm-title em,
.cert-showcase-title em,
.aps-heading em,
.aps-panel-title em,
.cta-title span {
  background-image:
    linear-gradient(90deg,
      transparent calc(50% - 80px),
      #93d4ff 50%,
      transparent calc(50% + 80px)
    ),
    linear-gradient(#0694D1, #0694D1);
  background-size: 300% 100%, auto;
  background-repeat: no-repeat, padding-box;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  font-style: normal;
  animation: em-shimmer 3s linear infinite;
}
.sec-sub { font-size: 14px; color: var(--light-sub); max-width: 560px; line-height: 1.52; }
/* ── USP COMPARISON ── */
.usp-sec { background: var(--light-white); padding: 100px 48px; border-top: 1px solid var(--light-border); border-bottom: 1px solid var(--light-border); }
.usp-inner { max-width: 1000px; margin: 0 auto; }
.usp-header { text-align: center; margin-bottom: 56px; }
.usp-table {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 0;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
}
.usp-col-label {
  display: flex; flex-direction: column;
  background: transparent;
}
.usp-col-koenig {
  display: flex; flex-direction: column;
  background: #0a2235;
  border: 2px solid rgba(6,148,209,0.35);
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(6,148,209,0.12);
  position: relative; z-index: 2;
  margin: -8px 0;
}
.usp-col-others {
  display: flex; flex-direction: column;
  background: var(--light-bg);
  border: 1px solid var(--light-border);
  border-radius: 16px;
  margin-left: -10px;
  padding-left: 10px;
}
.usp-col-head {
  padding: 22px 24px 18px;
  font-size: 12px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--light-sub);
  border-bottom: 1px solid var(--light-border);
}
.usp-col-koenig .usp-col-head {
  display: flex; align-items: center; gap: 10px;
  color: var(--white); font-size: 14px; letter-spacing: 1px;
  border-bottom: 1px solid rgba(6,148,209,0.25);
}
.usp-col-others .usp-col-head { color: var(--light-sub); }
.usp-koenig-logo { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; width: 20px; height: 20px; flex-shrink: 0; }
.usp-koenig-sq { border-radius: 1px; }
.usp-row-label {
  padding: 20px 16px 20px 0;
  font-size: 13px; font-weight: 600; color: var(--light-sub);
  border-bottom: 1px solid var(--light-border);
  display: flex; align-items: center; gap: 10px;
}
.usp-row-label:last-child { border-bottom: none; }
.usp-row-label-arrow { color: var(--blue); font-size: 16px; }
.usp-row-koenig {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(6,148,209,0.12);
  display: flex; align-items: center; gap: 10px;
  font-size: 14px; font-weight: 600; color: var(--white);
}
.usp-row-koenig:last-child { border-bottom: none; }
.usp-row-others {
  padding: 18px 20px;
  border-bottom: 1px solid var(--light-border);
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; color: var(--light-sub);
}
.usp-row-others:last-child { border-bottom: none; }
.usp-check {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
  background: rgba(16,217,100,0.12); border: 1px solid rgba(16,217,100,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: #10d964;
}
.usp-cross {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: rgba(239,68,68,0.7);
}
@media(max-width:700px){
  .usp-sec { padding: 72px 16px; }
  .usp-table { grid-template-columns: 120px 1fr 1fr; }
  .usp-row-label { font-size: 11px; }
  .usp-row-koenig, .usp-row-others { font-size: 12px; padding: 14px 12px; }
}

.features-header { max-width: 1200px; margin: 0 auto 60px; }
.features-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; background: var(--light-border); border: 1px solid var(--light-border); border-radius: var(--r16); overflow: hidden; }
.feat-card { background: var(--light-white); padding: 36px; transition: all 0.3s; position: relative; overflow: hidden; }
.feat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background: linear-gradient(90deg, var(--blue), var(--sky)); transform: scaleX(0); transform-origin: left; transition: transform 0.3s; }
.feat-card:hover { background: var(--off); }
.feat-card:hover::before { transform: scaleX(1); }
.feat-icon { width: 44px; height: 44px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; background: rgba(6,148,209,0.08); border: 1px solid rgba(6,148,209,0.15); border-radius: 12px; padding: 6px; }
.feat-title { font-family: var(--display); font-size: 22px; letter-spacing: 0.5px; color: var(--light-text); margin-bottom: 10px; }
.feat-desc { font-size: 14px; color: var(--light-sub); line-height: 1.7; }
.feat-stat { margin-top: 16px; font-size: 13px; font-weight: 700; color: var(--blue); }

/* ── GLOWING EFFECT ── */
.feat-card { border: 1px solid var(--light-border); overflow: visible; }
.glow-border-effect {
  pointer-events: none; position: absolute; inset: 0; border-radius: inherit;
  --spread: 20; --start: 0; --active: 0;
}
.glow-border-inner {
  position: absolute; inset: 0; border-radius: inherit;
}
.glow-border-inner::after {
  content: ""; border-radius: inherit; position: absolute;
  inset: calc(-1 * var(--glowingeffect-border-width, 1px));
  border: var(--glowingeffect-border-width, 1px) solid transparent;
  background: var(--gradient); background-attachment: fixed;
  opacity: var(--active, 0); transition: opacity 0.3s;
  -webkit-mask-clip: padding-box, border-box; mask-clip: padding-box, border-box;
  -webkit-mask-composite: source-in; mask-composite: intersect;
  -webkit-mask-image: linear-gradient(#0000, #0000),
    conic-gradient(
      from calc((var(--start, 0) - var(--spread, 20)) * 1deg),
      transparent 0deg, #fff,
      transparent calc(var(--spread, 20) * 2deg)
    );
  mask-image: linear-gradient(#0000, #0000),
    conic-gradient(
      from calc((var(--start, 0) - var(--spread, 20)) * 1deg),
      transparent 0deg, #fff,
      transparent calc(var(--spread, 20) * 2deg)
    );
}

/* ══════════════════════════════
   HOW IT WORKS  (vertical scroll-reveal)
══════════════════════════════ */
.hiw-sec {
  background: var(--ink); padding: 100px 48px;
  border-top: 1px solid rgba(255,255,255,0.04);
  overflow: hidden; position: relative;
}
.hiw-sec::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse 900px 500px at 50% 0%, rgba(6,148,209,0.07) 0%, transparent 70%);
}
/* grid texture */
.hiw-sec::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(rgba(6,148,209,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6,148,209,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* Restore white text inside dark How It Works section */
.hiw-sec .sec-label { color: var(--blue); }
.hiw-sec .sec-title { color: var(--white); }
.hiw-sec .sec-sub   { color: rgba(255,255,255,0.5); }
.hiw-sec p          { color: rgba(255,255,255,0.55); }

/* ── Achievement banner ── */
.hiw-banner {
  max-width: 860px; margin: 0 auto 80px;
  display: grid; grid-template-columns: 1fr 1px 1fr 1px 1fr; gap: 0;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(6,148,209,0.15);
  border-radius: 20px; overflow: hidden; position: relative; z-index: 1;
}
.hiw-banner::before {
  content: ''; position: absolute; inset: 0; border-radius: 20px;
  background: linear-gradient(135deg, rgba(6,148,209,0.06) 0%, transparent 60%);
  pointer-events: none;
}
.hiw-banner-div { background: rgba(6,148,209,0.12); }
.hiw-banner-stat {
  padding: 32px 36px; display: flex; flex-direction: column; align-items: flex-start;
  gap: 4px; position: relative; overflow: hidden;
}
.hiw-banner-stat::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(6,148,209,0.5), transparent);
  opacity: 0; transition: opacity 0.3s;
}
.hiw-banner-stat:hover::after { opacity: 1; }
.hiw-banner-num {
  font-family: var(--display); font-size: clamp(36px, 3.5vw, 52px); font-weight: 800;
  letter-spacing: -0.03em; line-height: 1;
  background: linear-gradient(135deg, #ffffff 0%, #50e6ff 60%, #0694D1 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hiw-banner-label {
  font-size: 13px; color: rgba(255,255,255,0.55); font-weight: 500; line-height: 1.5; max-width: 200px;
}
.hiw-banner-label strong { color: var(--white); display: block; font-weight: 700; font-size: 14px; }
.hiw-banner-tag {
  margin-top: 6px; display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  color: #0694D1; background: rgba(6,148,209,0.1); border: 1px solid rgba(6,148,209,0.2);
  padding: 3px 10px; border-radius: 20px;
}

/* ── Section header ── */
.hiw-header { max-width: 860px; margin: 0 auto 60px; text-align: center; position: relative; z-index: 1; }

/* ── Vertical steps layout ── */
.hiw-steps-wrap {
  max-width: 700px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center;
  position: relative; z-index: 1;
}

/* ── Gradient-border card ── */
.hiw-card-border {
  width: 100%; position: relative;
  background: linear-gradient(145deg, rgba(6,148,209,0.55) 0%, rgba(80,230,255,0.3) 50%, rgba(6,148,209,0.08) 100%);
  border-radius: 20px; padding: 1.5px;
  transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
  cursor: default;
}
.hiw-card-border:hover {
  background: linear-gradient(145deg, rgba(6,148,209,0.9) 0%, rgba(80,230,255,0.6) 50%, rgba(6,148,209,0.25) 100%);
  box-shadow: 0 0 40px rgba(6,148,209,0.18);
  transform: scale(1.012);
}
.hiw-card-inner {
  border-radius: 18.5px;
  background: linear-gradient(145deg, #0d2d45 0%, #071e2e 100%);
  padding: 28px 32px;
  display: flex; gap: 20px; align-items: flex-start;
  transition: background 0.3s;
}
.hiw-card-border:hover .hiw-card-inner {
  background: linear-gradient(145deg, #0f3150 0%, #071e2e 100%);
}

/* ── Step number ── */
.hiw-step-badge {
  flex-shrink: 0;
  width: 44px; height: 44px; border-radius: 50%;
  border: 2px solid #0694D1;
  background: rgba(6,148,209,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: #0694D1;
  letter-spacing: 0.5px;
  box-shadow: 0 0 0 0 rgba(6,148,209,0);
  transition: box-shadow 0.3s, background 0.3s;
  position: relative;
}
.hiw-step-badge::before {
  content: ''; position: absolute; inset: -8px; border-radius: 50%;
  background: radial-gradient(circle, rgba(6,148,209,0.2) 0%, transparent 70%);
  opacity: 0; transition: opacity 0.3s;
}
.hiw-card-border:hover .hiw-step-badge {
  background: rgba(6,148,209,0.18);
  box-shadow: 0 0 18px rgba(6,148,209,0.35);
}
.hiw-card-border:hover .hiw-step-badge::before { opacity: 1; }

/* ── Card body ── */
.hiw-card-body { flex: 1; min-width: 0; }
.hiw-card-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.hiw-card-icon {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: rgba(6,148,209,0.1); border: 1px solid rgba(6,148,209,0.22);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  transition: background 0.3s, border-color 0.3s;
}
.hiw-card-border:hover .hiw-card-icon {
  background: rgba(6,148,209,0.2); border-color: rgba(6,148,209,0.45);
}
.hiw-card-title {
  font-family: var(--display); font-size: 17px; font-weight: 700; color: #fff; line-height: 1.2;
}
.hiw-card-desc {
  font-size: 13.5px; color: rgba(255,255,255,0.5); line-height: 1.75;
}
.hiw-card-tags {
  display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;
}
.hiw-card-tag {
  font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.55);
  background: rgba(6,148,209,0.08); border: 1px solid rgba(6,148,209,0.18);
  padding: 3px 10px; border-radius: 6px;
}

/* ── Last card accent (Get Certified) ── */
.hiw-card-border.hiw-last {
  background: linear-gradient(145deg, rgba(6,148,209,0.75) 0%, rgba(80,230,255,0.5) 50%, rgba(6,148,209,0.2) 100%);
}
.hiw-card-border.hiw-last .hiw-card-inner {
  background: linear-gradient(145deg, #0f3050 0%, #071e2e 100%);
}
.hiw-card-border.hiw-last .hiw-step-badge {
  border-color: #50e6ff; color: #50e6ff;
  box-shadow: 0 0 16px rgba(80,230,255,0.3);
}
.hiw-card-border.hiw-last .hiw-card-title {
  background: linear-gradient(90deg, #fff 0%, #50e6ff 60%, #0694D1 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

/* ── Vertical connector ── */
.hiw-connector-v {
  display: flex; flex-direction: column; align-items: center; padding: 4px 0;
  transform-origin: top center;
}
.hiw-connector-line {
  width: 2px; height: 44px; border-radius: 2px;
  background: linear-gradient(to bottom, rgba(6,148,209,0.7), rgba(80,230,255,0.35));
}
.hiw-connector-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(6,148,209,0.5);
  box-shadow: 0 0 0 4px rgba(6,148,209,0.1);
  margin: 2px 0;
}

/* ── IntersectionObserver reveal states ── */
.hiw-reveal { opacity: 0; transform: translateY(28px); transition: none; }
.hiw-reveal.hiw-visible {
  animation: hiwFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both;
}
.hiw-line-reveal { opacity: 0; transform: scaleY(0); transform-origin: top center; transition: none; }
.hiw-line-reveal.hiw-visible {
  animation: hiwDrawLine 0.8s cubic-bezier(0.22,1,0.36,1) both;
}
@keyframes hiwFadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hiwDrawLine {
  from { opacity: 0; transform: scaleY(0); }
  to   { opacity: 1; transform: scaleY(1); }
}

@media (max-width: 900px) {
  .hiw-banner { grid-template-columns: 1fr; }
  .hiw-banner-div { display: none; }
  .hiw-card-inner { padding: 22px 20px; gap: 14px; }
}
@media (max-width: 560px) {
  .hiw-sec { padding: 72px 20px; }
  .hiw-card-title { font-size: 15px; }
}

/* ══════════════════════════════
   4 WAYS TO LEARN
══════════════════════════════ */
.learn-sec {
  background: var(--light-bg); padding: 100px 48px;
  position: relative; overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.04);
}
.learn-sec::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(ellipse 900px 500px at 50% 0%, rgba(6,148,209,0.07), transparent 70%);
}
.learn-sec::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  background-image: linear-gradient(rgba(6,148,209,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(6,148,209,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
.learn-inner { max-width: 700px; margin: 0 auto; position: relative; z-index: 1; }
.learn-header { text-align: center; margin-bottom: 56px; }
/* grid removed — now vertical stack via hiw-steps-wrap */

/* ── Badge pill (inline, left-aligned inside card) ── */
.learn-badge {
  display: inline-flex; align-items: center;
  padding: 3px 12px; border-radius: 20px; margin-bottom: 10px;
  font-size: 10px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase;
  background: linear-gradient(90deg, #0694D1, #50e6ff); color: var(--ink);
  box-shadow: 0 3px 12px rgba(6,148,209,0.35);
}
.learn-badge.amber  { background: linear-gradient(90deg, #f59e0b, #fbbf24); box-shadow: 0 3px 12px rgba(245,158,11,0.3); }
.learn-badge.green  { background: linear-gradient(90deg, #10b981, #34d399); box-shadow: 0 3px 12px rgba(16,185,129,0.3); }
.learn-badge.purple { background: linear-gradient(90deg, #8b5cf6, #a78bfa); box-shadow: 0 3px 12px rgba(139,92,246,0.3); }

/* Icon circle */
.learn-icon-wrap {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: rgba(6,148,209,0.1); border: 1px solid rgba(6,148,209,0.22);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; transition: background 0.3s, border-color 0.3s;
}
.hiw-card-border:hover .learn-icon-wrap {
  background: rgba(6,148,209,0.2); border-color: rgba(6,148,209,0.45);
}

/* Body layout */
.learn-card-body { flex: 1; min-width: 0; }
.learn-title { font-family: var(--display); font-size: 17px; font-weight: 700; color: var(--white); line-height: 1.2; }
.learn-desc { font-size: 13.5px; color: rgba(255,255,255,0.5); line-height: 1.75; margin-top: 6px; }

/* Feature chips */
.learn-features { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
.learn-feature {
  display: flex; align-items: center; gap: 5px;
  font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.6);
  background: rgba(6,148,209,0.08); border: 1px solid rgba(6,148,209,0.18);
  padding: 3px 10px; border-radius: 6px;
}
.learn-check { color: #0694D1; font-size: 10px; }

/* Price + CTA row */
.learn-footer {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 16px; padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.learn-price { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; white-space: nowrap; }
.learn-price strong { font-size: 20px; font-weight: 800; color: var(--white); font-family: var(--display); margin-right: 3px; }
.learn-cta {
  padding: 9px 18px; border-radius: 9px; border: 1.5px solid rgba(6,148,209,0.4);
  background: transparent; color: var(--blue); font-family: var(--body); font-size: 12px;
  font-weight: 700; cursor: pointer; transition: all 0.22s; white-space: nowrap;
}
.learn-cta:hover { background: rgba(6,148,209,0.12); border-color: #0694D1; color: var(--white); }

/* Featured (first card) stronger gradient */
.hiw-card-border.learn-featured {
  background: linear-gradient(145deg, rgba(6,148,209,0.75) 0%, rgba(80,230,255,0.5) 50%, rgba(6,148,209,0.2) 100%);
}
.hiw-card-border.learn-featured .hiw-card-inner {
  background: linear-gradient(145deg, #0f3050 0%, #071e2e 100%);
}
.hiw-card-border.learn-featured .learn-cta {
  background: linear-gradient(135deg, #0694D1, #076d9d); border-color: transparent; color: var(--white);
  box-shadow: 0 4px 14px rgba(6,148,209,0.3);
}
.hiw-card-border.learn-featured .learn-cta:hover { background: linear-gradient(135deg, #0578b3, #065a82); }
.hiw-card-border.learn-featured .learn-title {
  background: linear-gradient(90deg, #fff 0%, #50e6ff 60%, #0694D1 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}

@media (max-width: 560px) { .learn-sec { padding: 72px 20px; } .learn-footer { flex-direction: column; align-items: flex-start; } }

/* ── CERT PATHS (Sidebar Layout) ── */
.certs-sec { background: var(--light-bg); padding: 100px 48px; border-top: 1px solid var(--light-border); }
.certs-inner { max-width: 1280px; margin: 0 auto; }
.certs-header { margin-bottom: 40px; }
.certs-header .sec-label { color: var(--blue); }
.certs-header .sec-title { color: var(--light-text); }
.certs-header-sub { font-size: 15px; color: var(--light-sub); margin-top: 10px; max-width: 620px; line-height: 1.6; }

/* ── Mode Toggle Row ── */
.cert-section-top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.cert-mode-toggle { display: inline-flex; align-items: center; background: rgba(6,148,209,0.06); border: 1.5px solid rgba(6,148,209,0.18); border-radius: 50px; padding: 4px; gap: 2px; flex-shrink: 0; margin-top: 8px; }
.cert-mode-btn { position: relative; border: none; background: transparent; padding: 10px 22px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--light-sub); cursor: pointer; transition: color 0.25s; white-space: nowrap; overflow: hidden; font-family: var(--body); }
.cert-mode-btn.active { color: var(--white); }
.cert-mode-btn:not(.active):hover { color: var(--light-text); }
.cert-mode-active-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--blue) 0%, #057ab5 100%); border-radius: 50px; box-shadow: 0 4px 18px rgba(6,148,209,0.45); z-index: 0; }
.cert-mode-btn-content { position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 7px; }

/* ── Cert Search Bar ── */
.certs-search-wrap {
  position: relative; display: flex; align-items: center;
  max-width: 640px; margin-top: 24px;
  background: var(--light-white);
  border: 1.5px solid var(--light-border);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.certs-search-wrap:focus-within {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(6,148,209,0.12), 0 2px 8px rgba(0,0,0,0.06);
}
.certs-search-icon {
  position: absolute; left: 14px; color: var(--light-sub); pointer-events: none; flex-shrink: 0;
  transition: color 0.2s;
}
.certs-search-wrap:focus-within .certs-search-icon { color: var(--blue); }
.certs-search-input {
  width: 100%; padding: 13px 44px 13px 44px;
  font-size: 14px; font-weight: 500; color: var(--light-text);
  background: transparent; border: none; outline: none;
  font-family: inherit;
}
.certs-search-input::placeholder { color: var(--light-sub); font-weight: 400; }
.certs-search-clear {
  position: absolute; right: 12px;
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(0,0,0,0.07); border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--light-sub); transition: background 0.15s, color 0.15s;
}
.certs-search-clear:hover { background: rgba(6,148,209,0.15); color: var(--blue); }
.certs-search-kbd {
  position: absolute; right: 12px;
  font-size: 11px; font-weight: 600; color: var(--light-sub);
  background: var(--light-bg); border: 1px solid var(--light-border);
  border-radius: 5px; padding: 2px 7px; pointer-events: none; white-space: nowrap;
}

/* Track tag on search result cards */
.cert-track-tag {
  display: inline-block; font-size: 10px; font-weight: 700;
  color: var(--blue); background: rgba(6,148,209,0.08);
  border: 1px solid rgba(6,148,209,0.2); border-radius: 4px;
  padding: 2px 7px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px;
}

/* No results empty state */
.certs-no-results {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 20px; text-align: center;
}

/* Sidebar + info panel + course grid */
.certs-layout {
  display: grid;
  grid-template-columns: 248px 1fr;
  gap: 0;
  border: 1px solid var(--light-border);
  border-radius: 20px;
  overflow: hidden;
  height: 720px;
  align-items: stretch;
  box-shadow: 0 4px 32px rgba(6,148,209,0.06), 0 1px 4px rgba(0,0,0,0.04);
}
/* right side wrapper: stacks info panel + course panel in 2 rows */
.cert-right {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

/* LEFT SIDEBAR */
.cert-sidebar {
  background: var(--light-white);
  border-right: 1px solid var(--light-border);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
/* scrollable tech list */
.cert-sidebar-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(6,148,209,0.3) transparent;
}
.cert-sidebar-scroll::-webkit-scrollbar { width: 4px; }
.cert-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(6,148,209,0.3); border-radius: 4px; }
/* sticky bottom */
.cert-sidebar-bottom {
  flex-shrink: 0;
  border-top: 1px solid var(--light-border);
  background: var(--light-white);
  padding: 0;
}
.cert-sidebar-label {
  font-size: 10px; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--light-sub);
  padding: 16px 20px 8px;
}
.cert-sidebar-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 16px 11px 12px; cursor: pointer;
  transition: all 0.18s; border: none; background: transparent;
  text-align: left; width: 100%; position: relative;
  border-left: 3px solid transparent;
}
.cert-sidebar-item:hover { background: rgba(6,148,209,0.06); }
.cert-sidebar-item.active {
  background: linear-gradient(90deg, rgba(6,148,209,0.10), rgba(6,148,209,0.03));
  border-left-color: var(--blue);
}
.cert-sidebar-item.active .csi-label { color: var(--blue); font-weight: 700; }
.cert-sidebar-item.active .csi-count { background: rgba(6,148,209,0.12); color: var(--blue); border-color: rgba(6,148,209,0.3); }
.csi-icon {
  width: 38px; height: 38px; flex-shrink: 0; opacity: 0.6;
  transition: opacity 0.2s, transform 0.18s;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px;
}
.cert-sidebar-item:hover .csi-icon { opacity: 0.85; transform: scale(1.05); }
.cert-sidebar-item.active .csi-icon { opacity: 1; transform: scale(1.08); background: rgba(6,148,209,0.08); }
.csi-body { flex: 1; min-width: 0; }
.csi-label { font-size: 13px; font-weight: 600; color: var(--light-text); line-height: 1.3; transition: color 0.2s; display: block; }
.csi-sublabel { font-size: 10.5px; color: var(--light-sub); margin-top: 1px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.csi-count {
  font-size: 11px; font-weight: 700; color: var(--light-sub);
  background: var(--light-bg); border: 1px solid var(--light-border);
  padding: 2px 8px; border-radius: 20px; flex-shrink: 0;
  transition: all 0.2s; min-width: 28px; text-align: center;
}
.cert-sidebar-divider { height: 1px; background: var(--light-border); margin: 6px 0; }
/* Mid-sidebar brochure card */
.csi-brochure-mid {
  margin: 6px 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--light-bg);
  border: 1px solid var(--light-border);
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 4px 16px rgba(6,148,209,0.06);
}
.csi-brochure-icon {
  font-size: 18px; flex-shrink: 0;
  width: 34px; height: 34px; border-radius: 9px;
  background: rgba(6,148,209,0.18); display: flex; align-items: center; justify-content: center;
}
.csi-brochure-text { flex: 1; min-width: 0; }
.csi-brochure-title { font-size: 12px; font-weight: 700; color: var(--light-text); line-height: 1.3; }
.csi-brochure-sub { font-size: 10px; color: var(--light-sub); margin-top: 2px; }
.csi-brochure-btn {
  flex-shrink: 0; padding: 6px 11px; border-radius: 7px;
  background: linear-gradient(135deg, #0694D1, #0578b3);
  border: none; color: #fff; font-size: 11px; font-weight: 700;
  cursor: pointer; font-family: inherit; white-space: nowrap;
  box-shadow: 0 2px 8px rgba(6,148,209,0.4);
  transition: box-shadow 0.2s, transform 0.2s;
}
.csi-brochure-btn:hover { box-shadow: 0 4px 14px rgba(6,148,209,0.55); transform: translateY(-1px); }
.cert-sidebar-actions { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px 16px; }
.csa-enquire, .csa-brochure {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 11px 14px; border-radius: 10px;
  font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: inherit;
  transition: all 0.2s; border: none; letter-spacing: 0.1em;
}
.csa-enquire {
  background: linear-gradient(135deg, #0694D1, #0578b3);
  color: #fff;
  box-shadow: 0 4px 14px rgba(6,148,209,0.35);
}
.csa-enquire:hover { box-shadow: 0 6px 20px rgba(6,148,209,0.5); transform: translateY(-1px); }
.csa-brochure {
  background: #fff;
  color: var(--light-text);
  border: 1.5px solid rgba(6,148,209,0.3) !important;
}
.csa-brochure:hover { background: rgba(6,148,209,0.06); color: var(--blue); border-color: var(--blue) !important; transform: translateY(-1px); }

/* TOP INFO PANEL — two-row layout */
.cert-info-panel {
  background: #fff;
  border-bottom: 1px solid var(--light-border);
  display: flex; flex-direction: column;
  flex-shrink: 0;
  padding: 20px 28px 16px;
  gap: 14px;
  position: relative;
}
.cert-info-panel::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--blue), #50e6ff, var(--blue));
  background-size: 200% 100%; animation: shimmer-line 3s linear infinite;
}
@keyframes shimmer-line { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* Row 1: logo + name/desc + CTA */
.cert-info-row1 { display: flex; align-items: center; gap: 16px; }
.cert-info-logo {
  width: 48px; height: 48px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(6,148,209,0.07); border-radius: 12px;
  border: 1px solid rgba(6,148,209,0.14); padding: 5px;
}
.cert-info-identity { flex: 1; min-width: 0; }
.cert-info-name {
  font-size: 18px; font-weight: 800;
  color: var(--light-text); letter-spacing: -0.2px; line-height: 1.2;
  margin-bottom: 3px;
}
.cert-info-desc { font-size: 12.5px; color: var(--light-sub); line-height: 1.55; }
.cert-info-enroll {
  flex-shrink: 0; padding: 11px 26px; border-radius: 10px;
  background: linear-gradient(135deg, #0694D1, #0578b3);
  border: none; color: #fff; font-family: inherit;
  font-size: 14px; font-weight: 700; cursor: pointer; letter-spacing: 0.15px;
  box-shadow: 0 4px 14px rgba(6,148,209,0.3);
  transition: box-shadow 0.2s, transform 0.2s; white-space: nowrap;
}
.cert-info-enroll:hover { box-shadow: 0 6px 20px rgba(6,148,209,0.48); transform: translateY(-1px); }

/* Row 2: feature pills + level tabs */
.cert-info-row2 {
  display: flex; align-items: center; gap: 12px;
  flex-wrap: wrap; padding-top: 4px;
  border-top: 1px solid var(--light-border);
}
.cert-info-pills { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; }
.cert-info-pill {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11.5px; font-weight: 600; color: #0578b3;
  background: rgba(6,148,209,0.07); border: 1px solid rgba(6,148,209,0.18);
  padding: 4px 10px; border-radius: 20px;
}
.cert-info-pill-dot {
  font-size: 10px; color: #059669; font-weight: 800;
}

/* Level filter — horizontal pill tabs */
.cert-level-tabs { display: flex; gap: 5px; flex-shrink: 0; }
.cert-level-tab {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 13px; border-radius: 20px; font-size: 12px; font-weight: 700;
  border: 1.5px solid transparent; cursor: pointer; font-family: inherit;
  transition: all 0.18s; background: var(--light-bg);
  color: var(--light-sub);
}
.cert-level-tab:hover { border-color: currentColor; }
.cert-level-tab[data-lv="all"]    { --lc: #0694D1; }
.cert-level-tab[data-lv="fund"]   { --lc: #059669; }
.cert-level-tab[data-lv="assoc"]  { --lc: #0578b3; }
.cert-level-tab[data-lv="expert"] { --lc: #d97706; }
.cert-level-tab:hover { color: var(--lc); border-color: var(--lc); background: rgba(0,0,0,0.02); }
.cert-level-tab.active { color: #fff; background: var(--lc); border-color: var(--lc); }
.cert-level-tab-count {
  font-size: 10px; font-weight: 800;
  background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 10px;
}
.cert-level-tab:not(.active) .cert-level-tab-count { background: var(--light-border); color: var(--light-sub); }

/* keep old selectors inert */
.cert-info-divider-v { display: none; }
.cert-info-divider { display: none; }
.cert-info-filter-label { display: none; }
.cert-info-levels { display: none; }
.cert-info-right { display: none; }
.cert-level-track { display: none; }

/* BOTTOM COURSE ROW */
.cert-panel {
  background: #f8fafc;
  display: flex; flex-direction: column;
  overflow: hidden;
  flex: 1;
}
/* sticky filter header */
.cert-panel-sticky {
  flex-shrink: 0;
  padding: 14px 24px 13px;
  background: #fff;
  border-bottom: 1px solid var(--light-border);
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
/* scrollable course grid area */
.cert-panel-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px 22px 28px;
  scrollbar-width: thin;
  scrollbar-color: rgba(6,148,209,0.3) transparent;
}
.cert-panel-scroll::-webkit-scrollbar { width: 5px; }
.cert-panel-scroll::-webkit-scrollbar-thumb { background: rgba(6,148,209,0.3); border-radius: 4px; }
.cert-panel-header { display: none; }
.cert-panel-title-block {}
.cert-panel-icon { display: none; }
.cert-panel-name { display: none; }
.cert-panel-desc { display: none; }
.cert-panel-meta { display: none; }
.cert-meta-pill { display: none; }
.cert-panel-cta { display: none; }
.cert-panel-enroll { display: none; }

/* Course grid in panel */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.cert-card {
  background: #fff;
  border: 1px solid rgba(6,148,209,0.13);
  border-radius: 12px; padding: 16px; cursor: pointer;
  transition: all 0.22s; display: flex;
  flex-direction: column; position: relative; overflow: hidden;
  gap: 0;
}
/* coloured left accent bar */
.cert-card::after {
  content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
  background: var(--blue); border-radius: 14px 0 0 14px; opacity: 0;
  transition: opacity 0.22s;
}
.cert-card.fund-card::after  { background: #10b981; }
.cert-card.assoc-card::after { background: var(--blue); }
.cert-card.expert-card::after{ background: #f59e0b; }
.cert-card:hover {
  border-color: rgba(6,148,209,0.28);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(6,148,209,0.12), 0 2px 8px rgba(0,0,0,0.04);
}
.cert-card:hover::after { opacity: 1; }
/* level badges — properly colour-coded */
.cert-badge {
  display: inline-flex; align-items: center; font-size: 10px; font-weight: 700;
  letter-spacing: 0.5px; text-transform: uppercase; padding: 3px 10px;
  border-radius: 4px; margin-bottom: 12px; width: fit-content;
}
.cert-badge.fund   { background: rgba(16,185,129,0.08); color: #059669; border: 1px solid rgba(16,185,129,0.2); }
.cert-badge.assoc  { background: rgba(6,148,209,0.08);  color: #0578b3; border: 1px solid rgba(6,148,209,0.2); }
.cert-badge.expert { background: rgba(245,158,11,0.08); color: #d97706; border: 1px solid rgba(245,158,11,0.2); }
.cert-name {
  font-size: 14px; font-weight: 700; color: var(--light-text);
  margin-bottom: 10px; line-height: 1.45; flex: 1;
}
.cert-code {
  display: inline-block; font-size: 11px; font-family: 'SFMono-Regular', 'Consolas', monospace;
  color: var(--blue); background: rgba(6,148,209,0.07); border: 1px solid rgba(6,148,209,0.14);
  padding: 2px 8px; border-radius: 4px; font-weight: 600; letter-spacing: 0.3px;
  margin-bottom: 14px;
}
.cert-footer {
  display: flex; flex-direction: column; gap: 10px; margin-top: auto;
  border-top: 1px solid var(--light-border); padding-top: 12px;
}
.cert-price-row {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 2px;
}
.cert-price {
  display: flex; align-items: baseline; gap: 2px;
}
.cert-price-amount {
  font-size: 20px; font-weight: 800; color: var(--blue);
  font-family: var(--display); letter-spacing: -0.5px; line-height: 1;
}
.cert-price-curr {
  font-size: 11px; font-weight: 700; color: var(--blue); margin-right: 1px;
}
.cert-price-label {
  font-size: 10.5px; color: var(--light-sub); font-weight: 500;
}
.cert-dur {
  font-size: 11.5px; color: var(--light-sub); display: flex; align-items: center; gap: 5px;
  font-weight: 600;
}
.cert-actions { display: flex; gap: 8px; }
.cert-btn-brochure {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 9px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 700;
  background: #fff; color: var(--blue);
  border: 1.5px solid var(--blue); cursor: pointer;
  transition: all 0.18s; white-space: nowrap; font-family: inherit;
}
.cert-btn-brochure:hover { background: rgba(6,148,209,0.06); box-shadow: 0 2px 8px rgba(6,148,209,0.2); }
.cert-btn-details {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: 9px 12px; border-radius: 6px; font-size: 12.5px; font-weight: 700;
  background: var(--blue); color: #fff;
  border: none; cursor: pointer;
  transition: all 0.18s; white-space: nowrap; font-family: inherit;
  box-shadow: 0 3px 10px rgba(6,148,209,0.4);
}
.cert-btn-details:hover { background: var(--blue-dark); box-shadow: 0 5px 16px rgba(6,148,209,0.5); transform: translateY(-1px); }


/* ══════════════════════════════
   CERT PATH MAPPER (CodingNinjas style)
   Horizontal level nodes + connector lines
══════════════════════════════ */
.cert-path-mapper { display: none; }
.cert-path-mapper-hidden {
  display: flex; align-items: center;
  gap: 0; margin-bottom: 24px;
  background: rgba(4,14,24,0.6);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px; padding: 16px 20px;
  position: relative; overflow: hidden;
}
.cert-path-mapper::before {
  content: ''; position: absolute; left: 0; right: 0; top: 50%;
  height: 1px; background: rgba(6,148,209,0.15); z-index: 0;
}
.cert-path-all {
  display: flex; align-items: center; justify-content: center;
  padding: 6px 16px; border-radius: 8px; cursor: pointer;
  font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
  background: transparent; border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.45); transition: all 0.2s; white-space: nowrap;
  margin-right: 16px; z-index: 1; flex-shrink: 0;
}
.cert-path-all.active,
.cert-path-all:hover { border-color: rgba(6,148,209,0.5); color: var(--white); background: rgba(6,148,209,0.1); }
.cert-path-levels {
  display: flex; align-items: center; flex: 1; gap: 0; z-index: 1;
}
.cert-path-step {
  display: flex; align-items: center; flex: 1; cursor: pointer;
  transition: all 0.2s; text-decoration: none;
}
.cert-path-node {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  flex: 1;
}
.cert-path-circle {
  width: 36px; height: 36px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.12);
  background: rgba(4,14,24,0.9);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.22s;
  font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.35);
  position: relative; z-index: 2;
}
.cert-path-label {
  font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
  color: rgba(255,255,255,0.35); text-transform: uppercase;
  transition: color 0.22s; white-space: nowrap; text-align: center;
}
.cert-path-sub {
  font-size: 10px; color: rgba(255,255,255,0.2);
  transition: color 0.22s; text-align: center;
}
.cert-path-connector {
  flex: 1; display: flex; align-items: center; z-index: 1;
}
.cert-path-line {
  flex: 1; height: 2px;
  background: linear-gradient(90deg, rgba(6,148,209,0.2), rgba(6,148,209,0.4));
  position: relative;
}
.cert-path-arrow {
  width: 0; height: 0;
  border-top: 5px solid transparent; border-bottom: 5px solid transparent;
  border-left: 7px solid rgba(6,148,209,0.35);
  flex-shrink: 0;
}
/* Active states per level */
.cert-path-step[data-active="true"] .cert-path-circle {
  border-color: var(--blue); background: rgba(6,148,209,0.15);
  color: var(--blue); box-shadow: 0 0 0 4px rgba(6,148,209,0.12);
}
.cert-path-step[data-active="true"] .cert-path-label { color: var(--white); }
.cert-path-step[data-active="true"] .cert-path-sub { color: rgba(255,255,255,0.45); }
.cert-path-step[data-fund="true"] .cert-path-circle { border-color: #0694D1; }
.cert-path-step[data-assoc="true"] .cert-path-circle { border-color: #0694D1; }
.cert-path-step[data-expert="true"][data-active="true"] .cert-path-circle { border-color: var(--amber); color: var(--amber); background: rgba(245,158,11,0.1); box-shadow: 0 0 0 4px rgba(245,158,11,0.1); }
.cert-path-step[data-expert="true"][data-active="true"] .cert-path-label { color: var(--amber); }
/* hover */
.cert-path-step:hover .cert-path-circle { border-color: rgba(6,148,209,0.6); color: rgba(255,255,255,0.8); background: rgba(6,148,209,0.08); }
.cert-path-step:hover .cert-path-label { color: rgba(255,255,255,0.75); }

/* count badge on node */
.cert-path-count {
  position: absolute; top: -5px; right: -5px;
  background: var(--blue); color: #fff;
  font-size: 9px; font-weight: 800; width: 16px; height: 16px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  border: 1.5px solid var(--ink2);
}
.cert-path-step[data-expert="true"][data-active="true"] .cert-path-count { background: var(--amber); }

/* ══════════════════════════════
   WHY CHOOSE KOENIG — Video + reasons
══════════════════════════════ */
.why-sec {
  background: var(--ink); padding: 100px 48px;
  border-top: 1px solid rgba(255,255,255,0.04);
}
.why-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: flex-start;
}
.why-video-col { padding-top: 8px; }
.why-video-col { position: relative; }
.why-video-wrap {
  position: relative; border-radius: 20px; overflow: hidden;
  border: 1px solid rgba(6,148,209,0.2);
  box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
  aspect-ratio: 16/9;
  background: #000;
}
.why-video-wrap iframe { width: 100%; height: 100%; display: block; border: none; }
.why-video-thumb { position: relative; width: 100%; height: 100%; cursor: pointer; display: block; }
.why-video-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.why-play-btn {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.28); transition: background 0.2s;
}
.why-play-btn:hover { background: rgba(0,0,0,0.18); }
.why-play-circle {
  width: 68px; height: 68px; border-radius: 50%;
  background: var(--blue); display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 0 12px rgba(6,148,209,0.18), 0 8px 32px rgba(6,148,209,0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.why-play-btn:hover .why-play-circle {
  transform: scale(1.08);
  box-shadow: 0 0 0 16px rgba(6,148,209,0.14), 0 12px 40px rgba(6,148,209,0.5);
}
.why-video-glow {
  position: absolute; inset: -40px; pointer-events: none; z-index: -1;
  background: radial-gradient(circle at 50% 50%, rgba(6,148,209,0.12) 0%, transparent 70%);
  filter: blur(20px);
}
.why-text-col { display: flex; flex-direction: column; }
.why-reasons { display: flex; flex-direction: column; gap: 18px; margin: 28px 0 36px; }
.why-reason {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 16px 18px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.why-reason:hover { border-color: rgba(6,148,209,0.2); background: rgba(6,148,209,0.04); }
.why-reason-icon {
  width: 36px; height: 36px; border-radius: 9px; flex-shrink: 0;
  background: rgba(6,148,209,0.1); border: 1px solid rgba(6,148,209,0.2);
  display: flex; align-items: center; justify-content: center;
}
.why-reason-icon svg { width: 16px; height: 16px; color: var(--blue); }
.why-reason-body {}
.why-reason-title { font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 3px; }
.why-reason-sub { font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.5; }
.why-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: var(--blue); color: #fff;
  font-family: var(--body); font-size: 15px; font-weight: 700;
  padding: 13px 28px; border-radius: 10px; border: none; cursor: pointer;
  position: relative; overflow: hidden; align-self: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(6,148,209,0.35);
}
.why-cta::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  background-size: 200% 100%; animation: shimmerGrad 2.5s linear infinite;
}
.why-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(6,148,209,0.55); }

/* ── USP CHIPS ── */
.usp-chips {
  display: flex; flex-wrap: wrap; gap: 12px;
  margin-top: 36px; justify-content: center;
}
.usp-chip {
  display: flex; align-items: center; gap: 10px;
  background: rgba(6,148,209,0.06); border: 1px solid rgba(6,148,209,0.18);
  border-radius: 12px; padding: 12px 18px;
  transition: all 0.2s;
}
.usp-chip:hover { background: rgba(6,148,209,0.12); border-color: rgba(6,148,209,0.35); transform: translateY(-2px); }
.usp-chip-icon { font-size: 20px; flex-shrink: 0; }
.usp-chip-label { font-size: 13px; font-weight: 700; color: var(--white); line-height: 1.2; }
.usp-chip-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; }

/* ── LEAD GEN MID-PAGE ── */
.lgm-sec {
  background: var(--light-bg);
  padding: 90px 48px;
  overflow: hidden;
  position: relative;
}
.lgm-bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 60% at 15% 50%, rgba(6,148,209,0.13) 0%, transparent 65%),
    radial-gradient(ellipse 60% 80% at 85% 30%, rgba(9,49,72,0.8) 0%, transparent 70%);
}
.lgm-inner {
  max-width: 1100px; margin: 0 auto; position: relative;
  display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
}
.lgm-left {}
.lgm-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(6,148,209,0.12); border: 1px solid rgba(6,148,209,0.3);
  border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 700;
  color: #50e6ff; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px;
}
.lgm-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #50e6ff; animation: lgm-pulse 2s ease-in-out infinite; }
@keyframes lgm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
.lgm-title {
  font-size: clamp(28px, 3.5vw, 42px); font-weight: 800; line-height: 1.18;
  color: var(--white); margin-bottom: 16px;
}
.lgm-title em { font-style: normal; color: #50e6ff; }
.lgm-desc {
  font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.75; max-width: 440px; margin-bottom: 36px;
}
.lgm-ctas { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.lgm-or { font-size: 13px; color: rgba(255,255,255,0.3); }
.lgm-bullets { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
.lgm-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5; }
.lgm-bullet-dot { color: #50e6ff; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

/* RIGHT — DisplayCards stack */
.lgm-right {
  display: flex; align-items: center; justify-content: center;
  padding: 60px 20px 80px;
}
.lgm-dc-stack {
  display: grid;
  grid-template-areas: 'stack';
  place-items: center;
  width: 100%; max-width: 420px;
}
/* shared card base */
.lgm-dc-card {
  grid-area: stack;
  position: relative;
  width: 340px; height: 144px;
  transform: skewY(-8deg);
  border-radius: 14px;
  border: 2px solid rgba(6,148,209,0.25);
  background: rgba(9,49,72,0.72);
  backdrop-filter: blur(10px);
  padding: 14px 18px;
  display: flex; flex-direction: column; justify-content: space-between;
  transition: transform 0.65s cubic-bezier(0.22,1,0.36,1),
              border-color 0.4s, filter 0.65s;
  cursor: default; user-select: none;
}
/* right-side gradient fade (the ::after overlay) */
.lgm-dc-card::after {
  content: '';
  position: absolute;
  right: -2px; top: -5%;
  width: 180px; height: 110%;
  background: linear-gradient(to left, #071e2e, transparent);
  border-radius: 0 14px 14px 0;
  pointer-events: none;
}
/* before overlay for the greyed-out cards */
.lgm-dc-card::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 12px;
  background: rgba(7,30,46,0.55);
  transition: opacity 0.6s;
  pointer-events: none;
  z-index: 1;
}
.lgm-dc-card > * { position: relative; z-index: 2; }

/* BACK card */
.lgm-dc-back {
  filter: grayscale(1);
  transform: skewY(-8deg) translateX(0px) translateY(0px);
}
.lgm-dc-back:hover {
  filter: grayscale(0);
  transform: skewY(-8deg) translateY(-40px);
  border-color: rgba(255,255,255,0.22);
}
.lgm-dc-back:hover::before { opacity: 0; }

/* MID card */
.lgm-dc-mid {
  filter: grayscale(0.6);
  transform: skewY(-8deg) translateX(52px) translateY(36px);
}
.lgm-dc-mid:hover {
  filter: grayscale(0);
  transform: skewY(-8deg) translateX(52px) translateY(-4px);
  border-color: rgba(255,255,255,0.22);
}
.lgm-dc-mid::before { opacity: 0.5; }
.lgm-dc-mid:hover::before { opacity: 0; }

/* FRONT card — always full color */
.lgm-dc-front {
  filter: grayscale(0);
  transform: skewY(-8deg) translateX(104px) translateY(72px);
  border-color: rgba(6,148,209,0.5);
}
.lgm-dc-front::before { display: none; }
.lgm-dc-front:hover {
  transform: skewY(-8deg) translateX(104px) translateY(88px);
  border-color: rgba(80,230,255,0.6);
  box-shadow: 0 8px 32px rgba(6,148,209,0.35);
}

/* card internals */
.lgm-dc-top { display: flex; align-items: center; gap: 8px; }
.lgm-dc-icon {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 14px;
  flex-shrink: 0;
}
.lgm-dc-title { font-size: 16px; font-weight: 700; color: #50e6ff; }
.lgm-dc-desc { font-size: 15px; color: rgba(255,255,255,0.85); white-space: nowrap; }
.lgm-dc-meta { font-size: 12px; color: rgba(255,255,255,0.38); }

.lgm-ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 8px; }
.lgm-trust-row { display: flex; gap: 18px; margin-top: 20px; }
.lgm-trust-item { font-size: 12px; color: rgba(255,255,255,0.35); }

@media (max-width: 960px) {
  .lgm-inner { grid-template-columns: 1fr; gap: 40px; }
  .lgm-right { padding: 20px 0 60px; }
  .lgm-sec { padding: 72px 24px; }
  .lgm-dc-card { width: 280px; }
  .lgm-dc-mid  { transform: skewY(-8deg) translateX(40px) translateY(32px); }
  .lgm-dc-mid:hover { transform: skewY(-8deg) translateX(40px) translateY(-4px); }
  .lgm-dc-front { transform: skewY(-8deg) translateX(80px) translateY(64px); }
  .lgm-dc-front:hover { transform: skewY(-8deg) translateX(80px) translateY(76px); }
}

/* ── LIGHT SECTION OVERRIDES ── */
/* All light sections share these base rules */
.companies-sec, .usp-sec, .learn-sec,
.cert-showcase-sec, .lgm-sec {
  color: var(--light-text);
}
.companies-sec .sec-label, .usp-sec .sec-label,
.learn-sec .sec-label, .certs-sec .sec-label,
.lgm-sec .sec-label {
  color: var(--blue); background: rgba(6,148,209,0.08); border-color: rgba(6,148,209,0.2);
}
.companies-sec .sec-title, .usp-sec .sec-title,
.learn-sec .sec-title, .certs-sec .sec-title,
.lgm-sec .sec-title { color: var(--light-text); }

.companies-sec .sec-sub, .usp-sec .sec-sub, .certs-sec .sec-sub,
.learn-sec .sec-sub,
.lgm-sec .sec-sub { color: var(--light-sub); }

/* Companies */
.companies-sec p, .companies-sec .companies-sub { color: var(--light-sub); }
.companies-sec .companies-headline { color: var(--light-text); }
.companies-sec .companies-headline-sub { color: var(--light-sub); }
.companies-sec .companies-title { color: var(--light-text); }
.companies-sec .companies-stat-num { color: var(--light-text); }
.companies-sec .companies-stat-lbl { color: var(--light-sub); }
.companies-sec .companies-cta-btn { background: var(--blue); color: #fff; border-color: var(--blue); }
.companies-sec .companies-div { background: rgba(6,148,209,0.18); }

/* USP comparison table */
.usp-sec .usp-table { background: var(--light-bg); border: 1px solid var(--light-border); }
.usp-sec .usp-col-head { color: var(--light-sub) !important; }
.usp-sec .usp-col-koenig .usp-col-head { color: var(--blue) !important; }
.usp-sec .usp-col-others .usp-col-head { color: #7a8a94 !important; }
.usp-sec .usp-col-label { background: transparent; }
.usp-sec .usp-row-label { color: var(--light-text); border-bottom-color: rgba(6,148,209,0.08); }
.usp-sec .usp-row-label-arrow { color: var(--light-sub); }
.usp-sec .usp-row-koenig { color: var(--light-text); border-bottom-color: rgba(6,148,209,0.08); background: transparent; }
.usp-sec .usp-row-others { color: #7a8a94; border-bottom-color: rgba(6,148,209,0.06); }
.usp-sec .usp-col-koenig { background: rgba(6,148,209,0.06); border-color: rgba(6,148,209,0.18); }
.usp-sec .usp-head-koenig { color: var(--blue); }
.usp-sec .usp-head-other { color: #7a8a94; }
.usp-sec .usp-row { border-bottom-color: rgba(6,148,209,0.07); }
.usp-sec .usp-row:hover { background: rgba(6,148,209,0.04); }
.usp-sec .usp-feat { color: var(--light-text); }
.usp-sec .usp-cell { color: #5a7080; }
.usp-sec .usp-cell.yes { color: #0078c2; }
.usp-sec .usp-chip { background: var(--light-bg); border-color: rgba(6,148,209,0.18); }
.usp-sec .usp-chip:hover { background: rgba(6,148,209,0.06); }
.usp-sec .usp-chip-label { color: var(--light-text); }
.usp-sec .usp-chip-sub { color: var(--light-sub); }

/* 4 Ways to Learn on light-gray */
.learn-sec .hiw-card-border { background: linear-gradient(135deg, rgba(6,148,209,0.25), rgba(6,148,209,0.08)); }
.learn-sec .hiw-card-inner { background: var(--light-white); }
.learn-sec .hiw-card-title { color: var(--light-text); }
.learn-sec .hiw-card-desc { color: var(--light-sub); }
.learn-sec .learn-title { color: var(--light-text); }
.learn-sec .learn-desc { color: var(--light-sub); }
.learn-sec .learn-badge { color: var(--blue); background: rgba(6,148,209,0.08); border-color: rgba(6,148,209,0.2); }
.learn-sec .learn-feature { color: var(--light-sub); }
.learn-sec .learn-check { color: var(--blue); }
.learn-sec .learn-price { color: var(--light-sub); }
.learn-sec .learn-price strong { color: var(--light-text); }
.learn-sec .hiw-connector-line { background: rgba(6,148,209,0.2); }

/* Lead Gen (Want to Know More) on light-gray */
.lgm-sec .lgm-bg { display: none; }
.lgm-sec .lgm-title { color: var(--light-text); }
.lgm-sec .lgm-title em { color: var(--blue); }
.lgm-sec .lgm-desc { color: var(--light-sub); }
.lgm-sec .lgm-bullet { color: var(--light-sub); }
.lgm-sec .lgm-bullet-dot { color: var(--blue); }
.lgm-sec .lgm-eyebrow { color: var(--blue); background: rgba(6,148,209,0.08); border-color: rgba(6,148,209,0.2); }
.lgm-sec .lgm-right { background: var(--light-white); border-color: rgba(6,148,209,0.18); box-shadow: 0 8px 32px rgba(6,148,209,0.08); }
.lgm-sec .lgm-form-title { color: var(--light-text); }
.lgm-sec .lgm-form-sub { color: var(--light-sub); }
.lgm-sec .lgm-label { color: var(--light-sub); }
.lgm-sec .lgm-input { background: var(--light-bg); border-color: rgba(6,148,209,0.2); color: var(--light-text); }
.lgm-sec .lgm-input::placeholder { color: rgba(74,99,117,0.5); }
.lgm-sec .lgm-input:focus { background: #fff; border-color: rgba(6,148,209,0.5); }
.lgm-sec .lgm-form-note { color: var(--light-sub); }
.lgm-sec .lgm-trust-item { color: var(--light-sub); }
.lgm-sec .lgm-dc-card { background: var(--light-white); border-color: rgba(6,148,209,0.18); }
.lgm-sec .lgm-dc-title { color: var(--blue); }
.lgm-sec .lgm-dc-desc { color: var(--light-text); }
.lgm-sec .lgm-dc-meta { color: var(--light-sub); }
.lgm-sec .lgm-dc-back { filter: grayscale(0.3); }
.lgm-sec .lgm-dc-back::before, .lgm-sec .lgm-dc-mid::before { background: rgba(240,245,251,0.7); }
.lgm-sec .lgm-dc-card::after { background: linear-gradient(to left, var(--light-bg), transparent); }


/* Cert showcase — light-bg overrides */
.cert-showcase-sec .cert-showcase-label { color: var(--blue); }
.cert-showcase-sec .cert-showcase-title { color: var(--light-text); }
.cert-showcase-sec .cert-showcase-title em { color: var(--blue); }
.cert-showcase-sec .cert-showcase-desc { color: var(--light-sub); }
.cert-showcase-sec .cert-unlock-note { color: var(--light-sub); }

/* ── ENROLLMENT INSIGHTS ── */
.enroll-sec { background: var(--light-bg); padding: 80px 48px; overflow: hidden; position: relative; }
.enroll-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 72px; }
.enroll-left { flex: 1; min-width: 0; }
.enroll-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--blue); margin-bottom: 12px; }
.enroll-title { font-family: var(--display); font-size: clamp(28px,3vw,40px); font-weight: 800; color: var(--light-text); line-height: 1.1; margin-bottom: 10px; }
.enroll-title em { font-style: normal; color: var(--blue); }
.enroll-sub { font-size: 14px; color: var(--light-sub); line-height: 1.65; margin-bottom: 28px; max-width: 380px; }
.enroll-legend { display: flex; flex-direction: column; gap: 10px; }
.enroll-legend-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px; border-radius: 10px; cursor: pointer;
  transition: background 0.18s; border: 1px solid transparent;
}
.enroll-legend-item:hover, .enroll-legend-item.active {
  background: rgba(6,148,209,0.06); border-color: rgba(6,148,209,0.14);
}
.enroll-legend-left { display: flex; align-items: center; gap: 10px; }
.enroll-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.enroll-legend-name { font-size: 13px; font-weight: 600; color: var(--light-text); }
.enroll-legend-bar-wrap { flex: 1; margin: 0 16px; height: 4px; background: rgba(6,148,209,0.1); border-radius: 2px; overflow: hidden; }
.enroll-legend-bar { height: 100%; border-radius: 2px; transition: width 1s ease; }
.enroll-legend-pct { font-size: 12px; font-weight: 700; color: var(--light-sub); min-width: 36px; text-align: right; }
.enroll-right { flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.enroll-donut-wrap { position: relative; }
.enroll-center-label { text-align: center; }
.enroll-center-val { font-family: var(--display); font-size: 32px; font-weight: 800; color: var(--light-text); line-height: 1; }
.enroll-center-sub { font-size: 11px; color: var(--light-sub); margin-top: 4px; letter-spacing: 0.5px; }

/* ── Radar: Job Function ── */
.enroll-radar-wrap {
  max-width: 1100px; margin: 56px auto 0;
  background: var(--light-white);
  border: 1px solid var(--light-border);
  border-radius: 18px;
  overflow: hidden;
}
.enroll-radar-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 20px;
  padding: 28px 36px 20px;
  border-bottom: 1px solid var(--light-border);
}
.enroll-radar-title {
  font-family: var(--display); font-size: 22px; font-weight: 800;
  color: var(--light-text); line-height: 1.15;
}
.enroll-radar-title em { font-style: normal; color: var(--blue); }
.enroll-radar-sub { font-size: 13px; color: var(--light-sub); margin-top: 5px; line-height: 1.5; }
.enroll-radar-legend { display: flex; align-items: center; gap: 16px; flex-shrink: 0; padding-top: 4px; }
.enroll-radar-legend-item { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; color: var(--light-text); }
.enroll-radar-chart { padding: 8px 24px 24px; }
@media (max-width: 700px) {
  .enroll-radar-header { flex-direction: column; gap: 12px; padding: 20px; }
  .enroll-radar-chart { padding: 8px 8px 16px; }
}

/* ── TESTIMONIALS ── */
.test-sec { background: var(--light-bg); padding: 100px 48px; overflow: hidden; border-top: 1px solid var(--light-border); }
.test-inner { max-width: 1200px; margin: 0 auto; }
.test-sec .sec-title { color: var(--light-text); }
.test-sec .sec-sub { color: var(--light-sub); }
.test-sec .sec-label { color: var(--blue); background: rgba(6,148,209,0.08); border-color: rgba(6,148,209,0.2); }
/* Scrolling columns */
.test-cols-outer { display: flex; justify-content: center; gap: 24px; margin-top: 40px; max-height: 740px; overflow: hidden; -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); }
.test-col-md { display: none; }
.test-col-lg { display: none; }
@media (min-width: 768px) { .test-col-md { display: block; } }
@media (min-width: 1024px) { .test-col-lg { display: block; } }
.test-col-card {
  padding: 28px 28px 24px;
  border-radius: 24px;
  border: 1px solid var(--light-border);
  box-shadow: 0 4px 24px rgba(6,148,209,0.06), 0 1px 4px rgba(0,0,0,0.04);
  max-width: 280px; width: 280px;
  background: var(--light-white);
  flex-shrink: 0;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: default;
}
.test-col-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(6,148,209,0.12), 0 2px 8px rgba(0,0,0,0.06); }
.test-col-quote { font-size: 13px; color: var(--light-sub); line-height: 1.75; font-style: normal; }
.test-col-author { display: flex; align-items: center; gap: 10px; margin-top: 18px; }
.test-col-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--light-border); flex-shrink: 0; object-fit: cover; transition: border-color 0.3s; }
.test-col-card:hover .test-col-avatar { border-color: rgba(6,148,209,0.35); }
.test-col-name { font-size: 13px; font-weight: 600; color: var(--light-text); line-height: 1.3; }
.test-col-role { font-size: 11px; color: var(--light-sub); margin-top: 2px; }
.test-col-cert { display: inline-flex; font-size: 10px; font-weight: 700; color: var(--blue); background: rgba(6,148,209,0.07); border: 1px solid rgba(6,148,209,0.18); padding: 2px 7px; border-radius: 4px; margin-top: 5px; }

/* ── GLOBE SECTION ── */
.globe-sec {
  background: var(--light-white);
  padding: 100px 48px;
  overflow: hidden;
  position: relative;
  border-top: 1px solid var(--light-border);
}
.globe-sec::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 50% at 70% 50%, rgba(6,148,209,0.05) 0%, transparent 70%);
  pointer-events: none;
}
.globe-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; gap: 64px;
  position: relative; z-index: 1;
}
.globe-content { flex: 1; min-width: 0; }
.globe-canvas-wrap {
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.globe-stats {
  display: flex; gap: 28px; margin-top: 28px;
  flex-wrap: wrap;
}
.globe-stat { display: flex; flex-direction: column; gap: 4px; }
.globe-stat-num { font-size: 32px; font-weight: 800; color: var(--light-text); line-height: 1; }
.globe-stat-num span { color: var(--blue); }
.globe-stat-lbl { font-size: 12px; font-weight: 500; color: var(--light-sub); text-transform: uppercase; letter-spacing: 1px; }
.globe-divider { width: 1px; align-self: stretch; background: var(--light-border); }
.globe-badges {
  display: flex; gap: 10px; flex-wrap: wrap; margin-top: 32px;
}
.globe-badge {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12px; font-weight: 600; color: var(--light-sub);
  background: var(--light-bg); border: 1px solid var(--light-border);
  border-radius: 40px; padding: 7px 14px;
}
.globe-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); flex-shrink: 0; }

/* Globe pulsing dot overlay */
@keyframes gm-ring-expand {
  0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
  100% { transform: translate(-50%,-50%) scale(4); opacity: 0; }
}
/* Fixed solid dot */
.gm-dot {
  display: block; width: 8px; height: 8px; border-radius: 50%;
  background: #0694D1;
  box-shadow: 0 0 4px rgba(6,148,209,0.9), 0 0 8px rgba(6,148,209,0.5);
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
/* Expanding ring */
.gm-ring {
  display: block; width: 8px; height: 8px; border-radius: 50%;
  border: 1.5px solid rgba(6,148,209,0.8);
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation: gm-ring-expand 2s ease-out infinite;
}

/* Small pulse for country list */
@keyframes gm-pulse-sm-ring {
  0%   { box-shadow: 0 0 0 0 rgba(6,148,209,0.6); }
  70%  { box-shadow: 0 0 0 5px rgba(6,148,209,0); }
  100% { box-shadow: 0 0 0 0 rgba(6,148,209,0); }
}
.gm-pulse-sm {
  display: block; width: 7px; height: 7px; border-radius: 50%;
  background: var(--blue); animation: gm-pulse-sm-ring 2.2s ease-out infinite;
}

/* Country chips — single horizontal wrap row */
.globe-country-grid {
  display: flex; flex-wrap: wrap; gap: 6px; margin-top: 20px;
}
.globe-country-row {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 10px; border-radius: 20px;
  background: var(--light-bg); border: 1px solid var(--light-border);
  transition: border-color 0.15s, background 0.15s;
  white-space: nowrap;
}
.globe-country-row:hover { border-color: rgba(6,148,209,0.45); background: rgba(6,148,209,0.04); }
.globe-country-dot { flex-shrink: 0; display: flex; align-items: center; }
.globe-country-flag { font-size: 14px; line-height: 1; }
.globe-country-name { font-size: 12px; font-weight: 600; color: var(--light-text); }

@media (max-width: 900px) {
  .globe-inner { flex-direction: column; gap: 40px; }
  .globe-canvas-wrap > div { width: 300px !important; height: 300px !important; }
  .globe-sec { padding: 72px 20px; }
  .globe-country-grid { grid-template-columns: 1fr 1fr; }
}

/* ── COMPANIES SECTION ── */
.companies-sec {
  background: var(--light-white);
  padding: 72px 0 64px;
  border-top: 1px solid var(--light-border);
  border-bottom: 1px solid var(--light-border);
  overflow: hidden;
}
.companies-inner { max-width: 1260px; margin: 0 auto; text-align: center; }
.companies-headline-wrap { text-align: center; margin-bottom: 52px; padding: 0 24px; }
.companies-headline {
  font-family: var(--display); font-weight: 800; font-size: clamp(26px,3vw,42px);
  color: var(--white); letter-spacing: -0.5px; margin-bottom: 10px; line-height: 1.15;
}
.companies-headline em { font-style: normal; color: var(--blue); }
.companies-headline-sub { font-size: 15px; color: rgba(255,255,255,0.38); margin-bottom: 20px; font-weight: 400; }
.companies-sub { font-size: 15px; color: rgba(255,255,255,0.4); margin-bottom: 52px; }
.companies-underline {
  width: 80px; height: 2px; margin: 0 auto;
  background: linear-gradient(90deg, var(--blue), var(--sky));
  border-radius: 2px;
}


/* Stats block row */
.companies-cta-row { display: flex; justify-content: center; gap: 0; margin-top: 48px; border: 1px solid rgba(255,255,255,0.07); border-radius: var(--r16); overflow: hidden; max-width: 800px; margin-left: auto; margin-right: auto; }
.companies-stat-block { flex: 1; padding: 28px 20px; text-align: center; border-right: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); }
.companies-stat-block:last-child { border-right: none; }
.companies-stat-num { font-family: var(--display); font-size: 36px; color: var(--blue); letter-spacing: 1px; line-height: 1; }
.companies-stat-lbl { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 6px; font-weight: 500; }
.companies-stat-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,217,168,0.08); border: 1px solid rgba(6,148,209,0.15); color: var(--blue); font-size: 13px; font-weight: 600; padding: 8px 16px; border-radius: 20px; }

.companies-cta-btn {
  background: linear-gradient(135deg, var(--blue), #076d9d);
  color: var(--white); font-family: var(--body); font-weight: 700; font-size: 15px;
  padding: 15px 36px; border-radius: var(--r8); border: none; cursor: pointer;
  transition: all 0.25s; box-shadow: 0 8px 32px rgba(6,148,209,0.3);
}
.companies-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(6,148,209,0.4); }

/* Auto-scrolling logo track — white pill cards for full brand colour visibility */
.companies-marquee-wrap {
  position: relative; overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
  margin-bottom: 16px;
  padding: 10px 0;
}
.companies-marquee {
  display: flex; gap: 12px; width: max-content; align-items: center;
  animation: marquee 38s linear infinite;
  will-change: transform;
}
.companies-marquee-wrap:hover .companies-marquee { animation-play-state: paused; }
.companies-marquee-2 { animation-direction: reverse; animation-duration: 46s; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* White pill card — logo + name stacked */
.company-logo-item {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px;
  padding: 14px 20px 12px; flex-shrink: 0; min-width: 120px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
}
.company-logo-item:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 10px 28px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.15);
}
.company-logo-item svg { height: 26px; width: auto; display: block; }
.company-logo-name {
  font-size: 10.5px; font-weight: 700; color: #444;
  letter-spacing: 0.1px; text-align: center; white-space: nowrap;
  line-height: 1;
}

.companies-cta-row {
  margin-top: 48px; display: flex; align-items: center;
  justify-content: center; gap: 16px; flex-wrap: wrap;
}
.companies-stat-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(16,217,168,0.08); border: 1px solid rgba(6,148,209,0.15);
  color: var(--blue); font-size: 14px; font-weight: 700;
  padding: 10px 20px; border-radius: 24px;
}
.companies-cta-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--blue); color: var(--white);
  font-family: var(--body); font-size: 14px; font-weight: 700;
  padding: 12px 28px; border-radius: var(--r8); border: none; cursor: pointer;
  transition: all 0.25s;
}
.companies-cta-btn:hover { background: #057ab5; transform: translateY(-2px); box-shadow: 0 16px 36px rgba(6,148,209,0.4); }

/* ── DISPLAY CARDS ── */
.dc-stack {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
}
.dc-card {
  position: relative;
  border-radius: 14px;
  border: 1.5px solid rgba(6,148,209,0.15);
  background: #ffffff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  user-select: none;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(6,148,209,0.06);
}
/* accent top bar */
.dc-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(90deg, #0694D1, #50e6ff);
  opacity: 0.6;
  transition: opacity 0.3s;
}
.dc-card:hover { transform: translateY(-6px); border-color: rgba(6,148,209,0.4); box-shadow: 0 16px 40px rgba(6,148,209,0.16); }
.dc-card:hover::before { opacity: 1; }

/* front card always highlighted */
.dc-card.dc-front { border-color: rgba(6,148,209,0.32); box-shadow: 0 4px 20px rgba(6,148,209,0.12); }

/* show hover detail on lift */
.dc-card-detail {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease;
}
.dc-card:hover .dc-card-detail {
  max-height: 120px;
  opacity: 1;
}

.dc-card-top  { display: flex; align-items: flex-start; gap: 8px; }
.dc-card-badge {
  font-size: 8px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;
  padding: 2px 6px; border-radius: 20px; margin-left: auto;
  background: rgba(6,148,209,0.10); color: #0694D1;
  border: 1px solid rgba(6,148,209,0.2);
  flex-shrink: 0; white-space: nowrap;
}
.dc-card-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(6,148,209,0.14), rgba(80,230,255,0.08));
  box-shadow: 0 0 10px rgba(6,148,209,0.18);
  transition: box-shadow 0.3s;
}
.dc-card:hover .dc-card-icon { box-shadow: 0 0 18px rgba(6,148,209,0.36); }
.dc-card-icon svg { width: 16px; height: 16px; color: #0694D1; }
.dc-card-heading { display: flex; flex-direction: column; gap: 1px; min-width: 0; flex: 1; }
.dc-card-title { font-size: 13px; font-weight: 700; color: #071e2e; line-height: 1.25; }
.dc-card-code  { font-size: 10.5px; font-weight: 600; color: #0694D1; letter-spacing: 0.5px; }
.dc-card-desc  { font-size: 11.5px; color: #4a6375; line-height: 1.55; flex: 1; }
.dc-card-stat  {
  display: flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700; color: #0694D1;
  background: rgba(6,148,209,0.07); border-radius: 6px;
  padding: 5px 8px;
}
.dc-card-stat svg { width: 11px; height: 11px; flex-shrink: 0; }
.dc-card-detail-inner {
  border-top: 1px solid rgba(6,148,209,0.10);
  padding-top: 8px;
  display: flex; flex-direction: column; gap: 5px;
}
.dc-card-detail-row {
  font-size: 10.5px; color: #4a6375; display: flex; align-items: center; gap: 5px;
}
.dc-card-detail-row svg { width: 11px; height: 11px; color: #0694D1; flex-shrink: 0; }
.dc-card-dl-hint {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700; color: #0694D1;
  background: rgba(6,148,209,0.08); border: 1px solid rgba(6,148,209,0.22);
  border-radius: 6px; padding: 5px 9px; cursor: pointer;
  font-family: inherit; transition: background 0.2s, box-shadow 0.2s;
  margin-top: 2px;
}
.dc-card-dl-hint:hover { background: rgba(6,148,209,0.16); box-shadow: 0 4px 12px rgba(6,148,209,0.18); }
.dc-card-dl-hint svg { width: 10px; height: 10px; }

/* ── CERT SHOWCASE ── */
.cert-showcase-sec {
  background: var(--light-bg); padding: 100px 48px;
  overflow: hidden; position: relative;
}
.cert-showcase-sec::before {
  content:''; position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(ellipse 800px 500px at 65% 50%, rgba(6,148,209,0.06), transparent 60%);
}
.cert-showcase-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 64px; }
.cert-showcase-left { flex: 1; min-width: 0; position: relative; z-index: 1; }
.cert-showcase-right { flex-shrink: 0; width: min(500px, 100%); position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; }

/* Left text side */
.cert-showcase-label { font-size:12px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--blue); margin-bottom:14px; }
.cert-showcase-title { font-family:var(--display); font-size:32px; letter-spacing:-0.5px; color:var(--light-text); line-height:1.05; margin-bottom:16px; }
.cert-showcase-title em { font-style:normal; color:var(--blue); }
.cert-showcase-desc { font-size:15px; color:var(--light-sub); line-height:1.7; margin-bottom:32px; max-width:440px; }
.cert-unlock-btn {
  display:inline-flex; align-items:center; gap:10px;
  background: linear-gradient(135deg, var(--blue), #076d9d);
  color:#fff; font-family:var(--body); font-size:14px; font-weight:700;
  padding:13px 28px; border-radius:10px; border:none; cursor:pointer;
  box-shadow:0 8px 28px rgba(6,148,209,0.35); transition:all 0.25s;
}
.cert-unlock-btn:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(6,148,209,0.5); }
.cert-unlock-note { font-size:11px; color:var(--light-sub); margin-top:10px; }

/* Certificate real image (right side) */
.cert-preview-wrap { position:relative; }
.cert-real-img { width:100%; max-width:460px; display:block; border-radius:12px; box-shadow: 0 24px 64px rgba(6,148,209,0.18), 0 4px 16px rgba(0,0,0,0.10); border: 1px solid rgba(6,148,209,0.18); }
.cert-preview-wrap::before { content:''; position:absolute; inset:-3px; border-radius:14px; background:linear-gradient(135deg,rgba(6,148,209,0.35),rgba(6,148,209,0.05)); z-index:-1; }
.cert-card-mock { background:linear-gradient(135deg,#0a1628 0%,#0d2140 40%,#0a1e3a 100%); border-radius:14px; padding:36px 40px; position:relative; overflow:hidden; border:1px solid rgba(6,148,209,0.2); }
.cert-card-mock::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg,#0694D1,#45B0E1); }
.cert-watermark { position:absolute; bottom:-20px; right:-20px; width:180px; height:180px; opacity:0.04; font-size:160px; line-height:1; pointer-events:none; user-select:none; }
.cert-mock-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; }
.cert-mock-org { display:flex; align-items:center; gap:8px; }
.cert-mock-org-name { font-size:13px; font-weight:700; letter-spacing:1px; color:rgba(255,255,255,0.5); text-transform:uppercase; }
.cert-mock-stamp { width:52px; height:52px; border-radius:50%; border:2px solid rgba(6,148,209,0.4); display:flex; align-items:center; justify-content:center; background:rgba(6,148,209,0.08); font-size:22px; }
.cert-mock-presented { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.3); margin-bottom:6px; }
.cert-mock-recipient { font-family:var(--display); font-size:32px; letter-spacing:1px; color:var(--white); margin-bottom:4px; }
.cert-mock-subtitle { font-size:12px; color:rgba(255,255,255,0.35); letter-spacing:0.5px; margin-bottom:20px; }
.cert-mock-course-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.25); margin-bottom:4px; }
.cert-mock-course { font-family:var(--display); font-size:18px; letter-spacing:0.5px; color:var(--sky); margin-bottom:20px; line-height:1.2; }
.cert-mock-footer { display:flex; align-items:flex-end; justify-content:space-between; padding-top:20px; border-top:1px solid rgba(255,255,255,0.06); }
.cert-mock-sig-line { width:80px; height:1px; background:rgba(255,255,255,0.2); margin-bottom:4px; }
.cert-mock-sig-name { font-size:10px; color:rgba(255,255,255,0.25); letter-spacing:0.5px; }
.cert-mock-badge { text-align:right; }
.cert-mock-badge-ring { width:48px; height:48px; border-radius:50%; background:conic-gradient(var(--blue) 0deg 270deg,rgba(255,255,255,0.06) 270deg 360deg); display:flex; align-items:center; justify-content:center; margin-left:auto; margin-bottom:3px; }
.cert-mock-badge-inner { width:38px; height:38px; border-radius:50%; background:var(--ink); display:flex; align-items:center; justify-content:center; font-size:16px; }
.cert-mock-badge-text { font-size:9px; color:rgba(255,255,255,0.25); letter-spacing:0.3px; }
.cert-blur-overlay { position:absolute; inset:0; border-radius:14px; background:rgba(4,14,24,0.55); backdrop-filter:blur(4px); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; }
.cert-unlock-label { font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.4); }
.cert-unlock-note { font-size:11px; color:rgba(255,255,255,0.25); text-align:center; line-height:1.5; }

/* ── Benefit cards (left side) ── */
/* ── DisplayCards stack — Sample Certificate left side ── */
.csc-benefit-list {
  display: grid;
  grid-template-areas: 'stack';
  place-items: start;
  margin-top: 28px;
  padding: 0 160px 100px 0; /* room for diagonal offset */
}
/* base card */
.csc-benefit-card {
  grid-area: stack;
  position: relative;
  width: 340px;
  height: 138px;
  border-radius: 14px;
  border: 2px solid rgba(6,148,209,0.14);
  background: #fff;
  backdrop-filter: blur(8px);
  padding: 14px 18px;
  transform: skewY(-8deg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.7s cubic-bezier(0.25,1,0.5,1), filter 0.7s, border-color 0.3s, box-shadow 0.3s;
  user-select: none;
  overflow: hidden;
}
/* right-edge fade to section bg */
.csc-benefit-card::after {
  content: '';
  position: absolute;
  right: -2px; top: -5%;
  height: 110%; width: 160px;
  background: linear-gradient(to left, var(--light-bg), transparent);
  pointer-events: none; z-index: 2;
  transition: opacity 0.7s;
}
/* greyed overlay for back/mid cards */
.csc-benefit-card::before {
  content: '';
  position: absolute; inset: 0; border-radius: 12px;
  background: rgba(240,245,251,0.55);
  z-index: 1; pointer-events: none;
  transition: opacity 0.7s;
}
/* card content sits above overlays */
.csc-card-row { position: relative; z-index: 3; display: flex; align-items: center; gap: 8px; }
.csc-card-icon-wrap {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: rgba(6,148,209,0.12);
  display: flex; align-items: center; justify-content: center; font-size: 13px;
}
.csc-card-title { font-size: 14px; font-weight: 700; color: var(--light-text); }
.csc-card-desc { position: relative; z-index: 3; font-size: 12px; color: var(--light-sub); line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.csc-card-meta { position: relative; z-index: 3; font-size: 11px; color: var(--blue); font-weight: 600; }

/* BACK card — sits at origin, greyscale */
.csc-dc-back {
  filter: grayscale(1);
  border-color: rgba(6,148,209,0.07);
}
.csc-dc-back:hover {
  filter: grayscale(0);
  transform: skewY(-8deg) translateY(-40px);
  border-color: rgba(6,148,209,0.35);
  box-shadow: 0 12px 32px rgba(6,148,209,0.12);
}
.csc-dc-back:hover::before, .csc-dc-back:hover::after { opacity: 0; }

/* MID card — offset 64px right + 40px down */
.csc-dc-mid {
  transform: skewY(-8deg) translateX(64px) translateY(40px);
  filter: grayscale(1);
  border-color: rgba(6,148,209,0.09);
}
.csc-dc-mid:hover {
  filter: grayscale(0);
  transform: skewY(-8deg) translateX(64px) translateY(-4px);
  border-color: rgba(6,148,209,0.35);
  box-shadow: 0 12px 32px rgba(6,148,209,0.12);
}
.csc-dc-mid:hover::before, .csc-dc-mid:hover::after { opacity: 0; }

/* FRONT card — offset 128px right + 80px down, no greyscale */
.csc-dc-front {
  transform: skewY(-8deg) translateX(128px) translateY(80px);
  border-color: rgba(6,148,209,0.22);
  box-shadow: 0 4px 16px rgba(6,148,209,0.08);
}
.csc-dc-front::before { opacity: 0; }
.csc-dc-front:hover {
  transform: skewY(-8deg) translateX(128px) translateY(90px);
  box-shadow: 0 8px 28px rgba(6,148,209,0.15);
}


/* ── AWARDS SLIDER ── */
.awards-sec {
  background: var(--light-white);
  padding: 100px 48px;
  overflow: hidden;
  position: relative;
  border-top: 1px solid var(--light-border);
  border-bottom: 1px solid var(--light-border);
}
.awards-sec::before {
  content: '';
  position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
  width: 900px; height: 500px;
  background: radial-gradient(ellipse, rgba(6,148,209,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.awards-sec::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(6,148,209,0.2), transparent);
}
.awards-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }
.awards-header { text-align: center; margin-bottom: 20px; }
.awards-header .sec-label { justify-content: center; display: flex; color: var(--blue); background: rgba(6,148,209,0.08); border-color: rgba(6,148,209,0.2); }
.awards-header .sec-title { color: var(--light-text); }
.awards-header .sec-sub { color: var(--light-sub); }

/* ── Partner badge hero row ── */
.awards-partner-row {
  display: flex; align-items: center; justify-content: center; gap: 28px;
  margin: 32px auto 52px;
  flex-wrap: nowrap;
}
.awards-partner-badge {
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(135deg, rgba(6,148,209,0.07), rgba(6,148,209,0.02));
  border: 1px solid rgba(6,148,209,0.2);
  border-radius: var(--r16); padding: 14px 24px;
}
.awards-partner-badge-icon {
  width: 44px; height: 44px; border-radius: 10px;
  background: rgba(6,148,209,0.1); display: flex; align-items: center; justify-content: center;
}
.awards-partner-badge-text { display: flex; flex-direction: column; }
.awards-partner-badge-label {
  font-size: 10px; font-weight: 700; letter-spacing: 1.8px;
  text-transform: uppercase; color: var(--blue);
}
.awards-partner-badge-name {
  font-size: 15px; font-weight: 700; color: var(--light-text); line-height: 1.2;
}
.awards-partner-divider {
  width: 1px; height: 48px; background: var(--light-border);
}
.awards-partner-stat {
  text-align: center;
}
.awards-partner-stat-num {
  font-size: 28px; font-weight: 800; color: var(--blue); line-height: 1;
}
.awards-partner-stat-lbl {
  font-size: 11px; font-weight: 500; color: var(--light-sub);
  text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;
}

.awards-slider-wrap { position: relative; }
.awards-track-outer {
  overflow: hidden;
  border-radius: var(--r16);
  mask-image: linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%);
}
.awards-track {
  display: flex;
  gap: 20px;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.award-card {
  flex-shrink: 0;
  width: calc((100% - 40px) / 3);
  background: var(--light-white);
  border: 1px solid var(--light-border);
  border-radius: var(--r16);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
  box-shadow: 0 4px 16px rgba(6,148,209,0.06);
}
.award-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--blue), #50e6ff, var(--blue));
  background-size: 200% 100%;
  transform: scaleX(0); transform-origin: left; transition: transform 0.4s;
}
.award-card:hover {
  border-color: rgba(6,148,209,0.35);
  box-shadow: 0 16px 40px rgba(6,148,209,0.14);
  transform: translateY(-5px);
}
.award-card:hover::before { transform: scaleX(1); }
.award-card-glow {
  position: absolute; width: 240px; height: 240px; border-radius: 50%;
  background: radial-gradient(circle, rgba(6,148,209,0.06), transparent 70%);
  top: -80px; right: -80px; pointer-events: none;
}
.award-img-wrap {
  width: 100%; height: 160px;
  border-radius: 10px; overflow: hidden;
  background: var(--light-bg);
  border: 1px solid var(--light-border);
  position: relative;
}
.award-img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: contain; object-position: center;
  padding: 16px;
  transition: transform 0.4s ease;
}
.award-card:hover .award-img { transform: scale(1.06); }
.award-year-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase;
  background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25);
  color: #d97706; padding: 3px 10px; border-radius: 20px;
  width: fit-content;
}
.award-org {
  font-size: 10px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--blue);
}
.award-title {
  font-family: var(--display); font-size: 18px; font-weight: 700;
  color: var(--light-text); line-height: 1.25;
}
.award-desc { font-size: 13px; color: var(--light-sub); line-height: 1.6; }

/* Slider controls */
.awards-controls {
  display: flex; align-items: center; justify-content: center; gap: 16px;
  margin-top: 36px;
}
.awards-btn {
  width: 42px; height: 42px; border-radius: 50%;
  background: var(--light-white); border: 1px solid rgba(6,148,209,0.2);
  color: var(--blue); font-size: 16px;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(6,148,209,0.08);
}
.awards-btn:hover { background: var(--blue); border-color: var(--blue); color: var(--white); box-shadow: 0 6px 20px rgba(6,148,209,0.3); }
.awards-dots { display: flex; gap: 8px; }
.awards-dot {
  width: 6px; height: 6px; border-radius: 3px;
  background: rgba(255,255,255,0.15); cursor: pointer;
  transition: all 0.3s;
}
.awards-dot.active { width: 24px; background: var(--blue); }

/* Trust badges strip below awards */
.trust-logos-strip {
  max-width: 1000px; margin: 52px auto 0;
  display: flex; align-items: center; justify-content: center;
  gap: 10px; flex-wrap: nowrap;
}
.trust-logo-item {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.2px; white-space: nowrap;
  color: var(--light-sub);
  background: var(--light-bg);
  border: 1px solid var(--light-border);
  border-radius: 40px; padding: 7px 14px;
  transition: all 0.2s; flex-shrink: 0;
}
.trust-logo-item:hover { background: rgba(6,148,209,0.07); border-color: rgba(6,148,209,0.3); color: var(--blue); }
.trust-logo-item svg { opacity: 1; flex-shrink: 0; }

/* ── BOTTOM CTA ── */
.bottom-cta {
  background: linear-gradient(135deg, var(--navy) 0%, #0a2a4e 50%, #076d9d 100%);
  padding: 100px 48px; text-align: center; position: relative; overflow: hidden;
}
.bottom-cta::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 800px 400px at 50% 100%, rgba(6,148,209,0.12), transparent); }
.cta-title { font-family: var(--display); font-weight: 800; font-size: clamp(38px, 4.5vw, 64px); color: var(--white); letter-spacing: -0.5px; margin-bottom: 16px; position: relative; z-index:1; }
.cta-title span { color: var(--blue); }
.cta-sub { font-size: 18px; color: rgba(255,255,255,0.6); margin-bottom: 40px; position: relative; z-index:1; }
.cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; z-index:1; }
.cta-primary { background: var(--blue); color: var(--white); font-family: var(--body); font-weight: 700; font-size: 15px; padding: 16px 36px; border-radius: var(--r8); border: none; cursor: pointer; transition: all 0.25s; }
.cta-primary:hover { background: var(--blue-dark); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(6,148,209,0.35); }
.cta-ghost { background: rgba(255,255,255,0.06); color: var(--white); font-family: var(--body); font-weight: 700; font-size: 15px; padding: 16px 36px; border-radius: var(--r8); border: 2px solid rgba(255,255,255,0.55); cursor: pointer; transition: all 0.25s; }
.cta-ghost:hover { border-color: #fff; background: rgba(255,255,255,0.12); }
.cta-download { display: inline-flex; align-items: center; gap: 9px; background: rgba(255,255,255,0.07); color: var(--white); font-family: var(--body); font-weight: 600; font-size: 15px; padding: 15px 32px; border-radius: var(--r8); border: 1.5px solid rgba(255,255,255,0.18); cursor: pointer; transition: all 0.25s; }
.cta-download:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.4); transform: translateY(-2px); }
.cta-download svg { flex-shrink: 0; opacity: 0.8; }

/* ── FOOTER ── */
.footer { background: var(--ink); border-top: 1px solid var(--sl2); padding: 40px clamp(16px, 4vw, 48px); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.footer-left { font-size: 13px; color: rgba(255,255,255,0.3); }
.footer-right { display: flex; gap: 20px; }
.footer-link { font-size: 12px; color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
.footer-link:hover { color: var(--blue); }

/* ── DOWNLOAD BROCHURE FAB ── */
.dl-brochure-fab {
  position: fixed; bottom: 28px; right: 28px; z-index: 300;
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--blue) 0%, #076d9d 100%);
  color: var(--white); font-family: var(--body); font-weight: 700; font-size: 15px; letter-spacing: 0.3px;
  padding: 15px 24px 15px 20px;
  border-radius: 50px; border: none; cursor: pointer;
  box-shadow: 0 8px 32px rgba(6,148,209,0.45), 0 2px 8px rgba(0,0,0,0.3);
  animation: fabSlideIn 0.6s 1s cubic-bezier(0.175,0.885,0.32,1.275) both;
  transition: all 0.25s;
}
.dl-brochure-fab:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 20px 48px rgba(6,148,209,0.55), 0 4px 16px rgba(0,0,0,0.4);
}
.dl-brochure-fab:active { transform: translateY(-1px) scale(1.01); }
.dl-brochure-icon {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; flex-shrink: 0;
}
.dl-brochure-text { letter-spacing: 0.3px; white-space: nowrap; }
@keyframes fabSlideIn {
  from { opacity:0; transform: translateY(60px) scale(0.8); }
  to   { opacity:1; transform: translateY(0) scale(1); }
}

/* ── MODAL ── */
.modal-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
.modal-box { background: var(--ink2); border: 1px solid var(--sl2); border-radius: var(--r24); padding: 40px; max-width: 480px; width: 100%; position: relative; animation: scaleIn 0.25s ease; }
@keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:none} }
.modal-close { position: absolute; top: 16px; right: 16px; background: var(--sl3); border: none; color: rgba(255,255,255,0.5); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-close:hover { background: rgba(255,255,255,0.1); color: var(--white); }

/* ── REVEAL (see top of CSS for base rules) ── */


/* ── KOENIG EDGE SECTION (upGrad sticky-left style) ── */
.edge-sec { background: #f7f7f7; padding: 100px 0; border-top: 1px solid #ebebeb; }
.edge-inner {
  display: grid; grid-template-columns: 360px 1fr;
  max-width: 1200px; margin: 0 auto; padding: 0 64px;
  gap: 80px; align-items: start;
}
.edge-left { position: sticky; top: calc(50vh - 200px); }
.edge-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--blue); margin-bottom: 18px;
}
.edge-eyebrow::before {
  content: ""; display: block; width: 20px; height: 2px;
  background: var(--blue); border-radius: 2px;
}
.edge-left-heading {
  font-size: clamp(26px, 2.8vw, 40px); font-weight: 700;
  color: #212835; line-height: 1.2; margin-bottom: 14px; letter-spacing: -0.02em;
}
.edge-left-heading em { font-style: normal; color: var(--blue); }
.edge-left-sub { font-size: 15px; color: #586274; line-height: 1.75; margin-bottom: 32px; max-width: 300px; }
.edge-left-cta {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--blue); color: #fff; font-size: 14px; font-weight: 700;
  padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer;
  transition: all 0.2s;
}
.edge-left-cta:hover { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(6,148,209,0.35); }
.edge-left-count {
  margin-top: 36px; padding-top: 24px; border-top: 1px solid #ebebeb;
  display: flex; gap: 0; align-items: stretch;
}
.edge-count-item { flex: 1; padding-right: 20px; }
.edge-count-item + .edge-count-item {
  padding-left: 20px; padding-right: 0;
  border-left: 0.5px solid #c9c9c9;
}
.edge-count-num { font-size: 24px; font-weight: 800; color: var(--blue); line-height: 1; margin-bottom: 5px; }
.edge-count-num span { color: var(--blue); }
.edge-count-label { font-size: 11px; color: #586274; font-weight: 500; letter-spacing: 0.03em; }
/* Right — scrolling items */
.edge-right { display: flex; flex-direction: column; gap: 0; }
.edge-item {
  display: flex; gap: 20px; align-items: flex-start;
  padding: 24px; border-radius: 10px; border: 1px solid transparent;
  background: transparent;
  transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1),
              background 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.edge-item:hover { background: #fff; border-color: #ebebeb; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.edge-item-icon-wrap {
  flex-shrink: 0; width: 48px; height: 48px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; background: #fff; border: 1px solid #ebebeb;
  transition: all 0.2s;
}
.edge-item:hover .edge-item-icon-wrap { border-color: rgba(6,148,209,0.3); background: rgba(6,148,209,0.05); }
.edge-item-body { flex: 1; }
.edge-item-num { font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: rgba(6,148,209,0.5); margin-bottom: 5px; }
.edge-item-title { font-size: 16px; font-weight: 700; color: #212835; margin-bottom: 6px; line-height: 1.3; }
.edge-item-desc { font-size: 13.5px; color: #586274; line-height: 1.7; }
@media (max-width: 960px) {
  .edge-inner { grid-template-columns: 1fr; padding: 0 24px; gap: 40px; }
  .edge-left { position: static; }
}
@media (max-width: 600px) { .edge-sec { padding: 64px 0; } .edge-item { padding: 16px; } }

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .hero { flex-direction: column; padding: 96px 32px 72px; gap: 40px; }
  .hero-sep { display: none; }
  .lead-form-wrap { width: 100%; max-width: 500px; }
  .certs-layout { grid-template-columns: 200px 1fr; }
  .cert-grid { grid-template-columns: 1fr 1fr; }
  .features-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 900px) {
  .certs-layout { grid-template-columns: 1fr; }
  .cert-sidebar { flex-direction: row; flex-wrap: wrap; padding: 12px; gap: 6px; border-right: none; border-bottom: 1px solid var(--light-border); }
  .cert-sidebar-label { display: none; }
  .cert-sidebar-divider { display: none; }
  .cert-sidebar-item { width: auto; flex: 0 0 auto; border-left: none; border-bottom: 2px solid transparent; border-radius: 8px; padding: 8px 14px; }
  .cert-sidebar-item.active { border-bottom-color: var(--blue); border-left-color: transparent; }
  .csi-sublabel { display: none; }
  .cert-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .nav-ms-badge { display: none; }
  .nav-right { gap: 10px; }
  .hero { padding: 122px 20px 60px; }
  .lead-form { padding: 24px 20px; }
  .stats-inner { grid-template-columns: 1fr 1fr; }
  .stat-item { border-right: none; border-bottom: 1px solid var(--sl2); }
  .cert-grid { grid-template-columns: 1fr; }
  .cert-panel { padding: 20px; }
  .features-grid { grid-template-columns: 1fr; }
  .features-sec, .certs-sec, .test-sec, .bottom-cta { padding: 72px 20px; }
  .cta-btns { flex-direction: column; align-items: center; }
}

/* ══════════════════════════════════════════════
   FULL RESPONSIVE — MOBILE FIRST
   960 → 768 → 600 → 480
══════════════════════════════════════════════ */

/* ── 960px : tablet landscape ── */
@media (max-width: 960px) {
  /* Nav */
  .nav { padding: 0 24px; }

  /* Stats strip */
  .stats-inner { grid-template-columns: repeat(3,1fr); }
  .stat-number { font-size: 40px; }
  .stat-number .unit { font-size: 26px; }
  .stat-item { padding: 28px 16px; }

  /* Features */
  .features-sec { padding: 72px 24px; }
  .feat-card { padding: 28px 24px; }

  /* Why section 2-col → 1-col */
  .why-inner { grid-template-columns: 1fr; gap: 40px; }
  .why-sec { padding: 72px 24px; }
  .why-video-wrap { max-height: 340px; }

  /* Cert showcase */
  .cert-showcase-inner { flex-direction: column; gap: 40px; }
  .cert-showcase-right { width: 100%; max-width: 480px; align-self: center; }
  .cert-showcase-sec { padding: 72px 24px; }

  /* Awards */
  .awards-sec { padding: 72px 24px; }

  /* Bottom CTA */
  .bottom-cta { padding: 72px 24px; }

  /* Lead form 2-col → 1-col */
  .lf-row { grid-template-columns: 1fr; }

  /* Edge section */
  .edge-sec { padding: 72px 0; }
}

/* ── 768px : tablet portrait ── */
@media (max-width: 768px) {
  /* Stats */
  .stat-number { font-size: 34px; }
  .stat-number .unit { font-size: 22px; }
  .stat-item { padding: 22px 12px; }

  /* Features */
  .feat-card { padding: 24px; }
  .feat-title { font-size: 18px; }

  /* Cert showcase */
  .cert-showcase-right { width: 100%; max-width: 100%; }
  .dc-stack { grid-template-columns: 1fr; max-width: 100%; }

  /* Why section */
  .why-sec { padding: 64px 20px; }

  /* Ticker */
  .ticker-item { padding: 0 24px; font-size: 12px; }

  /* Globe */
  .globe-sec { padding: 64px 20px; }

  /* Awards partner row */
  .awards-partner-row { flex-wrap: wrap; gap: 16px; justify-content: center; }
  .awards-partner-divider { display: none; }
  .awards-inner { padding: 0 16px; }
  .award-card { padding: 20px 18px; }

  /* Edge */
  .edge-left-heading { font-size: clamp(24px, 5vw, 36px); }

  /* Bottom CTA */
  .bottom-cta { padding: 64px 20px; }
  .cta-sub { font-size: 16px; }

  /* Footer */
  .footer { flex-direction: column; gap: 16px; align-items: flex-start; padding: 32px 20px; }
  .footer-right { flex-wrap: wrap; gap: 12px; }

  /* FAB */
  .dl-brochure-fab { bottom: 16px; right: 16px; }

  /* Testimonials */
  .test-sec { padding: 64px 20px; }

  /* Companies */
  .companies-headline-wrap { margin-bottom: 32px; padding: 0 16px; }
  .company-logo-item { min-width: 100px; padding: 10px 14px; }
  .company-logo-item svg { height: 20px; }
  .company-logo-name { font-size: 9.5px; }
}

/* ── 600px : large phone ── */
@media (max-width: 600px) {
  /* Nav */
  .nav { padding: 0 16px; height: 56px; }
  .nav-logo-img { max-height: 28px; }
  .nav-cta { font-size: 12px; padding: 9px 14px; }

  /* Hero */
  .hero { padding: 100px 16px 48px; }
  .hero-h1 { font-size: clamp(20px, 7.5vw, 28px); }
  .hero-sub { font-size: 14px; }
  .hero-ctas { gap: 10px; }

  /* Stats strip */
  .stats-inner { grid-template-columns: 1fr 1fr; }
  .stat-number { font-size: 30px; }
  .stat-number .unit { font-size: 20px; }
  .stat-item { padding: 18px 10px; }

  /* Ticker */
  .ticker { padding: 10px 0; }
  .ticker-item { padding: 0 16px; font-size: 11.5px; }

  /* Features */
  .features-sec { padding: 56px 16px; }
  .features-grid { gap: 1px; }
  .feat-card { padding: 20px; }
  .feat-title { font-size: 17px; }
  .feat-desc { font-size: 13px; }

  /* Cert paths */
  .certs-sec { padding: 56px 16px; }
  .cert-panel { padding: 16px; }
  .cert-name { font-size: 13px; }

  /* Cert showcase */
  .cert-showcase-sec { padding: 56px 16px; }
  .cert-showcase-title { font-size: 26px; }
  .cert-preview-wrap { max-width: 100%; }
  .cert-real-img { max-width: 100%; border-radius: 8px; }
  .dc-card { padding: 14px 16px; }

  /* Why section */
  .why-sec { padding: 56px 16px; }
  .why-video-wrap { max-height: 220px; }

  /* Companies marquee */
  .company-logo-item { min-width: 86px; padding: 8px 10px; }
  .company-logo-item svg { height: 18px; }
  .company-logo-name { font-size: 9px; }

  /* How it works */
  .hiw-sec { padding: 56px 16px; }
  .hiw-card-inner { padding: 18px 16px; }

  /* Learn */
  .learn-sec { padding: 56px 16px; }
  .learn-footer { gap: 12px; }

  /* Globe */
  .globe-sec { padding: 56px 16px; }
  .globe-inner { gap: 32px; }
  .globe-canvas-wrap > div { width: 260px !important; height: 260px !important; }
  .globe-country-grid { gap: 4px; }
  .globe-country-row { padding: 4px 8px; font-size: 10.5px; }

  /* Edge */
  .edge-sec { padding: 56px 0; }
  .edge-inner { padding: 0 16px; gap: 32px; }
  .edge-item { padding: 16px 12px; }
  .edge-item-title { font-size: 15px; }
  .edge-item-desc { font-size: 13px; }
  .edge-left-heading { font-size: 22px; }
  .edge-left-sub { font-size: 13px; }

  /* Testimonials */
  .test-sec { padding: 56px 16px; }
  .test-cols-outer { max-height: 520px; }

  /* Awards */
  .awards-sec { padding: 56px 16px; }
  .awards-slider-wrap { padding: 0; }
  .award-card { min-width: 200px; padding: 16px 14px; }

  /* USP section */
  .usp-sec { padding: 56px 16px; }

  /* LGM mid-page */
  .lgm-sec { padding: 56px 16px; }

  /* Bottom CTA */
  .bottom-cta { padding: 56px 16px; }
  .cta-title { font-size: clamp(24px, 9vw, 36px); }
  .cta-sub { font-size: 14px; margin-bottom: 24px; }

  /* Footer */
  .footer { padding: 24px 16px; }
  .footer-right { gap: 10px; }

  /* FAB */
  .dl-brochure-fab { bottom: 12px; right: 12px; padding: 10px 14px; font-size: 12px; gap: 6px; }

  /* Awards partner row */
  .awards-partner-badge-name { font-size: 11px; }
  .awards-partner-stat-num { font-size: 22px; }

  /* Lead form */
  .lead-form { padding: 20px 16px; }
  .lf-submit { font-size: 14px; padding: 14px 20px; }
}

/* ── 480px : standard phone ── */
@media (max-width: 480px) {
  /* Nav CTA text */
  .nav-cta { font-size: 11px; padding: 8px 12px; }

  /* Stats single column feel */
  .stat-number { font-size: 26px; }
  .stat-number .unit { font-size: 18px; }
  .stat-label { font-size: 11px; }

  /* Hero */
  .hero { padding: 92px 14px 40px; }
  .hero-h1 { font-size: clamp(18px, 8.5vw, 26px); }

  /* Display cards (cert showcase) */
  .dc-stack { grid-template-columns: 1fr; }
  .dc-card { width: 100%; }

  /* Cert grid single col enforced */
  .cert-grid { grid-template-columns: 1fr; }

  /* Edge section */
  .edge-count-num { font-size: 20px; }
  .edge-count-label { font-size: 10px; }
  .edge-left-count { gap: 16px; }

  /* Awards track */
  .award-card { min-width: 180px; }

  /* Companies */
  .company-logo-item { min-width: 76px; padding: 6px 8px; }
  .company-logo-item svg { height: 16px; }

  /* FAB - icon only hint */
  .dl-brochure-fab { padding: 10px 12px; font-size: 11px; }
}

/* ══════════════════════════════════════════════════════
   CERT EXAM DETAILS SECTION
══════════════════════════════════════════════════════ */
.ced-sec {
  background: var(--light-white);
  padding: 100px 40px;
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--light-border);
}
.ced-sec::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(6,148,209,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6,148,209,0.07) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}
.ced-sec::after {
  content: '';
  position: absolute;
  top: -200px; left: 50%;
  transform: translateX(-50%);
  width: 900px; height: 500px;
  background: radial-gradient(ellipse at center, rgba(6,148,209,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.ced-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

/* Header */
.ced-header { text-align: center; margin-bottom: 56px; }
.ced-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--blue); margin-bottom: 16px;
  padding: 5px 14px; border-radius: 20px;
  border: 1px solid rgba(6,148,209,0.3);
  background: rgba(6,148,209,0.08);
}
.ced-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--blue); animation: ced-pulse 2s ease-in-out infinite; }
@keyframes ced-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
.ced-title {
  font-size: clamp(28px, 3.5vw, 46px); font-weight: 700; color: var(--light-text);
  line-height: 1.15; margin-bottom: 16px;
}
.ced-title em { font-style: normal; background: linear-gradient(135deg, var(--blue) 0%, #50e6ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.ced-subtitle { font-size: 16px; color: var(--light-sub); max-width: 520px; margin: 0 auto; line-height: 1.6; }

/* Tabs */
.ced-tabs-wrap { display: flex; justify-content: center; margin-bottom: 48px; }
.ced-tabs {
  display: flex; gap: 6px; flex-wrap: wrap; justify-content: center;
  padding: 6px; background: var(--light-bg);
  border-radius: 16px; border: 1px solid var(--light-border);
  max-width: 860px;
}
.ced-tab {
  padding: 7px 16px; border-radius: 10px; border: none; cursor: pointer;
  font-size: 12.5px; font-weight: 500; font-family: inherit;
  color: var(--light-sub); background: transparent;
  transition: all 0.2s ease; white-space: nowrap;
}
.ced-tab:hover { color: var(--light-text); background: rgba(6,148,209,0.06); }
.ced-tab.active {
  color: #fff; background: var(--blue);
  box-shadow: 0 2px 12px rgba(6,148,209,0.35);
}

/* Cards grid */
.ced-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Individual exam card */
.ced-card {
  position: relative;
  background: #ffffff;
  border: 1px solid var(--light-border);
  border-radius: 18px;
  padding: 24px;
  cursor: default;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.ced-card::before {
  content: '';
  position: absolute;
  inset: 0; border-radius: 18px;
  background: radial-gradient(circle at 20% 20%, var(--ced-glow, rgba(6,148,209,0.08)) 0%, transparent 60%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.ced-card:hover { transform: translateY(-5px); border-color: var(--ced-border, rgba(6,148,209,0.35)); background: var(--off); box-shadow: 0 12px 32px rgba(6,148,209,0.1), 0 2px 8px rgba(0,0,0,0.06); }
.ced-card:hover::before { opacity: 1; }

/* Card top row */
.ced-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.ced-card-left { flex: 1; min-width: 0; }

/* Exam code badge */
.ced-code {
  display: inline-block;
  font-size: 22px; font-weight: 800; letter-spacing: -0.02em;
  font-family: 'GT Walsheim Pro', monospace;
  background: linear-gradient(135deg, var(--blue) 0%, #50e6ff 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
  line-height: 1;
}
.ced-name {
  font-size: 13px; font-weight: 600; color: var(--light-text);
  line-height: 1.35; max-width: 200px;
}

/* Level badge */
.ced-badge {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 4px 10px; border-radius: 20px; white-space: nowrap;
  border: 1px solid;
}

/* Score ring */
.ced-ring-wrap { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.ced-ring-label { font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--light-sub); }

/* Stats chips row */
.ced-stats { display: flex; gap: 8px; flex-wrap: wrap; }
.ced-stat {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 500; color: var(--light-sub);
  padding: 4px 10px; border-radius: 20px;
  background: var(--light-bg); border: 1px solid var(--light-border);
}
.ced-stat-icon { font-size: 11px; line-height: 1; }

/* Skills section */
.ced-skills { display: flex; flex-direction: column; gap: 8px; }
.ced-skill-row { display: flex; flex-direction: column; gap: 4px; }
.ced-skill-meta { display: flex; justify-content: space-between; align-items: center; }
.ced-skill-label { font-size: 11px; color: var(--light-sub); }
.ced-skill-pct { font-size: 10px; font-weight: 600; color: var(--light-text); }
.ced-skill-track {
  height: 4px; border-radius: 2px; background: rgba(6,148,209,0.1); overflow: hidden;
}
.ced-skill-fill {
  height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, var(--blue) 0%, #50e6ff 100%);
  transform-origin: left;
  animation: ced-bar-in 0.8s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes ced-bar-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* Card footer */
.ced-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; padding-top: 14px; border-top: 1px solid var(--light-border); }
.ced-validity { font-size: 10.5px; color: var(--light-sub); display: flex; align-items: center; gap: 5px; }
.ced-enroll-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11.5px; font-weight: 600; font-family: inherit;
  color: var(--blue); background: rgba(6,148,209,0.1);
  border: 1px solid rgba(6,148,209,0.25); border-radius: 8px;
  padding: 6px 12px; cursor: pointer;
  transition: all 0.2s ease;
}
.ced-enroll-btn:hover { background: var(--blue); color: #fff; border-color: var(--blue); transform: translateX(2px); }

/* Footer info bar */
.ced-footer-bar {
  margin-top: 48px; padding: 20px 28px;
  background: var(--light-bg); border: 1px solid var(--light-border); border-radius: 14px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
}
.ced-footer-item { display: flex; align-items: center; gap: 10px; }
.ced-footer-icon { font-size: 18px; line-height: 1; }
.ced-footer-text { font-size: 12.5px; color: var(--light-sub); line-height: 1.4; }
.ced-footer-text strong { color: var(--light-text); display: block; margin-bottom: 1px; }
.ced-footer-divider { width: 1px; height: 32px; background: var(--light-border); }

/* Empty state */
.ced-empty { text-align: center; padding: 60px 0; color: var(--light-sub); }

/* ── Selected card state ── */
.exam-card-selected {
  border-color: var(--blue) !important;
  box-shadow: 0 0 0 2px rgba(6,148,209,0.15), 0 8px 24px rgba(6,148,209,0.12) !important;
  background: var(--off) !important;
}
.exam-card-selected-hint {
  display: flex; align-items: center; gap: 5px;
  font-size: 10.5px; font-weight: 700; color: var(--blue);
  margin-top: 4px; padding-top: 8px;
  border-top: 1px solid rgba(6,148,209,0.15);
}

/* ── Detail panel ── */
.ced-detail-panel {
  margin-top: 20px;
  background: #fff;
  border: 1.5px solid rgba(6,148,209,0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 48px rgba(6,148,209,0.1), 0 2px 12px rgba(0,0,0,0.06);
}
.ced-dp-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 24px 28px 20px;
  background: linear-gradient(135deg, var(--off) 0%, #fff 70%);
  border-bottom: 1px solid var(--light-border);
  position: relative;
}
.ced-dp-header::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--blue) 0%, #50e6ff 60%, var(--blue) 100%);
  background-size: 200% 100%; animation: shimmerGrad 3s linear infinite;
}
.ced-dp-header-left { flex: 1; }
.ced-dp-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.ced-dp-code { font-size: 13px; font-weight: 700; color: var(--light-sub); }
.ced-dp-title {
  font-size: clamp(20px, 2.5vw, 28px); font-weight: 800;
  color: var(--light-text); margin-bottom: 6px; line-height: 1.2;
}
.ced-dp-sub { font-size: 13.5px; color: var(--light-sub); line-height: 1.5; }
.ced-dp-sub strong { color: var(--light-text); }
.ced-dp-header-right { display: flex; align-items: flex-start; gap: 12px; flex-shrink: 0; }
.ced-dp-close {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--light-border);
  background: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--light-sub); transition: all 0.2s; flex-shrink: 0;
}
.ced-dp-close:hover { background: var(--light-bg); color: var(--light-text); border-color: rgba(6,148,209,0.3); }

.ced-dp-body {
  display: grid; grid-template-columns: 1fr 320px; gap: 0;
}

/* Left: info + skills */
.ced-dp-info { padding: 24px 28px; border-right: 1px solid var(--light-border); }
.ced-dp-section-label {
  font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
  color: var(--blue); margin-bottom: 14px;
}

/* 4-col info card grid */
.ced-info-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
}
.ced-info-card {
  display: flex; flex-direction: column; gap: 5px;
  padding: 14px 16px; border-radius: 12px;
  background: var(--light-bg); border: 1px solid var(--light-border);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ced-info-card:hover { border-color: rgba(6,148,209,0.3); box-shadow: 0 2px 8px rgba(6,148,209,0.08); }
.ced-info-icon { font-size: 18px; line-height: 1; }
.ced-info-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--light-sub); }
.ced-info-value { font-size: 13.5px; font-weight: 700; color: var(--light-text); line-height: 1.35; }

/* Skills in detail panel */
.ced-dp-skills { display: flex; flex-direction: column; gap: 10px; }
.ced-dp-skill-row { display: flex; flex-direction: column; gap: 5px; }
.ced-dp-skill-meta { display: flex; justify-content: space-between; }
.ced-dp-skill-label { font-size: 12px; color: var(--light-sub); }
.ced-dp-skill-pct { font-size: 11px; font-weight: 700; color: var(--light-text); }
.ced-dp-skill-track { height: 5px; border-radius: 3px; background: rgba(6,148,209,0.1); overflow: hidden; }
.ced-dp-skill-fill { height: 100%; border-radius: 3px; animation: ced-bar-in 0.8s cubic-bezier(0.16,1,0.3,1) both; }

/* Right: certification path */
.ced-dp-path { padding: 24px 24px; background: var(--light-bg); }
.ced-dp-path-sub { font-size: 12px; color: var(--light-sub); margin-bottom: 20px; margin-top: 4px; line-height: 1.5; }
.ced-path-steps { display: flex; flex-direction: column; }
.ced-path-step {
  display: flex; gap: 14px; align-items: stretch;
}
.ced-path-step-left {
  display: flex; flex-direction: column; align-items: center; flex-shrink: 0;
}
.ced-path-num {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; flex-shrink: 0;
  transition: all 0.3s;
}
.ced-path-line { width: 2px; flex: 1; min-height: 16px; margin: 4px 0; }
.ced-path-step-body {
  flex: 1; padding: 12px 14px; border-radius: 12px;
  border: 1.5px solid var(--light-border); background: #fff;
  margin-bottom: 10px; transition: all 0.2s;
}
.ced-path-step-body.current { box-shadow: 0 2px 12px rgba(6,148,209,0.12); }
.ced-path-step-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.ced-path-step-code { font-size: 14px; font-weight: 800; color: var(--light-text); }
.ced-path-step-name { font-size: 12px; color: var(--light-sub); line-height: 1.4; margin-bottom: 6px; }
.ced-path-here {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10.5px; font-weight: 700;
  padding: 2px 8px; border-radius: 20px;
  background: rgba(6,148,209,0.08); margin-bottom: 6px;
}
.ced-path-step-price { font-size: 11px; font-weight: 700; color: var(--blue); }
.ced-path-step-price span { font-size: 9px; font-weight: 500; color: var(--light-sub); }

/* Panel footer */
.ced-dp-footer {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
  padding: 16px 28px; border-top: 1px solid var(--light-border);
  background: var(--light-bg);
}
.ced-dp-footer-info { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.ced-dp-footer-fee { display: flex; flex-direction: column; gap: 1px; }
.ced-dp-footer-fee span { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--light-sub); }
.ced-dp-footer-fee strong { font-size: 20px; font-weight: 800; color: var(--blue); }
.ced-dp-footer-note { font-size: 11.5px; color: var(--light-sub); }
.ced-dp-footer-actions { display: flex; gap: 10px; }

/* Responsive */
@media (max-width: 900px) {
  .ced-dp-body { grid-template-columns: 1fr; }
  .ced-dp-path { border-top: 1px solid var(--light-border); border-right: none; }
  .ced-info-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .ced-dp-header { flex-direction: column; gap: 12px; }
  .ced-dp-header-right { align-self: flex-end; position: absolute; top: 20px; right: 20px; }
  .ced-dp-footer { flex-direction: column; align-items: flex-start; }
}

/* Score ring meta block (in info panel) */
.ced-meta-block {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  flex-shrink: 0; padding: 0 8px;
  border-left: 1px solid var(--light-border);
  border-right: 1px solid var(--light-border);
}
.ced-meta-block-label {
  font-size: 9px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--light-sub);
}

/* Exam stat chips inside cert card */
.exam-stat-chips {
  display: flex; gap: 5px; flex-wrap: wrap; margin-top: 2px;
}
.exam-chip {
  font-size: 10.5px; font-weight: 600; color: var(--light-sub);
  padding: 3px 8px; border-radius: 20px;
  background: var(--light-bg); border: 1px solid var(--light-border);
  white-space: nowrap;
}

/* Mini skill bars inside cert card */
.exam-skills-mini {
  display: flex; flex-direction: column; gap: 6px; margin-top: 2px;
}
.exam-skill-mini-row { display: flex; flex-direction: column; gap: 3px; }
.exam-skill-mini-meta {
  display: flex; justify-content: space-between; align-items: center;
}
.exam-skill-mini-label { font-size: 10.5px; color: var(--light-sub); }
.exam-skill-mini-pct   { font-size: 10px; font-weight: 700; color: var(--light-text); }
.exam-skill-mini-track {
  height: 3px; border-radius: 2px; background: rgba(6,148,209,0.1); overflow: hidden;
}
.exam-skill-mini-fill {
  height: 100%; border-radius: 2px;
  animation: ced-bar-in 0.7s cubic-bezier(0.16,1,0.3,1) both;
}

/* Responsive */
@media (max-width: 1024px) {
  .ced-meta-block { display: none; }
}
@media (max-width: 640px) {
  .ced-sec { padding: 72px 20px; }
  .ced-footer-bar { flex-direction: column; align-items: flex-start; }
  .ced-footer-divider { display: none; }
}
`;

// ── DATA ──
const TICKER_ITEMS = ["Microsoft Authorized Learning Partner","Official MOC Courseware","500,000+ Alumni Worldwide","MCT Certified Trainers Only","ESI Enterprise Partner","50+ Countries Served","95% Exam Pass Rate","Google Rating 4.7★","1-on-1 Training Exclusive"];

// Feature section SVG icons — official/recognisable brand marks inline
const FeatureIcons = {
  alp: () => (
    // Microsoft logo (4-square Windows mark) — ALP = official MS partner
    <svg width="36" height="36" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"   y="1"   width="9" height="9" fill="#f25022"/>
      <rect x="11"  y="1"   width="9" height="9" fill="#7fba00"/>
      <rect x="1"   y="11"  width="9" height="9" fill="#00a4ef"/>
      <rect x="11"  y="11"  width="9" height="9" fill="#ffb900"/>
    </svg>
  ),
  mct: () => (
    // Graduation cap — MCT (Microsoft Certified Trainer)
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="#0078d4"/>
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="#0078d4" opacity="0.6"/>
    </svg>
  ),
  oneOnOne: () => (
    // Single person with focus ring — 1-on-1 exclusive
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" fill="#0078d4"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" fill="#0078d4" opacity="0.5"/>
      <circle cx="12" cy="12" r="11" stroke="#0078d4" strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
    </svg>
  ),
  flyTrainer: () => (
    // Aeroplane — Fly-Me-A-Trainer
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#0078d4"/>
    </svg>
  ),
  esi: () => (
    // Microsoft Enterprise — shield with E monogram
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6L12 2z" fill="#0078d4" opacity="0.15"/>
      <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6L12 2z" stroke="#0078d4" strokeWidth="1.5" strokeLinejoin="round"/>
      <text x="12" y="15" textAnchor="middle" fill="#0078d4" fontSize="8" fontWeight="bold" fontFamily="sans-serif">ESI</text>
    </svg>
  ),
  passRate: () => (
    // Trophy / medal — 95% pass rate
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 14l-4.8 2.5.9-5.2L4.3 7.6l5.3-.8L12 2z" fill="#ffb900"/>
      <rect x="9" y="18" width="6" height="2" rx="1" fill="#0078d4"/>
      <rect x="7" y="20" width="10" height="2" rx="1" fill="#0078d4"/>
    </svg>
  ),
};

const FEATURES = [
  { icon: FeatureIcons.alp,        title: "Microsoft Authorized Learning Partner",  desc: "Koenig is an official Microsoft Authorized Learning Partner (ALP) delivering Microsoft Official Courseware (MOC) — the same curriculum Microsoft uses to train its own engineers.", stat: "Only 3% of global training providers hold ALP status" },
  { icon: FeatureIcons.mct,        title: "MCT-Certified Instructors Only",   desc: "Every Microsoft course is taught by an active Microsoft Certified Trainer (MCT). No freelancers, no subcontractors — guaranteed certified expertise on every session.", stat: "Avg. trainer experience: 14+ years in Microsoft technologies" },
  { icon: FeatureIcons.oneOnOne,   title: "1-on-1 Microsoft Training",     desc: "Exclusive to Koenig: your dedicated MCT trains only you, on your schedule. Perfect for busy IT professionals pursuing AZ-104, AI-102, SC-300 or any Microsoft cert.", stat: "Available in 50+ countries — 24/7 scheduling" },
  { icon: FeatureIcons.flyTrainer, title: "Fly-Me-A-Trainer",    desc: "Koenig sends a Microsoft-certified trainer directly to your office. Ideal for enterprise IT teams needing on-site Azure, Security or Microsoft 365 training.", stat: "On-site Microsoft training deployed in 40+ countries" },
  { icon: FeatureIcons.esi,        title: "ESI & Enterprise Skills Partner", desc: "As a Microsoft Enterprise Skills Initiative (ESI) partner, Koenig enables enterprise customers to use Training Service Provider (TSPv) credits for workforce certification.", stat: "Accepts Microsoft Enterprise Agreements & EA credits" },
  { icon: FeatureIcons.passRate,   title: "95% Microsoft Exam Pass Rate",       desc: "Structured exam prep, hands-on Azure labs, and dedicated MCT mentoring drive an industry-leading 95% pass rate across all Microsoft certification tracks.", stat: "vs. 60–70% industry average — verified on AZ-104, AI-102, SC-300" },
];

const CERT_TABS = ["Azure", "AI & Copilot", "Power Platform", "Security", "Microsoft 365", "Dynamics 365", "Data & Analytics", "DevOps & Dev", "GitHub", "Windows Server"];

// Official Microsoft technology logos — fully inline SVG, no external deps
const TECH_LOGOS = {
  "Azure": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg-az1" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#114a8b"/>
          <stop offset="100%" stopColor="#0669bc"/>
        </linearGradient>
        <linearGradient id="lg-az2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3ccbf4"/>
          <stop offset="100%" stopColor="#2892df"/>
        </linearGradient>
      </defs>
      <path fill="url(#lg-az1)" d="M33.34 6.54h26.03L33.4 89.46a4.15 4.15 0 0 1-3.93 2.8H8.15a4.15 4.15 0 0 1-3.93-5.49L27.4 9.35a4.15 4.15 0 0 1 3.94-2.81z"/>
      <path fill="#0078d4" d="M71.17 60.89H29.01a1.91 1.91 0 0 0-1.3 3.31l27.1 25.27a4.17 4.17 0 0 0 2.84 1.13h23.86z"/>
      <path fill="url(#lg-az2)" d="M68.6 9.35a4.15 4.15 0 0 0-3.93-2.81H33.63a4.15 4.15 0 0 1 3.93 2.81l23.18 77.42a4.15 4.15 0 0 1-3.93 5.49h31.04a4.15 4.15 0 0 0 3.93-5.49z"/>
    </svg>
  ),
  "Power Platform": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="13" height="13" rx="2" fill="#742774"/>
      <rect x="18" y="1" width="13" height="13" rx="2" fill="#742774" opacity="0.78"/>
      <rect x="1" y="18" width="13" height="13" rx="2" fill="#742774" opacity="0.55"/>
      <rect x="18" y="18" width="13" height="13" rx="2" fill="#742774" opacity="0.32"/>
      <path d="M7.5 7.5l2.5 2.5 3-4.5M18 10l5 0M18 16l7 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  ),
  "Security": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L4 7v8c0 7.4 5.1 14.3 12 16 6.9-1.7 12-8.6 12-16V7z" fill="#0078d4" opacity="0.18"/>
      <path d="M16 2L4 7v8c0 7.4 5.1 14.3 12 16 6.9-1.7 12-8.6 12-16V7z" fill="none" stroke="#0078d4" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M11 16l3.5 3.5L21 12" stroke="#50e6ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  "Microsoft 365": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"  y="1"  width="14" height="14" rx="2.5" fill="#f25022"/>
      <rect x="17" y="1"  width="14" height="14" rx="2.5" fill="#7fba00"/>
      <rect x="1"  y="17" width="14" height="14" rx="2.5" fill="#00a4ef"/>
      <rect x="17" y="17" width="14" height="14" rx="2.5" fill="#ffb900"/>
    </svg>
  ),
  "Dynamics 365": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13.5" fill="#002050" opacity="0.12"/>
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="#0078d4" strokeWidth="2"/>
      <path d="M8 11h16M8 16h16M8 21h10" stroke="#0078d4" strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx="22.5" cy="21" r="3.2" fill="#0078d4"/>
      <path d="M21 21l1.5 1.5 2.5-2.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  "AI & Copilot": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg-ai1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0078d4"/>
          <stop offset="100%" stopColor="#50e6ff"/>
        </linearGradient>
      </defs>
      <circle cx="16" cy="13" r="7.5" fill="none" stroke="url(#lg-ai1)" strokeWidth="2"/>
      <circle cx="16" cy="13" r="3" fill="#0078d4" opacity="0.45"/>
      <circle cx="16" cy="13" r="1.3" fill="#50e6ff"/>
      <path d="M16 5.5V3M16 23v2.5M8 13H5.5M26.5 13H24" stroke="#0078d4" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="7" y="25" width="18" height="4" rx="2" fill="url(#lg-ai1)" opacity="0.4"/>
      <path d="M11 27h10" stroke="#50e6ff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  "Data & Analytics": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg-da1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0078d4" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#0078d4"/>
        </linearGradient>
      </defs>
      <rect x="2"  y="17" width="6" height="12" rx="1.5" fill="url(#lg-da1)"/>
      <rect x="10" y="11" width="6" height="18" rx="1.5" fill="url(#lg-da1)"/>
      <rect x="18" y="5"  width="6" height="24" rx="1.5" fill="url(#lg-da1)"/>
      <rect x="26" y="13" width="4" height="16" rx="1.5" fill="url(#lg-da1)"/>
      <path d="M5 15 L13 9 L21 12 L29 7" stroke="#50e6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="5" cy="15" r="1.8" fill="#50e6ff"/>
      <circle cx="13" cy="9" r="1.8" fill="#50e6ff"/>
      <circle cx="21" cy="12" r="1.8" fill="#50e6ff"/>
      <circle cx="29" cy="7" r="1.8" fill="#50e6ff"/>
    </svg>
  ),
  "DevOps & Dev": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" fill="none" stroke="#0078d4" strokeWidth="1.5" opacity="0.35"/>
      <path d="M10 11l-5 5 5 5" stroke="#0078d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M22 11l5 5-5 5" stroke="#0078d4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M13 23l6-14" stroke="#50e6ff" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  ),
  "GitHub": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#000000"/>
    </svg>
  ),
  "Windows Server": ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="2"  y="2"  width="13" height="13" rx="1.5" fill="#00adef"/>
      <rect x="17" y="2"  width="13" height="13" rx="1.5" fill="#00adef" opacity="0.8"/>
      <rect x="2"  y="17" width="13" height="13" rx="1.5" fill="#00adef" opacity="0.65"/>
      <rect x="17" y="17" width="13" height="13" rx="1.5" fill="#00adef" opacity="0.45"/>
      <path d="M5 8h7M5 10.5h5M20 8h7M20 10.5h5M5 23h7M5 25.5h5M20 23h7M20 25.5h5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
};

const CERT_META = {
  "Azure": { sublabel: "Cloud Infrastructure", desc: "Master Microsoft's cloud platform — from core IaaS/PaaS fundamentals to advanced architecture, networking, security, and DevOps pipelines.", pills: ["15 Courses", "AZ-900 → AZ-305", "Cloud Roles"] },
  "AI & Copilot": { sublabel: "Artificial Intelligence", desc: "Build, deploy, and govern AI solutions on Azure — from AI fundamentals and Copilot Studio to advanced ML, Document Intelligence, and OpenAI integration.", pills: ["12 Courses", "AI-900 → AI-102", "AI Engineer"] },
  "Power Platform": { sublabel: "Low-Code & Power BI", desc: "Build data-driven apps, automate workflows, create rich BI dashboards, and deploy Fabric analytics — no heavy coding required.", pills: ["12 Courses", "PL-900 → PL-600", "Analyst & Developer"] },
  "Security": { sublabel: "Cybersecurity & Compliance", desc: "Defend Microsoft cloud environments, manage identity & access, deploy Sentinel SIEM, and meet enterprise Zero Trust compliance standards.", pills: ["13 Courses", "SC-900 → SC-100", "Security Roles"] },
  "Microsoft 365": { sublabel: "Productivity & Collaboration", desc: "Administer M365 at scale — Teams, Exchange, SharePoint, Endpoint (Intune), and the latest Copilot AI deployment for enterprise.", pills: ["12 Courses", "MS-900 → MS-102", "Admin & IT Pro"] },
  "Dynamics 365": { sublabel: "CRM, ERP & Business Apps", desc: "Implement and configure Dynamics 365 modules for Sales, Customer Service, Finance, Supply Chain, and Power Platform integration.", pills: ["12 Courses", "MB-910 → MB-800", "Functional Consultant"] },
  "Data & Analytics": { sublabel: "Data Engineering & BI", desc: "Design and implement data platforms on Azure — from SQL fundamentals to enterprise data warehousing, Microsoft Fabric, and real-time analytics.", pills: ["12 Courses", "DP-900 → DP-700", "Data Engineer & Analyst"] },
  "DevOps & Dev": { sublabel: "Developer & DevOps", desc: "Build cloud-native apps, automate CI/CD pipelines, containerise with Kubernetes, and develop enterprise solutions on Azure and Microsoft 365.", pills: ["12 Courses", "AZ-204 → AZ-400", "Developer & DevOps"] },
  "GitHub": { sublabel: "Source Control & Actions", desc: "Master GitHub — the world's leading developer platform now under Microsoft — from foundations and Actions automation to Advanced Security and Copilot.", pills: ["8 Courses", "GH Foundations → GHAS", "Developer & SecOps"] },
  "Windows Server": { sublabel: "Hybrid Infrastructure", desc: "Administer Windows Server on-premises and hybrid Azure environments — core infrastructure, Active Directory, Hyper-V, and advanced hybrid services.", pills: ["8 Courses", "AZ-800 → AZ-801", "IT Administrator"] },
};

const CERTS = {
  "Azure": [
    { name: "Microsoft Azure Fundamentals", code: "AZ-900", dur: "3 days", level: "fund" },
    { name: "Azure Data Fundamentals", code: "DP-900", dur: "2 days", level: "fund" },
    { name: "Azure AI Fundamentals", code: "AI-900", dur: "2 days", level: "fund" },
    { name: "Microsoft Azure Administrator", code: "AZ-104", dur: "5 days", level: "assoc" },
    { name: "Azure Virtual Desktop Specialty", code: "AZ-140", dur: "4 days", level: "assoc" },
    { name: "Azure Network Engineer Associate", code: "AZ-700", dur: "3 days", level: "assoc" },
    { name: "Azure Security Technologies", code: "AZ-500", dur: "4 days", level: "assoc" },
    { name: "Azure Database Administrator Associate", code: "DP-300", dur: "4 days", level: "assoc" },
    { name: "Azure IoT Developer Specialty", code: "AZ-220", dur: "4 days", level: "assoc" },
    { name: "SAP on Azure Workloads Specialty", code: "AZ-120", dur: "4 days", level: "assoc" },
    { name: "Azure Stack Hub Operator Associate", code: "AZ-600", dur: "4 days", level: "assoc" },
    { name: "Administering Windows Server Hybrid Core", code: "AZ-800", dur: "4 days", level: "assoc" },
    { name: "Designing Azure Infrastructure Solutions", code: "AZ-305", dur: "4 days", level: "expert" },
    { name: "Configuring Windows Server Hybrid Advanced", code: "AZ-801", dur: "4 days", level: "expert" },
    { name: "Azure Solutions Architect Expert (Full Path)", code: "AZ-104+305", dur: "9 days", level: "expert" },
  ],
  "AI & Copilot": [
    { name: "Azure AI Fundamentals", code: "AI-900", dur: "2 days", level: "fund" },
    { name: "Copilot for Microsoft 365 User Adoption", code: "MS-4004", dur: "1 day", level: "fund" },
    { name: "Copilot for Microsoft 365 Admin Deployment", code: "MS-4006", dur: "1 day", level: "fund" },
    { name: "Understanding Microsoft AI", code: "AI-3000", dur: "1 day", level: "fund" },
    { name: "Azure AI Engineer Associate", code: "AI-102", dur: "5 days", level: "assoc" },
    { name: "Azure AI Studio — GenAI App Development", code: "AI-3016", dur: "3 days", level: "assoc" },
    { name: "Microsoft Copilot Studio", code: "AI-3004", dur: "2 days", level: "assoc" },
    { name: "Azure OpenAI & Responsible AI", code: "AI-050", dur: "2 days", level: "assoc" },
    { name: "Build NLP with Azure AI Language", code: "AI-3003", dur: "2 days", level: "assoc" },
    { name: "Azure AI Document Intelligence", code: "AI-3002", dur: "2 days", level: "assoc" },
    { name: "Azure AI Search & Retrieval Augmented Gen.", code: "AI-3018", dur: "2 days", level: "assoc" },
    { name: "Designing & Implementing AI Solutions", code: "AI-305", dur: "3 days", level: "expert" },
  ],
  "Power Platform": [
    { name: "Power Platform Fundamentals", code: "PL-900", dur: "2 days", level: "fund" },
    { name: "Dashboard in a Day (Power BI)", code: "DIAD", dur: "1 day", level: "fund" },
    { name: "Power Apps Canvas Apps — PL-7001", code: "PL-7001", dur: "1 day", level: "fund" },
    { name: "Power Automate Process Flows — PL-7002", code: "PL-7002", dur: "1 day", level: "fund" },
    { name: "Power BI Data Analyst", code: "PL-300", dur: "3 days", level: "assoc" },
    { name: "Power Platform App Maker Associate", code: "PL-100", dur: "3 days", level: "assoc" },
    { name: "Power Platform Functional Consultant", code: "PL-200", dur: "4 days", level: "assoc" },
    { name: "Power Automate RPA Developer", code: "PL-500", dur: "3 days", level: "assoc" },
    { name: "Microsoft Fabric Analytics Engineer", code: "DP-600", dur: "4 days", level: "assoc" },
    { name: "Power Platform Developer Associate", code: "PL-400", dur: "4 days", level: "assoc" },
    { name: "Power Virtual Agents & Copilot Studio", code: "PL-3005", dur: "2 days", level: "assoc" },
    { name: "Power Platform Solution Architect Expert", code: "PL-600", dur: "4 days", level: "expert" },
  ],
  "Security": [
    { name: "Security, Compliance & Identity Fundamentals", code: "SC-900", dur: "2 days", level: "fund" },
    { name: "Security Operations Analyst Associate", code: "SC-200", dur: "4 days", level: "assoc" },
    { name: "Identity & Access Administrator Associate", code: "SC-300", dur: "4 days", level: "assoc" },
    { name: "Information Protection & Compliance Admin", code: "SC-400", dur: "4 days", level: "assoc" },
    { name: "Information Protection Administrator", code: "SC-401", dur: "3 days", level: "assoc" },
    { name: "Azure Security Technologies", code: "AZ-500", dur: "4 days", level: "assoc" },
    { name: "Microsoft Sentinel SIEM Deployment", code: "SC-5008", dur: "2 days", level: "assoc" },
    { name: "Microsoft Defender XDR", code: "SC-5001", dur: "1 day", level: "assoc" },
    { name: "Implement Security with Defender for Cloud", code: "SC-5002", dur: "1 day", level: "assoc" },
    { name: "GitHub Advanced Security (GHAS)", code: "SC-5006", dur: "2 days", level: "assoc" },
    { name: "Microsoft Entra — Identity Governance", code: "SC-5007", dur: "2 days", level: "assoc" },
    { name: "Microsoft Cybersecurity Architect Expert", code: "SC-100", dur: "4 days", level: "expert" },
    { name: "Designing Zero Trust Security Architecture", code: "SC-ZTA", dur: "2 days", level: "expert" },
  ],
  "Microsoft 365": [
    { name: "Microsoft 365 Fundamentals", code: "MS-900", dur: "2 days", level: "fund" },
    { name: "Copilot for M365 User Adoption", code: "MS-4004", dur: "1 day", level: "fund" },
    { name: "Copilot for M365 Admin Deployment", code: "MS-4006", dur: "1 day", level: "fund" },
    { name: "Teams Administrator Associate", code: "MS-700", dur: "4 days", level: "assoc" },
    { name: "Messaging Administrator Associate", code: "MS-203", dur: "4 days", level: "assoc" },
    { name: "Endpoint Administrator — Intune", code: "MD-102", dur: "5 days", level: "assoc" },
    { name: "Collaboration Communications Systems Eng.", code: "MS-721", dur: "3 days", level: "assoc" },
    { name: "Troubleshoot Microsoft Teams", code: "MS-740", dur: "3 days", level: "assoc" },
    { name: "Employee Experience — Microsoft Viva", code: "MS-080", dur: "2 days", level: "assoc" },
    { name: "SharePoint Administrator", code: "MS-SharePoint", dur: "3 days", level: "assoc" },
    { name: "Viva & Microsoft Adoption Specialist", code: "MC-700", dur: "2 days", level: "assoc" },
    { name: "Microsoft 365 Administrator Expert", code: "MS-102", dur: "5 days", level: "expert" },
  ],
  "Dynamics 365": [
    { name: "Dynamics 365 Fundamentals (CRM)", code: "MB-910", dur: "2 days", level: "fund" },
    { name: "Dynamics 365 Fundamentals (ERP)", code: "MB-920", dur: "2 days", level: "fund" },
    { name: "D365 Sales Functional Consultant", code: "MB-210", dur: "3 days", level: "assoc" },
    { name: "D365 Customer Service Functional Consultant", code: "MB-230", dur: "3 days", level: "assoc" },
    { name: "D365 Field Service Functional Consultant", code: "MB-240", dur: "3 days", level: "assoc" },
    { name: "D365 Finance Functional Consultant", code: "MB-310", dur: "4 days", level: "assoc" },
    { name: "D365 Supply Chain Functional Consultant", code: "MB-330", dur: "4 days", level: "assoc" },
    { name: "D365 Business Central Functional Consultant", code: "MB-800", dur: "4 days", level: "assoc" },
    { name: "D365 Customer Insights — Data", code: "MB-260", dur: "3 days", level: "assoc" },
    { name: "D365 Customer Insights — Journeys", code: "MB-280", dur: "3 days", level: "assoc" },
    { name: "D365 Finance & Operations Developer", code: "MB-500", dur: "5 days", level: "expert" },
    { name: "D365 Business Central Developer", code: "MB-820", dur: "4 days", level: "expert" },
  ],
  "Data & Analytics": [
    { name: "Azure Data Fundamentals", code: "DP-900", dur: "2 days", level: "fund" },
    { name: "Azure Data Scientist Associate", code: "DP-100", dur: "4 days", level: "assoc" },
    { name: "Azure Data Engineer Associate", code: "DP-203", dur: "4 days", level: "assoc" },
    { name: "Azure Database Administrator Associate", code: "DP-300", dur: "4 days", level: "assoc" },
    { name: "Azure Cosmos DB Developer Specialty", code: "DP-420", dur: "4 days", level: "assoc" },
    { name: "Microsoft Fabric Analytics Engineer", code: "DP-600", dur: "4 days", level: "assoc" },
    { name: "Power BI Data Analyst", code: "PL-300", dur: "3 days", level: "assoc" },
    { name: "Implement Data Engineering with Fabric", code: "DP-700", dur: "3 days", level: "assoc" },
    { name: "Azure Enterprise Data Analyst Associate", code: "DP-500", dur: "4 days", level: "assoc" },
    { name: "Real-Time Intelligence with Microsoft Fabric", code: "DP-604", dur: "2 days", level: "assoc" },
    { name: "Azure Synapse Analytics Deep Dive", code: "DP-3011", dur: "2 days", level: "assoc" },
    { name: "Azure Data Solutions Architect Expert", code: "DP-Expert", dur: "5 days", level: "expert" },
  ],
  "DevOps & Dev": [
    { name: "Azure Developer Associate", code: "AZ-204", dur: "5 days", level: "assoc" },
    { name: "Power Platform Developer Associate", code: "PL-400", dur: "4 days", level: "assoc" },
    { name: "Microsoft 365 Developer Associate", code: "MS-600", dur: "4 days", level: "assoc" },
    { name: "Azure Container Apps & Kubernetes Service", code: "AZ-204K", dur: "3 days", level: "assoc" },
    { name: "GitHub Actions for Azure DevOps", code: "GH-ADO", dur: "2 days", level: "assoc" },
    { name: "Azure API Management & Integration", code: "AZ-API", dur: "2 days", level: "assoc" },
    { name: "Deploy Cloud-Native Apps with Azure", code: "AZ-2003", dur: "2 days", level: "assoc" },
    { name: "AI Orchestration with Azure Functions", code: "AZ-2005", dur: "2 days", level: "assoc" },
    { name: "Azure Logic Apps & Integration Services", code: "AZ-720", dur: "3 days", level: "assoc" },
    { name: "Azure Service Bus & Event-Driven Apps", code: "AZ-EDA", dur: "2 days", level: "assoc" },
    { name: "Designing & Implementing DevOps (AZ-400)", code: "AZ-400", dur: "5 days", level: "expert" },
    { name: "Azure Solutions Architect Expert", code: "AZ-305", dur: "4 days", level: "expert" },
  ],
  "GitHub": [
    { name: "GitHub Foundations", code: "GH-F", dur: "2 days", level: "fund" },
    { name: "GitHub Copilot Fundamentals", code: "GH-COP", dur: "1 day", level: "fund" },
    { name: "GitHub Actions — Automate Workflows", code: "GH-ACT", dur: "3 days", level: "assoc" },
    { name: "GitHub Administration", code: "GH-ADM", dur: "3 days", level: "assoc" },
    { name: "GitHub Advanced Security (GHAS)", code: "GH-AS", dur: "3 days", level: "assoc" },
    { name: "GitHub Packages & Container Registry", code: "GH-PKG", dur: "2 days", level: "assoc" },
    { name: "GitHub Copilot for Enterprise Development", code: "GH-ENT", dur: "2 days", level: "assoc" },
    { name: "GitHub Enterprise Cloud & Server Expert", code: "GH-EXP", dur: "4 days", level: "expert" },
  ],
  "Windows Server": [
    { name: "Windows Client Fundamentals", code: "MD-100", dur: "2 days", level: "fund" },
    { name: "Windows Server 2022 Core Administration", code: "WS-011", dur: "5 days", level: "assoc" },
    { name: "Modern Desktop Administration (MD-101)", code: "MD-101", dur: "5 days", level: "assoc" },
    { name: "Administering Windows Server Hybrid Core", code: "AZ-800", dur: "4 days", level: "assoc" },
    { name: "Active Directory Domain Services", code: "WS-AD", dur: "3 days", level: "assoc" },
    { name: "Hyper-V Virtualization & Storage", code: "WS-HV", dur: "3 days", level: "assoc" },
    { name: "Windows Server Failover Clustering", code: "WS-FC", dur: "3 days", level: "assoc" },
    { name: "Configuring Windows Server Hybrid Advanced", code: "AZ-801", dur: "4 days", level: "expert" },
  ],
};

// ── EXAM DETAILS DATA (sourced from learn.microsoft.com) ──
// ── Price computed from level + training duration ──
function getCertPrice(cert) {
  const days = parseInt(cert.dur) || 1;
  const ratePerDay = { fund: 199, assoc: 249, expert: 299 };
  return (ratePerDay[cert.level] || 249) * days;
}

const EXAM_META = {
  fund:  { examDur: "45 min",  questions: "~40 Questions", validity: "No Expiry",          badge: "Fundamentals", color: "#10b981", bg: "rgba(16,185,129,0.10)",  score: 700 },
  assoc: { examDur: "100 min", questions: "~55 Questions", validity: "Renews Yearly (Free)", badge: "Associate",    color: "#0694D1", bg: "rgba(6,148,209,0.10)",   score: 700 },
  expert:{ examDur: "150 min", questions: "~60 Questions", validity: "Renews Yearly (Free)", badge: "Expert",       color: "#a855f7", bg: "rgba(168,85,247,0.10)",  score: 700 },
};

// ── Per-level exam detail data (sourced from learn.microsoft.com) ──
const CERT_DETAIL = {
  fund:  { cost: "$165", bundle: "Exam + practice test bundle available", format: "Multiple choice & case studies", questions: "40–60 questions", duration: "1 hr 30 min", passing: "700 / 1000", validity: "No expiry", retake: "24hr wait, then 14-day" },
  assoc: { cost: "$165", bundle: "Exam + practice test bundle available", format: "Multiple choice, labs & case studies", questions: "40–60 questions", duration: "2 hours", passing: "700 / 1000", validity: "1 year (free renewal)", retake: "24hr wait, then 14-day" },
  expert:{ cost: "$165", bundle: "Exam + practice test bundle available", format: "MCQ, drag & drop & case studies", questions: "40–60 questions", duration: "2 hr 30 min", passing: "700 / 1000", validity: "1 year (free renewal)", retake: "24hr wait, then 14-day" },
};

// Builds 3-step path (fund → assoc → expert) for a cert within its tab
function buildCertPath(selectedCert, tabCerts) {
  const groups = { fund: [], assoc: [], expert: [] };
  tabCerts.forEach(c => { if (groups[c.level]) groups[c.level].push(c); });
  return ["fund","assoc","expert"].filter(lv => groups[lv].length > 0).map((lv, idx) => {
    const inGroup = groups[lv];
    const pick = inGroup.find(c => c.code === selectedCert.code) || inGroup[0];
    return { ...pick, step: idx + 1, current: pick.code === selectedCert.code };
  });
}

const EXAM_SKILLS = {
  "Azure":          [{ l:"Cloud Architecture & Services",pct:37},{ l:"Identity & Security",pct:25},{ l:"Networking & Storage",pct:23},{ l:"Governance & Monitoring",pct:15}],
  "AI & Copilot":   [{ l:"Azure AI Services & APIs",pct:35},{ l:"Generative AI & OpenAI",pct:30},{ l:"Machine Learning & MLOps",pct:22},{ l:"Responsible AI",pct:13}],
  "Power Platform": [{ l:"Power Apps Development",pct:35},{ l:"Data Analytics (Power BI)",pct:30},{ l:"Automation & Integration",pct:20},{ l:"Governance & Admin",pct:15}],
  "Security":       [{ l:"Identity & Access Mgmt",pct:30},{ l:"Threat Detection & Response",pct:30},{ l:"Compliance & Data Protection",pct:25},{ l:"Zero Trust Architecture",pct:15}],
  "Microsoft 365":  [{ l:"Exchange, Teams & SharePoint",pct:30},{ l:"Endpoint & Device Mgmt",pct:25},{ l:"M365 Security & Compliance",pct:25},{ l:"Identity & Collaboration",pct:20}],
  "Dynamics 365":   [{ l:"CRM Configuration & Apps",pct:35},{ l:"ERP Finance & Operations",pct:30},{ l:"Power Platform Integration",pct:20},{ l:"Business Process Design",pct:15}],
  "Data & Analytics":[{ l:"Data Engineering & Pipelines",pct:35},{ l:"Analytics & Visualization",pct:30},{ l:"Database Administration",pct:20},{ l:"Real-Time & Streaming",pct:15}],
  "DevOps & Dev":   [{ l:"CI/CD & DevOps Pipelines",pct:35},{ l:"Cloud-Native Development",pct:30},{ l:"Containerization & K8s",pct:20},{ l:"Application Integration",pct:15}],
  "GitHub":         [{ l:"Version Control & Actions",pct:35},{ l:"Security & GHAS",pct:30},{ l:"Copilot & AI Dev Tools",pct:20},{ l:"Enterprise Administration",pct:15}],
  "Windows Server": [{ l:"Active Directory & Identity",pct:30},{ l:"Hybrid Infrastructure",pct:30},{ l:"Virtualization & Storage",pct:25},{ l:"High Availability & DR",pct:15}],
};

// Generates a crisp SVG avatar data URI — works offline, zero CORS
function svgAvatar(initials, bg, textColor = '#fff') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" rx="24" fill="${bg}"/><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="${textColor}">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const TESTIMONIALS = [
  { quote: "Passed AZ-104 on first attempt. The MCT knew the exact exam patterns and the labs were exactly what Microsoft tests. Worth every penny.", name: "Rahul M.", role: "Azure Administrator", cert: "AZ-104 Certified", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "I trained 15 of my team members for SC-200. Koenig's on-site delivery was seamless and all 15 passed within 3 months.", name: "Sarah K.", role: "CISO, Financial Services", cert: "Enterprise Client", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "The 1-on-1 format was a game changer. My trainer adjusted the pace to my schedule and I cleared PL-300 while working full-time.", name: "Ahmed R.", role: "Business Intelligence Lead", cert: "PL-300 Certified", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "From AZ-900 to AZ-305 in 6 months. Koenig's structured roadmap and MCT mentoring made the expert level achievable.", name: "Priya S.", role: "Cloud Solutions Architect", cert: "AZ-305 Expert", photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "As an L&D head I've used 5 training vendors. Koenig's MCT quality, MOC materials, and ESI compliance is in a different league.", name: "James T.", role: "Head of L&D, UK Enterprise", cert: "100+ Learners Trained", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "SC-900 and SC-300 back to back — both cleared first try. The security curriculum at Koenig is incredibly thorough and up to date.", name: "Aisha N.", role: "Security Analyst", cert: "SC-300 Certified", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "AI-102 was daunting but the trainer broke it down perfectly. Real Azure OpenAI labs made the difference. Highly recommend.", name: "David L.", role: "AI Engineer", cert: "AI-102 Certified", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "DP-600 Fabric certification done in 3 weeks of part-time study. The customised schedule around my timezone was a lifesaver.", name: "Mei W.", role: "Data Platform Engineer", cert: "DP-600 Certified", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face&auto=format" },
  { quote: "Our whole DevOps team got AZ-400 certified through Koenig's corporate training. Smooth logistics and top-tier MCTs throughout.", name: "Carlos R.", role: "Engineering Manager", cert: "AZ-400 Team Training", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face&auto=format" },
];

const COURSES = ["Azure (AZ series)", "Power BI / Power Platform", "Microsoft 365 / Copilot", "Security (SC series)", "Dynamics 365", "DevOps / Developer", "Not sure yet"];

const KOENIG_LOGO = "data:image/png;base64,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";

const AWARDS = [
  {
    svgIcon: <img className="award-img" src="https://www.koenig-solutions.com/assets/newimages/awards/NewAwardsImages/MS-Partner-of-the-year-2025.svg" alt="Microsoft Partner of the Year 2025"/>,
    year: "2025", org: "Microsoft",
    title: "Partner of the Year — 2025",
    desc: "Awarded by Microsoft for industry-leading training delivery, learner outcomes, and enterprise certification success globally.",
  },
  {
    svgIcon: <img className="award-img" src="https://www.koenig-solutions.com/assets/newimages/awards/NewAwardsImages/award-fy24.webp" alt="Microsoft Award FY24"/>,
    year: "FY2024", org: "Microsoft",
    title: "Microsoft Excellence Award FY24",
    desc: "Recognised by Microsoft for outstanding partner performance, cloud training volume, and learner success in FY2024.",
  },
  {
    svgIcon: <img className="award-img" src="https://www.koenig-solutions.com/assets/newimages/awards/NewAwardsImages/Winner-of-Microsoft-Asia-Superstar-Campaign-in-FY22.svg" alt="Microsoft Asia Superstar Campaign FY22"/>,
    year: "FY2022", org: "Microsoft Asia",
    title: "Winner — Asia Superstar Campaign",
    desc: "Won Microsoft's Asia Superstar Campaign for exceptional cloud training performance and partner growth across the Asia region.",
  },
  {
    svgIcon: <img className="award-img" src="https://www.koenig-solutions.com/assets/newimages/awards/NewAwardsImages/award-aug-2022.webp" alt="Microsoft Award August 2022"/>,
    year: "2022", org: "Microsoft",
    title: "Microsoft Recognition Award 2022",
    desc: "Awarded by Microsoft in recognition of sustained excellence in certified training delivery and partner ecosystem contribution.",
  },
  {
    svgIcon: <img className="award-img" src="https://www.koenig-solutions.com/assets/newimages/awards/NewAwardsImages/award-page-microsoft.webp" alt="Microsoft Partner Award"/>,
    year: "2023", org: "Microsoft",
    title: "Microsoft Authorized Learning Partner",
    desc: "Gold ALP status for 10+ consecutive years — official MOC courseware, MCT-certified trainers, and Microsoft-proctored exams.",
  },
];


function Counter({ end, suffix = "", prefix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let start = 0; const dur = 1800; const step = 16;
      const inc = end / (dur / step);
      const t = setInterval(() => {
        start += inc;
        if (start >= end) { setVal(end); clearInterval(t); }
        else setVal(Math.floor(start));
      }, step);
      obs.disconnect();
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ── MULTI-STEP FORM (revamped) ──
function LeadForm({ onClose, mode }) {
  const isBrochure = mode === "brochure";
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "",
    role: "", teamSize: "", course: [], message: ""
  });

  const set = (k, v) => setData(p => ({ ...p, [k]: v }));
  const toggleCourse = (c) => set("course", data.course.includes(c) ? data.course.filter(x => x !== c) : [...data.course, c]);

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!data.firstName.trim()) e.firstName = "First name required";
      if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = "Valid work email required";
      if (!data.phone.trim()) e.phone = "Phone / WhatsApp required";
    }
    if (s === 2) {
      if (data.course.length === 0) e.course = "Select at least one area";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);
  const submit = async () => {
    if (!validate(3)) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setSubmitted(true);
    setLoading(false);
    if (isBrochure) {
      setTimeout(() => downloadBrochure(), 400);
    }
  };

  const STEPS = ["You", "Interests", "Goals"];

  if (submitted) return (
    <div className="lf-success">
      <div className="lf-success-icon">{isBrochure ? "📥" : "✅"}</div>
      <div className="lf-success-title">
        {isBrochure ? `Your Brochure is Downloading, ${data.firstName || "there"}!` : `You're All Set, ${data.firstName || "there"}!`}
      </div>
      <div className="lf-success-msg">
        {isBrochure
          ? <>Your brochure download has started. A training advisor will also follow up within <strong style={{color:"#0694D1"}}>2 business hours</strong>.</>
          : <>A Microsoft Training Advisor will reach out within <strong style={{color:"#0694D1"}}>2 business hours</strong>.</>
        }
      </div>
      <div className="lf-success-steps">
        {[
          {n:1, title:"Confirmation email sent", sub:"Check your inbox for a copy of your request"},
          {n:2, title:"Free 30-min consultation", sub:"We'll map the right certification path for your goals"},
          {n:3, title:"Custom training plan", sub:"Receive a personalised schedule and pricing"},
        ].map(({n,title,sub}) => (
          <div key={n} className="lf-success-step">
            <div className="lf-success-step-num">{n}</div>
            <div className="lf-success-step-text"><strong>{title}</strong>{sub}</div>
          </div>
        ))}
      </div>
      <div className="lf-success-dl">
        <div className="lf-success-dl-icon">📄</div>
        <div className="lf-success-dl-text">
          <div className="lf-success-dl-title">Your sample certificate is ready</div>
          <div className="lf-success-dl-sub">Personalised with your name · PNG format</div>
        </div>
        <button className="lf-success-dl-btn" onClick={() => generateCertPDF(data.firstName + (data.lastName ? ' ' + data.lastName : ''))}>
          ↓ Download
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="lf-header">
        <div className="lf-tag">
          <span className="lf-tag-dot"/>
          {isBrochure ? "Free Training Brochure" : "Free Microsoft Training Guide"}
        </div>
        <div className="lf-title">
          {isBrochure ? <>Get Your Free<br/><span>Training Brochure</span></> : <>Talk to a<br/><span>Microsoft Expert</span></>}
        </div>
        <div className="lf-sub">
          {isBrochure ? "Curriculum · Pricing · Exam prep — all in one PDF" : "Response within 2 hours · Zero obligation"}
        </div>
      </div>

      {/* Step progress */}
      <div className="lf-progress-wrap">
        <div className="lf-progress-steps">
          {STEPS.map((_, i) => (
            <React.Fragment key={i}>
              <div className={`lf-step-pill ${step > i+1 ? "done" : step === i+1 ? "active" : ""}`}>
                {step > i+1 ? "✓" : i+1}
              </div>
              {i < STEPS.length - 1 && (
                <div className="lf-step-connector">
                  <div className={`lf-step-connector-fill ${step > i+1 ? "done" : ""}`}/>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="lf-step-labels">
          {STEPS.map((s, i) => (
            <div key={i} className={`lf-step-lbl ${step === i+1 ? "active" : ""}`}>{s}</div>
          ))}
        </div>
      </div>

      {/* Step 1 — Contact */}
      {step === 1 && (
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div className="lf-row">
            <div className="lf-field" style={{marginBottom:0}}>
              <label className="lf-label">First Name *</label>
              <div className="lf-input-wrap">
                <svg className="lf-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input className={`lf-input ${errors.firstName ? "err" : ""}`} placeholder="Rahul" value={data.firstName} onChange={e => set("firstName", e.target.value)}/>
              </div>
              {errors.firstName && <div className="lf-err"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{errors.firstName}</div>}
            </div>
            <div className="lf-field" style={{marginBottom:0}}>
              <label className="lf-label">Last Name</label>
              <div className="lf-input-wrap">
                <svg className="lf-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input className="lf-input" placeholder="Sharma" value={data.lastName} onChange={e => set("lastName", e.target.value)}/>
              </div>
            </div>
          </div>
          <div style={{marginBottom:12}}/>
          <div className="lf-field">
            <label className="lf-label">Work Email *</label>
            <div className="lf-input-wrap">
              <svg className="lf-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input className={`lf-input ${errors.email ? "err" : ""}`} placeholder="you@company.com" type="email" value={data.email} onChange={e => set("email", e.target.value)}/>
            </div>
            {errors.email && <div className="lf-err"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{errors.email}</div>}
          </div>
          <div className="lf-field">
            <label className="lf-label">Phone / WhatsApp *</label>
            <div className="lf-input-wrap">
              <svg className="lf-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/></svg>
              <input className={`lf-input ${errors.phone ? "err" : ""}`} placeholder="+91 98400 00000" value={data.phone} onChange={e => set("phone", e.target.value)}/>
            </div>
            {errors.phone && <div className="lf-err"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{errors.phone}</div>}
          </div>
          <ShinyButton fullWidth onClick={next}>
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </ShinyButton>
        </div>
      )}

      {/* Step 2 — Interests */}
      {step === 2 && (
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <span className="lf-chips-label">Which Microsoft track interests you? *</span>
          <div className="lf-chips">
            {COURSES.map(c => (
              <button key={c} className={`lf-chip ${data.course.includes(c) ? "sel" : ""}`} onClick={() => toggleCourse(c)}>{c}</button>
            ))}
          </div>
          {errors.course && <div className="lf-err" style={{marginBottom:10}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{errors.course}</div>}
          <div className="lf-field">
            <label className="lf-label">Company (optional)</label>
            <div className="lf-input-wrap">
              <svg className="lf-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <input className="lf-input" placeholder="Acme Corp" value={data.company} onChange={e => set("company", e.target.value)}/>
            </div>
          </div>
          <div className="lf-row">
            <div className="lf-field" style={{marginBottom:0}}>
              <label className="lf-label">Your Role</label>
              <select className="lf-input lf-select no-icon" value={data.role} onChange={e => set("role", e.target.value)}>
                <option value="">Select role</option>
                <option>IT Professional</option>
                <option>L&D / HR Manager</option>
                <option>Developer</option>
                <option>Manager / Team Lead</option>
                <option>CTO / IT Director</option>
                <option>Student / Career Changer</option>
              </select>
            </div>
            <div className="lf-field" style={{marginBottom:0}}>
              <label className="lf-label">Team Size</label>
              <select className="lf-input lf-select no-icon" value={data.teamSize} onChange={e => set("teamSize", e.target.value)}>
                <option value="">Just me</option>
                <option>2–5 people</option>
                <option>6–20 people</option>
                <option>21–50 people</option>
                <option>50+ people</option>
              </select>
            </div>
          </div>
          <div className="lf-nav" style={{marginTop:16}}>
            <button className="lf-btn-back" onClick={back}>← Back</button>
            <ShinyButton fullWidth onClick={next}>
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </ShinyButton>
          </div>
        </div>
      )}

      {/* Step 3 — Message & submit */}
      {step === 3 && (
        <div style={{animation:"fadeUp 0.3s ease"}}>
          <div className="lf-field">
            <label className="lf-label">Anything to add? (optional)</label>
            <div className="lf-input-wrap">
              <svg className="lf-input-icon top" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <textarea className="lf-input lf-textarea" rows={3}
                placeholder="e.g. I need AZ-104 in 4 weeks, 3 team members in Dubai…"
                value={data.message} onChange={e => set("message", e.target.value)}
              />
            </div>
          </div>
          <div className="lf-summary">
            <div className="lf-summary-label">Your Request Summary</div>
            <div className="lf-summary-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="lf-summary-val">{data.firstName} {data.lastName}</span>
              <span style={{color:"rgba(255,255,255,0.3)"}}>·</span>
              <span>{data.email}</span>
            </div>
            {data.course.length > 0 && (
              <div className="lf-summary-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="lf-summary-val">{data.course.slice(0,2).join(", ")}{data.course.length > 2 ? ` +${data.course.length-2} more` : ""}</span>
              </div>
            )}
            {data.company && (
              <div className="lf-summary-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                <span>{data.company}</span>
              </div>
            )}
          </div>
          <ShinyButton fullWidth onClick={submit} disabled={loading}>
            {loading
              ? <><span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:16}}>⟳</span> Submitting…</>
              : <>Get My Free Consultation <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            }
          </ShinyButton>
          <div style={{marginTop:8}}>
            <button className="lf-btn-back" onClick={back}>← Back</button>
          </div>
        </div>
      )}

      <div className="lf-trust">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Your details are safe. No spam, ever.
      </div>
    </>
  );
}

// ── COMPANIES SECTION — Official brand logos via Simple Icons (jsDelivr CDN) ──
const COMPANY_LIST = [
  {
    name: "Microsoft",
    jsx: (
      <svg viewBox="0 0 21 21" height="28" xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
        <rect fill="#F25022" x="0" y="0" width="10" height="10"/>
        <rect fill="#7FBA00" x="11" y="0" width="10" height="10"/>
        <rect fill="#00A4EF" x="0" y="11" width="10" height="10"/>
        <rect fill="#FFB900" x="11" y="11" width="10" height="10"/>
      </svg>
    )
  },
  {
    name: "Google",
    jsx: (
      <svg viewBox="0 0 24 24" height="28" xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    )
  },
  {
    name: "Amazon",
    jsx: (
      <svg viewBox="0 0 72 28" height="28" xmlns="http://www.w3.org/2000/svg" style={{display:"block"}}>
        <text x="1" y="18" fontFamily="'Arial Black',Arial,sans-serif" fontSize="15" fontWeight="900" fill="#232F3E" letterSpacing="-0.5">amazon</text>
        <path d="M8 23 Q36 32 64 23" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M60.5 20.5 L64 23 L62 26" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  { name: "IBM",        slug: "ibm",        color: "#1F70C1" },
  { name: "Accenture",  slug: "accenture",  color: "#A100FF" },
  { name: "Deloitte",   slug: "deloitte",   color: "#76C143" },
  { name: "Cisco",      slug: "cisco",      color: "#1BA0D7" },
  { name: "Oracle",     slug: "oracle",     color: "#F80000" },
  { name: "SAP",        slug: "sap",        color: "#0070B9" },
  { name: "Infosys",    slug: "infosys",    color: "#007CC5" },
  { name: "Wipro",      slug: "wipro",      color: "#341C71" },
  { name: "Cognizant",  slug: "cognizant",  color: "#0033A0" },
  { name: "Dell",       slug: "dell",       color: "#007DB8" },
  { name: "ServiceNow", slug: "servicenow", color: "#62D84E" },
  { name: "Salesforce", slug: "salesforce", color: "#00A1E0" },
  { name: "Adobe",      slug: "adobe",      color: "#FF0000" },
  { name: "PwC",        slug: "pwc",        color: "#D04A02" },
  { name: "Capgemini",  slug: "capgemini",  color: "#0070AD" },
  { name: "Siemens",    slug: "siemens",    color: "#009999" },
  { name: "HCL Tech",   slug: "hcl",        color: "#E3001B" },
];

function BrandLogo({ name, slug, color, jsx }) {
  // Multi-color logos are provided as inline JSX — render immediately, no fetch needed
  if (jsx) return jsx;

  const [svg, setSvg] = React.useState(null);
  const [err, setErr] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    fetch(`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`)
      .then(r => { if (!r.ok) throw new Error(); return r.text(); })
      .then(text => {
        if (cancelled) return;
        const colored = text
          .replace(/(<svg[^>]*)(>)/, `$1 fill="${color}" style="height:28px;width:auto;display:block;" $2`);
        setSvg(colored);
      })
      .catch(() => { if (!cancelled) setErr(true); });
    return () => { cancelled = true; };
  }, [slug, color]);
  if (err) return <span style={{ fontSize: 12, fontWeight: 800, color, letterSpacing: "-0.3px" }}>{name}</span>;
  if (!svg) return <span style={{ width: 60, height: 30, display: "inline-block" }} />;
  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
}

const CompanyLogos = COMPANY_LIST;


// ── KOENIG GLOBE — 14 countries ──
const GLOBE_MARKERS = [
  { lat: 28.61,  lng: 77.21,   label: "India",        flag: "🇮🇳" },
  { lat: 25.20,  lng: 55.27,   label: "UAE",          flag: "🇦🇪" },
  { lat: 36.19,  lng: 44.01,   label: "Iraq",         flag: "🇮🇶" },
  { lat: 24.69,  lng: 46.72,   label: "Saudi Arabia", flag: "🇸🇦" },
  { lat: 51.51,  lng: -0.13,   label: "UK",           flag: "🇬🇧" },
  { lat: 52.37,  lng: 4.90,    label: "Netherlands",  flag: "🇳🇱" },
  { lat: 53.34,  lng: -6.27,   label: "Ireland",      flag: "🇮🇪" },
  { lat: 40.71,  lng: -74.01,  label: "USA",          flag: "🇺🇸" },
  { lat: 43.65,  lng: -79.38,  label: "Canada",       flag: "🇨🇦" },
  { lat: 1.35,   lng: 103.82,  label: "Singapore",    flag: "🇸🇬" },
  { lat: -33.87, lng: 151.21,  label: "Australia",    flag: "🇦🇺" },
  { lat: 35.68,  lng: 139.69,  label: "Japan",        flag: "🇯🇵" },
  { lat: -26.20, lng: 28.04,   label: "South Africa", flag: "🇿🇦" },
  { lat: -1.29,  lng: 36.82,   label: "Kenya",        flag: "🇰🇪" },
];

// Fixed globe orientation — centered on Eastern hemisphere (India/Middle East/Europe)
const STATIC_PHI = -0.5;
const STATIC_THETA = 0.25;

function projectMarker(lat, lng) {
  const lat_r = lat * Math.PI / 180;
  const lng_r = lng * Math.PI / 180;
  const x = Math.cos(lat_r) * Math.sin(lng_r);
  const y = Math.sin(lat_r);
  const z = Math.cos(lat_r) * Math.cos(lng_r);
  const cos_phi = Math.cos(STATIC_PHI), sin_phi = Math.sin(STATIC_PHI);
  const xr = x * cos_phi + z * sin_phi;
  const yr = y;
  const zr = -x * sin_phi + z * cos_phi;
  const cos_th = Math.cos(STATIC_THETA), sin_th = Math.sin(STATIC_THETA);
  const xf = xr;
  const yf = yr * cos_th - zr * sin_th;
  const zf = yr * sin_th + zr * cos_th;
  if (zf < 0.15) return null; // hide markers near the limb / behind globe
  const nx = (xf + 1) / 2;
  const ny = (1 - yf) / 2;
  // reject if too close to globe edge (keeps dots safely inside the circle)
  const dx = nx - 0.5, dy = ny - 0.5;
  if (Math.sqrt(dx * dx + dy * dy) > 0.42) return null;
  return { x: nx, y: ny };
}

const KOENIG_GLOBE_CONFIG = {
  width: 800, height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0.6, theta: 0.25,
  dark: 0,
  diffuse: 0.5,
  mapSamples: 18000,
  mapBrightness: 1.4,
  baseColor: [0.88, 0.93, 0.98],
  markerColor: [6/255, 148/255, 209/255],
  glowColor: [0.72, 0.88, 0.98],
  markers: GLOBE_MARKERS.map(m => ({ location: [m.lat, m.lng], size: m.label === "India" ? 0.1 : m.label === "USA" || m.label === "UK" ? 0.08 : 0.055 })),
};

function InteractiveGlobe({ size = 520 }) {
  let width = 0;
  const canvasRef = useRef(null);

  const onResize = () => {
    if (canvasRef.current) width = canvasRef.current.offsetWidth;
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    const globe = createGlobe(canvasRef.current, {
      ...KOENIG_GLOBE_CONFIG,
      width: width * 2,
      height: width * 2,
      phi: STATIC_PHI,
      theta: STATIC_THETA,
      onRender: (state) => {
        state.phi = STATIC_PHI;
        state.theta = STATIC_THETA;
        state.width = width * 2;
        state.height = width * 2;
      },
    });
    setTimeout(() => { if (canvasRef.current) canvasRef.current.style.opacity = "1"; });
    return () => { globe.destroy(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* outer ambient glow */}
      <div style={{
        position: "absolute", inset: -32, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,148,209,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Globe canvas + dot overlays clipped to the circle */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", opacity: 0, transition: "opacity 0.8s ease", display: "block" }}
        />
        {/* Pulsing dot overlays — fixed dot + expanding ring */}
        {GLOBE_MARKERS.map((m, i) => {
          const pos = projectMarker(m.lat, m.lng);
          if (!pos) return null;
          return (
            <div key={m.label} style={{
              position: "absolute",
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              width: 0, height: 0,
            }}>
              {/* expanding pulse ring */}
              <span className="gm-ring" style={{ animationDelay: `${i * 0.22}s` }} />
              {/* fixed solid dot on top */}
              <span className="gm-dot" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GlobeSection() {
  return (
    <section className="globe-sec">
      <div className="globe-inner">
        {/* Left content */}
        <div className="globe-content reveal">
          <h2 className="sec-title" style={{marginBottom:16, color:"var(--light-text)"}}>
            Training Professionals<br/>
            <TextShimmer as="em" duration={3} spread={2}>Across 50+ Countries</TextShimmer>
          </h2>
          <p style={{fontSize:14,color:"var(--light-sub)",lineHeight:1.6,maxWidth:420,marginBottom:0}}>
            From our headquarters in India to training centers across UAE, Iraq, Saudi Arabia, UK, USA, Singapore, Australia, and more — Koenig delivers Microsoft certification training in 50+ countries.
          </p>

          <div className="globe-stats">
            <div className="globe-stat">
              <div className="globe-stat-num">50<span>+</span></div>
              <div className="globe-stat-lbl">Countries</div>
            </div>
            <div className="globe-divider"/>
            <div className="globe-stat">
              <div className="globe-stat-num">500<span>K+</span></div>
              <div className="globe-stat-lbl">Trained</div>
            </div>
            <div className="globe-divider"/>
            <div className="globe-stat">
              <div className="globe-stat-num">30<span>+</span></div>
              <div className="globe-stat-lbl">Years</div>
            </div>
            <div className="globe-divider"/>
            <div className="globe-stat">
              <div className="globe-stat-num">95<span>%</span></div>
              <div className="globe-stat-lbl">Pass Rate</div>
            </div>
          </div>

          <div className="globe-country-grid">
            {GLOBE_MARKERS.map((m, i) => (
              <div key={m.label} className="globe-country-row" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="globe-country-dot"><span className="gm-pulse-sm" /></span>
                <span className="globe-country-flag">{m.flag}</span>
                <span className="globe-country-name">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Globe */}
        <div className="globe-canvas-wrap reveal">
          <InteractiveGlobe size={460} />
        </div>
      </div>
    </section>
  );
}

function CompaniesSection({ onCTA }) {
  const row1 = [...CompanyLogos.slice(0, 10), ...CompanyLogos.slice(0, 10)];
  const row2 = [...CompanyLogos.slice(10), ...CompanyLogos.slice(10)];

  return (
    <section className="companies-sec">
      <div className="companies-inner reveal">

        {/* Headline */}
        <div className="companies-headline-wrap">
          <div className="companies-headline">
            Trusted by enterprise teams at <TextShimmer as="em" duration={2.5} spread={2}>500+</TextShimmer> global companies
          </div>
          <div className="companies-headline-sub">
            From Fortune 500 enterprises to fast-growing tech firms — Koenig alumni are everywhere
          </div>
          <div className="companies-underline"/>
        </div>

        {/* Marquee row 1 — left to right */}
        <div className="companies-marquee-wrap">
          <div className="companies-marquee">
            {row1.map((c, i) => (
              <div key={i} className="company-logo-item">
                <BrandLogo name={c.name} slug={c.slug} color={c.color} jsx={c.jsx} />
                <span className="company-logo-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee row 2 — right to left */}
        <div className="companies-marquee-wrap">
          <div className="companies-marquee companies-marquee-2">
            {row2.map((c, i) => (
              <div key={i} className="company-logo-item">
                <BrandLogo name={c.name} slug={c.slug} color={c.color} jsx={c.jsx} />
                <span className="company-logo-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{textAlign:"center", marginTop:32}}>
          <button className="companies-cta-btn" onClick={onCTA}>
            View All Courses
          </button>
        </div>

      </div>
    </section>
  );
}

// ── CERT GENERATOR ──
function generateCertPDF(name) {
  const canvas = document.createElement('canvas');
  canvas.width = 1122; canvas.height = 794; // A4 landscape px at 96dpi
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 1122, 794);
  bg.addColorStop(0, '#04111f'); bg.addColorStop(0.5, '#0a1e3a'); bg.addColorStop(1, '#04111f');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1122, 794);

  // Top accent bar
  const bar = ctx.createLinearGradient(0, 0, 1122, 0);
  bar.addColorStop(0, '#0694d1'); bar.addColorStop(0.5, '#10d9a8'); bar.addColorStop(1, '#38bdf8');
  ctx.fillStyle = bar; ctx.fillRect(0, 0, 1122, 6);

  // Border frame
  ctx.strokeStyle = 'rgba(6,148,209,0.2)'; ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, 1050, 722);
  ctx.strokeStyle = 'rgba(6,148,209,0.07)'; ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 1034, 706);

  // Corner ornaments
  const corners = [[36,36],[1086,36],[36,758],[1086,758]];
  corners.forEach(([x,y]) => {
    ctx.strokeStyle = 'rgba(6,148,209,0.5)'; ctx.lineWidth = 2;
    const sx = x < 100 ? 1 : -1, sy = y < 100 ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(x, y+sy*30); ctx.lineTo(x, y); ctx.lineTo(x+sx*30, y); ctx.stroke();
  });

  // Microsoft 4-square logo (top left)
  const sq = 14, gap = 3, lx = 80, ly = 80;
  [['#f25022',0,0],['#7fba00',1,0],['#00a4ef',0,1],['#ffb900',1,1]].forEach(([c,dx,dy]) => {
    ctx.fillStyle = c; ctx.fillRect(lx+dx*(sq+gap), ly+dy*(sq+gap), sq, sq);
  });
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '700 11px Arial';
  ctx.fillText('MICROSOFT AUTHORIZED LEARNING PARTNER', lx+sq*2+gap+10, ly+sq+2);

  // Koenig logo text (top right)
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '700 13px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('KOENIG SOLUTIONS', 1042, 92);
  ctx.fillStyle = 'rgba(6,148,209,0.7)'; ctx.font = '500 10px Arial';
  ctx.fillText('EST. 1993 · GLOBAL TRAINING LEADER', 1042, 108);
  ctx.textAlign = 'left';

  // "This is to certify that"
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '400 13px Georgia';
  ctx.fillText('THIS IS TO CERTIFY THAT', 561, 220);

  // Decorative line
  ctx.strokeStyle = 'rgba(6,148,209,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(261, 232); ctx.lineTo(861, 232); ctx.stroke();

  // Recipient name
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 58px Georgia';
  ctx.fillText(name || 'Your Name', 561, 310);

  // Underline
  const nm = ctx.measureText(name || 'Your Name');
  ctx.strokeStyle = 'rgba(56,189,248,0.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(561-nm.width/2, 322); ctx.lineTo(561+nm.width/2, 322); ctx.stroke();

  // "has successfully completed"
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '400 14px Georgia';
  ctx.fillText('HAS SUCCESSFULLY COMPLETED THE OFFICIAL MICROSOFT TRAINING COURSE', 561, 365);

  // Course name
  const gradCourse = ctx.createLinearGradient(361, 0, 761, 0);
  gradCourse.addColorStop(0, '#38bdf8'); gradCourse.addColorStop(1, '#10d9a8');
  ctx.fillStyle = gradCourse; ctx.font = 'bold 28px Georgia';
  ctx.fillText('Microsoft Azure Administrator (AZ-104)', 561, 420);

  // Meta row
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '500 12px Arial';
  ctx.fillText('COURSE DURATION: 5 DAYS   ·   FORMAT: OFFICIAL MOC   ·   INSTRUCTOR: MCT CERTIFIED', 561, 460);

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(160, 500); ctx.lineTo(962, 500); ctx.stroke();

  // Signatures section
  const sigs = [['Rohit Aggarwal', 'CEO, Koenig Solutions'], ['Microsoft Partner', 'Authorized Training Partner']];
  sigs.forEach(([name, role], i) => {
    const sx = 300 + i * 460;
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(sx-80, 590); ctx.lineTo(sx+80, 590); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '700 12px Arial';
    ctx.fillText(name, sx, 608);
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '400 11px Arial';
    ctx.fillText(role, sx, 624);
  });

  // Date
  const today = new Date().toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'});
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.font = '400 11px Arial';
  ctx.fillText(`Date of Completion: ${today}`, 561, 680);

  // Seal circle
  ctx.beginPath(); ctx.arc(561, 540, 46, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(6,148,209,0.35)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.beginPath(); ctx.arc(561, 540, 38, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(6,148,209,0.15)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = 'rgba(6,148,209,0.08)'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '700 22px Arial'; ctx.textAlign = 'center';
  ctx.fillText('✓', 561, 550);

  // Bottom bar
  const bbar = ctx.createLinearGradient(0, 0, 1122, 0);
  bbar.addColorStop(0, '#0694d1'); bbar.addColorStop(0.5, '#10d9a8'); bbar.addColorStop(1, '#38bdf8');
  ctx.fillStyle = bbar; ctx.fillRect(0, 788, 1122, 6);

  // Trigger download
  const link = document.createElement('a');
  link.download = 'Koenig-Sample-Certificate.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── BROCHURE GENERATOR ──
function downloadBrochure() {
  const canvas = document.createElement('canvas');
  canvas.width = 794; canvas.height = 1123; // A4 at 96dpi
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, 1123);
  bg.addColorStop(0, '#071e2e'); bg.addColorStop(1, '#093148');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 794, 1123);

  // Top accent bar
  const bar = ctx.createLinearGradient(0, 0, 794, 0);
  bar.addColorStop(0, '#0694D1'); bar.addColorStop(0.5, '#50e6ff'); bar.addColorStop(1, '#0694D1');
  ctx.fillStyle = bar; ctx.fillRect(0, 0, 794, 6);

  // Logo text
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left'; ctx.fillText('KOENIG SOLUTIONS', 60, 70);
  ctx.fillStyle = '#0694D1'; ctx.font = '500 13px Arial';
  ctx.fillText('Microsoft Authorized Learning Partner', 60, 92);

  // Partner badge area
  ctx.strokeStyle = 'rgba(6,148,209,0.3)'; ctx.lineWidth = 1;
  ctx.strokeRect(60, 110, 674, 1);

  // Hero headline
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 44px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Microsoft Certification', 397, 200);
  const grad = ctx.createLinearGradient(197, 0, 597, 0);
  grad.addColorStop(0, '#0694D1'); grad.addColorStop(0.5, '#50e6ff'); grad.addColorStop(1, '#0694D1');
  ctx.fillStyle = grad; ctx.font = 'bold 44px Arial';
  ctx.fillText('Training Brochure 2025', 397, 255);

  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '400 15px Arial';
  ctx.fillText('Official Microsoft courses delivered by certified MCT trainers', 397, 295);

  // Stats row
  const stats = [['500K+','Professionals Trained'],['95%','First-Attempt Pass Rate'],['30+','Years of Excellence'],['200+','Countries Served']];
  stats.forEach(([val, label], i) => {
    const x = 100 + i * 160;
    ctx.fillStyle = '#0694D1'; ctx.font = 'bold 26px Arial'; ctx.textAlign = 'center';
    ctx.fillText(val, x, 370);
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.font = '400 11px Arial';
    ctx.fillText(label, x, 390);
  });

  ctx.strokeStyle = 'rgba(6,148,209,0.2)'; ctx.lineWidth = 1;
  ctx.strokeRect(60, 405, 674, 1);

  // Popular certs
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'left';
  ctx.fillText('Popular Microsoft Certifications', 60, 445);
  const certs = [['AZ-104','Azure Administrator','Associate'],['AZ-305','Azure Solutions Architect','Expert'],['AI-102','Azure AI Engineer','Associate'],['SC-300','Identity & Access Admin','Associate'],['PL-300','Power BI Data Analyst','Associate'],['AZ-400','DevOps Engineer','Expert']];
  certs.forEach(([code, name, level], i) => {
    const col = i % 2; const row = Math.floor(i / 2);
    const x = 60 + col * 340; const y = 475 + row * 70;
    ctx.fillStyle = 'rgba(6,148,209,0.08)';
    ctx.beginPath(); ctx.roundRect(x, y, 310, 56, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(6,148,209,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(x, y, 310, 56, 8); ctx.stroke();
    ctx.fillStyle = '#0694D1'; ctx.font = 'bold 15px Arial'; ctx.textAlign = 'left';
    ctx.fillText(code, x + 14, y + 22);
    ctx.fillStyle = '#ffffff'; ctx.font = '400 12px Arial';
    ctx.fillText(name, x + 14, y + 40);
    ctx.fillStyle = 'rgba(80,230,255,0.7)'; ctx.font = '700 10px Arial'; ctx.textAlign = 'right';
    ctx.fillText(level.toUpperCase(), x + 296, y + 22);
  });

  ctx.strokeStyle = 'rgba(6,148,209,0.2)'; ctx.lineWidth = 1;
  ctx.strokeRect(60, 690, 674, 1);

  // Why Koenig
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'left';
  ctx.fillText('Why Choose Koenig?', 60, 730);
  const reasons = ['✦  Microsoft Authorized & ESI Partner — official MOC curriculum guaranteed','✦  Certified Microsoft Trainers (MCT) with real project experience','✦  Flexible 1-on-1, group, or corporate on-site delivery options','✦  Global delivery in 200+ countries with timezone-friendly scheduling'];
  reasons.forEach((r, i) => {
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '400 13px Arial';
    ctx.fillText(r, 60, 760 + i * 28);
  });

  ctx.strokeStyle = 'rgba(6,148,209,0.2)'; ctx.lineWidth = 1;
  ctx.strokeRect(60, 880, 674, 1);

  // Footer CTA
  ctx.fillStyle = 'rgba(6,148,209,0.12)';
  ctx.beginPath(); ctx.roundRect(60, 900, 674, 160, 14); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.font = 'bold 22px Arial'; ctx.textAlign = 'center';
  ctx.fillText('Ready to Get Microsoft Certified?', 397, 942);
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.font = '400 14px Arial';
  ctx.fillText('Contact our advisors for a free consultation and personalised learning path.', 397, 968);
  ctx.fillStyle = '#0694D1'; ctx.font = 'bold 13px Arial';
  ctx.fillText('www.koenig-solutions.com  ·  info@koenig-solutions.com  ·  +1-877-226-2244', 397, 1000);

  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.font = '400 11px Arial';
  ctx.fillText('© 2025 Koenig Solutions Pvt. Ltd. · Microsoft Authorized Learning Partner · ESI Partner', 397, 1090);

  const link = document.createElement('a');
  link.download = 'Koenig-Microsoft-Training-Brochure.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── DISPLAY CARDS — stacked skewed cert highlight cards ──
const CERT_DISPLAY_CARDS = [
  {
    slot: "dc-back",
    icon: <Cloud />,
    badge: "MOST POPULAR",
    title: "Azure Administrator",
    code: "AZ-104",
    desc: "Manage Azure identities, governance, storage, compute & networks.",
    stat: { icon: <TrendingUp />, text: "Avg salary: $115,000 / yr post-cert" },
    details: [
      { icon: <TrendingUp />, text: "+42% salary hike reported by alumni" },
      { icon: <CheckCircle />, text: "2× faster promotions vs. non-certified peers" },
      { icon: <Award />,       text: "Recognised by Fortune 500 hiring teams" },
    ],
    dl: "Download AZ-104 Sample",
  },
  {
    slot: "dc-mid",
    icon: <Shield />,
    badge: "HIGH DEMAND",
    title: "Security Engineer",
    code: "SC-300",
    desc: "Protect identities, data, apps & hybrid cloud environments.",
    stat: { icon: <TrendingUp />, text: "Avg salary: $128,000 / yr post-cert" },
    details: [
      { icon: <TrendingUp />, text: "+38% pay increase within 6 months" },
      { icon: <CheckCircle />, text: "500K+ open security roles globally in 2024" },
      { icon: <Award />,       text: "Top cert for CISO & security leadership track" },
    ],
    dl: "Download SC-300 Sample",
  },
  {
    slot: "dc-front",
    icon: <Award />,
    badge: "START HERE",
    title: "M365 Fundamentals",
    code: "MS-900",
    desc: "Cloud services, SaaS essentials & Microsoft 365 collaboration.",
    stat: { icon: <TrendingUp />, text: "Avg salary: $92,000 / yr post-cert" },
    details: [
      { icon: <TrendingUp />, text: "+28% salary uplift at entry level" },
      { icon: <CheckCircle />, text: "Opens pathway to 12+ Microsoft certs" },
      { icon: <Award />,       text: "Preferred by HR & operations hiring managers" },
    ],
    dl: "Download MS-900 Sample",
  },
];

function DisplayCards({ onUnlock }) {
  return (
    <div className="dc-stack">
      {CERT_DISPLAY_CARDS.map((c) => (
        <div key={c.slot} className={`dc-card ${c.slot}`}>
          {/* Top row */}
          <div className="dc-card-top">
            <span className="dc-card-icon">{c.icon}</span>
            <div className="dc-card-heading">
              <div className="dc-card-title">{c.title}</div>
              <div className="dc-card-code">{c.code}</div>
            </div>
          </div>
          <span className="dc-card-badge" style={{alignSelf:'flex-start'}}>{c.badge}</span>

          {/* Desc */}
          <p className="dc-card-desc">{c.desc}</p>

          {/* Stat pill */}
          <div className="dc-card-stat">
            {c.stat.icon}
            {c.stat.text}
          </div>

          {/* Hover-reveal detail */}
          <div className="dc-card-detail">
            <div className="dc-card-detail-inner">
              {c.details.map((d, i) => (
                <div key={i} className="dc-card-detail-row">
                  {d.icon}{d.text}
                </div>
              ))}
              <button className="dc-card-dl-hint" onClick={onUnlock}>
                <Download />
                {c.dl}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CERT SHOWCASE ──
function CertShowcase({ onUnlock }) {

  return (
    <section className="cert-showcase-sec">
      <div className="cert-showcase-inner">

        {/* LEFT — label + title + benefit cards + CTA */}
        <div className="cert-showcase-left reveal">
          <div className="cert-showcase-label">✦ Sample Certificate</div>
          <div className="cert-showcase-title">Your Microsoft <em>Certification</em> Awaits</div>
          <div className="cert-showcase-desc">
            See what your official Microsoft certification looks like. Download a sample — then let our advisors map the fastest path to earning the real one.
          </div>
          <div style={{ marginTop: 32, marginBottom: 8 }}>
            <DisplayCards onUnlock={onUnlock} />
          </div>
        </div>

        {/* RIGHT — original certificate mock + CTA */}
        <div className="cert-showcase-right reveal" data-delay="160">
          <div className="cert-preview-wrap">
            <img
              src="/koenig-sample-cert.png"
              alt="Koenig Solutions Sample Certificate"
              className="cert-real-img"
            />
            {/* Blur overlay */}
            <div className="cert-blur-overlay">
              <div className="cert-unlock-label">🔒 Fill your details to unlock</div>
              <button className="cert-unlock-btn" onClick={onUnlock}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Sample Certificate
              </button>
              <div className="cert-unlock-note">Free · No credit card · Instant download</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}


// ── CERT EXAM DETAILS ──
function ScoreRing({ score = 700, max = 1000, color = "#0694D1", size = 72 }) {
  const r = (size / 2) - 7;
  const circ = 2 * Math.PI * r;
  const pct = score / max;
  const dash = circ * pct;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:"block" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(6,148,209,0.12)" strokeWidth="5.5" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="5.5"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" fill="var(--light-text, #071e2e)" fontSize="12" fontWeight="700" fontFamily="inherit">{score}</text>
      <text x={size/2} y={size/2 + 10} textAnchor="middle" fill="var(--light-sub, #4a6375)" fontSize="9" fontFamily="inherit">/{max}</text>
    </svg>
  );
}

function UnifiedCertSection({ onEnroll, onBrochure }) {
  const [viewMode, setViewMode]       = useState("courses"); // "courses" | "exams"
  const [activeTab, setActiveTab]     = useState(CERT_TABS[0]);
  const [activeLevel, setActiveLevel] = useState("all");
  const [certSearch, setCertSearch]   = useState("");
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => { setSelectedCert(null); }, [activeTab, viewMode]);

  const allCerts = CERTS[activeTab] || [];
  const counts = {
    all:    allCerts.length,
    fund:   allCerts.filter(c => c.level === "fund").length,
    assoc:  allCerts.filter(c => c.level === "assoc").length,
    expert: allCerts.filter(c => c.level === "expert").length,
  };
  const levels = [
    { key: "all",    label: "All",          count: counts.all },
    { key: "fund",   label: "Fundamentals", count: counts.fund },
    { key: "assoc",  label: "Associate",    count: counts.assoc },
    { key: "expert", label: "Expert",       count: counts.expert },
  ].filter(lv => lv.count > 0 || lv.key === "all");

  // Courses mode
  const q = certSearch.trim().toLowerCase();
  const searchActive = q.length > 0;
  const courseDisplay = searchActive
    ? CERT_TABS.flatMap(tab => CERTS[tab].map(c => ({ ...c, tab }))).filter(c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.tab.toLowerCase().includes(q) ||
        (c.level==="fund"&&"fundamentals".includes(q)) || (c.level==="assoc"&&"associate".includes(q)) || (c.level==="expert"&&"expert".includes(q))
      )
    : allCerts.filter(c => activeLevel==="all" ? true : c.level===activeLevel).map(c => ({ ...c, tab: activeTab }));

  // Exams mode
  const skills       = EXAM_SKILLS[activeTab] || [];
  const examDisplay  = allCerts.filter(c => activeLevel==="all" ? true : c.level===activeLevel);
  const lc           = activeLevel==="fund"?"#059669":activeLevel==="assoc"?"#0578b3":activeLevel==="expert"?"#d97706":"var(--blue)";
  const ll           = activeLevel==="all"?"All":activeLevel==="fund"?"Fundamentals":activeLevel==="assoc"?"Associate":"Expert";
  const detail       = selectedCert ? (CERT_DETAIL[selectedCert.level] || CERT_DETAIL.assoc) : null;
  const meta         = selectedCert ? (EXAM_META[selectedCert.level]   || EXAM_META.assoc)   : null;
  const pathSteps    = selectedCert ? buildCertPath(selectedCert, allCerts) : [];
  const LEVEL_LABEL  = { fund:"Fundamentals", assoc:"Associate", expert:"Expert" };

  return (
    <section className="certs-sec" id="cert">
      <div className="certs-inner">

        {/* ── HEADER ── */}
        <div className="certs-header reveal">
          <div className="cert-section-top-row">
            <div>
              <h2 className="sec-title">Microsoft <em>Certification Explorer</em></h2>
              <p className="certs-header-sub">
                Browse 100+ official Microsoft courses across Azure, AI, Security, Power Platform, M365 and more — or dive into exam details, skills breakdown and certification paths.
              </p>
            </div>
            {/* ── INNOVATIVE MODE TOGGLE ── */}
            <div className="cert-mode-toggle">
              {[
                { id:"courses", icon:"📚", label:"Courses & Pricing" },
                { id:"exams",   icon:"🎯", label:"Exam Guide"        },
              ].map(m => (
                <button
                  key={m.id}
                  className={`cert-mode-btn${viewMode===m.id?" active":""}`}
                  onClick={() => setViewMode(m.id)}
                >
                  {viewMode===m.id && (
                    <motion.span
                      className="cert-mode-active-bg"
                      layoutId="cert-mode-pill"
                      transition={{ type:"spring", stiffness:420, damping:32 }}
                    />
                  )}
                  <span className="cert-mode-btn-content">
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search — courses mode only */}
          <AnimatePresence>
            {viewMode==="courses" && (
              <motion.div
                className="certs-search-wrap"
                initial={{ opacity:0, y:-8 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.22 }}
              >
                <svg className="certs-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input
                  className="certs-search-input"
                  type="text"
                  placeholder="Search certifications or exam codes… e.g. AZ-900, Copilot, Security"
                  value={certSearch}
                  onChange={e => setCertSearch(e.target.value)}
                  onKeyDown={e => e.key==="Escape" && setCertSearch("")}
                />
                {certSearch ? (
                  <button className="certs-search-clear" onClick={() => setCertSearch("")} title="Clear">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                ) : (
                  <span className="certs-search-kbd">Esc to clear</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── LAYOUT ── */}
        <div className="certs-layout reveal">

          {/* SIDEBAR */}
          <div className="cert-sidebar">
            <div className="cert-sidebar-scroll">
              <div className="cert-sidebar-label">Technologies</div>
              {CERT_TABS.map(t => (
                <button
                  key={t}
                  className={`cert-sidebar-item${activeTab===t?" active":""}`}
                  onClick={() => { setActiveTab(t); setActiveLevel("all"); }}
                >
                  <span className="csi-icon" style={t==="GitHub"?{background:"#fff",borderRadius:10,padding:4}:{}}>
                    {TECH_LOGOS[t]({ size: t==="GitHub"?22:28 })}
                  </span>
                  <div className="csi-body">
                    <span className="csi-label">{t}</span>
                    <span className="csi-sublabel">{CERT_META[t].sublabel}</span>
                  </div>
                  <span className="csi-count">{CERTS[t].length}</span>
                </button>
              ))}
            </div>
            <div className="cert-sidebar-bottom">
              <div className="cert-sidebar-actions">
                <button className="csa-brochure" onClick={onBrochure}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download Brochure
                </button>
                <button className="csa-enquire" onClick={onEnroll}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Enquire Now
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="cert-right">

            {/* INFO PANEL — shared, adapts per mode */}
            <div className="cert-info-panel">
              <div className="cert-info-row1">
                <div className="cert-info-logo" style={activeTab==="GitHub"?{background:"#fff",borderRadius:12,padding:6,display:"inline-flex"}:{}}>
                  {TECH_LOGOS[activeTab]({ size: activeTab==="GitHub"?30:38 })}
                </div>
                <div className="cert-info-identity">
                  <div className="cert-info-name">{activeTab}</div>
                  <div className="cert-info-desc">{CERT_META[activeTab].desc}</div>
                </div>
                {viewMode==="exams" && (
                  <div className="ced-meta-block">
                    <ScoreRing score={700} color="var(--blue)" size={56}/>
                    <div className="ced-meta-block-label">Pass Score</div>
                  </div>
                )}
                <button className="cert-info-enroll" onClick={onEnroll}>Enquire Now →</button>
              </div>
              <div className="cert-info-row2">
                <div className="cert-info-pills">
                  {viewMode==="courses" ? (
                    CERT_META[activeTab].pills.map(p => (
                      <span key={p} className="cert-info-pill"><span className="cert-info-pill-dot">✓</span>{p}</span>
                    ))
                  ) : (
                    <>
                      <span className="cert-info-pill"><span className="cert-info-pill-dot">🎯</span>Pass: 700/1000</span>
                      <span className="cert-info-pill"><span className="cert-info-pill-dot">🔄</span>Free Renewal</span>
                      <span className="cert-info-pill"><span className="cert-info-pill-dot">✓</span>{CERT_META[activeTab].pills[0]}</span>
                      <span className="cert-info-pill"><span className="cert-info-pill-dot">✓</span>{CERT_META[activeTab].pills[1]}</span>
                    </>
                  )}
                </div>
                <div className="cert-level-tabs">
                  {levels.map(lv => (
                    <button
                      key={lv.key}
                      className={`cert-level-tab${activeLevel===lv.key?" active":""}`}
                      data-lv={lv.key}
                      onClick={() => { setActiveLevel(lv.key); setSelectedCert(null); }}
                    >
                      {lv.label}
                      <span className="cert-level-tab-count">{lv.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── ANIMATED CONTENT AREA ── */}
            <AnimatePresence mode="wait">

              {/* ══ COURSES MODE ══ */}
              {viewMode==="courses" && (
                <motion.div
                  key="courses-view"
                  initial={{ opacity:0, x:30 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:-30 }}
                  transition={{ duration:0.28, ease:[0.16,1,0.3,1] }}
                >
                  <div className="cert-panel">
                    {/* sticky label */}
                    {searchActive ? (
                      <div className="cert-panel-sticky">
                        <span style={{fontSize:12,fontWeight:800,color:"var(--blue)",background:"rgba(6,148,209,0.1)",padding:"4px 12px",borderRadius:20,border:"1.5px solid rgba(6,148,209,0.3)"}}>
                          {courseDisplay.length} result{courseDisplay.length!==1?"s":""}
                        </span>
                        <span style={{fontSize:13,fontWeight:600,color:"var(--light-sub)"}}>for "<strong style={{color:"var(--light-text)"}}>{certSearch.trim()}</strong>"</span>
                        <button onClick={() => setCertSearch("")} style={{marginLeft:"auto",fontSize:12,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Clear ×</button>
                      </div>
                    ) : (
                      <div className="cert-panel-sticky">
                        <span style={{fontSize:12,fontWeight:800,color:lc,background:`color-mix(in srgb, ${lc} 10%, transparent)`,padding:"4px 12px",borderRadius:20,border:`1.5px solid ${lc}`}}>
                          {courseDisplay.length} {ll==="All"?"All Courses":ll}
                        </span>
                        <span style={{fontSize:13,fontWeight:700,color:"var(--light-text)"}}>{activeTab}</span>
                        <span style={{fontSize:12,color:"var(--light-sub)",marginLeft:"auto"}}>Scroll to browse all courses</span>
                      </div>
                    )}
                    <div className="cert-panel-scroll">
                      {courseDisplay.length===0 ? (
                        <div className="certs-no-results">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.25,marginBottom:12}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                          <div style={{fontWeight:700,fontSize:15,color:"var(--light-text)",marginBottom:4}}>No courses found</div>
                          <div style={{fontSize:13,color:"var(--light-sub)"}}>Try a different keyword or exam code</div>
                          <button style={{marginTop:16,fontSize:12,fontWeight:700,color:"var(--blue)",background:"rgba(6,148,209,0.08)",border:"1px solid rgba(6,148,209,0.25)",borderRadius:8,padding:"7px 16px",cursor:"pointer"}} onClick={() => setCertSearch("")}>Clear search</button>
                        </div>
                      ) : (
                        <div className="cert-grid">
                          {courseDisplay.map((c,i) => (
                            <div key={`c-${i}`} className={`cert-card ${c.level}-card`}>
                              {searchActive && <span className="cert-track-tag">{c.tab}</span>}
                              <span className={`cert-badge ${c.level}`}>
                                {c.level==="fund"?"Fundamentals":c.level==="assoc"?"Associate":"Expert"}
                              </span>
                              <div className="cert-name">{c.name}</div>
                              <div className="cert-code">{c.code}</div>
                              <div className="cert-footer">
                                <div className="cert-price-row">
                                  <span className="cert-price">
                                    <span className="cert-price-curr">$</span>
                                    <span className="cert-price-amount">{getCertPrice(c).toLocaleString()}</span>
                                  </span>
                                  <span className="cert-price-label">per person · USD</span>
                                </div>
                                <span className="cert-dur">⏱ {c.dur}</span>
                                <div className="cert-actions">
                                  <button className="cert-btn-brochure" onClick={onBrochure}>Brochure</button>
                                  <button className="cert-btn-details" onClick={onEnroll}>Enroll Now</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ EXAM GUIDE MODE ══ */}
              {viewMode==="exams" && (
                <motion.div
                  key="exams-view"
                  initial={{ opacity:0, x:-30 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:30 }}
                  transition={{ duration:0.28, ease:[0.16,1,0.3,1] }}
                >
                  <div className="cert-panel">
                    <div className="cert-panel-sticky">
                      <span style={{fontSize:12,fontWeight:800,color:lc,background:`color-mix(in srgb, ${lc} 10%, transparent)`,padding:"4px 12px",borderRadius:20,border:`1.5px solid ${lc}`}}>
                        {examDisplay.length} {ll} Exam{examDisplay.length!==1?"s":""}
                      </span>
                      <span style={{fontSize:13,fontWeight:700,color:"var(--light-text)"}}>{activeTab}</span>
                      <span style={{fontSize:12,color:"var(--light-sub)",marginLeft:"auto"}}>Click any exam to see full details</span>
                    </div>
                    <div className="cert-panel-scroll">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${activeTab}-${activeLevel}`}
                          className="cert-grid"
                          initial={{ opacity:0 }}
                          animate={{ opacity:1 }}
                          exit={{ opacity:0 }}
                          transition={{ duration:0.18 }}
                        >
                          {examDisplay.map(cert => {
                            const cm = EXAM_META[cert.level] || EXAM_META.assoc;
                            const isSelected = selectedCert?.code===cert.code;
                            return (
                              <div
                                key={cert.code}
                                className={`cert-card ${cert.level}-card${isSelected?" exam-card-selected":""}`}
                                onClick={() => setSelectedCert(isSelected ? null : cert)}
                                style={{ cursor:"pointer" }}
                              >
                                <span className={`cert-badge ${cert.level}`}>
                                  {cert.level==="fund"?"Fundamentals":cert.level==="assoc"?"Associate":"Expert"}
                                </span>
                                <div className="cert-name">{cert.name}</div>
                                <div className="cert-code">{cert.code}</div>
                                <div className="exam-stat-chips">
                                  <span className="exam-chip">⏱ {cm.examDur}</span>
                                  <span className="exam-chip">❓ {cm.questions}</span>
                                  <span className="exam-chip">🎯 700/1000</span>
                                </div>
                                <div className="exam-skills-mini">
                                  {skills.slice(0,2).map(sk => (
                                    <div key={sk.l} className="exam-skill-mini-row">
                                      <div className="exam-skill-mini-meta">
                                        <span className="exam-skill-mini-label">{sk.l}</span>
                                        <span className="exam-skill-mini-pct">{sk.pct}%</span>
                                      </div>
                                      <div className="exam-skill-mini-track">
                                        <div className="exam-skill-mini-fill" style={{width:`${sk.pct}%`,background:`linear-gradient(90deg, ${cm.color} 0%, #50e6ff 100%)`}}/>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="cert-footer">
                                  <div className="cert-price-row">
                                    <span className="cert-price">
                                      <span className="cert-price-curr">$</span>
                                      <span className="cert-price-amount">{getCertPrice(cert).toLocaleString()}</span>
                                    </span>
                                    <span className="cert-price-label">indicative · USD</span>
                                  </div>
                                  <span className="cert-dur">📅 {cert.dur} · {cm.validity}</span>
                                  <div className="cert-actions">
                                    <button className="cert-btn-details" onClick={e=>{e.stopPropagation();onEnroll();}}>Enroll Now</button>
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="exam-card-selected-hint">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    View Details Below
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>{/* end cert-right */}
        </div>{/* end certs-layout */}

        {/* ── EXAM DETAIL PANEL (exam mode only) ── */}
        <AnimatePresence>
          {viewMode==="exams" && selectedCert && detail && (
            <motion.div
              className="ced-detail-panel"
              initial={{ opacity:0, y:-16, scale:0.99 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-16, scale:0.99 }}
              transition={{ duration:0.38, ease:[0.16,1,0.3,1] }}
            >
              <div className="ced-dp-header">
                <div className="ced-dp-header-left">
                  <div className="ced-dp-eyebrow">
                    <span className={`cert-badge ${selectedCert.level}`} style={{marginBottom:0}}>{LEVEL_LABEL[selectedCert.level]}</span>
                    <span className="ced-dp-code">{selectedCert.code}</span>
                  </div>
                  <h3 className="ced-dp-title">Certification Details</h3>
                  <p className="ced-dp-sub">Everything you need to know about the <strong>{selectedCert.code} {selectedCert.name}</strong> exam</p>
                </div>
                <div className="ced-dp-header-right">
                  <ScoreRing score={700} color={meta.color} size={80}/>
                  <button className="ced-dp-close" onClick={() => setSelectedCert(null)} title="Close">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
              <div className="ced-dp-body">
                <div className="ced-dp-info">
                  <div className="ced-dp-section-label">Exam Information</div>
                  <div className="ced-info-grid">
                    {[
                      { icon:"📋", label:"Exam Name",     value:selectedCert.code },
                      { icon:"💰", label:"Exam Cost",     value:detail.cost },
                      { icon:"📝", label:"Format",        value:detail.format },
                      { icon:"❓", label:"Questions",     value:detail.questions },
                      { icon:"⏱", label:"Duration",      value:detail.duration },
                      { icon:"🎯", label:"Passing Score", value:detail.passing },
                      { icon:"📅", label:"Validity",      value:detail.validity },
                      { icon:"🔄", label:"Retake Policy", value:detail.retake },
                    ].map((item,idx) => (
                      <motion.div key={item.label} className="ced-info-card" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:idx*0.04,duration:0.3}}>
                        <span className="ced-info-icon">{item.icon}</span>
                        <span className="ced-info-label">{item.label}</span>
                        <span className="ced-info-value">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="ced-dp-section-label" style={{marginTop:20}}>Skills Measured ({activeTab})</div>
                  <div className="ced-dp-skills">
                    {skills.map((sk,si) => (
                      <motion.div key={sk.l} className="ced-dp-skill-row" initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.32+si*0.06,duration:0.3}}>
                        <div className="ced-dp-skill-meta">
                          <span className="ced-dp-skill-label">{sk.l}</span>
                          <span className="ced-dp-skill-pct">{sk.pct}%</span>
                        </div>
                        <div className="ced-dp-skill-track">
                          <div className="ced-dp-skill-fill" style={{width:`${sk.pct}%`,background:`linear-gradient(90deg, ${meta.color} 0%, #50e6ff 100%)`}}/>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="ced-dp-path">
                  <div className="ced-dp-section-label">Certification Path</div>
                  <p className="ced-dp-path-sub">Where {selectedCert.code} fits in the {activeTab} journey</p>
                  <div className="ced-path-steps">
                    {pathSteps.map((step,idx) => (
                      <motion.div key={step.code} className={`ced-path-step${step.current?" current":""}`} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:idx*0.1,duration:0.35}}>
                        <div className="ced-path-step-left">
                          <div className="ced-path-num" style={{background:step.current?meta.color:"var(--light-bg)",color:step.current?"#fff":"var(--light-sub)",border:`2px solid ${step.current?meta.color:"var(--light-border)"}`}}>{idx+1}</div>
                          {idx<pathSteps.length-1 && <div className="ced-path-line" style={{background:step.current?`linear-gradient(to bottom, ${meta.color}, var(--light-border))`:"var(--light-border)"}}/>}
                        </div>
                        <div className={`ced-path-step-body${step.current?" current":""}`} style={step.current?{borderColor:meta.color+"50",background:meta.bg}:{}}>
                          <div className="ced-path-step-top">
                            <span className="ced-path-step-code" style={step.current?{color:meta.color}:{}}>{step.code}</span>
                            <span className={`cert-badge ${step.level}`} style={{marginBottom:0,fontSize:9}}>{LEVEL_LABEL[step.level]}</span>
                          </div>
                          <div className="ced-path-step-name">{step.name}</div>
                          {step.current && <div className="ced-path-here" style={{color:meta.color}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>You are here</div>}
                          <div className="ced-path-step-price">${getCertPrice(step).toLocaleString()} <span>indicative</span></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ced-dp-footer">
                <div className="ced-dp-footer-info">
                  <span className="ced-dp-footer-fee"><span>Indicative Training Fee</span><strong>${getCertPrice(selectedCert).toLocaleString()} USD</strong></span>
                  <span className="ced-dp-footer-note">📋 {detail.bundle}</span>
                </div>
                <div className="ced-dp-footer-actions">
                  <button className="cert-btn-brochure" onClick={onBrochure}>Download Brochure</button>
                  <button className="cert-btn-details" onClick={onEnroll}>
                    Enroll in {selectedCert.code}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info bar — exam mode only */}
        <AnimatePresence>
          {viewMode==="exams" && (
            <motion.div className="ced-footer-bar reveal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}>
              <div className="ced-footer-item"><span className="ced-footer-icon">🎯</span><div className="ced-footer-text"><strong>Passing Score</strong>700 out of 1000 — all Microsoft exams</div></div>
              <div className="ced-footer-divider"/>
              <div className="ced-footer-item"><span className="ced-footer-icon">🔄</span><div className="ced-footer-text"><strong>Free Renewal</strong>Annual online assessment via Microsoft Learn</div></div>
              <div className="ced-footer-divider"/>
              <div className="ced-footer-item"><span className="ced-footer-icon">🌐</span><div className="ced-footer-text"><strong>Exam Data</strong>learn.microsoft.com official exam pages</div></div>
              <div className="ced-footer-divider"/>
              <div className="ced-footer-item"><span className="ced-footer-icon">💰</span><div className="ced-footer-text"><strong>Indicative Pricing</strong>Contact Koenig for exact training fees</div></div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

function CertExamDetails({ onEnroll }) {
  const [examTab, setExamTab]         = useState(CERT_TABS[0]);
  const [examLevel, setExamLevel]     = useState("all");
  const [selectedCert, setSelectedCert] = useState(null);

  const skills   = EXAM_SKILLS[examTab] || [];
  const allCerts = CERTS[examTab] || [];
  const counts   = {
    all:    allCerts.length,
    fund:   allCerts.filter(c => c.level === "fund").length,
    assoc:  allCerts.filter(c => c.level === "assoc").length,
    expert: allCerts.filter(c => c.level === "expert").length,
  };
  const levels = [
    { key: "all",    label: "All",          count: counts.all },
    { key: "fund",   label: "Fundamentals", count: counts.fund },
    { key: "assoc",  label: "Associate",    count: counts.assoc },
    { key: "expert", label: "Expert",       count: counts.expert },
  ].filter(lv => lv.count > 0 || lv.key === "all");

  const displayCerts = allCerts.filter(c => examLevel === "all" ? true : c.level === examLevel);
  const lc = examLevel === "fund" ? "#059669" : examLevel === "assoc" ? "#0578b3" : examLevel === "expert" ? "#d97706" : "var(--blue)";
  const ll = examLevel === "all" ? "All Exams" : examLevel === "fund" ? "Fundamentals" : examLevel === "assoc" ? "Associate" : "Expert";

  // Detail panel derived data
  const detail    = selectedCert ? (CERT_DETAIL[selectedCert.level] || CERT_DETAIL.assoc) : null;
  const meta      = selectedCert ? (EXAM_META[selectedCert.level]   || EXAM_META.assoc)   : null;
  const pathSteps = selectedCert ? buildCertPath(selectedCert, allCerts) : [];
  const LEVEL_LABEL = { fund: "Fundamentals", assoc: "Associate", expert: "Expert" };
  const LEVEL_COLOR = { fund: "#059669", assoc: "#0578b3", expert: "#d97706" };

  return (
    <section className="ced-sec">
      <div className="ced-inner">

        {/* Header — same style as tech section */}
        <div className="certs-header reveal">
          <div className="ced-eyebrow">
            <span className="ced-eyebrow-dot" />
            Source: learn.microsoft.com · koenig-solutions.com
          </div>
          <h2 className="sec-title">Microsoft Exam <em>Guide & Details</em></h2>
          <p className="certs-header-sub">
            Exam format, skills measured, passing score, cost, duration and indicative training fees for every Microsoft certification — AZ-104, AI-102, SC-300, AZ-305 and more.
          </p>
        </div>

        {/* ── SAME LAYOUT AS TECH SECTION ── */}
        <div className="certs-layout reveal">

          {/* LEFT SIDEBAR — technology selector */}
          <div className="cert-sidebar">
            <div className="cert-sidebar-scroll">
              <div className="cert-sidebar-label">Technologies</div>
              {CERT_TABS.map(t => (
                <button
                  key={t}
                  className={`cert-sidebar-item${examTab === t ? " active" : ""}`}
                  onClick={() => { setExamTab(t); setExamLevel("all"); }}
                >
                  <span className="csi-icon" style={t === "GitHub" ? { background: "#fff", borderRadius: 10, padding: 4 } : {}}>
                    {TECH_LOGOS[t]({ size: t === "GitHub" ? 22 : 28 })}
                  </span>
                  <div className="csi-body">
                    <span className="csi-label">{t}</span>
                    <span className="csi-sublabel">{CERT_META[t].sublabel}</span>
                  </div>
                  <span className="csi-count">{CERTS[t].length}</span>
                </button>
              ))}
            </div>
            <div className="cert-sidebar-bottom">
              <div className="cert-sidebar-actions">
                <button className="csa-enquire" onClick={onEnroll} style={{ flex: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Enquire Now
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: info panel + exam grid */}
          <div className="cert-right">

            {/* TOP: info panel */}
            <div className="cert-info-panel">
              <div className="cert-info-row1">
                <div className="cert-info-logo" style={examTab === "GitHub" ? { background: "#fff", borderRadius: 12, padding: 6, display: "inline-flex" } : {}}>
                  {TECH_LOGOS[examTab]({ size: examTab === "GitHub" ? 30 : 38 })}
                </div>
                <div className="cert-info-identity">
                  <div className="cert-info-name">{examTab}</div>
                  <div className="cert-info-desc">{CERT_META[examTab].desc}</div>
                </div>
                {/* Exam meta stat block */}
                <div className="ced-meta-block">
                  <ScoreRing score={700} color="var(--blue)" size={56} />
                  <div className="ced-meta-block-label">Pass Score</div>
                </div>
                <button className="cert-info-enroll" onClick={onEnroll}>Enquire Now →</button>
              </div>
              <div className="cert-info-row2">
                <div className="cert-info-pills">
                  <span className="cert-info-pill"><span className="cert-info-pill-dot">🎯</span>Pass: 700/1000</span>
                  <span className="cert-info-pill"><span className="cert-info-pill-dot">🔄</span>Free Renewal</span>
                  <span className="cert-info-pill"><span className="cert-info-pill-dot">✓</span>{CERT_META[examTab].pills[0]}</span>
                  <span className="cert-info-pill"><span className="cert-info-pill-dot">✓</span>{CERT_META[examTab].pills[1]}</span>
                </div>
                <div className="cert-level-tabs">
                  {levels.map(lv => (
                    <button
                      key={lv.key}
                      className={`cert-level-tab${examLevel === lv.key ? " active" : ""}`}
                      data-lv={lv.key}
                      onClick={() => setExamLevel(lv.key)}
                    >
                      {lv.label}
                      <span className="cert-level-tab-count">{lv.count}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* BOTTOM: exam card grid */}
            <div className="cert-panel">
              <div className="cert-panel-sticky">
                <span style={{ fontSize:12, fontWeight:800, color:lc, background:`color-mix(in srgb, ${lc} 10%, transparent)`, padding:"4px 12px", borderRadius:20, border:`1.5px solid ${lc}` }}>
                  {displayCerts.length} {ll}
                </span>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--light-text)" }}>{examTab}</span>
                <span style={{ fontSize:12, color:"var(--light-sub)", marginLeft:"auto" }}>Scroll to explore all exams</span>
              </div>

              <div className="cert-panel-scroll">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${examTab}-${examLevel}`}
                    className="cert-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {displayCerts.map((cert) => {
                      const cm = EXAM_META[cert.level] || EXAM_META.assoc;
                      const isSelected = selectedCert?.code === cert.code;
                      return (
                        <div
                          key={cert.code}
                          className={`cert-card ${cert.level}-card${isSelected ? " exam-card-selected" : ""}`}
                          onClick={() => setSelectedCert(isSelected ? null : cert)}
                          style={{ cursor: "pointer" }}
                        >
                          <span className={`cert-badge ${cert.level}`}>
                            {cert.level === "fund" ? "Fundamentals" : cert.level === "assoc" ? "Associate" : "Expert"}
                          </span>
                          <div className="cert-name">{cert.name}</div>
                          <div className="cert-code">{cert.code}</div>

                          {/* Exam-specific stats row */}
                          <div className="exam-stat-chips">
                            <span className="exam-chip">⏱ {cm.examDur}</span>
                            <span className="exam-chip">❓ {cm.questions}</span>
                            <span className="exam-chip">🎯 700/1000</span>
                          </div>

                          {/* Top 2 skill mini-bars */}
                          <div className="exam-skills-mini">
                            {skills.slice(0, 2).map(sk => (
                              <div key={sk.l} className="exam-skill-mini-row">
                                <div className="exam-skill-mini-meta">
                                  <span className="exam-skill-mini-label">{sk.l}</span>
                                  <span className="exam-skill-mini-pct">{sk.pct}%</span>
                                </div>
                                <div className="exam-skill-mini-track">
                                  <div className="exam-skill-mini-fill" style={{ width: `${sk.pct}%`, background: `linear-gradient(90deg, ${cm.color} 0%, #50e6ff 100%)` }} />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="cert-footer">
                            <div className="cert-price-row">
                              <span className="cert-price">
                                <span className="cert-price-curr">$</span>
                                <span className="cert-price-amount">{getCertPrice(cert).toLocaleString()}</span>
                              </span>
                              <span className="cert-price-label">indicative · USD</span>
                            </div>
                            <span className="cert-dur">📅 {cert.dur} training · {cm.validity}</span>
                            <div className="cert-actions">
                              <button className="cert-btn-details" onClick={e => { e.stopPropagation(); onEnroll(); }}>Enroll Now</button>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="exam-card-selected-hint">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                              View Details Below
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>{/* end cert-right */}
        </div>{/* end certs-layout */}

        {/* ── DYNAMIC CERT DETAIL PANEL ── */}
        <AnimatePresence>
          {selectedCert && detail && (
            <motion.div
              className="ced-detail-panel"
              initial={{ opacity: 0, y: -16, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.99 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Panel header */}
              <div className="ced-dp-header">
                <div className="ced-dp-header-left">
                  <div className="ced-dp-eyebrow">
                    <span className={`cert-badge ${selectedCert.level}`} style={{ marginBottom: 0 }}>
                      {LEVEL_LABEL[selectedCert.level]}
                    </span>
                    <span className="ced-dp-code">{selectedCert.code}</span>
                  </div>
                  <h3 className="ced-dp-title">Certification Details</h3>
                  <p className="ced-dp-sub">Everything you need to know about the <strong>{selectedCert.code} {selectedCert.name}</strong> exam</p>
                </div>
                <div className="ced-dp-header-right">
                  <ScoreRing score={700} color={meta.color} size={80} />
                  <button className="ced-dp-close" onClick={() => setSelectedCert(null)} title="Close">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              {/* Panel body: info grid + path */}
              <div className="ced-dp-body">

                {/* LEFT: exam information grid */}
                <div className="ced-dp-info">
                  <div className="ced-dp-section-label">Exam Information</div>
                  <div className="ced-info-grid">
                    {[
                      { icon: "📋", label: "Exam Name",     value: selectedCert.code },
                      { icon: "💰", label: "Exam Cost",     value: detail.cost },
                      { icon: "📝", label: "Format",        value: detail.format },
                      { icon: "❓", label: "Questions",     value: detail.questions },
                      { icon: "⏱", label: "Duration",      value: detail.duration },
                      { icon: "🎯", label: "Passing Score", value: detail.passing },
                      { icon: "📅", label: "Validity",      value: detail.validity },
                      { icon: "🔄", label: "Retake Policy", value: detail.retake },
                    ].map((item, idx) => (
                      <motion.div
                        key={item.label}
                        className="ced-info-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                      >
                        <span className="ced-info-icon">{item.icon}</span>
                        <span className="ced-info-label">{item.label}</span>
                        <span className="ced-info-value">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Skills breakdown */}
                  <div className="ced-dp-section-label" style={{ marginTop: 20 }}>Skills Measured ({examTab})</div>
                  <div className="ced-dp-skills">
                    {skills.map((sk, si) => (
                      <motion.div
                        key={sk.l}
                        className="ced-dp-skill-row"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.32 + si * 0.06, duration: 0.3 }}
                      >
                        <div className="ced-dp-skill-meta">
                          <span className="ced-dp-skill-label">{sk.l}</span>
                          <span className="ced-dp-skill-pct">{sk.pct}%</span>
                        </div>
                        <div className="ced-dp-skill-track">
                          <div className="ced-dp-skill-fill" style={{ width: `${sk.pct}%`, background: `linear-gradient(90deg, ${meta.color} 0%, #50e6ff 100%)`, animationDelay: `${si * 0.08}s` }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: certification path */}
                <div className="ced-dp-path">
                  <div className="ced-dp-section-label">Certification Path</div>
                  <p className="ced-dp-path-sub">Where {selectedCert.code} fits in the {examTab} journey</p>
                  <div className="ced-path-steps">
                    {pathSteps.map((step, idx) => (
                      <motion.div
                        key={step.code}
                        className={`ced-path-step${step.current ? " current" : ""}`}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.35 }}
                      >
                        <div className="ced-path-step-left">
                          <div className="ced-path-num" style={{ background: step.current ? meta.color : "var(--light-bg)", color: step.current ? "#fff" : "var(--light-sub)", border: `2px solid ${step.current ? meta.color : "var(--light-border)"}` }}>
                            {idx + 1}
                          </div>
                          {idx < pathSteps.length - 1 && (
                            <div className="ced-path-line" style={{ background: step.current ? `linear-gradient(to bottom, ${meta.color}, var(--light-border))` : "var(--light-border)" }} />
                          )}
                        </div>
                        <div className={`ced-path-step-body${step.current ? " current" : ""}`} style={step.current ? { borderColor: meta.color + "50", background: meta.bg } : {}}>
                          <div className="ced-path-step-top">
                            <span className="ced-path-step-code" style={step.current ? { color: meta.color } : {}}>{step.code}</span>
                            <span className={`cert-badge ${step.level}`} style={{ marginBottom: 0, fontSize: 9 }}>{LEVEL_LABEL[step.level]}</span>
                          </div>
                          <div className="ced-path-step-name">{step.name}</div>
                          {step.current && (
                            <div className="ced-path-here" style={{ color: meta.color }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                              You are here
                            </div>
                          )}
                          <div className="ced-path-step-price">${getCertPrice(step).toLocaleString()} <span>indicative</span></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

              </div>{/* end ced-dp-body */}

              {/* Panel footer */}
              <div className="ced-dp-footer">
                <div className="ced-dp-footer-info">
                  <span className="ced-dp-footer-fee">
                    <span>Indicative Training Fee</span>
                    <strong>${getCertPrice(selectedCert).toLocaleString()} USD</strong>
                  </span>
                  <span className="ced-dp-footer-note">📋 {detail.bundle}</span>
                </div>
                <div className="ced-dp-footer-actions">
                  <button className="cert-btn-brochure" onClick={onEnroll}>Download Brochure</button>
                  <button className="cert-btn-details" onClick={onEnroll}>
                    Enroll in {selectedCert.code}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info bar */}
        <div className="ced-footer-bar reveal">
          <div className="ced-footer-item">
            <span className="ced-footer-icon">🎯</span>
            <div className="ced-footer-text"><strong>Passing Score</strong>700 out of 1000 — all Microsoft exams</div>
          </div>
          <div className="ced-footer-divider" />
          <div className="ced-footer-item">
            <span className="ced-footer-icon">🔄</span>
            <div className="ced-footer-text"><strong>Free Renewal</strong>Annual online assessment via Microsoft Learn</div>
          </div>
          <div className="ced-footer-divider" />
          <div className="ced-footer-item">
            <span className="ced-footer-icon">🌐</span>
            <div className="ced-footer-text"><strong>Exam Data</strong>learn.microsoft.com official exam pages</div>
          </div>
          <div className="ced-footer-divider" />
          <div className="ced-footer-item">
            <span className="ced-footer-icon">💰</span>
            <div className="ced-footer-text"><strong>Indicative Pricing</strong>Contact Koenig for exact training fees</div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── VIDEO FACADE ── (thumbnail + play button; only loads iframe on click → no YouTube link)
function VideoFacade({ videoId }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&controls=1`}
        title="Why Choose Koenig Solutions"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ width: "100%", height: "100%", display: "block", border: "none" }}
      />
    );
  }
  return (
    <div className="why-video-thumb" onClick={() => setPlaying(true)}>
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="Why Choose Koenig Solutions"
      />
      <div className="why-play-btn">
        <div className="why-play-circle">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 3 }}>
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── TEXT SHIMMER ──
// Ported from shadcn/Tailwind source to plain CSS-in-JS + framer-motion
function TextShimmer({
  children,
  as: Component = 'span',
  className,
  duration = 2,
  spread = 2,
  baseColor = '#0694D1',
  gradColor = '#a8d8ff',
  style,
}) {
  const MotionComp = motion[Component] || motion.span;
  const dynamicSpread = children.length * spread;
  return (
    <MotionComp
      className={className}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{ repeat: Infinity, duration, ease: 'linear' }}
      style={{
        '--spread': `${dynamicSpread}px`,
        backgroundImage: `linear-gradient(90deg, transparent calc(50% - var(--spread)), ${gradColor}, transparent calc(50% + var(--spread))), linear-gradient(${baseColor}, ${baseColor})`,
        backgroundSize: '250% 100%, auto',
        backgroundRepeat: 'no-repeat, padding-box',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        fontStyle: 'inherit',
        ...style,
      }}
    >
      {children}
    </MotionComp>
  );
}

// ── DISPLAY CARDS (stacked skew, adapted from shadcn display-cards) ──
const LGM_CARDS = [
  {
    icon: "📄",
    iconBg: "rgba(6,148,209,0.18)",
    title: "Course Curriculum",
    description: "Full module & lab breakdown",
    meta: "Updated Mar 2026",
    layer: "back",
  },
  {
    icon: "🎯",
    iconBg: "rgba(80,230,255,0.12)",
    title: "Exam Prep Guide",
    description: "Objective map & study plan",
    meta: "MCT reviewed",
    layer: "mid",
  },
  {
    icon: "⬇",
    iconBg: "rgba(6,148,209,0.25)",
    title: "Free Brochure",
    description: "Pricing, batches & early-bird",
    meta: "Instant · No spam",
    layer: "front",
  },
];

function DisplayCard({ icon, iconBg, title, description, meta, style, className }) {
  return (
    <div className={`lgm-dc-card ${className || ""}`} style={{ position: "relative", ...style }}>
      <div className="lgm-dc-top">
        <span className="lgm-dc-icon" style={{ background: iconBg }}>{icon}</span>
        <span className="lgm-dc-title">{title}</span>
      </div>
      <p className="lgm-dc-desc">{description}</p>
      <p className="lgm-dc-meta">{meta}</p>
    </div>
  );
}

// ── MID-PAGE LEAD GEN ──
function LeadGenMid({ onBrochure, onAdvisor }) {
  return (
    <section className="lgm-sec">
      <div className="lgm-bg" aria-hidden="true" />
      <div className="lgm-inner">
        {/* LEFT */}
        <div className="lgm-left">
          <div className="reveal">
            <div className="lgm-eyebrow">
              <span className="lgm-eyebrow-dot" />
              Free Resource
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: "0.08s" }}>
            <h2 className="lgm-title">
              Want to Know <em>More?</em>
            </h2>
          </div>
          <div className="reveal" style={{ transitionDelay: "0.16s" }}>
            <p className="lgm-desc">
              Get to know the course in-depth — curriculum, delivery formats,
              exam prep strategy, and pricing — all in one place.
            </p>
          </div>
          <div className="lgm-bullets reveal" style={{ transitionDelay: "0.22s" }}>
            {[
              "Full module breakdown & lab hours",
              "Exam objective mapping by MCTs",
              "Pricing, batches & early-bird offers",
            ].map((b, i) => (
              <div key={i} className="lgm-bullet">
                <span className="lgm-bullet-dot">✓</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="lgm-ctas reveal" style={{ transitionDelay: "0.3s" }}>
            <ShinyButton size="lg" onClick={onBrochure}>
              ⬇ Download Brochure
            </ShinyButton>
            <ShinyButton size="lg" variant="outline" onClick={onAdvisor}>
              Talk to an Advisor
            </ShinyButton>
          </div>
          <div className="lgm-trust-row reveal" style={{ transitionDelay: "0.36s" }}>
            <span className="lgm-trust-item">🔒 Secure</span>
            <span className="lgm-trust-item">⚡ Instant PDF</span>
            <span className="lgm-trust-item">🏆 500K+ trained</span>
          </div>
        </div>

        {/* RIGHT — DisplayCards stacked */}
        <div className="lgm-right reveal" style={{ transitionDelay: "0.18s" }}>
          <div className="lgm-dc-stack">
            <DisplayCard {...LGM_CARDS[0]} className="lgm-dc-back" />
            <DisplayCard {...LGM_CARDS[1]} className="lgm-dc-mid" />
            <DisplayCard {...LGM_CARDS[2]} className="lgm-dc-front" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS COLUMN (scrolling) ──
function TestimonialsColumn({ testimonials, duration = 10, className }) {
  const doubled = [...testimonials, ...testimonials];
  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 20, listStyle: "none", margin: 0, padding: 0 }}
      >
        {doubled.map((t, i) => (
          <motion.li
            key={i}
            className="test-col-card"
            style={{ position: "relative" }}
            whileHover={{ scale: 1.03, y: -6, transition: { type: "spring", stiffness: 400, damping: 17 } }}
          >
            <div className="test-col-quote">"{t.quote}"</div>
            <div className="test-col-author">
              <img className="test-col-avatar" src={t.photo} alt={t.name} />
              <div>
                <div className="test-col-name">{t.name}</div>
                <div className="test-col-role">{t.role}</div>
                <div className="test-col-cert">{t.cert}</div>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

// ── AWARDS SLIDER ──
/* ─────────────────────────────────────────────
   KOENIG EDGE SECTION  (upGrad-style sticky-left + reveal-right)
───────────────────────────────────────────── */
const EdgeIcons = {
  /* 01 — Microsoft 4-square logo → instantly = official MS partner */
  msLogo: () => (
    <svg width="34" height="34" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"  y="1"  width="9" height="9" fill="#f25022"/>
      <rect x="11" y="1"  width="9" height="9" fill="#7fba00"/>
      <rect x="1"  y="11" width="9" height="9" fill="#00a4ef"/>
      <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
    </svg>
  ),
  /* 02 — Person silhouette + MCT ribbon badge → certified trainer */
  mct: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* head */}
      <circle cx="12" cy="6" r="3.5" fill="#00a4ef"/>
      {/* shoulders */}
      <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7" fill="#7fba00"/>
      {/* badge ribbon */}
      <circle cx="18.5" cy="18.5" r="4" fill="#ffb900"/>
      <path d="M16.8 18.5l1.2 1.2 2.4-2.4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  /* 03 — Stack of pages with MS logo watermark → official MS courseware */
  book: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* back page */}
      <rect x="6" y="3" width="14" height="18" rx="2" fill="#7fba00" opacity="0.35"/>
      {/* front page */}
      <rect x="4" y="2" width="14" height="18" rx="2" fill="#fff" stroke="#00a4ef" strokeWidth="1.5"/>
      {/* MS 4-square watermark on page */}
      <rect x="7"  y="5.5" width="4" height="4" fill="#f25022" opacity="0.8"/>
      <rect x="12" y="5.5" width="4" height="4" fill="#7fba00" opacity="0.8"/>
      <rect x="7"  y="10.5" width="4" height="4" fill="#00a4ef" opacity="0.8"/>
      <rect x="12" y="10.5" width="4" height="4" fill="#ffb900" opacity="0.8"/>
      {/* text lines */}
      <line x1="7" y1="16.5" x2="15" y2="16.5" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="7" y1="18.5" x2="12" y2="18.5" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  /* 04 — Laptop with Azure cloud above screen → hands-on cloud lab */
  lab: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* laptop base */}
      <rect x="3" y="13" width="18" height="2" rx="1" fill="#7fba00"/>
      {/* laptop screen */}
      <rect x="5" y="6" width="14" height="8" rx="1.5" fill="#00a4ef" opacity="0.15" stroke="#00a4ef" strokeWidth="1.5"/>
      {/* cloud inside screen */}
      <path d="M8.5 12c-.8 0-1.5-.6-1.5-1.4 0-.7.5-1.3 1.2-1.4C8.4 8.3 9.2 8 10 8c1.1 0 2 .6 2.3 1.5.2-.1.4-.1.7-.1.8 0 1.5.6 1.5 1.4S13.8 12 13 12H8.5z" fill="#00a4ef"/>
      {/* colored dots = lab activity */}
      <circle cx="10" cy="10.2" r="0.6" fill="#f25022"/>
      <circle cx="11.5" cy="10.2" r="0.6" fill="#ffb900"/>
    </svg>
  ),
  /* 05 — Split screen: laptop + mobile → flexible multi-mode learning */
  calendar: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* laptop */}
      <rect x="2" y="7" width="13" height="9" rx="1.5" fill="#00a4ef" opacity="0.15" stroke="#00a4ef" strokeWidth="1.5"/>
      <rect x="1" y="16" width="15" height="1.5" rx="0.75" fill="#00a4ef"/>
      {/* play triangle inside laptop screen */}
      <polygon points="7,9.5 7,14.5 11,12" fill="#00a4ef"/>
      {/* mobile phone */}
      <rect x="17" y="6" width="6" height="11" rx="1.5" fill="#ffb900" opacity="0.2" stroke="#ffb900" strokeWidth="1.5"/>
      <circle cx="20" cy="15.5" r="0.7" fill="#ffb900"/>
      {/* signal dots = online */}
      <circle cx="7"  cy="5" r="1" fill="#f25022"/>
      <circle cx="10" cy="5" r="1" fill="#7fba00"/>
      <circle cx="13" cy="5" r="1" fill="#ffb900"/>
    </svg>
  ),
  /* 06 — Certificate scroll with big checkmark → exam pass */
  target: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* scroll body */}
      <rect x="3" y="4" width="18" height="14" rx="2" fill="#ffb900" opacity="0.15" stroke="#ffb900" strokeWidth="1.5"/>
      {/* rolled ends */}
      <ellipse cx="3"  cy="11" rx="1.5" ry="7" fill="#ffb900" opacity="0.3"/>
      <ellipse cx="21" cy="11" rx="1.5" ry="7" fill="#f25022" opacity="0.3"/>
      {/* big checkmark */}
      <path d="M7 11l3.5 3.5L17 8" stroke="#7fba00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* ribbon */}
      <line x1="12" y1="18" x2="12" y2="21" stroke="#00a4ef" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="21.5" r="1.5" fill="#00a4ef"/>
    </svg>
  ),
  /* 07 — Globe with pin markers → 50+ countries */
  globe: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* globe */}
      <circle cx="12" cy="12" r="9" fill="#00a4ef" opacity="0.12" stroke="#00a4ef" strokeWidth="1.5"/>
      <ellipse cx="12" cy="12" rx="4.5" ry="9" stroke="#00a4ef" strokeWidth="1.2" fill="none"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke="#00a4ef" strokeWidth="1.2"/>
      <line x1="4"  y1="7.5" x2="20" y2="7.5" stroke="#00a4ef" strokeWidth="1" opacity="0.5"/>
      <line x1="4"  y1="16.5" x2="20" y2="16.5" stroke="#00a4ef" strokeWidth="1" opacity="0.5"/>
      {/* location pins */}
      <circle cx="8"  cy="10" r="2" fill="#f25022"/>
      <path d="M8 10v3" stroke="#f25022" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="16" cy="8" r="2" fill="#ffb900"/>
      <path d="M16 8v3" stroke="#ffb900" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  /* 08 — Trophy with "30" engraved → 30 years of excellence */
  trophy: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* cup body */}
      <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" fill="#ffb900" opacity="0.25" stroke="#ffb900" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* handles */}
      <path d="M6 4c-1.5 0-3 1-3 3s1.5 3 3 3" stroke="#f25022" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M18 4c1.5 0 3 1 3 3s-1.5 3-3 3" stroke="#7fba00" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      {/* "30" text */}
      <text x="12" y="11" textAnchor="middle" fill="#ffb900" fontSize="5.5" fontWeight="800" fontFamily="sans-serif">30</text>
      {/* stem */}
      <line x1="12" y1="16" x2="12" y2="19" stroke="#ffb900" strokeWidth="1.8" strokeLinecap="round"/>
      {/* base */}
      <rect x="7.5" y="19" width="9" height="2.5" rx="1" fill="#00a4ef"/>
    </svg>
  ),
};

const EDGE_ITEMS = [
  { icon: EdgeIcons.msLogo,   num: "01", title: "Microsoft Gold Partner", desc: "One of a select few Microsoft Authorized Learning Partners in India — you train with official courseware, certified instructors, and Microsoft-verified content." },
  { icon: EdgeIcons.mct,      num: "02", title: "300+ MCT Certified Trainers", desc: "Every trainer holds the Microsoft Certified Trainer (MCT) credential with proven enterprise deployment experience — not just theory." },
  { icon: EdgeIcons.book,     num: "03", title: "Official MOC Courseware", desc: "Training materials are created and maintained directly by Microsoft, keeping you up to date with the latest Azure, M365, and AI features." },
  { icon: EdgeIcons.lab,      num: "04", title: "Hands-On Lab Access", desc: "Practice in official Microsoft Learn sandboxes with pre-provisioned Azure environments and guided real-world exercises — not simulations." },
  { icon: EdgeIcons.calendar, num: "05", title: "Flexible Learning Modes", desc: "Choose live online, classroom, or 1-on-1 instructor-led training. Weekend and fast-track batches available to fit your schedule." },
  { icon: EdgeIcons.target,   num: "06", title: "Exam-Focused Prep", desc: "Practice tests, study guides, and dedicated exam-readiness sessions engineered to maximise your first-attempt pass rate." },
  { icon: EdgeIcons.globe,    num: "07", title: "Trusted in 50+ Countries", desc: "30,000+ professionals trained every month across India, the US, UK, UAE, and 50+ other countries — with globally recognised certificates." },
  { icon: EdgeIcons.trophy,   num: "08", title: "30 Years of Excellence", desc: "Founded in 1993, Koenig has three decades of IT training expertise — the experience to guide you from zero to certified, fast." },
];

function EdgeSection({ onCTA }) {

  return (
    <section className="edge-sec">
      <div className="edge-inner">

        {/* Left — sticky heading */}
        <div className="edge-left">
          <div className="edge-eyebrow">Our Advantage</div>
          <h2 className="edge-left-heading">
            Your Path to<br /><em>Career Success</em><br />Starts Here
          </h2>
          <p className="edge-left-sub">
            What gives Koenig an edge? From official Microsoft credentials to world-class trainers, here's why 500,000+ professionals chose us.
          </p>
          <button className="edge-left-cta" onClick={onCTA}>
            Explore Courses →
          </button>
          <div className="edge-left-count">
            <div className="edge-count-item">
              <div className="edge-count-num">30<span>+</span></div>
              <div className="edge-count-label">Years Training</div>
            </div>
            <div className="edge-count-item">
              <div className="edge-count-num">500<span>K+</span></div>
              <div className="edge-count-label">Alumni</div>
            </div>
            <div className="edge-count-item">
              <div className="edge-count-num">95<span>%</span></div>
              <div className="edge-count-label">Pass Rate</div>
            </div>
          </div>
        </div>

        {/* Right — items reveal on scroll */}
        <div className="edge-right">
          {EDGE_ITEMS.map((item) => (
            <div key={item.num} className="edge-item reveal">
              <div className="edge-item-icon-wrap"><item.icon /></div>
              <div className="edge-item-body">
                <div className="edge-item-num">{item.num}</div>
                <h3 className="edge-item-title">{item.title}</h3>
                <p className="edge-item-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function AwardsSlider() {
  const [idx, setIdx] = useState(0);
  const visibleCount = 3;
  const maxIdx = Math.max(0, AWARDS.length - visibleCount);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => i >= maxIdx ? 0 : i + 1), 3500);
    return () => clearInterval(t);
  }, [maxIdx]);

  const prev = () => setIdx(i => i <= 0 ? maxIdx : i - 1);
  const next = () => setIdx(i => i >= maxIdx ? 0 : i + 1);

  return (
    <section className="awards-sec hex-bg">
      <div className="awards-inner">
        <div className="awards-header reveal">
          <div className="sec-title">Recognised as a<br/><TextShimmer as="em" duration={3} spread={2}>Microsoft Partner of the Year</TextShimmer></div>
          <div className="sec-sub" style={{margin:'14px auto 0',textAlign:'center'}}>
            33+ years of Microsoft training excellence recognised globally — Microsoft Partner of the Year, FY24 Award winner
          </div>
        </div>

        {/* Partner badge hero row */}
        <div className="awards-partner-row reveal">
          <div className="awards-partner-badge">
            <div className="awards-partner-badge-icon">
              <svg width="22" height="22" viewBox="0 0 23 23" fill="none">
                <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
                <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
                <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
              </svg>
            </div>
            <div className="awards-partner-badge-text">
              <span className="awards-partner-badge-label">Microsoft</span>
              <span className="awards-partner-badge-name">Gold Authorized Learning Partner</span>
            </div>
          </div>
          <div className="awards-partner-divider"/>
          <div className="awards-partner-stat">
            <div className="awards-partner-stat-num">30+</div>
            <div className="awards-partner-stat-lbl">Years of Excellence</div>
          </div>
          <div className="awards-partner-divider"/>
          <div className="awards-partner-stat">
            <div className="awards-partner-stat-num">500K+</div>
            <div className="awards-partner-stat-lbl">Professionals Trained</div>
          </div>
          <div className="awards-partner-divider"/>
          <div className="awards-partner-stat">
            <div className="awards-partner-stat-num">50+</div>
            <div className="awards-partner-stat-lbl">Countries Reached</div>
          </div>
        </div>

        <div className="awards-slider-wrap reveal">
          <div className="awards-track-outer">
            <div
              className="awards-track"
              style={{ transform: `translateX(calc(-${idx * (100/visibleCount)}% - ${idx * 20/visibleCount}px))` }}
            >
              {AWARDS.map((a, i) => (
                <div key={i} className="award-card glow-card holo-card">
                  <div className="award-card-glow"/>
                  {/* Real award image */}
                  <div className="award-img-wrap">
                    {a.svgIcon}
                  </div>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:4}}>
                    <div className="award-org">{a.org}</div>
                    <div className="award-year-badge">⭐ {a.year}</div>
                  </div>
                  <div className="award-title">{a.title}</div>
                  <div className="award-desc">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="awards-controls">
            <button className="awards-btn" onClick={prev}>←</button>
            <div className="awards-dots">
              {Array.from({length: maxIdx + 1}).map((_, i) => (
                <div key={i} className={`awards-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)}/>
              ))}
            </div>
            <button className="awards-btn" onClick={next}>→</button>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── SHINY BUTTON ─────────────────────────────────────────────────────────────
// Adapted from emerald-ui shiny-button (no clsx/tailwind-merge/TypeScript).
// Props: variant="default"|"outline"  size="sm"|"default"|"lg"  fullWidth
const ShinyButton = React.forwardRef(function ShinyButton(
  { children, variant = "default", size, fullWidth, className = "", ...rest },
  ref
) {
  const cls = [
    "shiny-btn",
    variant === "outline" ? "shiny-outline" : "",
    size === "sm" ? "shiny-sm" : size === "lg" ? "shiny-lg" : "",
    fullWidth ? "shiny-full" : "",
    className,
  ].filter(Boolean).join(" ");
  return <button ref={ref} className={cls} {...rest}>{children}</button>;
});
ShinyButton.displayName = "ShinyButton";

// ── GRADIENT BUTTON ─────────────────────────────────────────────────────────
// Adapted from 21st.dev gradient-button (no Radix, no CVA, no TypeScript).
// Variants: default (blue fill) | "outline" (dark + blue border)
// Sizes   : default | "lg" | "sm"
const GradientButton = React.forwardRef(function GradientButton(
  { children, variant = "default", size, className = "", style, ...rest },
  ref
) {
  const cls = [
    "gradient-button",
    variant === "outline" ? "gb-outline" : "",
    size === "lg" ? "gb-lg" : size === "sm" ? "gb-sm" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button ref={ref} className={cls} style={style} {...rest}>
      {children}
    </button>
  );
});
GradientButton.displayName = "GradientButton";

// ── CONTAINER SCROLL (adapted from aceternity-ui, no TS/Tailwind/Next.js) ──
function ContainerScroll({ titleComponent, children }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate    = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale     = useTransform(scrollYProgress, [0, 1], isMobile ? [0.72, 0.92] : [1.06, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      ref={containerRef}
      style={{
        height: isMobile ? '52rem' : '72rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: isMobile ? '8px' : '80px 80px',
      }}
    >
      <div style={{ paddingTop: isMobile ? 40 : 160, paddingBottom: isMobile ? 40 : 160, width: '100%', position: 'relative', perspective: '1000px' }}>
        {/* Title */}
        <motion.div style={{ translateY: translate }} className="preview-title-wrap">
          {titleComponent}
        </motion.div>
        {/* Card */}
        <motion.div
          style={{
            rotateX: rotate, scale,
            maxWidth: '64rem', marginTop: -48, marginLeft: 'auto', marginRight: 'auto',
            height: isMobile ? '22rem' : '36rem', width: '100%',
          }}
          className="preview-card-outer"
        >
          <div className="preview-card-inner">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── PLATFORM PREVIEW SECTION ──
function PlatformPreview() {
  return (
    <section className="preview-sec">
      <ContainerScroll
        titleComponent={
          <div style={{ textAlign: 'center', paddingBottom: 8 }}>
            <div className="preview-tag">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0694D1', display: 'inline-block' }}/>
              Live Learning Environment
            </div>
            <div className="preview-title">
              Train inside real<br/>
              <span style={{
                background: 'linear-gradient(90deg, #50e6ff 0%, #0694D1 50%, #50e6ff 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Microsoft Azure labs
              </span>
            </div>
            <div className="preview-sub">
              Every Koenig course includes hands-on lab access — the same Azure portal your MCT uses on exam day.
            </div>
          </div>
        }
      >
        {/* Browser chrome mockup */}
        <div className="preview-chrome">
          <span className="preview-chrome-dot" style={{ background: '#ff5f57' }}/>
          <span className="preview-chrome-dot" style={{ background: '#febc2e' }}/>
          <span className="preview-chrome-dot" style={{ background: '#28c840' }}/>
          <div className="preview-chrome-bar">portal.azure.com — Microsoft Azure</div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1400&h=900&fit=crop&auto=format&q=80"
          alt="Azure portal dashboard"
          className="preview-img"
          draggable="false"
          style={{ height: 'calc(100% - 42px)' }}
        />
      </ContainerScroll>
    </section>
  );
}

// ── DONUT CHART ──
function DonutChart({ data, size = 220, strokeWidth = 26, centerContent }) {
  const [hovered, setHovered] = React.useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = size / 2 - strokeWidth / 2;
  const circ = 2 * Math.PI * radius;
  let cum = 0;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseLeave={() => setHovered(null)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible", transform: "rotate(-90deg)" }}>
        {/* bg ring */}
        <circle cx={size/2} cy={size/2} r={radius} fill="transparent"
          stroke="rgba(6,148,209,0.1)" strokeWidth={strokeWidth} />
        {data.map((seg, i) => {
          const pct = total === 0 ? 0 : (seg.value / total) * 100;
          const dashArray = `${(pct/100)*circ} ${circ}`;
          const dashOffset = -(cum/100)*circ;
          const isActive = hovered === seg.label;
          cum += pct;
          return (
            <motion.circle key={seg.label}
              cx={size/2} cy={size/2} r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={isActive ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{
                filter: isActive ? `drop-shadow(0 0 8px ${seg.color})` : "none",
                cursor: "pointer",
                transition: "stroke-width 0.2s, filter 0.2s",
                transformOrigin: "center",
              }}
              initial={{ strokeDashoffset: circ }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
              onMouseEnter={() => setHovered(seg.label)}
            />
          );
        })}
      </svg>
      {centerContent && (
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          {typeof centerContent === "function" ? centerContent(hovered) : centerContent}
        </div>
      )}
    </div>
  );
}

// ── JOB FUNCTION RADAR DATA ──
const JOB_FUNCTION_DATA = [
  { role: "Cloud Engineer",   y2024: 78, y2025: 92 },
  { role: "Security Analyst", y2024: 65, y2025: 81 },
  { role: "Developer",        y2024: 72, y2025: 88 },
  { role: "IT Admin",         y2024: 58, y2025: 63 },
  { role: "Data Analyst",     y2024: 61, y2025: 74 },
  { role: "PM / Architect",   y2024: 45, y2025: 57 },
  { role: "DevOps Engineer",  y2024: 68, y2025: 79 },
];

const CustomRadarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e5eaf0", borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 150 }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: "#093148", marginBottom: 6 }}>{payload[0]?.payload?.role}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#4b5a68", marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.stroke, display: "inline-block", flexShrink: 0 }} />
          <span>{p.name}:</span>
          <span style={{ fontWeight: 700, color: "#071e2e", marginLeft: "auto", paddingLeft: 8 }}>{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

// ── ENROLLMENT INSIGHTS ──
const ENROLLMENT_DATA = [
  { value: 38, color: "#0694D1", label: "Azure",           sub: "Cloud & Infrastructure" },
  { value: 22, color: "#00a4ef", label: "Microsoft 365",   sub: "Productivity & Collab" },
  { value: 17, color: "#ffb900", label: "Security",        sub: "Identity & Compliance" },
  { value: 12, color: "#7fba00", label: "Power Platform",  sub: "Low-Code & Automation" },
  { value: 7,  color: "#b55cf5", label: "Dynamics 365",    sub: "CRM & ERP" },
  { value: 4,  color: "#f25022", label: "Others",          sub: "GitHub, DevOps, Data" },
];

function EnrollmentInsights() {
  const [hovered, setHovered] = React.useState(null);
  const activeItem = ENROLLMENT_DATA.find(d => d.label === hovered);
  const total = ENROLLMENT_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <section className="enroll-sec">
      <div className="enroll-inner reveal">

        {/* LEFT — title + legend */}
        <div className="enroll-left">
          <div className="enroll-label">Enrollment Data</div>
          <div className="enroll-title">Where Professionals<br/>Are <em>Enrolling</em></div>
          <div className="enroll-sub">
            Based on 2024–25 learner registrations across Koenig's Microsoft training portfolio.
          </div>
          <div className="enroll-legend">
            {ENROLLMENT_DATA.map(d => (
              <div key={d.label}
                className={`enroll-legend-item${hovered === d.label ? " active" : ""}`}
                onMouseEnter={() => setHovered(d.label)}
                onMouseLeave={() => setHovered(null)}>
                <div className="enroll-legend-left">
                  <div className="enroll-legend-dot" style={{ background: d.color }} />
                  <span className="enroll-legend-name">{d.label}</span>
                </div>
                <div className="enroll-legend-bar-wrap">
                  <div className="enroll-legend-bar" style={{ width: `${d.value}%`, background: d.color }} />
                </div>
                <span className="enroll-legend-pct">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — donut chart */}
        <div className="enroll-right">
          <DonutChart
            data={ENROLLMENT_DATA}
            size={260}
            strokeWidth={28}
            centerContent={(hov) => {
              const seg = ENROLLMENT_DATA.find(d => d.label === hov);
              return (
                <div className="enroll-center-label">
                  <div className="enroll-center-val" style={{ color: seg ? seg.color : "var(--light-text)" }}>
                    {seg ? `${seg.value}%` : `${total}%`}
                  </div>
                  <div className="enroll-center-sub">{seg ? seg.label : "All Courses"}</div>
                </div>
              );
            }}
          />
        </div>

      </div>


    </section>
  );
}

// ── HOW IT WORKS SECTION ──
const HIW_STEPS = [
  {
    num: "01", icon: "🔍",
    title: "Choose Your Course",
    desc: "Browse 500+ Microsoft certifications — Azure, Security, Power Platform, M365, AI and more. Filter by role, level, or exam code. Your advisor helps map the fastest path to your goal.",
    tags: ["AZ-104", "SC-300", "PL-300", "AI-102", "DP-600"],
  },
  {
    num: "02", icon: "📅",
    title: "Pick Your Schedule",
    desc: "Train on your terms. Choose classroom, live online, 1-on-1 flex, or self-paced. Sessions span time zones — weekday or weekend, morning or evening, we have a slot.",
    tags: ["Classroom", "Live Online", "1-on-1 Flex", "Self-Paced"],
  },
  {
    num: "03", icon: "🎓",
    title: "Learn from Experts",
    desc: "Train with Microsoft Certified Trainers (MCTs) using official MOC courseware and hands-on Azure labs. Mock exams mirror the real test environment so you walk in prepared.",
    tags: ["200+ MCTs", "Official MOC", "Hands-on Labs", "Mock Exams"],
  },
  {
    num: "04", icon: "🏆",
    title: "Get Certified",
    desc: "Sit your Microsoft exam with confidence. Our post-training support and practice tests ensure you're ready. Earn your digital badge and share it on LinkedIn instantly.",
    tags: ["95% Pass Rate", "Digital Badge", "LinkedIn Ready", "500K+ Alumni"],
    isLast: true,
  },
];

function HowItWorksSection() {
  const secRef = useRef(null);

  useEffect(() => {
    const root = secRef.current;
    if (!root) return;

    const cards  = root.querySelectorAll('.hiw-reveal');
    const lines  = root.querySelectorAll('.hiw-line-reveal');
    const delays = [0, 120, 240, 360];

    const cardObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('hiw-visible');
          cardObs.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -80px 0px', threshold: 0.15 }
    );

    const lineObs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('hiw-visible');
          lineObs.unobserve(e.target);
        }
      }),
      { rootMargin: '0px 0px -60px 0px', threshold: 0.5 }
    );

    cards.forEach((el, i) => {
      el.style.animationDelay = (delays[i] ?? 0) + 'ms';
      cardObs.observe(el);
    });
    lines.forEach((el) => {
      el.style.animationDelay = '60ms';
      lineObs.observe(el);
    });

    return () => { cardObs.disconnect(); lineObs.disconnect(); };
  }, []);

  return (
    <section className="hiw-sec" ref={secRef}>


      {/* Header */}
      <div className="hiw-header hiw-reveal">
        <div className="sec-title">
          <TextShimmer as="span" duration={2.5} spread={2} style={{display:"block"}}>How to Get Microsoft Certified</TextShimmer>
        </div>
        <div className="sec-sub" style={{margin:"12px auto 0", textAlign:"center", maxWidth:520}}>
          From choosing a Microsoft certification track to passing your exam — four guided steps with your MCT every stage of the way.
        </div>
      </div>

      {/* Vertical steps */}
      <div className="hiw-steps-wrap">
        {HIW_STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`hiw-card-border hiw-reveal${s.isLast ? ' hiw-last' : ''}`}>
              <div className="hiw-card-inner">
                {/* Step badge */}
                <div className="hiw-step-badge">{s.num}</div>
                {/* Body */}
                <div className="hiw-card-body">
                  <div className="hiw-card-head">
                    <div className="hiw-card-icon">{s.icon}</div>
                    <div className="hiw-card-title">{s.title}</div>
                  </div>
                  <div className="hiw-card-desc">{s.desc}</div>
                  <div className="hiw-card-tags">
                    {s.tags.map((t) => (
                      <span key={t} className="hiw-card-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Connector between steps */}
            {!s.isLast && (
              <div className="hiw-connector-v hiw-line-reveal">
                <div className="hiw-connector-line"/>
                <div className="hiw-connector-dot"/>
                <div className="hiw-connector-line"/>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

    </section>
  );
}

// ── MAIN ──
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(false);
  const [brochureModal, setBrochureModal] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [hqName, setHqName] = useState("");
  const [hqEmail, setHqEmail] = useState("");
  const [hqPhone, setHqPhone] = useState("");
  const [hqDone, setHqDone] = useState(false);
  const [hqType, setHqType] = useState("enterprise"); // "individual" | "enterprise"
  const heroVideoRef = useRef(null);
  const toggleVideoMute = () => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setVideoMuted(v.muted);
  };

  // Typewriter state
  const [twText, setTwText] = useState("");
  const twFull = "Microsoft Certifications";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTwText(twFull.slice(0, i + 1));
      i++;
      if (i >= twFull.length) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Scroll nav + progress bar
    const prog = document.getElementById("scroll-progress");
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (prog) {
        const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        prog.style.width = pct + "%";
      }
    };
    window.addEventListener("scroll", onScroll);

    // Cursor glow
    const glow = document.getElementById("cursor-glow");
    const onMouseMove = (e) => {
      if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }
      // Glow card mouse tracking
      document.querySelectorAll(".glow-card").forEach(card => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    // Magnetic buttons
    const setupMagnetic = () => {
      document.querySelectorAll(".magnetic").forEach(el => {
        el.addEventListener("mousemove", (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
      });
    };
    setupMagnetic();

    // Matrix rain on hero canvas
    const canvas = document.getElementById('matrix-canvas');
    let matrixInterval = null;
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      const cols = Math.floor(canvas.width / 16);
      const drops = Array.from({length: cols}, () => Math.random() * -50);
      const chars = 'AZ09アカサ@#$%01';
      matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(7,30,46,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0694D1'; ctx.font = '13px monospace';
        drops.forEach((y, i) => {
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
          if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; else drops[i]++;
        });
      }, 60);
    }

    // 3D tilt on hover
    const tiltEls = document.querySelectorAll('.holo-card');
    const onTilt = function(e) {
      const r = this.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      this.style.transform = `perspective(700px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateZ(6px)`;
    };
    const onTiltLeave = function() { this.style.transform = ''; };
    tiltEls.forEach(el => { el.addEventListener('mousemove', onTilt); el.addEventListener('mouseleave', onTiltLeave); });

    // ── Scroll-reveal: IntersectionObserver ──────────────────────────
    // Stagger siblings within the same parent automatically.
    // Per-element override: data-delay="N" (ms).
    const revealEls = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );
    const lineEls = document.querySelectorAll(".learn-sec .hiw-line-reveal");

    // Build per-parent sibling indices for stagger
    const parentIndexMap = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!parentIndexMap.has(parent)) parentIndexMap.set(parent, 0);
      if (!el.dataset.delay) {
        const idx = parentIndexMap.get(parent);
        el.dataset.delay = idx * 90;
        parentIndexMap.set(parent, idx + 1);
      }
    });

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const delay = parseInt(e.target.dataset.delay, 10) || 0;
          setTimeout(() => e.target.classList.add("in"), delay);
          revealObs.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -72px 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObs.observe(el));

    // Connector lines inside 4 Ways section
    const lineObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setTimeout(() => e.target.classList.add("hiw-visible"), 60);
          lineObs.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.5 }
    );
    lineEls.forEach((el) => lineObs.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      revealObs.disconnect();
      lineObs.disconnect();
      if (matrixInterval) clearInterval(matrixInterval);
      tiltEls.forEach(el => { el.removeEventListener('mousemove', onTilt); el.removeEventListener('mouseleave', onTiltLeave); });
    };
  }, []);

  // Countdown
  const [time, setTime] = useState({ h: 11, m: 47, s: 23 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(p => {
        let { h, m, s } = p;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");

  return (
    <>
      <style>{CSS}</style>

      {/* SCROLL PROGRESS */}
      <div id="scroll-progress" style={{width:"0%"}}/>

      {/* CURSOR GLOW */}
      <div id="cursor-glow"/>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo">
          <img src={KOENIG_LOGO} alt="Koenig Solutions — step forward" className="nav-logo-img" />
          <div className="nav-logo-divider"/>
          <div className="nav-ms-badge">
            <div className="ms-flag">
              {[["#f25022","#7fba00"],["#00a4ef","#ffb900"]].flat().map((c,i)=><div key={i} className="ms-sq" style={{background:c}}/>)}
            </div>
            <span className="nav-badge-text">Microsoft Partner</span>
          </div>
        </div>
        <div className="nav-right">
          <button className="nav-cta" onClick={() => setBrochureModal(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Brochure
          </button>
        </div>
      </nav>


      {/* HERO — 21st.dev split layout */}
      <section className="hero" id="hero">
        {/* Backgrounds */}
        <div className="hero-bg"/>
        <div className="hero-grid"/>
        <canvas id="matrix-canvas"/>
        <div className="aurora-orb aurora-1"/>
        <div className="aurora-orb aurora-2"/>
        <div className="aurora-orb aurora-3"/>
        <div className="hero-sep"/>
        {/* Particles */}
        {[{w:3,h:3,top:"18%",left:"38%",dur:"8s",del:"0s"},{w:4,h:4,top:"72%",left:"42%",dur:"6s",del:"1s"},{w:2,h:2,top:"45%",left:"55%",dur:"9s",del:"2s"},{w:3,h:3,top:"25%",left:"48%",dur:"7s",del:"0.5s"}].map((p,i)=>(
          <div key={i} className="particle" style={{width:p.w,height:p.h,top:p.top,left:p.left,animationDuration:p.dur,animationDelay:p.del,opacity:0.2,position:'absolute',zIndex:0,pointerEvents:'none'}}/>
        ))}

        {/* ══ LEFT COLUMN ══ */}
        <div className="hero-left">

          {/* Animated border badge */}
          {/* Headline */}
          <h1 className="hero-h1">
            <span className="h1-plain">Get Microsoft Certified with</span>
            <TextShimmer as="span" className="h1-grad" duration={2.5} spread={3} baseColor="#0694D1" gradColor="#ffffff">Authorized Training</TextShimmer>
          </h1>

          {/* Subtitle */}
          <p className="hero-sub">
            Official Microsoft Authorized Learning Partner (ALP). MCT-certified instructors, official MOC courseware, and a 95% exam pass rate across AZ-104, AI-102, SC-300, AZ-305 and 100+ Microsoft certification courses. Train live online, 1-on-1, or on-site in 50+ countries.
          </p>

          {/* Feature rows */}
          <div className="hero-features">
            {[
              ["Microsoft Gold ALP + ESI Partner — official MOC courseware", <path key="a" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>],
              ["MCT-certified Microsoft trainers only — no contractors", <path key="b" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>],
              ["500,000+ IT professionals certified across 50+ countries", <path key="c" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>],
              ["Flexi schedule — start any day, Azure to Copilot tracks", <path key="d" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>],
            ].map(([text, svgPath],i) => (
              <div key={i} className="hero-feat-row">
                <div className="hero-feat-icon">
                  <svg viewBox="0 0 24 24" fill="none" style={{width:12,height:12,color:'var(--blue)'}}>{svgPath}</svg>
                </div>
                {text}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-ctas">
            <button className="hero-btn-primary magnetic" onClick={() => setModal(true)}>
              Get Certified Now
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="hero-btn-ghost" onClick={() => document.getElementById('cert')?.scrollIntoView({behavior:'smooth'})}>
              Browse Courses
            </button>
          </div>

          {/* Social proof */}
          <div className="hero-proof">
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div className="sp-avatars">
                {[
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face&auto=format",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face&auto=format",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format",
                  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face&auto=format",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&auto=format",
                ].map((src,i)=>(
                  <img key={i} className="sp-avatar" src={src} alt={`Koenig Solutions Microsoft certified professional ${i+1}`}/>
                ))}
              </div>
              <div className="sp-text">
                <div className="stars">★★★★★</div>
                <div><strong>500K+</strong> certified professionals</div>
              </div>
            </div>
            <div className="hero-proof-divider"/>
            <div className="proof-partner-badges">
              <div className="proof-badge-card">
                <img className="proof-partner-img" src="https://www.koenig-solutions.com/assets/newimages/awards/NewAwardsImages/MS-Partner-of-the-year-2025.svg" alt="MS Partner of Year 2025"/>
                <div className="proof-badge-label">Partner of the Year</div>
              </div>
              <div className="proof-badge-card">
                <img className="proof-partner-img" src="https://www.koenig-solutions.com/assets/newimages/awards/NewAwardsImages/award-fy24.webp" alt="FY24 Award"/>
                <div className="proof-badge-label">Microsoft Award FY24</div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN — hero video ══ */}
        <div className="hero-form-col">
          <div className="hero-form-glow"/>
          <div className="hero-video-card">
            <video
              ref={heroVideoRef}
              className="hero-video"
              src="/hero-video.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <button
              className="hero-video-mute"
              onClick={toggleVideoMute}
              aria-label={videoMuted ? "Unmute video" : "Mute video"}
            >
              {videoMuted ? (
                /* Muted — speaker with X */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                /* Unmuted — speaker with waves */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              )}
            </button>
          </div>
          {/* Quick lead form below video */}
          <div className="hq-form-card">
            {/* Individual / Enterprise toggle */}
            <div className="hq-toggle-row">
              <div className="hq-toggle-track">
                <button
                  type="button"
                  className={`hq-toggle-btn${hqType === "individual" ? " active" : ""}`}
                  onClick={() => { setHqType("individual"); setHqEmail(""); }}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`hq-toggle-btn${hqType === "enterprise" ? " active" : ""}`}
                  onClick={() => { setHqType("enterprise"); setHqEmail(""); }}
                >
                  Enterprise
                </button>
                <span className="hq-toggle-pill" style={{ transform: hqType === "enterprise" ? "translateX(100%)" : "translateX(0)" }} />
              </div>
            </div>

            {hqDone ? (
              <div className="hq-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10d964" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>We'll be in touch shortly!</span>
              </div>
            ) : (
              <form className="hq-form" onSubmit={e => { e.preventDefault(); if(hqName && hqEmail){ setHqDone(true); } }}>
                <div className="hq-row">
                  <input className="hq-input" type="text" placeholder="Your Name" value={hqName} onChange={e=>setHqName(e.target.value)} required />
                  <input
                    className="hq-input"
                    type="email"
                    placeholder={hqType === "individual" ? "Personal Email" : "Work Email"}
                    value={hqEmail}
                    onChange={e=>setHqEmail(e.target.value)}
                    required
                  />
                  <input className="hq-input" type="tel" placeholder="Phone" value={hqPhone} onChange={e=>setHqPhone(e.target.value)} />
                </div>
                <ShinyButton fullWidth size="lg" type="submit">Request More Information →</ShinyButton>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-strip circuit-bg reveal">
        <div className="stats-inner">
          {[
            {n:33,    suf:"+",  label:"Years of Excellence",        src:"In operation since 1993"},
            {n:500000,suf:"+",  label:"IT Professionals Certified",  src:"Across 50+ countries"},
            {n:95,    suf:"%",  label:"Microsoft Exam Pass Rate",   src:"vs. 60–70% industry avg"},
            {n:300,   suf:"+",  label:"MCT-Certified Trainers",     src:"No contractors, ever"},
            {n:100,   suf:"+",  label:"Microsoft Courses",          src:"Azure · AI · Security · M365"},
          ].map((s,i)=>(
            <div key={i} className="stat-item reveal-scale" style={{transitionDelay:`${i*0.1}s`}}>
              <div className="stat-number">
                <span className="stat-number-wrap"><Counter end={s.n} suffix={s.suf}/></span>
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-source">{s.src}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANIES */}
      <CompaniesSection onCTA={() => setModal(true)} />

      {/* KOENIG EDGE */}
      <EdgeSection onCTA={() => setModal(true)} />

      {/* UNIFIED CERT EXPLORER */}
      <UnifiedCertSection onEnroll={() => setModal(true)} onBrochure={() => setBrochureModal(true)} />

      {false && <section className="certs-sec" id="cert-old">
        <div className="certs-inner">
          <div className="certs-header reveal">
            <h2 className="sec-title">Microsoft Certification <em>Training Courses</em></h2>
            <p className="certs-header-sub">Browse 100+ official Microsoft courses across Azure, AI, Security, Power Platform, M365 and more. Every course is instructor-led by an MCT-certified trainer with official Microsoft courseware.</p>
            <div className="certs-search-wrap">
              <svg className="certs-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                className="certs-search-input"
                type="text"
                placeholder="Search certifications or exam codes… e.g. AZ-900, Copilot, Security"
                value={certSearch}
                onChange={e => { setCertSearch(e.target.value); }}
                onKeyDown={e => e.key === "Escape" && setCertSearch("")}
              />
              {certSearch ? (
                <button className="certs-search-clear" onClick={() => setCertSearch("")} title="Clear">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              ) : (
                <span className="certs-search-kbd">Esc to clear</span>
              )}
            </div>
          </div>

          <div className="certs-layout reveal">

            {/* LEFT SIDEBAR — technology selector */}
            <div className="cert-sidebar">
              {/* scrollable list */}
              <div className="cert-sidebar-scroll">
                <div className="cert-sidebar-label">Technologies</div>
                {CERT_TABS.map((t, i) => (
                  <React.Fragment key={t}>
                    <button
                      className={`cert-sidebar-item ${certTab === t ? "active" : ""}`}
                      onClick={() => { setCertTab(t); setCertLevel("all"); }}
                    >
                      <span className="csi-icon" style={t === "GitHub" ? { background: "#fff", borderRadius: 10, padding: 4 } : {}}>{TECH_LOGOS[t]({ size: t === "GitHub" ? 22 : 28 })}</span>
                      <div className="csi-body">
                        <span className="csi-label">{t}</span>
                        <span className="csi-sublabel">{CERT_META[t].sublabel}</span>
                      </div>
                      <span className="csi-count">{CERTS[t].length}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* sticky bottom actions — always visible */}
              <div className="cert-sidebar-bottom">
                <div className="cert-sidebar-actions">
                  <button className="csa-brochure" onClick={() => setBrochureModal(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Brochure
                  </button>
                  <button className="csa-enquire" onClick={() => setModal(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — 2 rows: info (30%) + courses (70%) */}
            <div className="cert-right">

            {/* TOP ROW: technology info */}
            {(() => {
              const all = CERTS[certTab];
              const counts = {all: all.length, fund: all.filter(c=>c.level==="fund").length, assoc: all.filter(c=>c.level==="assoc").length, expert: all.filter(c=>c.level==="expert").length};
              const levels = [
                {key:"all",    label:"All",          count: counts.all},
                {key:"fund",   label:"Fundamentals", count: counts.fund},
                {key:"assoc",  label:"Associate",    count: counts.assoc},
                {key:"expert", label:"Expert",       count: counts.expert},
              ].filter(lv => lv.count > 0 || lv.key === "all");
              return (
                <div className="cert-info-panel">
                  {/* Row 1 — identity + CTA */}
                  <div className="cert-info-row1">
                    <div className="cert-info-logo" style={certTab === "GitHub" ? { background: "#fff", borderRadius: 12, padding: 6, display: "inline-flex" } : {}}>{TECH_LOGOS[certTab]({ size: certTab === "GitHub" ? 30 : 38 })}</div>
                    <div className="cert-info-identity">
                      <div className="cert-info-name">{certTab}</div>
                      <div className="cert-info-desc">{CERT_META[certTab].desc}</div>
                    </div>
                    <button className="cert-info-enroll" onClick={() => setModal(true)}>Enquire Now →</button>
                  </div>
                  {/* Row 2 — feature chips + level tabs */}
                  <div className="cert-info-row2">
                    <div className="cert-info-pills">
                      {CERT_META[certTab].pills.map(p => (
                        <span key={p} className="cert-info-pill">
                          <span className="cert-info-pill-dot">✓</span>{p}
                        </span>
                      ))}
                    </div>
                    <div className="cert-level-tabs">
                      {levels.map(lv => (
                        <button
                          key={lv.key}
                          className={`cert-level-tab${certLevel===lv.key?" active":""}`}
                          data-lv={lv.key}
                          onClick={() => setCertLevel(lv.key)}
                        >
                          {lv.label}
                          <span className="cert-level-tab-count">{lv.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* BOTTOM ROW: course grid */}
            <div className="cert-panel">

              {/* sticky: course count label */}
              {(() => {
                const q = certSearch.trim().toLowerCase();
                const searchActive = q.length > 0;
                if (searchActive) {
                  const total = CERT_TABS.flatMap(tab => CERTS[tab].map(c => ({ ...c, tab }))).filter(c =>
                    c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.tab.toLowerCase().includes(q) ||
                    (c.level==="fund"&&"fundamentals".includes(q)) || (c.level==="assoc"&&"associate".includes(q)) || (c.level==="expert"&&"expert".includes(q))
                  ).length;
                  return (
                    <div className="cert-panel-sticky">
                      <span style={{fontSize:12,fontWeight:800,color:"var(--blue)",background:"rgba(6,148,209,0.1)",padding:"4px 12px",borderRadius:20,border:"1.5px solid rgba(6,148,209,0.3)"}}>
                        {total} result{total !== 1 ? "s" : ""}
                      </span>
                      <span style={{fontSize:13,fontWeight:600,color:"var(--light-sub)"}}>for "<strong style={{color:"var(--light-text)"}}>{certSearch.trim()}</strong>"</span>
                      <button onClick={() => setCertSearch("")} style={{marginLeft:"auto",fontSize:12,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Clear ×</button>
                    </div>
                  );
                }
                const filtered = CERTS[certTab].filter(c => certLevel==="all" ? true : c.level===certLevel);
                const lc = certLevel==="fund"?"#059669":certLevel==="assoc"?"#0578b3":certLevel==="expert"?"#d97706":"var(--blue)";
                const levelLabel = certLevel==="all"?"All Courses":certLevel==="fund"?"Fundamentals":certLevel==="assoc"?"Associate":"Expert";
                return (
                  <div className="cert-panel-sticky">
                    <span style={{fontSize:12,fontWeight:800,color:lc,background:`color-mix(in srgb, ${lc} 10%, transparent)`,padding:"4px 12px",borderRadius:20,border:`1.5px solid ${lc}`}}>
                      {filtered.length} {levelLabel}
                    </span>
                    <span style={{fontSize:13,fontWeight:700,color:"var(--light-text)"}}>{certTab}</span>
                    <span style={{fontSize:12,color:"var(--light-sub)",marginLeft:"auto"}}>Scroll to browse all courses</span>
                  </div>
                );
              })()}{/* end cert-panel-sticky */}

              {/* scrollable course grid */}
              {(() => {
                const q = certSearch.trim().toLowerCase();
                const searchActive = q.length > 0;
                const displayCerts = searchActive
                  ? CERT_TABS.flatMap(tab => CERTS[tab].map(c => ({ ...c, tab }))).filter(c =>
                      c.name.toLowerCase().includes(q) ||
                      c.code.toLowerCase().includes(q) ||
                      c.tab.toLowerCase().includes(q) ||
                      (c.level === "fund" && "fundamentals".includes(q)) ||
                      (c.level === "assoc" && "associate".includes(q)) ||
                      (c.level === "expert" && "expert".includes(q))
                    )
                  : CERTS[certTab].filter(c => certLevel === "all" ? true : c.level === certLevel).map(c => ({ ...c, tab: certTab }));
                return (
                  <div className="cert-panel-scroll">
                    {displayCerts.length === 0 ? (
                      <div className="certs-no-results">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.25,marginBottom:12}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <div style={{fontWeight:700,fontSize:15,color:"var(--light-text)",marginBottom:4}}>No courses found</div>
                        <div style={{fontSize:13,color:"var(--light-sub)"}}>Try a different keyword or exam code</div>
                        <button style={{marginTop:16,fontSize:12,fontWeight:700,color:"var(--blue)",background:"rgba(6,148,209,0.08)",border:"1px solid rgba(6,148,209,0.25)",borderRadius:8,padding:"7px 16px",cursor:"pointer"}} onClick={() => setCertSearch("")}>Clear search</button>
                      </div>
                    ) : (
                      <div className="cert-grid">
                        {displayCerts.map((c, i) => (
                          <div key={`search-${i}`} className={`cert-card ${c.level}-card`}>
                            {searchActive && <span className="cert-track-tag">{c.tab}</span>}
                            <span className={`cert-badge ${c.level}`}>
                              {c.level === "fund" ? "Fundamentals" : c.level === "assoc" ? "Associate" : "Expert"}
                            </span>
                            <div className="cert-name">{c.name}</div>
                            <div className="cert-code">{c.code}</div>
                            <div className="cert-footer">
                              <div className="cert-price-row">
                                <span className="cert-price">
                                  <span className="cert-price-curr">$</span>
                                  <span className="cert-price-amount">{getCertPrice(c).toLocaleString()}</span>
                                </span>
                                <span className="cert-price-label">per person · USD</span>
                              </div>
                              <span className="cert-dur">⏱ {c.dur}</span>
                              <div className="cert-actions">
                                <button className="cert-btn-brochure" onClick={() => setBrochureModal(true)}>Brochure</button>
                                <button className="cert-btn-details" onClick={() => setModal(true)}>Enroll Now</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>{/* end cert-panel */}

            </div>{/* end cert-right */}

          </div>
        </div>
      </section>}

      {/* ENROLLMENT INSIGHTS */}
      <EnrollmentInsights />

      {/* CERT SHOWCASE */}
      <CertShowcase onUnlock={() => setModal(true)} />

      {/* HOW IT WORKS */}
      <HowItWorksSection />


      {/* TESTIMONIALS */}
      <section className="test-sec">
        <div className="test-inner">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: "center", marginBottom: 0 }}
          >
            <div className="sec-title" style={{ marginBottom: 10 }}>Microsoft Certification <TextShimmer as="em" duration={2.5} spread={2}>Student Reviews</TextShimmer></div>
            <p style={{ textAlign: "center", maxWidth: 480, margin: "0 auto", color: "var(--light-sub)" }}>
              Real results from IT professionals who passed AZ-104, AI-102, SC-300 and other Microsoft exams with Koenig — rated 4.7/5 from 500+ verified reviews.
            </p>
          </motion.div>
          <div className="test-cols-outer">
            <TestimonialsColumn testimonials={TESTIMONIALS.slice(0, 3)} duration={15} />
            <TestimonialsColumn testimonials={TESTIMONIALS.slice(3, 6)} duration={19} className="test-col-md" />
            <TestimonialsColumn testimonials={TESTIMONIALS.slice(6, 9)} duration={17} className="test-col-lg" />
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <AwardsSlider />

      {/* GLOBAL PRESENCE */}
      <GlobeSection />

      {/* BOTTOM CTA */}
      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">© 2026 Koenig Solutions · Microsoft Authorized Learning Partner · ESI Partner</div>
        <div className="footer-right">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Use</a>
          <a href="#" className="footer-link">Contact Us</a>
        </div>
      </footer>


      {/* ENQUIRY MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e=>{ if(e.target===e.currentTarget) setModal(false); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={()=>setModal(false)}>✕</button>
            <LeadForm onClose={()=>setModal(false)}/>
          </div>
        </div>
      )}

      {/* BROCHURE MODAL */}
      {brochureModal && (
        <div className="modal-overlay" onClick={e=>{ if(e.target===e.currentTarget) setBrochureModal(false); }}>
          <div className="modal-box">
            <button className="modal-close" onClick={()=>setBrochureModal(false)}>✕</button>
            <LeadForm onClose={()=>setBrochureModal(false)} mode="brochure"/>
          </div>
        </div>
      )}
    </>
  );
}
