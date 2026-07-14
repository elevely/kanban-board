import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import BoardsPage from "../pages/BoardsPage";
import BoardPage from "../pages/BoardPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/boards" element={<BoardsPage />} />
                <Route path="/boards/:id" element={<BoardPage />} />
            </Routes>
        </BrowserRouter>
    );
}