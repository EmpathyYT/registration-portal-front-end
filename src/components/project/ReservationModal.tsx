import React, { useState } from 'react';
import type { Team } from '../../types/project';

interface ReservationModalProps {
    team: Team;
    onClose: () => void;
    onSubmit: (location: string, date: string) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ team, onClose, onSubmit }) => {
    const [location, setLocation] = useState('Hall A');
    const [date, setDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (date) onSubmit(location, date);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pt-4 px-4 pb-2">
                        <h4 className="modal-title fw-bolder text-primary">Book Presentation: {team.Name}</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-secondary">Select Location</label>
                                <select
                                    className="form-select form-select-lg bg-light border-0"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option value="Hall A">Hall A</option>
                                    <option value="Hall B">Hall B</option>
                                    <option value="Lab 101">Lab 101</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">Select Time</label>
                                <input
                                    type="datetime-local"
                                    className="form-control form-control-lg bg-light border-0"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3">
                                Confirm Reservation
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;