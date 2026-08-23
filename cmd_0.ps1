powershell -Command "Set-Content -Path 'src\App.css' -Encoding UTF8 -Value @'
/* ============================================================
   DESIGN SYSTEM - REGISTRATION PORTAL
   ============================================================ */

:root {
  --brand:         #2563eb;
  --brand-deep:    #1d4ed8;
  --brand-light:   #eff6ff;
  --accent:        #16a34a;
  --accent-light:  #f0fdf4;
  --danger:        #dc2626;
  --app-bg:        #edf3ff;
  --surface:       #ffffff;
  --surface-muted: #f8faff;
  --text-main:     #0f172a;
  --muted:         #6b7280;
  --shadow-sm:     0 2px 8px rgba(15,23,42,0.07);
  --shadow-md:     0 6px 24px rgba(15,23,42,0.10);
  --shadow-lg:     0 16px 48px rgba(15,23,42,0.13);
  --shadow-brand:  0 6px 20px rgba(37,99,235,0.28);
  --shadow-accent: 0 6px 20px rgba(22,163,74,0.28);
  --ease-spring:   cubic-bezier(0.34,1.56,0.64,1);
  --ease-smooth:   cubic-bezier(0.16,1,0.3,1);
}

* { -webkit-tap-highlight-color: transparent; }
html, body, #root { min-height: 100%; }

body {
  margin: 0;
  color: var(--text-main);
  background:
    radial-gradient(1200px 400px at 8% -10%,  rgba(37,99,235,0.15),  transparent 70%),
    radial-gradient(1100px 320px at 90% -15%, rgba(22,163,74,0.12),  transparent 70%),
    radial-gradient(900px  240px at 50% 120%, rgba(59,130,246,0.07), transparent 70%),
    var(--app-bg);
}

/* NAVBAR */
.glass-navbar {
  background: linear-gradient(135deg, rgba(255,255,255,0.36), rgba(240,247,255,0.50));
  border-bottom: 1px solid rgba(255,255,255,0.50);
  box-shadow: 0 10px 32px rgba(14,24,45,0.10);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
}

.glass-dropdown {
  background: rgba(255,255,255,0.93);
  border: 1px solid rgba(255,255,255,0.80);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--shadow-lg);
}

/* MENU TRIGGER */
.menu-trigger {
  width: 46px; height: 46px;
  border: 1.5px solid rgba(37,99,235,0.22);
  border-radius: 999px;
  color: var(--brand-deep);
  background: linear-gradient(145deg, rgba(255,255,255,0.97), rgba(230,242,255,0.90));
  box-shadow: var(--shadow-brand);
  transition: color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s var(--ease-spring);
}
.menu-trigger:hover {
  border-color: rgba(37,99,235,0.4);
  box-shadow: 0 10px 28px rgba(37,99,235,0.30);
  transform: scale(1.07);
}
.menu-trigger:active { transform: scale(0.93) !important; }

.menu-icon { transition: transform 0.25s var(--ease-smooth); }
.menu-icon.open { transform: rotate(-90deg); }

.menu-action { transition: background-color 0.18s ease, color 0.18s ease, padding-left 0.18s ease; }
.menu-action:hover { background-color: rgba(37,99,235,0.07); padding-left: 1.15rem !important; }

/* PRESSABLE BUTTONS - spring press + ripple */
.pressable-btn {
  position: relative;
  overflow: hidden;
  transition: transform 0.12s var(--ease-spring), box-shadow 0.18s ease, filter 0.14s ease;
}
.pressable-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(255,255,255,0.18);
  opacity: 0;
  transition: opacity 0.15s ease;
}
.pressable-btn:not(:disabled):hover::after { opacity: 1; }
.pressable-btn:not(:disabled):hover {
  transform: translateY(-2px) scale(1.018);
  filter: brightness(1.05);
}
.pressable-btn:not(:disabled):active {
  transform: translateY(2px) scale(0.955) !important;
  filter: brightness(0.95);
  box-shadow: 0 1px 4px rgba(0,0,0,0.10) !important;
  transition-duration: 0.07s !important;
}
.pressable-btn:not(:disabled):active::after { opacity: 0; }

/* INTERACTIVE CARDS */
.interactive-card {
  transition: transform 0.22s var(--ease-smooth), box-shadow 0.22s ease;
}
.interactive-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg) !important;
}

/* INPUTS */
.input-animated {
  transition: box-shadow 0.22s ease, background-color 0.2s ease, border-color 0.2s ease;
}
.input-animated:focus {
  background-color: #fff !important;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.14), 0 2px 8px rgba(37,99,235,0.08);
  border-color: rgba(37,99,235,0.38) !important;
  outline: none;
}

/* COMMIT GLOW */
.btn-glowing { animation: pulse-glow 2.2s ease-in-out infinite; }
@keyframes pulse-glow {
  0%   { box-shadow: 0 0 0 0   rgba(22,163,74,0.55); }
  60%  { box-shadow: 0 0 0 12px rgba(22,163,74,0); }
  100% { box-shadow: 0 0 0 0   rgba(22,163,74,0); }
}

/* ICON ANIMATIONS */
.icon-spin-slow { animation: spin-slow 3s linear infinite; }
@keyframes spin-slow { 100% { transform: rotate(360deg); } }

/* ENTRANCE ANIMATIONS */
.fade-up        { animation: fade-up       280ms var(--ease-smooth) both; }
.section-enter  { animation: section-enter 360ms var(--ease-smooth) both; }
.bounce-in      { animation: bounce-in     420ms var(--ease-spring) both; }
.animate-slide-fade { animation: slide-fade-in 0.30s var(--ease-smooth) forwards; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes section-enter {
  from { opacity: 0; transform: translateY(14px) scale(0.993); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes bounce-in {
  0%   { opacity: 0; transform: scale(0.88); }
  65%  { transform: scale(1.04); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes slide-fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* FLOATING NOTICE */
.floating-notice-zone {
  position: fixed; top: 4.2rem; left: 50%;
  transform: translateX(-50%);
  width: min(92vw, 720px);
  z-index: 1040; pointer-events: none;
}
.ui-notice {
  border-radius: 1rem;
  padding: 0.8rem 1.1rem;
  font-weight: 700; font-size: 0.88rem;
  animation: notice-in 200ms var(--ease-smooth);
  display: flex; align-items: center; gap: 0.5rem;
}
.floating-notice-zone .ui-notice { box-shadow: 0 14px 34px rgba(17,24,39,0.15); }
.ui-notice.info    { color: #1d4ed8; background: rgba(59,130,246,0.11); border: 1px solid rgba(59,130,246,0.22); }
.ui-notice.success { color: #14532d; background: rgba(34,197,94,0.11);  border: 1px solid rgba(34,197,94,0.24); }
.ui-notice.error   { color: #991b1b; background: rgba(239,68,68,0.11);  border: 1px solid rgba(239,68,68,0.22); }

@keyframes notice-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* SOFT PULSE */
.soft-pulse { animation: soft-pulse 2s ease-in-out infinite; }
@keyframes soft-pulse {
  0%,100% { box-shadow: 0 0 0 0   rgba(37,99,235,0); }
  50%     { box-shadow: 0 0 0 8px rgba(37,99,235,0.10); }
}

/* BUTTON GRADIENT OVERRIDES */
.btn-primary.pressable-btn {
  background: linear-gradient(135deg, var(--brand), var(--brand-deep));
  border: none; box-shadow: var(--shadow-brand);
}
.btn-primary.pressable-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #3b7cf8, var(--brand));
  box-shadow: 0 8px 28px rgba(37,99,235,0.40);
}

.btn-success.pressable-btn {
  background: linear-gradient(135deg, #22c55e, var(--accent));
  border: none; box-shadow: var(--shadow-accent);
}
.btn-success.pressable-btn:not(:disabled):hover {
  background: linear-gradient(135deg, #34d370, #15803d);
  box-shadow: 0 8px 28px rgba(22,163,74,0.40);
}

.btn-outline-danger.pressable-btn {
  transition: background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.12s var(--ease-spring);
}
.btn-outline-danger.pressable-btn:not(:disabled):hover {
  background: var(--danger); color: #fff;
  box-shadow: 0 6px 20px rgba(220,38,38,0.32);
}

.btn-light.pressable-btn {
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(0,0,0,0.07);
  box-shadow: var(--shadow-sm);
}
.btn-light.pressable-btn:not(:disabled):hover {
  background: #fff; box-shadow: var(--shadow-md);
}

/* BADGE TRANSITIONS */
.badge { transition: background-color 0.3s ease, color 0.3s ease; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .floating-notice-zone { top: 4.8rem; width: min(94vw, 720px); }
}

/* REDUCED MOTION */
@media (prefers-reduced-motion: reduce) {
  .interactive-card, .pressable-btn, .ui-notice,
  .fade-up, .section-enter, .bounce-in,
  .animate-slide-fade, .soft-pulse, .btn-glowing, .icon-spin-slow {
    transition: none !important;
    animation: none !important;
  }
}
'@"
