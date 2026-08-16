import React, { useState } from 'react';
import type { TeamMember } from '../../types/project';

interface ManageMemberModalProps {
    member: TeamMember;
    onClose: () => void;
    onUpdateRole: (userId: string, newRole: string) => void;
    onPromoteToLeader: (userId: string) => void;
    onKick: (userId: string) => void;
}

export const ManageMemberModal: React.FC<ManageMemberModalProps> = ({
                                                                        member, onClose, onUpdateRole, onPromoteToLeader, onKick
                                                                    }) => {
    const [teamRole, setTeamRole] = useState(member.team_role);

    const handleSaveRole = () => {
        onUpdateRole(member.user_id, teamRole);
    };

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow-lg">
                    <div className="modal-header border-0 pt-4 px-4 pb-2">
                        <h4 className="modal-title fw-bolder text-dark">Manage: {member.full_name}</h4>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary">Update Team Role</label>
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control bg-light border-0"
                                    value={teamRole}
                                    onChange={(e) => setTeamRole(e.target.value)}
                                />
                                <button className="btn btn-primary fw-bold rounded-3 px-4" onClick={handleSaveRole}>
                                    Save
                                </button>
                            </div>
                        </div>

                        <hr className="my-4 text-muted" />

                        <div className="d-flex flex-column gap-2">
                            <button
                                className="btn btn-outline-success fw-bold rounded-3 py-2"
                                onClick={() => onPromoteToLeader(member.user_id)}
                            >
                                Promote to Team Leader
                            </button>
                            <button
                                className="btn btn-outline-danger fw-bold rounded-3 py-2"
                                onClick={() => onKick(member.user_id)}
                            >
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