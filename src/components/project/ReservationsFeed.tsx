import { useState } from 'react';
import type { Reservation } from '../../types/project';

interface ReservationsFeedProps {
    reservations: Reservation[];
    canManage: boolean;
    onBook: () => void;
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

export default function ReservationsFeed({ reservations, canManage, onBook, onEdit, onDelete }: ReservationsFeedProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const safeIndex = reservations.length === 0 ? 0 : Math.min(activeIndex, reservations.length - 1);
    const active = reservations[safeIndex];
    const hasMultiple = reservations.length > 1;

    return (
        <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
                <div className="icon-box-sm">
                    <svg width="13" height="13" fill="white" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                </div>
                <h6 className="fw-bold mb-0 menu-text section-label">Presentation Schedule</h6>
                {reservations.length > 0 && (
                    <span className="fw-bolder rounded-pill d-flex align-items-center gap-1 badge-pending">
                        📅 {reservations.length} booked
                    </span>
                )}
                {canManage && (
                    <button className="btn btn-primary btn-sm fw-bold rounded-3 px-3 ms-auto pressable-btn" onClick={onBook}>
                        + Book Slot
                    </button>
                )}
            </div>

            {reservations.length === 0 ? (
                <div className="card border-0 bg-white rounded-4 shadow-sm p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between interactive-card">
                    <div className="d-flex align-items-center">
                        <div className="icon-circle bg-light me-3">
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
                <div className="card border-0 bg-white rounded-4 shadow-sm p-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between interactive-card fade-up card-border-success">
                    <div className="d-flex align-items-center mb-3 mb-md-0">
                        <div className="icon-circle bg-success bg-opacity-10 text-success me-3">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                <h6 className="fw-bolder text-dark mb-0">{active.location}</h6>
                                <span className="fw-bolder badge-upcoming rounded-pill">Upcoming</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <span className="text-muted small">🕐 {formatDateTime(active.reservation_time)}</span>
                                {hasMultiple && (
                                    <span className="fw-bold badge-position rounded-pill d-inline-flex align-items-center">
                                        {safeIndex + 1} of {reservations.length}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-2 justify-content-md-end">
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
                        {canManage && (
                            <>
                                <button className="btn btn-light fw-bold rounded-3 px-4 py-2 pressable-btn" onClick={() => onEdit(active)}>Edit</button>
                                <button className="btn btn-light text-danger fw-bold rounded-3 px-4 py-2 pressable-btn" onClick={() => onDelete(active)}>Delete</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
