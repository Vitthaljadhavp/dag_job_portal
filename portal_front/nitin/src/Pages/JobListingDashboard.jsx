import React, { useState, useEffect } from "react";
import { Dropdown, Modal, Button, Card } from "react-bootstrap";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import save job icons
import moment from "moment"; // For calculating posting days
import "bootstrap/dist/css/bootstrap.min.css";
import "./JobListingDashboard.css";
import { Form } from "react-bootstrap";
import { Carousel } from "react-bootstrap"; // ✅ Import Bootstrap Carousel
import bannerImg1 from "../Assets/carousel-2.jpg";
import bannerImg2 from "../Assets/carousel-1.jpg";
import bannerImg3 from "../Assets/homebg1.jpg";
import { useNavigate } from "react-router-dom";

const JobListingDashboard = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [showEnquiry, setShowEnquiry] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (storedProfile) {
      setUserProfile(storedProfile);
    }
  }, []);

  // Fetch jobs from backend
  useEffect(() => {
    axios
      .get("http://localhost:9091/api/jobs") // Adjust URL based on your backend
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  // Detect scrolling for navbar transparency effect
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle Logout with Confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken"); // Clear JWT
      sessionStorage.clear(); // Clear session storage
      setTimeout(() => navigate("/login"), 500); // Smooth logout transition
    }
  };

  // Toggle Save Job
  const toggleSaveJob = (jobId) => {
    setSavedJobs((prevSaved) => {
      const newSaved = new Set(prevSaved);
      if (newSaved.has(jobId)) {
        newSaved.delete(jobId);
      } else {
        newSaved.add(jobId);
      }
      return newSaved;
    });
  };

  return (
    <div className="dashboard-container ">
      
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      {/* Left Side: Logo and Portal Name */}
      <div className="navbar-left">
        <div className="navbar-logo">
          <img src="/logo.png" alt="Logo" className="logo-img" />
          <span className="portal-name">DAG Job Portal</span>
        </div>
      </div>

      {/* Right Side: Logout Button
      <div className="navbar-right">
        <button className="logout-button btn" onClick={handleLogout}>
          Logout <i className="bi bi-box-arrow-right me-2"></i>
        </button>
      </div> */}


<Dropdown>
          <Dropdown.Toggle variant="light" id="profile-dropdown">
            <img
              src={userProfile?.profilePic || "/default-profile.png"}
              alt="Profile"
              className="rounded-circle"
              width="50"
              height="50"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
            <Dropdown.Item href="/applied-jobs">Applied Jobs</Dropdown.Item>
            <Dropdown.Item href="/saved-jobs">Saved Jobs</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setShowEnquiry(true)}>
              Enquiry/Help
            </Dropdown.Item>
            <Dropdown.Item href="/contact-us">Contact Us</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/login" onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </nav>
        


      {/* Banner Carousel (Bootstrap) */}
            <div className="banner-section">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" style={{height:"500px", width: "100%" , objectFit:"cover"}} src={bannerImg1} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" style={{height:"500px", width: "100%" , objectFit:"cover"}} src={bannerImg2} alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" style={{height:"500px", width: "100%" , objectFit:"cover"}} src={bannerImg3} alt="Third slide" />
          </Carousel.Item>
        </Carousel>
      
        {/* Banner Content */}
        <div className="banner-content">
          <h1>Welcome to DAG Job Portal</h1>
          <p>Your gateway to exciting job opportunities and career growth.</p>
          <div className="banner-buttons">
            <button className="btn btn-success me-2">Explore Jobs</button>
            <button className="btn btn-outline-light">Upload Resume</button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section text-center py-5 p-5">
        <h1>Find your dream job here</h1>
        <p>A thoughtful combination of design and function to support your career growth.</p>
        <div className="search-bar d-flex justify-content-center gap-3 mt-3">
          <Form.Control type="text" placeholder="Location" className="search-input" />
          <Form.Control type="text" placeholder="Job Type" className="search-input" />
          <Button variant="success">Search</Button>
        </div>
      </div>

      {/* Popular Search Section */}
      <div className="popular-search-section mt-5 ">
        <h3 className="text-center">Popular Search</h3>
        <div className="d-flex justify-content-center gap-4 mt-3">
          {/* Job Listings */}
      <div className="job-list mt-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="job-card">
              <Card.Body>
                {/* Save Job Icon */}
                <div className="save-icon" onClick={() => toggleSaveJob(job.id)}>
                  {savedJobs.has(job.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                </div>

                <h5 className="job-title">{job.title}</h5>
                <p className="job-company">{job.companyName}</p>
                <p className="job-location">📍 {job.location}</p>
                
                {/* Job Type, Mode & Status */}
                <p className="job-info">
                  <strong>Type:</strong> {job.jobType} | 
                  <strong> Mode:</strong> {job.jobMode} |
                  <strong> Status:</strong> {job.status}
                </p>

                {/* Salary */}
                <p className="job-salary">💰 Salary: {job.salary || "Not Disclosed"}</p>

                {/* Skills Required */}
                <p className="job-skills">
                  <strong>Skills:</strong> {job.skills ? job.skills.join(", ") : "N/A"}
                </p>

                {/* Posting Days Calculation */}
                <p className="job-posted">
                  🕒 Posted {moment(job.postedDate).fromNow()}
                </p>

                <p className="job-description">{job.description.slice(0, 100)}...</p>
                <Button variant="primary">Apply Now</Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No job postings available.</p>
        )}
      </div>
        </div>
      </div>

      <Modal show={showEnquiry} onHide={() => setShowEnquiry(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enquiry Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label className="form-label">Your Message</label>
              <textarea className="form-control" rows="4" placeholder="Write your enquiry here..."></textarea>
            </div>
            <Button variant="primary" onClick={() => setShowEnquiry(false)}>
              Submit
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default JobListingDashboard;
