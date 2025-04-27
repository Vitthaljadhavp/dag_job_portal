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
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpError, setOtpError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post("http://localhost:9091/api/users/login", { email, password });
    
      console.log("API Response:", response.data); // Check what data is returned
    
      const { token, role, isProfileComplete, userId } = response.data; // Ensure userId is extracted
      
      localStorage.setItem("token", token);
      localStorage.setItem("role", role?.trim().toLowerCase());
      localStorage.setItem("userId", userId); // Store userId
      localStorage.setItem("isProfileComplete", isProfileComplete);
    
      console.log("UserId after login:", userId); // Debugging
    
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "job_seeker") {
          if (isProfileComplete) {
            navigate("/job-seeker-dashboard"); 
          } else {
            navigate("/job-seeker-dashboard");
          }
        } else if (role === "recruiter") {
          navigate("/recruiter-dashboard");
        } else {
          navigate("/home");
        }
      }, 500);
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password");
    }
    
  };

  const handleOtpClick = (e) => {
    e.preventDefault();
    setShowOtpModal(true);
  };

  const handleOtpLogin = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9091/api/users/send-otp",
        null,
        { params: { mobileNumber } }
      );
      
      setShowOtpInput(true);
      setOtpError('');
      // In production, remove this alert and let the user wait for SMS
      alert("OTP for testing: " + response.data.otp);
    } catch (error) {
      setOtpError(error.response?.data || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9091/api/users/verify-otp",
        null,
        { params: { mobileNumber, otp } }
      );

      const { token, role, isProfileComplete, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role?.trim().toLowerCase());
      localStorage.setItem("userId", userId);
      localStorage.setItem("isProfileComplete", isProfileComplete);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "job_seeker") {
        navigate("/job-seeker-dashboard");
      } else if (role === "recruiter") {
        navigate("/recruiter-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setOtpError(error.response?.data || 'Invalid OTP');
    }
  };

  return (
    <>
      {/* Navbar */}
<nav className="navbar">
  <div className="navbar-left">
    <div className="navbar-logo">
      <img src="/logo.png" alt="Logo" className="logo-img" />
      <span className="portal-name">DAG Job Portal</span>
    </div>
  </div>

  {/* Login & Signup on Right */}
  <div className="navbar-right">
    <a href="/" className="signup-button" style={{marginRight:"50px"}}>Sign Up</a>
  </div>
</nav>

      <div className="login-combined-container" style={{margin: "50px 50px 150px 50px"}}>
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
          <img
            //src={require("../Assets/11538663.webp")}
            alt="Login illustration"
            style={{ width: '100%', marginTop: '20px', borderRadius: '8px' }}
          />
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

          <div className="or-divider">Or</div>
          
          <button className="google-signin-button">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2875/2875404.png"
              alt="Google"
              className="google-icon"
            />
            Sign in with Google
          </button>

          <a href="#" className="otp" onClick={handleOtpClick}>
            Use OTP to Login
          </a>
        </div>

        </div>

        {showOtpModal && (
        <div className="modal-overlay">
          <div className="otp-modal">
            <button className="modal-close" onClick={() => {
              setShowOtpModal(false);
              setShowOtpInput(false);
              setOtpError('');
              setOtp('');
            }}>×</button>
            <h2>Login</h2>
            <div className="otp-input-container">
              <input
                type="tel"
                placeholder="+91 - Enter your 10 digit mobile number"
                value={mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(value);
                  setOtpError('');
                }}
                disabled={showOtpInput}
              />
              {showOtpInput && (
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setOtpError('');
                  }}
                  style={{ marginTop: '10px' }}
                />
              )}
              {otpError && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                  {otpError}
                </div>
              )}
              <div className="otp-number-info">
                {showOtpInput ? 'Enter the OTP sent to your mobile number' : 'You will receive an OTP on this number'}
              </div>
            </div>
            <button 
              className="get-otp-button" 
              onClick={showOtpInput ? handleVerifyOtp : handleOtpLogin}
            >
              {showOtpInput ? 'Verify OTP' : 'Get OTP'}
            </button>
            <div className="or-email-login">
              or <a href="#" onClick={() => {
                setShowOtpModal(false);
                setShowOtpInput(false);
                setOtpError('');
                setOtp('');
              }}>Use Email to Login</a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Login;