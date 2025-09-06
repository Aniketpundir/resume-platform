import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

const API = import.meta.env.VITE_API || "http://localhost:5000";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");

  useEffect(() => {
    if (token) {
      axios
        .get(API + "/auth/me", { headers: { Authorization: "Bearer " + token } })
        .then((r) => setUser(r.data.user))
        .catch(() => {
          setToken(null);
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  if (!token) {
    return mode === "login" ? (
      <Login onLogin={(t) => { setToken(t); localStorage.setItem("token", t); }} switchToSignup={() => setMode("signup")} />
    ) : (
      <Signup onSignup={(t) => { setToken(t); localStorage.setItem("token", t); }} switchToLogin={() => setMode("login")} />
    );
  }

  return <Dashboard token={token} user={user} api={API} />;
}
