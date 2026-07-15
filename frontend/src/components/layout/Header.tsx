import "../../styles/header.css";

import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/boards">
                    <div className="header-logo">
                        Flow
                    </div>
                </Link>

                <div className="header-right">
                    <div className="header-avatar">
                        E
                    </div>
                </div>
            </div>
        </header>
    );
}