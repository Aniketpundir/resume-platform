import React, { useState } from "react";
import axios from "axios";

export default function Signup({ onSignup, switchToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const API = import.meta.env.VITE_API || "http://localhost:5000";

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(API + "/auth/signup", { name, email, password });
            onSignup(res.data.token);
        } catch (err) {
            setMsg(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
            <form
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
                onSubmit={submit}
            >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Create Account 🚀
                </h2>
                {msg && <div className="text-red-600 mb-3 text-center">{msg}</div>}

                <label className="block mb-3">
                    <span className="text-gray-700">Name</span>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </label>

                <label className="block mb-3">
                    <span className="text-gray-700">Email</span>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </label>

                <label className="block mb-3">
                    <span className="text-gray-700">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </label>

                <p className="text-sm text-gray-600 mb-3">
                    Password must include uppercase, lowercase, number, and special character.
                </p>

                <button className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                    Signup
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={switchToLogin}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Login
                    </button>
                </p>
            </form>
        </div>
    );
}
