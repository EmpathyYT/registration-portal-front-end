import React, { useState } from 'react';

interface InviteMemberModalProps {
    onClose: () => void;
    onSubmit: (universityId: string) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ onClose, onSubmit }) => {
    const [universityId, setUniversityId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (universityId.trim()) onSubmit(universityId);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pt-4 px-4 pb-2">
                        <h4 className="modal-title fw-bolder text-primary">Invite Team Member</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">Student University ID</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg bg-light border-0"
                                    placeholder="e.g. 20221005"
                                    value={universityId}
                                    onChange={(e) => setUniversityId(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3">
                                Send Invitation
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InviteMemberModal;