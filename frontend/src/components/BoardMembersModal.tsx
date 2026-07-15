import { useEffect, useState } from "react";

import type { BoardMember } from "../types/boardMember";

import "../styles/members-modal.css";

import {
    getMembers,
    addMember,
    updateMember,
    deleteMember,
} from "../api/boards";

interface Props {
    boardId: number;
    open: boolean;
    onClose: () => void;
}

export default function BoardMembersModal({
    boardId,
    open,
    onClose,
}: Props) {
    const [members, setMembers] = useState<BoardMember[]>([]);

    const [username, setUsername] = useState("");

    const [role, setRole] = useState("viewer");

    useEffect(() => {
        if (open) {
            loadMembers();
        }
    }, [open]);

    async function loadMembers() {
        const data = await getMembers(boardId);

        setMembers(data);
    }

    async function handleInvite() {
        if (!username.trim()) return;

        await addMember(
            boardId,
            username,
            role,
        );

        setUsername("");

        setRole("viewer");

        loadMembers();
    }

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="members-header">
                    <h2>Board Members</h2>
                    <p>Manage access and permissions for this board.</p>
                </div>

                {members.map((member) => (
                    <div
                        key={member.id}
                        className="member-row"
                    >
                        <div className="member-info">
                            <div className="member-avatar">
                                {member.username.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <div className="member-name">
                                    {member.username}
                                </div>

                                <div className="member-id">
                                    User #{member.user_id}
                                </div>
                            </div>
                        </div>

                        <div className="member-actions">
                            <select
                                value={member.role}
                                onChange={async (
                                    e
                                ) => {
                                    await updateMember(
                                        boardId,
                                        member.user_id,
                                        e.target.value,
                                    );

                                    loadMembers();
                                }}
                            >
                                <option value="owner">
                                    Owner
                                </option>

                                <option value="editor">
                                    Editor
                                </option>

                                <option value="viewer">
                                    Viewer
                                </option>
                            </select>

                            <button
                                onClick={async () => {
                                    await deleteMember(
                                        boardId,
                                        member.user_id,
                                    );

                                    loadMembers();
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                <div className="members-divider"></div>

                <div className="invite-form">
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                    />

                    <select
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                    >
                        <option value="editor">
                            Editor
                        </option>

                        <option value="viewer">
                            Viewer
                        </option>
                    </select>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose}>
                        Close
                    </button>

                    <button
                        onClick={handleInvite}
                    >
                        Invite
                    </button>
                </div>
            </div>
        </div>
    );
}