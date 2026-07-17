import "../../styles/header.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Header() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const username = localStorage.getItem("username") ?? "U";

    const avatarLetter = username[0].toUpperCase();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    function logout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <header className="header">
            <div className="header-container">

                <Link to="/boards">
                    <div className="header-logo">
                        Flow
                    </div>
                </Link>

                <div
                    className="header-menu"
                    ref={menuRef}
                >
                    <div
                        className="header-avatar"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        {avatarLetter}
                    </div>

                    {open && (
                        <div className="avatar-dropdown">
                            <button onClick={logout}>
                                Exit
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}