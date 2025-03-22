import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Modal, Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { Carousel } from "react-bootstrap"; // ✅ Import Bootstrap Carousel
import bannerImg1 from "../Assets/carousel-2.jpg";
import bannerImg2 from "../Assets/carousel-1.jpg";
import bannerImg3 from "../Assets/homebg1.jpg";
import { useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";
import Footer from "../components/Footer";


const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [showEnquiry, setShowEnquiry] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    mode: "On-site",
    salary: "",
    skills: "",
    description: "",
    deadline: "",
    status: "Open",
  });
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("authToken"); // Retrieve the JWT token
    
    if (!token) {
      alert("You must be logged in to post a job.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:9091/api/jobs",
        job,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Job Posted:", response.data);
      fetchJobs(); // Refresh job list
      setShowModal(false); // Close modal after submission
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Please try again.");
    }
  };
  
  

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:9091/api/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(`http://localhost:9091/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:9091/api/jobs/${selectedJob.id}`, selectedJob, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchJobs();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };



  const handleStatusChange = async (jobId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(`http://localhost:9091/api/jobs/${jobId}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

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

  return (

    <div>
  
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
        <h1>Welcome to DAG Recruiter Dashboard</h1>
        <p>Find top talent and manage your job postings efficiently.</p>
        <div className="banner-buttons">
          {/* Post a Job Button */}
          <button className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#postJobModal">
            Post a Job
          </button>

          {/* View Posted Jobs Button */}
          <button className="btn btn-outline-light" onClick={() => navigate("/recruiter-job-list")}>
            View Posted Jobs
          </button>
        </div>
      </div>
    </div>
  
    
    
    <div className="container mt-4">
      <h2>Recruiter Dashboard</h2>
      {/* Add Job Button */}
      <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#postJobModal">
        Post a Job
      </button>

      {/* Post Job Modal */}
      <div className="modal fade" id="postJobModal" tabIndex="-1" aria-labelledby="postJobModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="postJobModalLabel">Post a Job</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Job Title</label>
                  <input type="text" className="form-control" name="title" value={job.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" name="company" value={job.company} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" name="location" value={job.location} onChange={handleChange} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Job Type</label>
                    <select className="form-control" name="type" value={job.type} onChange={handleChange}>
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Mode</label>
                    <select className="form-control" name="mode" value={job.mode} onChange={handleChange}>
                      <option>On-site</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Salary Range</label>
                  <input type="text" className="form-control" name="salary" value={job.salary} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Skills Required (comma separated)</label>
                  <input type="text" className="form-control" name="skills" value={job.skills} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Job Description</label>
                  <textarea className="form-control" name="description" value={job.description} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Application Deadline</label>
                  <input type="date" className="form-control" name="deadline" value={job.deadline} onChange={handleChange} required />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Post Job</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Jobs Section */}
      <div className="mt-4">
        <h4>Manage Jobs</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.location}</td>
                <td>
                  <Badge bg={job.status === 'Open' ? 'success' : 'danger'}>
                    {job.status}
                  </Badge>
                </td>
                <td>
                  <Button variant='primary' onClick={() => handleEdit(job)}>Edit</Button>{' '}
                  <Button variant='danger' onClick={() => handleDelete(job.id)}>Delete</Button>{' '}
                  <Button variant='warning' onClick={() => handleStatusChange(job.id, 'Closed')}>
                    Close Job
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>

    {/* Edit Job Modal */}
    {selectedJob && (
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type='text' value={selectedJob.title} onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Company</Form.Label>
              <Form.Control type='text' value={selectedJob.company} onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control type='text' value={selectedJob.location} onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowModal(false)}>Close</Button>
          <Button variant='success' onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    )}
    
    <Footer />
    </div>
  );
};

export default RecruiterDashboard;

