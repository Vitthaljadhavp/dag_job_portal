import React, { useState, useEffect, useRef } from "react";
import './JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null); // ✅ FIXED

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="dashboard-container">
      <header className="navbar">
        <div className="navbar-left">
          <img src="https://static.naukimg.com/s/7/123/i/naukri_Logo.png" alt="Naukri Logo" className="logo" />
        </div>

        <div className="navbar-center">
          <a href="#">Home</a>
          <div className="dropdown">
            <a href="#">Opportunities</a>
            <div className="dropdown-content">
              <a href="/JobListingDashboard">Recommended jobs</a>
              <a href="#">Job invites</a>
              <a href="#">Jobs from alerts</a>
              <a href="/AppliedJobs">Application status</a>
              <a href="#">Saved jobs</a>
            </div>
          </div>
          <a href="#">Companies</a>
        </div>

        <div className="navbar-right">
          <input type="text" placeholder="Search jobs here" className="search-box" />
          <div className="nav-icons" ref={profileRef}>
            <span className="notif">🔔</span>
            {/* Profile Pic and Menu */}
            <div className="profile-dropdown">
              <span className="profile-pic" onClick={toggleProfileMenu}>👤</span>
              {showProfileMenu && (
                <div className="profile-menu">
                  <a href="#profile">My Profile</a>
                  <a href="#settings">Settings</a>
                  <a href="#logout">Logout</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="left-panel">
          <div className="profile-card">
            <img className="avatar" src="https://via.placeholder.com/80" alt="Profile" />
            <h3>Nitin Gaikwad</h3>
            <p>B.Tech/B.E. Computers<br />@ Indira College of Engineering</p>
            <button className="btn">Complete profile</button>
            <div className="stats">
              <div>
                <strong>120</strong>
                <p>Search appearances</p>
              </div>
              <div>
                <strong>33</strong>
                <p>Recruiter actions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="center-panel">
          <div className="card promo">
            <h3>All India NCAT</h3>
            <p>May 24 & 25th, 2025<br />Win from ₹20L prize pool</p>
            <button className="btn-dark">Tell me more</button>
          </div>
          <div className="card ambassador">
            <h3>Shine & inspire as a Naukri Campus Ambassador</h3>
            <button className="btn">Become ambassador</button>
          </div>
        </div>

        <div className="right-panel">
          <div className="card article">
            <h4>Latest Group Discussion GD Topics For Students</h4>
            <p>Acing a group discussion is a crucial step for college students...</p>
            <a href="#">Read more</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
