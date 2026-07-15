import { useEffect, useState } from "react";

import type { BoardMember } from "../types/boardMember";

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
                <h2>Board Members</h2>

                {members.map((member) => (
                    <div
                        key={member.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <div>
                            User #{member.user_id}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                            }}
                        >
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

                <hr />

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

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                        marginTop: 20,
                    }}
                >
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