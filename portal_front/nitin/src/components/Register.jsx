import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    workStatus: "fresher",
    role: "job_seeker", // Default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWorkStatusChange = (status) => {
    setFormData({ ...formData, workStatus: status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9091/api/users/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("User registered successfully:", response.data);
      alert("User registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">DAG Job Portal</div>
        <div className="navbar-login">
          Already Registered? <a href="Login">Login here</a>
        </div>
      </nav>
      <div className="register-page">
        <div className="register-info">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="User"
            className="register-info-img"
          />
          <h3>On registering, you can</h3>
          <ul>
            <li>✅ Build your profile and let recruiters find you</li>
            <li>✅ Get job postings delivered right to your email</li>
            <li>✅ Find a job and grow your career</li>
          </ul>
        </div>
        <div className="register-container">
          <h2>Create your DAG Profile</h2>
          <button className="google-button">
            <img
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              alt="Google"
              className="google-icon"
            />
            Continue with Google
          </button>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="What is your name?"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Mobile No.</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />

<div className="role-container">
    <label htmlFor="role">Role</label>
    <select id="role" name="role">
        <option value="job_seeker">Job Seeker</option>
        <option value="recruiter">Recruiter</option>
        <option value="admin">Admin</option>
    </select>
</div>


            <label>Work status</label>
            <div className="work-status-container">
              <label
                className={`work-status-option ${formData.workStatus === "experienced" ? "selected" : ""}`}
                onClick={() => handleWorkStatusChange("experienced")}
              >
                <div className="work-status-content">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    alt="Experienced"
                    className="work-status-icon"
                  />
                  <div>
                    <h4>I'm Experienced</h4>
                    <p>I have work experience (excluding internships)</p>
                  </div>
                </div>
              </label>
              <label
                className={`work-status-option ${formData.workStatus === "fresher" ? "selected" : ""}`}
                onClick={() => handleWorkStatusChange("fresher")}
              >
                <div className="work-status-content">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3069/3069170.png"
                    alt="Fresher"
                    className="work-status-icon"
                  />
                  <div>
                    <h4>I'm a Fresher</h4>
                    <p>I am a student/Haven't worked after graduation</p>
                  </div>
                </div>
              </label>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
