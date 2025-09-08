import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const BASE_URL = import.meta.env.VITE_API_URL;

  const login = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setUser(res.data.user);
        toast.success("Login successful!");
        setTimeout(() => navigate("/items"), 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      toast.error(errorMsg);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <input
        className="login-input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={login}>
        Login
      </button>

      <p className="login-switch">
        Don't have an account?{" "}
        <button className="switch-btn" onClick={() => navigate("/signup")}>
          Signup
        </button>
      </p>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
