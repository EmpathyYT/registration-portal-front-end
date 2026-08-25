/**
 * componentStyles.ts
 * ──────────────────
 * Named CSSProperties constants extracted from component inline styles.
 * Import these in components instead of repeating long style objects in JSX.
 *
 * Usage:
 *   import { iconBoxMd, glassCard } from '../../styles/componentStyles';
 *   <div style={iconBoxMd}>...</div>
 */
import type { CSSProperties } from 'react';

// ─── ICON BOXES (blue gradient, used as section icons) ────────
const _iconBoxBase: CSSProperties = {
    background: 'linear-gradient(135deg, #3b7cf8, #1d4ed8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};

/** 28×28 — used in feed section headers (InvitationsFeed, ReservationsFeed) */
export const iconBoxSm: CSSProperties = {
    ..._iconBoxBase,
    width: '28px', height: '28px', borderRadius: '8px',
    boxShadow: '0 3px 8px rgba(37,99,235,0.25)',
};

/** 36×36 — used in grid section headers (AvailableTeamsGrid, AvailableCoursesGrid) */
export const iconBoxMd: CSSProperties = {
    ..._iconBoxBase,
    width: '36px', height: '36px', borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
};

/** 46×46 — used in card headers (MyTeamPanel) */
export const iconBoxLg: CSSProperties = {
    ..._iconBoxBase,
    width: '46px', height: '46px', borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(37,99,235,0.28)',
};

/** 52×52 — supervisor purple variant (SupervisorTeamSelector) */
export const iconBoxSupervisor: CSSProperties = {
    width: '52px', height: '52px', borderRadius: '14px',
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxShadow: '0 6px 18px rgba(124,58,237,0.35)',
};

// ─── CARD SURFACES ────────────────────────────────────────────
/** Standard glassmorphism card (MyTeamPanel, modals) */
export const glassCard: CSSProperties = {
    borderRadius: '1.25rem',
    boxShadow: '0 8px 32px rgba(15,23,42,0.09)',
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.6)',
};

/** Smaller glass card variant (invitation/reservation cards) */
export const glassCardSm: CSSProperties = {
    borderRadius: '1rem',
    boxShadow: '0 4px 20px rgba(15,23,42,0.07)',
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.6)',
};

// ─── AVATAR ────────────────────────────────────────────────────
/** Circular avatar with blue gradient */
export const avatarCircle: CSSProperties = {
    width: '48px', height: '48px', fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #3b7cf8, #1d4ed8)',
    boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
};

// ─── BADGES ────────────────────────────────────────────────────
/** Orange-red gradient — pending invitations count */
export const pendingBadge: CSSProperties = {
    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    color: '#fff', fontSize: '0.72rem', padding: '3px 10px',
    boxShadow: '0 3px 10px rgba(239,68,68,0.40)', letterSpacing: '0.02em',
};

/** Blue-purple gradient — position indicator (1 of 4) */
export const positionPill: CSSProperties = {
    background: 'linear-gradient(135deg, #3b7cf8, #8b5cf6)',
    color: '#fff', fontSize: '0.68rem', padding: '2px 8px', letterSpacing: '0.04em',
};

/** Purple — supervisor identity badge */
export const supervisorBadge: CSSProperties = {
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    color: '#fff', fontSize: '0.70rem', padding: '3px 10px',
    borderRadius: '999px', letterSpacing: '0.04em',
};

/** Green — upcoming reservation badge */
export const upcomingBadge: CSSProperties = {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff', fontSize: '0.72rem', padding: '3px 10px',
    boxShadow: '0 3px 8px rgba(22,163,74,0.30)', letterSpacing: '0.02em',
};

// ─── MODALS ────────────────────────────────────────────────────
/** Standard modal backdrop */
export const modalOverlay: CSSProperties = { backgroundColor: 'rgba(0,0,0,0.5)' };
