import React, { useState, useEffect, useRef } from "react";
import './JobSeekerDashboard.css';
import { FaUserCircle, FaFileAlt, FaBookmark, FaBell, FaCog, FaSignOutAlt, FaUpload } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const JobSeekerDashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState({ photo: '', resume: '' });
  const [profileScore, setProfileScore] = useState(0);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const calculateProfileScore = (data) => {
    let score = 0;
    const totalFields = 11; // Total number of profile fields

    // Basic Information
    if (data.fullName) score += 1;
    if (data.email) score += 1;
    if (data.mobileNumber) score += 1;
    if (data.address) score += 1;
    if (data.dateOfBirth) score += 1;
    if (data.gender) score += 1;
    if (data.profilePictureUrl) score += 1;
    if (data.resumeUrl) score += 1;
    if (data.aboutMe) score += 1;
    if (data.educationList?.length > 0) score += 1;
    if (data.skills?.length > 0) score += 1;

    const percentage = (score / totalFields) * 100;
    setProfileScore(Math.round(percentage));
    return percentage;
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`http://localhost:9091/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserData(response.data);
      calculateProfileScore(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (type, file) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Create a job seeker profile object with minimum required fields
      const profile = {
        id: userId,
        fullName: userData?.fullName || '',
        email: userData?.email || '',
        mobileNumber: userData?.mobileNumber || ''
      };
      
      formData.append('profile', new Blob([JSON.stringify(profile)], { type: 'application/json' }));
      
      if (type === 'photo') {
        formData.append('profilePicture', file);
      } else {
        formData.append('resume', file);
      }

      const response = await axios.post(
        'http://localhost:9091/api/job-seeker/save',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setUploadStatus(prev => ({
          ...prev,
          [type]: 'Upload successful!'
        }));
        // Refresh user data to show new uploads
        fetchUserData();
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setUploadStatus(prev => ({
        ...prev,
        [type]: 'Upload failed. Please try again.'
      }));
    }
  };

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

  useEffect(() => {
    fetchUserData();
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
      <div className="profile-photo-container">
        <img 
          className="avatar" 
          src={userData?.profilePictureUrl || "https://via.placeholder.com/80"} 
          alt="Profile" 
        />
        <label className="upload-button">
          <FaUpload />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleFileUpload('photo', e.target.files[0]);
              calculateProfileScore({ ...userData, profilePictureUrl: URL.createObjectURL(e.target.files[0]) });
            }}
            style={{ display: 'none' }}
          />
        </label>
        {uploadStatus.photo && <p className="upload-status">{uploadStatus.photo}</p>}
      </div>

      <h3>{userData?.fullName || 'Loading...'}</h3>
      <p>{userData?.workStatus === 'fresher' ? 'Fresher' : 'Experienced'}<br />
         {userData?.education || 'Complete your profile'}</p>
      
      <div className="resume-upload-section">
        <h4>Resume</h4>
        <label className="resume-upload-button">
          <FaUpload /> {userData?.resumeUrl ? 'Update Resume' : 'Upload Resume'}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              handleFileUpload('resume', e.target.files[0]);
              calculateProfileScore({ ...userData, resumeUrl: true });
            }}
            style={{ display: 'none' }}
          />
        </label>
        {userData?.resumeUrl && (
          <a href={userData.resumeUrl} target="_blank" rel="noopener noreferrer" className="view-resume-link">
            View Current Resume
          </a>
        )}
        {uploadStatus.resume && <p className="upload-status">{uploadStatus.resume}</p>}
      </div>
      
      {/* Profile Completion Score */}
      <div className="completion-score">
        <div className="score-circle" style={{
          background: `conic-gradient(#00d084 ${profileScore}%, #eee ${profileScore}% 100%)`
        }}>
          <span>{profileScore}%</span>
        </div>
        <p>Profile Completion</p>
      </div>

      <button 
        className="btn btn-primary"
        onClick={() => navigate('/profile-completion')}
      >
        {profileScore === 100 ? 'View Profile' : 'Complete Profile'}
      </button>
      
      <div className="stats">
        <div>
          <strong>{userData?.searchAppearances || '0'}</strong>
          <p>Search appearances</p>
        </div>
        <div>
          <strong>{userData?.recruiterActions || '0'}</strong>
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
