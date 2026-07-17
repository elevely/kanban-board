import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/auth";

import "../styles/login.css";

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const data = await login(username, password);

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("username", username);

            navigate("/boards");
        } catch (error) {
            alert("Неверный логин или пароль");
        }
    }

    return (
        <div className="login-page">
            <div className="login-brand">
                <h1>Flow</h1>

                <p>
                Simple project management 
                without distractions.
                </p>
            </div>

            <div className="login-card">
                <h2>Welcome back</h2>

                <input
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    placeholder="Username"
                />

                <input
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    type="password"
                    placeholder="Password"
                />

                <button onClick={handleLogin}>
                    Sign In
                </button>

                <p className="auth-switch">
                    Don't have an account?

                    <span
                        onClick={() => navigate("/register")}
                    >
                        Sign Up
                    </span>
                </p>

            </div>
        </div>
    );
}