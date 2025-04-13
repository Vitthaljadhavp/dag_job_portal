import React, { useState, useEffect, useRef } from "react";
import './JobSeekerDashboard.css';
import { FaUserCircle, FaFileAlt, FaBookmark, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";

const JobSeekerDashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);

  const toggleProfileMenu = () => setShowProfileMenu(prev => !prev);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ProfileDropdownMenu = ({ show }) => (
    <div className={`profile-menu ${show ? "show" : ""}`}>
      <a href="#profile"><FaUserCircle /> My Profile</a>
      <a href="#resume"><FaFileAlt /> My Resume</a>
      <a href="#applications"><MdWork /> Job Applications</a>
      <a href="#saved-jobs"><FaBookmark /> Saved Jobs</a>
      <a href="#alerts"><FaBell /> Job Alerts</a>
      <a href="#settings"><FaCog /> Settings</a>
      <a href="#logout"><FaSignOutAlt /> Logout</a>
    </div>
  );

  const ProfileCard = () => (
    <div className="profile-card">
      <img className="avatar" src="https://via.placeholder.com/80" alt="Profile" />
      <h3>Nitin Gaikwad</h3>
      <p>B.Tech/B.E. Computers<br />@ Indira College of Engineering</p>
      <button className="btn btn-primary">Complete profile</button>
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
  );

  const PromoCard = () => (
    <div className="card promo">
      <h3>All India NCAT</h3>
      <p>May 24 & 25th, 2025<br />Win from ₹20L prize pool</p>
      <button className="btn-dark">Tell me more</button>
    </div>
  );

  const AmbassadorCard = () => (
    <div className="card ambassador">
      <h3>Shine & inspire as a Naukri Campus Ambassador</h3>
      <button className="btn btn-primary">Become ambassador</button>
    </div>
  );

  const ExtraCard = ({ title, content }) => (
    <div className="card">
      <h4>{title}</h4>
      <p>{content}</p>
      <a href="#">Explore more</a>
    </div>
  );

  const extraCardsData = [
    {
      title: "Top Resume Tips for 2025",
      content: "Learn how to craft a resume that gets noticed by recruiters instantly."
    },
    {
      title: "Hackathons to Boost Your Profile",
      content: "Compete in nationwide hackathons and land top jobs."
    },
    {
      title: "Interview Preparation Bootcamps",
      content: "Master behavioral, technical, and HR interviews in one place."
    },
    {
      title: "Remote Work Trends in 2025",
      content: "Stay ahead with jobs that offer flexibility and remote-first culture."
    },
    {
      title: "Salary Negotiation Tips",
      content: "Discover how to ask for what you deserve without feeling awkward."
    },
    {
      title: "Top Companies Hiring Freshers",
      content: "Find out which companies are actively hiring fresh graduates this quarter."
    },
    {
      title: "Personal Branding for Developers",
      content: "Build a tech portfolio and LinkedIn presence that stands out."
    },
    {
      title: "How to Handle Job Rejections",
      content: "Turn every rejection into a growth opportunity with this mindset shift."
    },
    {
      title: "Free Courses to Learn AI & ML",
      content: "Enroll in beginner-to-pro AI/ML courses to upgrade your skillset."
    },
    {
      title: "Top Mistakes to Avoid in Interviews",
      content: "Avoid these common mistakes that cost candidates their dream job."
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-left">
          <img
            src="https://static.naukimg.com/s/7/123/i/naukri_Logo.png"
            alt="Naukri Logo"
            className="logo"
          />
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
          <input
            type="text"
            placeholder="Search jobs here"
            className="search-box"
          />
          <div className="nav-icons" ref={profileRef}>
            <IoNotifications className="notif" title="Notifications" />
            <div className="profile-dropdown">
              <span
                className="profile-pic"
                onClick={toggleProfileMenu}
                tabIndex={0}
                role="button"
                aria-expanded={showProfileMenu}
                onKeyDown={(e) => e.key === 'Enter' && toggleProfileMenu()}
              >
                <FaUserCircle size={24} />
              </span>
              <ProfileDropdownMenu show={showProfileMenu} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="left-panel">
          <ProfileCard />
        </div>

        <div className="center-panel">
          <PromoCard />
          <AmbassadorCard />
          {extraCardsData.map((card, index) => (
            <ExtraCard key={index} title={card.title} content={card.content} />
          ))}
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
