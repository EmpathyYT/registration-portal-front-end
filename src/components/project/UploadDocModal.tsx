import React, { useState } from 'react';

interface UploadDocModalProps {
    currentLink?: string;
    onClose: () => void;
    onSubmit: (link: string) => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({ currentLink = '', onClose, onSubmit }) => {
    const [link, setLink] = useState(currentLink);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (link.trim()) onSubmit(link);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pt-4 px-4 pb-2">
                        <h4 className="modal-title fw-bolder text-primary">Project Documentation</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-semibold text-secondary">Document URL (Google Drive, GitHub, etc.)</label>
                                <input
                                    type="url"
                                    className="form-control form-control-lg bg-light border-0"
                                    placeholder="https://..."
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-3">
                                Save Document Link
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadDocModal;