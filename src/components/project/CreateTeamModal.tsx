import React, { useState } from 'react';

interface CreateTeamModalProps {
    onClose: () => void;
    onSubmit: (projectTitle: string) => void;  // teams table only has project_title, no name
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose, onSubmit }) => {
    const [projectTitle, setProjectTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectTitle.trim()) {
            onSubmit(projectTitle);
        }
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered animate-slide-fade">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pt-4 px-4 pb-2">
                        <h4 className="modal-title fw-bolder text-primary">Create New Project Team</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">Project Title</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg bg-light border-0"
                                    placeholder="e.g. Course Registration System"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3">
                                Create &amp; Become Leader
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTeamModal;