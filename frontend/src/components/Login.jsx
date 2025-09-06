import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const API = import.meta.env.VITE_API || "http://localhost:5000";

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API + "/auth/login", { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        onSubmit={submit}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>
        {msg && <div className="text-red-600 mb-3 text-center">{msg}</div>}

        <label className="block mb-3">
          <span className="text-gray-700">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <button
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={switchToSignup}
            className="text-purple-600 font-semibold hover:underline"
          >
            Signup
          </button>
        </p>
      </form>
    </div>
  );
}
