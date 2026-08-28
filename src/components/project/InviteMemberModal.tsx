import React, { useState } from 'react';
import { styles, modalOverlay } from '../../styles/components/project/InviteMemberModalStyles';

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
        <div className={styles.overlay} style={modalOverlay} tabIndex={-1}>
            <div className={styles.dialog}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h4 className={styles.title}>Invite Team Member</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className={styles.body}>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className={styles.label}>Student University ID</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="e.g. 20221005"
                                    value={universityId}
                                    onChange={(e) => setUniversityId(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
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