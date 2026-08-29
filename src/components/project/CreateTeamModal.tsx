import React, { useState } from 'react';
import { styles, modalOverlay } from '../../styles/components/project/CreateTeamModalStyles';

interface CreateTeamModalProps {
    onClose: () => void;
    onSubmit: (projectTitle: string) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose, onSubmit }) => {
    const [projectTitle, setProjectTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectTitle.trim()) onSubmit(projectTitle);
    };

    return (
        <div className={styles.overlay} style={modalOverlay} tabIndex={-1}>
            <div className={styles.dialog}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h4 className={styles.title}>Create New Project Team</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className={styles.body}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className={styles.label}>Project Title</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. Course Registration System"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
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