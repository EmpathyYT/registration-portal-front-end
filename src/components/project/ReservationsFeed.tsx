import { useState } from 'react';
import type { Reservation } from '../../types/project';
import { iconBoxSm, pendingBadge, positionPill, upcomingBadge } from '../../styles/componentStyles';

interface ReservationsFeedProps {
    reservations: Reservation[];
    canManage: boolean;       // true for team leader and supervisor
    onBook: () => void;       // open create modal
    onEdit: (r: Reservation) => void;
    onDelete: (r: Reservation) => void;
}

function formatDateTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric',
        year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

export default function ReservationsFeed({
    reservations, canManage, onBook, onEdit, onDelete,
}: ReservationsFeedProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const safeIndex = reservations.length === 0 ? 0 : Math.min(activeIndex, reservations.length - 1);
    const active = reservations[safeIndex];
    const hasMultiple = reservations.length > 1;

    return (
        <div className="mb-4">
            {/* ── Section header ──────────────────────────────── */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <div style={iconBoxSm}>
                    <svg width="13" height="13" fill="white" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                </div>

                <h6 className="fw-bold mb-0 menu-text"
                    style={{ letterSpacing: '0.06em', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                    Presentation Schedule
                </h6>

                {reservations.length > 0 && (
                    <span className="fw-bolder rounded-pill d-flex align-items-center gap-1"
                        style={pendingBadge}>
                        📅 {reservations.length} booked
                    </span>
                )}

                {/* Leader/supervisor: Book new slot */}
                {canManage && (
                    <button
                        className="btn btn-primary btn-sm fw-bold rounded-3 px-3 ms-auto pressable-btn"
                        onClick={onBook}
                    >
                        + Book Slot
                    </button>
                )}
            </div>

            {/* ── Empty state ─────────────────────────────────── */}
            {reservations.length === 0 ? (
                <div className="card border-0 bg-white rounded-4 shadow-sm p-3
                                d-flex flex-column flex-md-row align-items-md-center
                                justify-content-between interactive-card">
                    <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle d-flex align-items-center
                                        justify-content-center me-3"
                             style={{ width: '48px', height: '48px' }}>
                            <svg width="20" height="20" fill="#adb5bd" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </div>
                        <div>
                            <h6 className="fw-bolder text-dark mb-0">No presentations booked</h6>
                            <div className="text-muted small mt-1">
                                {canManage ? 'Click "+ Book Slot" to reserve a time.' : 'Your team has not booked a slot yet.'}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* ── Active reservation card ─────────────────── */
                <div className="card border-0 bg-white rounded-4 shadow-sm p-3
                                d-flex flex-column flex-md-row align-items-md-center
                                justify-content-between interactive-card fade-up"
                     style={{ borderLeft: '3px solid #22c55e' }}>

                    <div className="d-flex align-items-center mb-3 mb-md-0">
                        <div className="bg-success bg-opacity-10 text-success rounded-circle
                                        d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                             style={{ width: '48px', height: '48px' }}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                <h6 className="fw-bolder text-dark mb-0">{active.location}</h6>
                                <span className="fw-bolder rounded-pill" style={upcomingBadge}>Upcoming</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <span className="text-muted small">
                                    🕐 {formatDateTime(active.reservation_time)}
                                </span>
                                {hasMultiple && (
                                    <span className="fw-bold rounded-pill d-inline-flex align-items-center"
                                          style={positionPill}>
                                        {safeIndex + 1} of {reservations.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        {/* Navigate through reservations */}
                        <button
                            className={`btn btn-light rounded-3 fw-bold px-3 py-2 pressable-btn ${hasMultiple ? 'soft-pulse' : ''}`}
                            onClick={() => hasMultiple && setActiveIndex(prev => (prev + 1) % reservations.length)}
                            disabled={!hasMultiple}
                            aria-label="Next reservation"
                        >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                            </svg>
                        </button>

                        {/* Leader/supervisor: Edit and Delete */}
                        {canManage && (
                            <>
                                <button
                                    className="btn btn-light fw-bold rounded-3 px-4 py-2 pressable-btn"
                                    onClick={() => onEdit(active)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-light text-danger fw-bold rounded-3 px-4 py-2 pressable-btn"
                                    onClick={() => onDelete(active)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
