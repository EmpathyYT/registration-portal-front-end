import React, { useState, useRef } from 'react';
import { styles, modalOverlay } from '../../styles/components/project/UploadDocModalStyles';

interface UploadDocModalProps {
    currentLink?: string;
    onClose: () => void;
    onSubmit: (file: File) => Promise<void>;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({ currentLink = '', onClose, onSubmit }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file && file.type !== 'application/pdf') {
            setFileError('Only PDF files are allowed. Please select a .pdf file.');
            setSelectedFile(null);
            // Reset the input so the user can pick again
            if (inputRef.current) inputRef.current.value = '';
            return;
        }
        setFileError(null);
        setSelectedFile(file);
    };

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
                                <p className="text-muted small mb-2">PDF files only (.pdf)</p>
                                {currentLink && (
                                    <p className="text-muted small mb-2">
                                        A document is already uploaded. Selecting a new file will replace it.
                                    </p>
                                )}
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className={styles.input}
                                    onChange={handleFileChange}
                                    disabled={isSaving}
                                    required
                                />
                                {fileError && (
                                    <p className="text-danger small mt-2 fw-semibold">{fileError}</p>
                                )}
                                {selectedFile && !fileError && (
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