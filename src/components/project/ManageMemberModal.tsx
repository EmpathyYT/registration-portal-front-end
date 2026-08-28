import React, { useState } from 'react';
import type { TeamMember } from '../../types/project';
import { styles, modalOverlay } from '../../styles/components/project/ManageMemberModalStyles';

interface ManageMemberModalProps {
    member: TeamMember;
    onClose: () => void;
    onUpdateRole: (userId: string, newRole: string) => void;
    onPromoteToLeader: (userId: string) => void;
    onKick: (userId: string) => void;
}

export const ManageMemberModal: React.FC<ManageMemberModalProps> = ({
    member, onClose, onUpdateRole, onPromoteToLeader, onKick,
}) => {
    const [teamRole, setTeamRole] = useState(member.team_role);

    const handleSaveRole = () => onUpdateRole(member.user_id, teamRole);

    return (
        <div className={styles.overlay} style={modalOverlay} tabIndex={-1}>
            <div className={styles.dialog}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h4 className={styles.title}>Manage: {member.full_name}</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className={styles.body}>
                        <div className="mb-4">
                            <label className={styles.roleLabel}>Update Team Role</label>
                            <div className={styles.roleRow}>
                                <input
                                    type="text"
                                    className={styles.roleInput}
                                    value={teamRole}
                                    onChange={(e) => setTeamRole(e.target.value)}
                                />
                                <button className={styles.saveBtn} onClick={handleSaveRole}>Save</button>
                            </div>
                        </div>

                        <hr className={styles.divider} />

                        <div className={styles.actionGroup}>
                            <button className={styles.promoteBtn} onClick={() => onPromoteToLeader(member.user_id)}>
                                Promote to Team Leader
                            </button>
                            <button className={styles.kickBtn} onClick={() => onKick(member.user_id)}>
                                Kick from Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMemberModal;