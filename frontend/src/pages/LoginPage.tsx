import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/auth";

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const data = await login(username, password);

            localStorage.setItem("token", data.access_token);

            navigate("/boards");
        } catch (error) {
            alert("Неверный логин или пароль");
        }
    }

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#0f172a",
            }}
        >
            <div
                style={{
                    width: 400,
                    padding: 40,
                    background: "#1e293b",
                    borderRadius: 16,
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: 30,
                    }}
                >
                    Kanban Board
                </h1>

                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    style={{
                        width: "100%",
                        padding: 12,
                        marginBottom: 15,
                        borderRadius: 8,
                    }}
                />

                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    style={{
                        width: "100%",
                        padding: 12,
                        marginBottom: 20,
                        borderRadius: 8,
                    }}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        padding: 12,
                        border: "none",
                        borderRadius: 8,
                        background: "#3b82f6",
                        color: "white",
                        fontSize: 16,
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
}