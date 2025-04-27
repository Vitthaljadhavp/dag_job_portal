import React, { useState, useEffect } from "react";
import { Dropdown, Modal, Button, Card } from "react-bootstrap";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import save job icons
import moment from "moment"; // For calculating posting days
import { InputGroup } from "react-bootstrap";
import { FaMapMarkerAlt, FaBriefcase, FaSearch } from "react-icons/fa";
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
    const [filteredJobs, setFilteredJobs] = useState([]); // Store filtered jobs
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState(new Set()); // Track applied jobs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

    // Search & Filter State
    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [selectedJobType, setSelectedJobType] = useState("");
    
    // 🔹 Function to filter jobs
    const filterJobs = () => {
      let sourceJobs = jobs.length > 0 ? jobs : []; // If jobs are empty, return empty array
      
      let filtered = sourceJobs.filter(job =>
        job.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        job.location.toLowerCase().includes(searchLocation.toLowerCase()) &&
        (selectedJobType ? job.jobType === selectedJobType : true)
      );
      setFilteredJobs(filtered);
    };

    // Function to Filter Jobs Dynamically
    useEffect(() => {
      const filtered = jobs.filter(job =>
        (job.title?.toLowerCase() || "").includes(searchTitle.toLowerCase()) &&
        (job.location?.toLowerCase() || "").includes(searchLocation.toLowerCase()) &&
        (selectedJobType ? job.jobType === selectedJobType : true)
      );  
      setFilteredJobs(filtered);
    }, [searchTitle, searchLocation, selectedJobType, jobs]); // Runs when any of these change


    // 🔹 Automatically filter jobs when search inputs change
    useEffect(() => {
      filterJobs();
    }, [searchTitle, searchLocation, selectedJobType]);

    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
        if (storedProfile) {
          setUserProfile(storedProfile);
        }
     }, []);

    // Fetch jobs from backend
    useEffect(() => {
        axios.get("http://localhost:9091/api/jobs")
          .then(response => {
            setJobs(response.data);
            setFilteredJobs(response.data.length > 0 ? response.data : []); // Show empty array if API returns no jobs
          })
          .catch(error => {
            console.error("Error fetching jobs:", error);
            setFilteredJobs([]); // If API fails, show empty jobs array
          });
    }, []); // Empty dependency array to run once on mount

    // Detect scrolling for navbar transparency effect
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {                                         // Check authentication on mount
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found. Redirecting to login...");
        navigate("/login");
      } else {
        console.log("Token found. User is authenticated.");
        setCheckingAuth(false);
      }
    }, [navigate]);

    if (checkingAuth) {
      return null;
    }

    const handleLogout = () => {                              // HANDLE LOGOUT
      console.log("Logout initiated...");

      const confirmLogout = window.confirm("Are you sure you want to log out?");
      console.log("User confirmation for logout:", confirmLogout);

      if (confirmLogout) {
        console.log("Clearing localStorage and sessionStorage...");
        
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("isProfileComplete");
        sessionStorage.clear();

        setLoggedIn(false);
        console.log("Logged out from state.");

        console.log("Redirecting to login page...");
        navigate("/login");

        // Hard reload to prevent back button cache
        setTimeout(() => {
          window.location.reload();
          console.log("Page reloaded after logout.");
        }, 300);
      } else {
        console.log("Logout cancelled by user.");
      }
    };

    const toggleSaveJob = (jobId) => {                            // Toggle Save Job
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

    const API = axios.create({
      baseURL: 'http://localhost:9091/api',
    });
    
    // If you are using JWT token authentication, add token here
    API.interceptors.request.use((config) => {
      const token = localStorage.getItem('token'); // adjust based on your token storage
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle job application
    const applyToJob = async (jobId) => {
      try {
        const response = await API.post(`/applied-jobs/apply/${jobId}`);
        alert('Applied successfully!');
        setAppliedJobs((prevApplied) => new Set(prevApplied.add(jobId)));
      } catch (error) {
        console.error('Error applying for job:', error);
        alert(error.response?.data?.message || 'Failed to apply!');
      }
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
            <Dropdown.Item href="/job-seeker-dashboard">My Profile</Dropdown.Item>
            <Dropdown.Item href="/AppliedJobs">Applied Jobs</Dropdown.Item>
            <Dropdown.Item href="/saved-jobs">Saved Jobs</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setShowEnquiry(true)}>
              Enquiry/Help
            </Dropdown.Item>
            <Dropdown.Item href="/contact-us">Contact Us</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
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
            <button className="btn btn-success me-2" >Explore Jobs</button>
            <button className="btn btn-outline-light" onClick={() => navigate("/job-seeker-dashboard")}>
      Upload Resume
    </button>
          </div>
        </div>
      </div>


        {/* Hero Section */}
    <div className="hero-section text-center py-5 px-5">
      <h1>Find Your Dream Job Here</h1>
      <p>A thoughtful combination of design and function to support your career growth.</p>

      {/* Search Filters */}
      <div className="container mt-4" style={{ border: "1px dotted black" }}>
        <div className="row justify-content-center align-items-center g-2">
          
          {/* Job Title Input */}
          <div className="col-md-3">
            <InputGroup className="search-input">
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Job Title (e.g. Software Engineer)"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Location Input */}
          <div className="col-md-3">
            <InputGroup className="search-input">
              <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Job Type Dropdown */}
          <div className="col-md-3">
            <InputGroup className="search-input">
              <InputGroup.Text><FaBriefcase /></InputGroup.Text>
              <Dropdown onSelect={(jobType) => setSelectedJobType(jobType)}>
                <Dropdown.Toggle variant="light" id="jobTypeDropdown" style={{ marginBottom: "15px", border: "0.01px solid black" }}>
                  {selectedJobType || "Select Job Type"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="">All</Dropdown.Item>
                  <Dropdown.Item eventKey="Full-time">Full-time</Dropdown.Item>
                  <Dropdown.Item eventKey="Part-time">Part-time</Dropdown.Item>
                  <Dropdown.Item eventKey="Internship">Internship</Dropdown.Item>
                  <Dropdown.Item eventKey="Contract">Contract</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </InputGroup>
          </div>

           {/* 🔍 Search Button */}
        <div className="col-md-2">
          <Button variant="success" className="w-100" onClick={filterJobs}>Search</Button>
        </div>

        </div>
      </div>
    </div>

      {/* 🔹 Job Listings Section */}
    <div className="popular-title">
      <h3 className="text-center">Popular Search</h3>
      <div className="d-flex justify-content-center gap-4 m-5">
        <div className="job-list mt-4">
        {filteredJobs.length > 0 ? (
  filteredJobs.map((job) => (
    <div key={job.id} className="col-md-4 mb-4">
      <Card className="job-card">
        <Card.Body>
          <h5 className="job-title">{job.title}</h5>
          <p className="job-company">{job.company}</p>
          <p className="job-location">📍 {job.location}</p>
          <p className="job-mode">📍 {job.mode}</p>
          <p className="job-salary">📍 {job.salary}</p>
          <p className="job-status">📍 {job.status}</p>
          <p className="job-description">📍 {job.description}</p>          
          <p className="job-deadline">📍 {job.deadline}</p>
          
          

          <Button
            variant="primary"
            onClick={() => applyToJob(job.id)}
            disabled={appliedJobs.has(job.id)}
          >
            {appliedJobs.has(job.id) ? 'Applied' : 'Apply Now'}
          </Button>
        </Card.Body>
      </Card>
    </div>
  ))
) : (
  <p>No jobs available based on your search criteria.</p>
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
