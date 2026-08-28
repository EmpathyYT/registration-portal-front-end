import { useState } from 'react';
import type { Reservation } from '../../types/project';
import { styles } from '../../styles/components/project/ReservationsFeedStyles';

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
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.icon}>
                    <svg width="13" height="13" fill="white" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                </div>
                <h6 className={styles.title}>Presentation Schedule</h6>
                {reservations.length > 0 && (
                    <span className={styles.countBadge}>📅 {reservations.length} booked</span>
                )}
                {canManage && (
                    <button className={styles.bookBtn} onClick={onBook}>+ Book Slot</button>
                )}
            </div>

            {reservations.length === 0 ? (
                <div className={styles.emptyCard}>
                    <div className={styles.emptyLeft}>
                        <div className={styles.emptyIcon}>
                            <svg width="20" height="20" fill="#adb5bd" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </div>
                        <div>
                            <h6 className={styles.emptyTitle}>No presentations booked</h6>
                            <div className={styles.emptySubtitle}>
                                {canManage ? 'Click "+ Book Slot" to reserve a time.' : 'Your team has not booked a slot yet.'}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.activeCard}>
                    <div className={styles.activeLeft}>
                        <div className={styles.activeIcon}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                            </svg>
                        </div>
                        <div>
                            <div className={styles.activeTitleRow}>
                                <h6 className={styles.activeTitle}>{active.location}</h6>
                                <span className={styles.upcomingBadge}>Upcoming</span>
                            </div>
                            <div className={styles.activeMeta}>
                                <span className={styles.metaText}>🕐 {formatDateTime(active.reservation_time)}</span>
                                {hasMultiple && (
                                    <span className={styles.positionBadge}>{safeIndex + 1} of {reservations.length}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button
                            className={styles.nextBtn(hasMultiple)}
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
                                <button className={styles.editBtn} onClick={() => onEdit(active)}>Edit</button>
                                <button className={styles.deleteBtn} onClick={() => onDelete(active)}>Delete</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
