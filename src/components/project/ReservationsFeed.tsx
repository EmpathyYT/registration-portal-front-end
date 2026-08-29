
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
    const active = reservations.length > 0 ? reservations[0] : null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <div className={styles.icon}>
                    <svg width="13" height="13" fill="white" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                </div>
                <h6 className={styles.title}>Presentation Schedule</h6>
                {active && (
                    <span className={styles.countBadge}>📅 1 booked</span>
                )}
                {canManage && !active && (
                    <button className={styles.bookBtn} onClick={onBook}>+ Book Slot</button>
                )}
            </div>

            {!active ? (
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
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
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
