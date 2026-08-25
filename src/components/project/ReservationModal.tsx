import React, { useState } from 'react';
import type { Team, Reservation } from '../../types/project';
import { modalOverlay } from '../../styles/componentStyles';

interface ReservationModalProps {
    team: Team;
    onClose: () => void;
    onSubmit: (location: string, date: string) => void;
    existing?: Reservation;   // if provided: edit mode, otherwise: create mode
}

const LOCATIONS = ['Hall A', 'Hall B', 'Hall C', 'Lab 101', 'Lab 202', 'Conference Room 1'];

export const ReservationModal: React.FC<ReservationModalProps> = ({
    team, onClose, onSubmit, existing,
}) => {
    const isEdit = Boolean(existing);

    // Pre-fill from existing reservation when editing
    const [location, setLocation] = useState(
        existing?.location ?? LOCATIONS[0]
    );
    const [date, setDate] = useState(
        existing ? existing.reservation_time.slice(0, 16) : ''  // trim to datetime-local format
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date) onSubmit(location, date);
    };

    return (
        <div className="modal d-block animate-slide-fade" style={modalOverlay} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pt-4 px-4 pb-2">
                        <h4 className="modal-title fw-bolder text-primary">
                            {isEdit ? 'Edit Reservation' : 'Book Presentation'}: {team.project_title}
                        </h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary">Location</label>
                                <select
                                    className="form-select form-select-lg bg-light border-0"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    {LOCATIONS.map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">Date &amp; Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control form-control-lg bg-light border-0"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3 pressable-btn">
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