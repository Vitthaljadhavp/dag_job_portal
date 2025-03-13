import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await axios.post("http://localhost:9091/api/users/login", { email, password });
        const role = response.data.role?.trim().toLowerCase();
        console.log("User Role:", role); // Debugging log
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", role);
        alert("Login Successful!");
        setTimeout(() => {
            if (role === "admin") {
                navigate("/admin-dashboard");
            } else if (role === "job_seeker") {
                navigate("/job-seeker-dashboard");
            } else if (role === "recruiter") {
                navigate("/recruiter-dashboard");
            } else {
                navigate("/home");
            }
        }, 500);
    } catch (err) {
        setError("Invalid email or password");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-combined-container">
        <div className="new-to-naukri">
          <h2>New to DAG?</h2>
          <ul>
            <li>✓ One click apply using DAG profile.</li>
            <li>✓ Get relevant job recommendations.</li>
            <li>✓ Showcase profile to top companies and consultants.</li>
            <li>✓ Know application status on applied jobs.</li>
          </ul>
          <button className="register-free-button" onClick={() => navigate("/register")}>
            Register for Free
          </button>
        </div>

        <div className="login-container">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <label>Email ID/Username</label>
            <input type="text" placeholder="Enter Email ID/Username" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <a href="/forgot-password" className="forgot-password">Forgot Password?</a> <br />
            <button type="submit" className="login-button">Login</button> <br />
          </form>
          
          <a href="#otp" className="otp">Use OTP to Login</a>
          <div className="or-divider">Or</div> 
          <div className="google-signin-container">
            <a href="#google" className="google-signin-button">
              <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" className="google-icon" alt="Google Sign-in" />
              Sign in with Google
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
