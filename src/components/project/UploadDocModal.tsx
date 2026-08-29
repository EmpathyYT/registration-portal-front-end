import React, { useState } from 'react';
import { styles, modalOverlay } from '../../styles/components/project/UploadDocModalStyles';

interface UploadDocModalProps {
    currentLink?: string;
    onClose: () => void;
    onSubmit: (link: string) => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({ currentLink = '', onClose, onSubmit }) => {
    const [link, setLink] = useState(currentLink);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!link.trim()) return;
        setIsSaving(true);
        setTimeout(() => { onSubmit(link); }, 500);
    };

    return (
        <div className={styles.overlay} style={modalOverlay} tabIndex={-1}>
            <div className={styles.dialog}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h4 className={styles.title}>Project Documentation</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={isSaving}></button>
                    </div>
                    <div className={styles.body}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className={styles.label}>Document URL (Google Drive, GitHub, etc.)</label>
                                <input
                                    type="url"
                                    className={styles.input}
                                    placeholder="https://..."
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    disabled={isSaving}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={isSaving}>
                                {isSaving && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                {isSaving ? 'Saving...' : 'Save Document Link'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadDocModal;