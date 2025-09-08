import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    if (!fullName || !username || !password || !phone) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/auth/signup", {
        fullName,
        username,
        password,
        phone,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        toast.success("Signup successful!");
        setTimeout(() => navigate("/items"), 1500); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Signup</h2>

      <input
        className="signup-input"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        className="signup-input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="signup-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="signup-input"
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="signup-btn" onClick={signup}>
        Signup
      </button>

      <p className="signup-switch">
        Already have an account?{" "}
        <button className="switch-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </p>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}