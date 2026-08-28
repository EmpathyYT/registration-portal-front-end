import React, { useState } from 'react';
import type { Team, Reservation } from '../../types/project';
import { styles, modalOverlay } from '../../styles/components/project/ReservationModalStyles';

interface ReservationModalProps {
    team: Team;
    onClose: () => void;
    onSubmit: (location: string, date: string) => void;
    existing?: Reservation;
}

const LOCATIONS = ['Hall A', 'Hall B', 'Hall C', 'Lab 101', 'Lab 202', 'Conference Room 1'];

export const ReservationModal: React.FC<ReservationModalProps> = ({
    team, onClose, onSubmit, existing,
}) => {
    const isEdit = Boolean(existing);
    const [location, setLocation] = useState(existing?.location ?? LOCATIONS[0]);
    const [date, setDate] = useState(existing ? existing.reservation_time.slice(0, 16) : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date) onSubmit(location, date);
    };

    return (
        <div className={styles.overlay} style={modalOverlay} tabIndex={-1}>
            <div className={styles.dialog}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h4 className={styles.title}>
                            {isEdit ? 'Edit Reservation' : 'Book Presentation'}: {team.project_title}
                        </h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className={styles.body}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className={styles.locationLabel}>Location</label>
                                <select className={styles.locationSelect} value={location} onChange={(e) => setLocation(e.target.value)}>
                                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className={styles.dateLabel}>Date &amp; Time</label>
                                <input
                                    type="datetime-local"
                                    className={styles.dateInput}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                {isEdit ? 'Save Changes' : 'Confirm Reservation'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;