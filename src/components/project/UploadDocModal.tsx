import React, { useState, useRef } from 'react';
import { styles, modalOverlay } from '../../styles/components/project/UploadDocModalStyles';

interface UploadDocModalProps {
    currentLink?: string;
    onClose: () => void;
    onSubmit: (file: File) => Promise<void>;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({ currentLink = '', onClose, onSubmit }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        setIsSaving(true);
        try {
            await onSubmit(selectedFile);
        } finally {
            // Always reset the loading state, whether upload succeeded or failed.
            setIsSaving(false);
        }
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
                                <label className={styles.label}>Upload Document File</label>
                                {currentLink && (
                                    <p className="text-muted small mb-2">
                                        A document is already uploaded. Selecting a new file will replace it.
                                    </p>
                                )}
                                <input
                                    ref={inputRef}
                                    type="file"
                                    className={styles.input}
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                                    disabled={isSaving}
                                    required
                                />
                                {selectedFile && (
                                    <p className="text-muted small mt-2">Selected: <strong>{selectedFile.name}</strong></p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSaving || !selectedFile}
                            >
                                {isSaving && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
                                {isSaving ? 'Uploading...' : 'Upload Document'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadDocModal;