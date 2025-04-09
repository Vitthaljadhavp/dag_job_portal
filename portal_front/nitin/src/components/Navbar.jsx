import React from 'react';
import { useNavigate } from "react-router-dom";
import './Navbar.css';
import { FaBriefcase, FaBuilding, FaServicestack, FaUser, FaUserPlus, FaChevronDown } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
      const confirmLogout = window.confirm("Are you sure you want to log out?");
      if (confirmLogout) {
        localStorage.removeItem("authToken"); // Clear JWT
        sessionStorage.clear(); // Clear session storage
        setTimeout(() => navigate("/login"), 500); // Smooth logout transition
      }
    };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="naukri-logo.png" alt="Logo" className="navbar-logo" />
        <h1 className="navbar-title">DAG <span>Job Portal</span></h1>
      </div>

      <ul className="navbar-links">
        <li><a href="#jobs"><FaBriefcase className="nav-icon" /> Jobs</a></li>
        <li><a href="#companies"><FaBuilding className="nav-icon" /> Companies</a></li>
        <li><a href="#services"><FaServicestack className="nav-icon" /> Services</a></li>
      </ul>

      <div className="navbar-right">
        <button className="post-job-btn">Post a Job</button>
        <button className="view-job-btn">View Jobs</button>

        <div className="profile-dropdown">
          <button className="profile-btn">
            <FaUser className="nav-icon" /> Profile <FaChevronDown />
          </button>
          <div className="dropdown-content">
            <a href="#view">View Profile</a>
            <a href="#settings">Settings</a>
            <a href="/login" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>
    </nav>
    
  );
}

    
export default Navbar;
