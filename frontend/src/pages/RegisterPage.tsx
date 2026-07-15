import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    login,
    register,
} from "../api/auth";

import "../styles/login.css";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    async function handleRegister() {
        if (!username.trim()) {
            alert("Enter username");
            return;
        }

        if (!password.trim()) {
            alert("Enter password");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await register(username, password);

            const data = await login(
                username,
                password,
            );

            localStorage.setItem(
                "token",
                data.access_token,
            );

            navigate("/boards");
        } catch (error) {
            alert("Registration failed");
        }
    }

    return (
        <div className="login-page">
            <div className="login-brand">
                <h1>Flow</h1>

                <p>
                    Simple project management
                    <br />
                    without distractions.
                </p>
            </div>

            <div className="login-card">
                <h2>Create account</h2>

                <input
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    placeholder="Username"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    placeholder="Password"
                />

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                    placeholder="Confirm password"
                />

                <button
                    onClick={handleRegister}
                >
                    Create Account
                </button>

                <p className="auth-switch">
                    Already have an account?

                    <span
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
}