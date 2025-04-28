// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Table, Button, Badge, Modal, Form, Dropdown } from 'react-bootstrap';
// import axios from 'axios';
// import { Carousel } from "react-bootstrap"; // ✅ Import Bootstrap Carousel
// import bannerImg1 from "../Assets/carousel-2.jpg";
// import bannerImg2 from "../Assets/carousel-1.jpg";
// import bannerImg3 from "../Assets/homebg1.jpg";
// import { useNavigate } from "react-router-dom";
// import "./RecruiterDashboard.css";
// import Footer from "../components/Footer";


// const RecruiterDashboard = () => {
//   const navigate = useNavigate();
//   const [showEnquiry, setShowEnquiry] = useState(false);
//     const [userProfile, setUserProfile] = useState(null);
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [jobs, setJobs] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedJob, setSelectedJob] = useState(null);
//     const [job, setJob] = useState({
//       title: "",
//       company: "",
//       location: "",
//       type: "",
//       mode: "",
//       salary: "",
//       skills: "",
//       description: "",
//       deadline: "",
//       status:""
//     });
  
//     // Handle input change
//     const handleChange = (e) => {
//       setJob({
//         ...job,
//         [e.target.name]: e.target.value,
//       });
//     };
  
//     // Handle form submission
//     const handleSubmit = async (e) => {
//       e.preventDefault();
    
//       const jobData = {
//         ...job,
//         salary: job.salary ? Number(job.salary) : 0, // Ensure salary is a number
//         type: job.type || "Not specified",
//         mode: job.mode || "Not specified",
//         status: job.status || "Open",
//         skills: job.skills ? job.skills.split(",").map(skill => skill.trim()) : [], // Convert skills to array
//       };
    
//       console.log("Sending job data:", JSON.stringify(jobData, null, 2));
    
//       try {
//         const response = await axios.post("http://localhost:9091/api/jobs/postJob", jobData, {
//           headers: { "Content-Type": "application/json" },
//         });
    
//         console.log("Response from server:", response.data);
//         alert("Job posted successfully!");
//       } catch (error) {
//         console.error("Error posting job:", error.response?.data || error.message);
//         alert(`Failed to post job: ${error.response?.data?.message || error.message}`);
//       }
//     };
  

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const response = await axios.get(`http://localhost:9091/api/jobs`);
//       setJobs(response.data);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     }
//   };

//   const handleEdit = (job) => {
//     setSelectedJob(job);
//     setShowModal(true);
//   };

//   const handleDelete = async (jobId) => {
//     if (window.confirm("Are you sure you want to delete this job?")) {
//       try {
//         await axios.delete(`http://localhost:9091/api/jobs/${jobId}`);
//         fetchJobs();
//       } catch (error) {
//         console.error("Error deleting job:", error);
//       }
//     }
//   };

//   const handleSaveChanges = async () => {
//     try {
//       await axios.put(`http://localhost:9091/api/jobs/${selectedJob.id}`, selectedJob, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       fetchJobs();
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error updating job:", error);
//     }
//   };



//   const handleStatusChange = async (jobId, status) => {
//     try {
//       await axios.put(`http://localhost:9091/api/jobs/${jobId}`, { status }, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       fetchJobs();
//     } catch (error) {
//       console.error("Error updating job status:", error);
//     }
//   };

//   // Detect scrolling for navbar transparency effect
//     useEffect(() => {
//       const handleScroll = () => {
//         setIsScrolled(window.scrollY > 50);
//       };
//       window.addEventListener("scroll", handleScroll);
//       return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//    // Handle Logout with Confirmation
//    const handleLogout = () => {
//     const confirmLogout = window.confirm("Are you sure you want to log out?");
//     if (confirmLogout) {
//       localStorage.removeItem("authToken"); // Clear JWT
//       sessionStorage.clear(); // Clear session storage
//       setTimeout(() => navigate("/login"), 500); // Smooth logout transition
//     }
//   };

//   return (

//     <div>
  
//     <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
//       {/* Left Side: Logo and Portal Name */}
//       <div className="navbar-left">
//         <div className="navbar-logo">
//           <img src="/logo.png" alt="Logo" className="logo-img" />
//           <span className="portal-name">DAG Job Portal</span>
//         </div>
//       </div>

//       <Dropdown>
//         <Dropdown.Toggle variant="light" id="profile-dropdown">
//           <img
//             src={userProfile?.profilePic || "/default-profile.png"}
//             alt="Profile"
//             className="rounded-circle"
//             width="50"
//             height="50"
//           />
//         </Dropdown.Toggle>
//         <Dropdown.Menu align="end">
//           <Dropdown.Item>My Profile</Dropdown.Item>
//           <Dropdown.Item onClick={() => navigate("/ApplicationInsights")}> Applicantion Insights </Dropdown.Item>
//           <Dropdown.Divider />
//           <Dropdown.Item onClick={() => setShowEnquiry(true)}>
//             Enquiry/Help
//           </Dropdown.Item>
//           <Dropdown.Item href="/contact-us">Contact Us</Dropdown.Item>
//           <Dropdown.Divider />
//           <Dropdown.Item href="/login" onClick={handleLogout}>Logout</Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>
//     </nav>

//     {/* Banner Carousel (Bootstrap) */}
//     <div className="banner-section">
//       <Carousel>
//         <Carousel.Item>
//           <img className="d-block w-100" style={{height:"500px", width: "100%" , objectFit:"cover"}} src={bannerImg1} alt="First slide" />
//         </Carousel.Item>
//         <Carousel.Item>
//           <img className="d-block w-100" style={{height:"500px", width: "100%" , objectFit:"cover"}} src={bannerImg2} alt="Second slide" />
//         </Carousel.Item>
//         <Carousel.Item>
//           <img className="d-block w-100" style={{height:"500px", width: "100%" , objectFit:"cover"}} src={bannerImg3} alt="Third slide" />
//         </Carousel.Item>
//       </Carousel>
          
//       {/* Banner Content */}
//       <div className="banner-content">
//         <h1>Welcome to DAG Recruiter Dashboard</h1>
//         <p>Find top talent and manage your job postings efficiently.</p>
//         <div className="banner-buttons">
//           {/* Post a Job Button */}
//           <button className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#postJobModal">
//             Post a Job
//           </button>

//           {/* View Posted Jobs Button */}
//           <button className="btn btn-outline-light" onClick={() => navigate("/recruiter-job-list")}>
//             View Posted Jobs
//           </button>
//         </div>
//       </div>
//     </div>
  
    
    
//     <div className="container mt-4">
//       <h2>Recruiter Dashboard</h2>
//       {/* Add Job Button */}
//       <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#postJobModal">
//         Post a Job
//       </button>

//       {/* Post Job Modal */}
//       <div className="modal fade" id="postJobModal" tabIndex="-1" aria-labelledby="postJobModalLabel" aria-hidden="true">
//         <div className="modal-dialog modal-lg">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="postJobModalLabel">Post a Job</h5>
//               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <div className="modal-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label">Job Title</label>
//                   <input type="text" className="form-control" name="title" value={job.title} onChange={handleChange} required />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Company Name</label>
//                   <input type="text" className="form-control" name="company" value={job.company} onChange={handleChange} required />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Location</label>
//                   <input type="text" className="form-control" name="location" value={job.location} onChange={handleChange} required />
//                 </div>
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Job Type</label>
//                     <select className="form-control" name="type" value={job.type} onChange={handleChange}>
//                       <option>Full-time</option>
//                       <option>Part-time</option>
//                       <option>Internship</option>
//                     </select>
//                   </div>
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Mode</label>
//                     <select className="form-control" name="mode" value={job.mode} onChange={handleChange}>
//                       <option>On-site</option>
//                       <option>Remote</option>
//                       <option>Hybrid</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Salary Range</label>
//                   <input type="text" className="form-control" name="salary" value={job.salary} onChange={handleChange} required />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Skills Required (comma separated)</label>
//                   <input type="text" className="form-control" name="skills" value={job.skills} onChange={handleChange} required />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Job Description</label>
//                   <textarea className="form-control" name="description" value={job.description} onChange={handleChange} required></textarea>
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Application Deadline</label>
//                   <input type="date" className="form-control" name="deadline" value={job.deadline} onChange={handleChange} required />
//                 </div>
//                 <div className="row">
//                   <div className="col-md-6 mb-3">
//                     <label className="form-label">Job Status</label>
//                     <select className="form-control" name="status" value={job.status} onChange={handleChange}>
//                       <option>Open</option>
//                       <option>Close</option>
//                     </select>
//                   </div>
//                   </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                   <button type="submit" className="btn btn-primary">Post Job</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Manage Jobs Section */}
//       <div className="mt-4">
//         <h4>Manage Jobs</h4>
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Company</th>
//               <th>Location</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {jobs.map((job) => (
//               <tr key={job.id}>
//                 <td>{job.title}</td>
//                 <td>{job.company}</td>
//                 <td>{job.location}</td>
//                 <td>
//                   <Badge bg={job.status === 'Open' ? 'success' : 'danger'}>
//                     {job.status}
//                   </Badge>
//                 </td>
//                 <td>
//                   <Button variant='primary' onClick={() => handleEdit(job)}>Edit</Button>{' '}
//                   <Button variant='danger' onClick={() => handleDelete(job.id)}>Delete</Button>{' '}
//                   <Button variant='warning' onClick={() => handleStatusChange(job.id, 'Closed')}>
//                     Close Job
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </div>

//     {/* Edit Job Modal */}
//     {selectedJob && (
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Job</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Title</Form.Label>
//               <Form.Control type='text' value={selectedJob.title} onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Company</Form.Label>
//               <Form.Control type='text' value={selectedJob.company} onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })} />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Location</Form.Label>
//               <Form.Control type='text' value={selectedJob.location} onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant='secondary' onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant='success' onClick={handleSaveChanges}>Save Changes</Button>
//         </Modal.Footer>
//       </Modal>
//     )}
    
//     <Footer />
//     </div>
//   );
// };

// export default RecruiterDashboard;




































import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Badge, Modal, Form, Dropdown, Card, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { Carousel } from "react-bootstrap";
import bannerImg1 from "../Assets/carousel-2.jpg";
import bannerImg2 from "../Assets/carousel-1.jpg";
import bannerImg3 from "../Assets/homebg1.jpg";
import { useNavigate } from "react-router-dom";
import "./RecruiterDashboard.css";
import Footer from "../components/Footer";
import { FiEdit, FiTrash2, FiEye, FiCalendar, FiDollarSign, FiMapPin, FiBriefcase, FiClock } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    interviews: 0
  });

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    mode: "",
    salary: "",
    skills: "",
    description: "",
    deadline: "",
    status: "Open"
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const jobData = {
      ...job,
      salary: job.salary ? Number(job.salary) : 0,
      type: job.type || "Not specified",
      mode: job.mode || "Not specified",
      status: job.status || "Open",
      skills: job.skills ? job.skills.split(",").map(skill => skill.trim()) : [],
    };
  
    try {
      const response = await axios.post("http://localhost:9091/api/jobs/postJob", jobData, {
        headers: { "Content-Type": "application/json" },
      });
      fetchJobs();
      fetchStats();
      document.getElementById('closePostJobModal').click();
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error.response?.data || error.message);
      alert(`Failed to post job: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`http://localhost:9091/api/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchStats = async () => {
    // In a real app, you would fetch these from your API
    setStats({
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.status === 'Open').length,
      applications: 42, // Mock data
      interviews: 8 // Mock data
    });
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:9091/api/jobs/${jobId}`);
        fetchJobs();
        fetchStats();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:9091/api/jobs/${selectedJob.id}`, selectedJob, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchJobs();
      fetchStats();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleStatusChange = async (jobId, status) => {
    try {
      await axios.put(`http://localhost:9091/api/jobs/${jobId}`, { status }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchJobs();
      fetchStats();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      sessionStorage.clear();
      setTimeout(() => navigate("/login"), 500);
    }
  };
  

  return (
    <div className="recruiter-dashboard">
      {/* Navigation Bar */}
      <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-left">
          <div className="navbar-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="portal-name">DAG Job Portal</span>
          </div>
        </div>

        <div className="navbar-center">
          <Button variant="outline-light" className="mx-2" onClick={() => navigate("/recruiter-dashboard")}>
            Dashboard
          </Button>
          <Button variant="outline-light" className="mx-2" onClick={() => navigate("/recruiter-job-list")}>
            Job Listings
          </Button>
          <Button variant="outline-light" className="mx-2" onClick={() => navigate("/ApplicationInsights")}>
            Analytics
          </Button>
        </div>

        <Dropdown>
          <Dropdown.Toggle variant="light" id="profile-dropdown">
            <img
              src={userProfile?.profilePic || "/default-profile.png"}
              alt="Profile"
              className="rounded-circle"
              width="40"
              height="40"
            />
            <span className="ms-2 d-none d-md-inline">Swapnil</span>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item>My Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/ApplicationInsights")}>Application Insights</Dropdown.Item>
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

      {/* Banner Carousel */}
      <div className="banner-section">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" style={{height:"400px", objectFit:"cover"}} src={bannerImg1} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" style={{height:"400px", objectFit:"cover"}} src={bannerImg2} alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" style={{height:"400px", objectFit:"cover"}} src={bannerImg3} alt="Third slide" />
          </Carousel.Item>
        </Carousel>
            
        <div className="banner-content">
          <h1>Welcome to DAG Recruiter Dashboard</h1>
          <p>Find top talent and manage your job postings efficiently.</p>
          <div className="banner-buttons">
            <Button variant="success" className="me-2" data-bs-toggle="modal" data-bs-target="#postJobModal">
              Post a Job
            </Button>
            <Button variant="outline-light" onClick={() => navigate("/recruiter-job-list")}>
              View Posted Jobs
            </Button>
          </div>
        </div>
      </div>
    
      {/* Main Content */}
      <Container className="mt-4">
        {/* Stats Cards
        /* <Row className="mb-4">
          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Total Jobs</Card.Title>
                <Card.Text className="stat-number">{stats.totalJobs}</Card.Text>
                <ProgressBar now={(stats.totalJobs / 20) * 100} variant="info" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Active Jobs</Card.Title>
                <Card.Text className="stat-number">{stats.activeJobs}</Card.Text>
                <ProgressBar now={(stats.activeJobs / stats.totalJobs) * 100 || 0} variant="success" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Applications</Card.Title>
                <Card.Text className="stat-number">{stats.applications}</Card.Text>
                <ProgressBar now={(stats.applications / 100) * 100} variant="primary" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="stat-card">
              <Card.Body>
                <Card.Title>Interviews</Card.Title>
                <Card.Text className="stat-number">{stats.interviews}</Card.Text>
                <ProgressBar now={(stats.interviews / 20) * 100} variant="warning" />
              </Card.Body>
            </Card>
          </Col>
        </Row> */ }





        {/* Recent Activity */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5>Recent Job Postings</h5>
                <Button variant="primary" size="sm" onClick={() => navigate("/recruiter-job-list")}>
                  View All
                </Button>
              </Card.Header>
              <Card.Body>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.slice(0, 5).map((job) => (
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>{job.company}</td>
                        <td>
                          <Badge bg={job.status === 'Open' ? 'success' : 'danger'}>
                            {job.status}
                          </Badge>
                        </td>
                        <td>
                          <Button variant="link" size="sm" onClick={() => handleEdit(job)}>
                            <FiEdit />
                          </Button>
                          <Button variant="link" size="sm" onClick={() => handleDelete(job.id)}>
                            <FiTrash2 />
                          </Button>
                          <Button variant="link" size="sm" onClick={() => navigate(`/job-details/${job.id}`)}>
                            <FiEye />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Quick Links Sidebar */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>
                <h5>Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <Button variant="outline-primary" className="w-100 mb-2" data-bs-toggle="modal" data-bs-target="#postJobModal">
                  Post New Job
                </Button>
                <Button variant="outline-secondary" className="w-100 mb-2" onClick={() => navigate("/candidate-pool")}>
                  View Candidate Pool
                </Button>
                <Button variant="outline-success" className="w-100 mb-2" onClick={() => navigate("/schedule-interview")}>
                  Schedule Interview
                </Button>
              </Card.Body>
            </Card>

            {/* <Card className="mb-4">
              <Card.Header>
                <h5>Quick Links</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="link" className="text-start">Help Center</Button>
                  <Button variant="link" className="text-start">Terms & Conditions</Button>
                  <Button variant="link" className="text-start">Privacy Policy</Button>
                  <Button variant="link" className="text-start" onClick={() => setShowEnquiry(true)}>
                    Contact Support
                  </Button>
                </div>
              </Card.Body>
            </Card> */}

            {/* <Card>
              <Card.Header>
                <h5>Follow Us</h5>
              </Card.Header>
              <Card.Body className="text-center">
                <Button variant="link" className="social-icon">
                  <FaLinkedin size={24} />
                </Button>
                <Button variant="link" className="social-icon">
                  <FaTwitter size={24} />
                </Button>
                <Button variant="link" className="social-icon">
                  <FaFacebook size={24} />
                </Button>
              </Card.Body>
            </Card> */}
          </Col>
        </Row>

        {/* All Jobs Section */}
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>Manage All Jobs</h5>
            <div>
              <Button variant="primary" size="sm" className="me-2" data-bs-toggle="modal" data-bs-target="#postJobModal">
                Post Job
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => navigate("/recruiter-job-list")}>
                View All
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td><FiMapPin className="me-1" />{job.location}</td>
                    <td><FiBriefcase className="me-1" />{job.type}</td>
                    <td>
                      <Badge bg={job.status === 'Open' ? 'success' : 'danger'}>
                        {job.status}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(job)}>
                        <FiEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" className="me-1" onClick={() => handleDelete(job.id)}>
                        <FiTrash2 />
                      </Button>
                      {job.status === 'Open' ? (
                        <Button variant="outline-warning" size="sm" onClick={() => handleStatusChange(job.id, 'Closed')}>
                          Close
                        </Button>
                      ) : (
                        <Button variant="outline-success" size="sm" onClick={() => handleStatusChange(job.id, 'Open')}>
                          Reopen
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Post Job Modal */}
      <div className="modal fade" id="postJobModal" tabIndex="-1" aria-labelledby="postJobModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="postJobModalLabel">Post a New Job</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Title *</Form.Label>
                      <Form.Control type="text" name="title" value={job.title} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name *</Form.Label>
                      <Form.Control type="text" name="company" value={job.company} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location *</Form.Label>
                      <Form.Control type="text" name="location" value={job.location} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Salary Range</Form.Label>
                      <Form.Control type="text" name="salary" value={job.salary} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Type</Form.Label>
                      <Form.Select name="type" value={job.type} onChange={handleChange}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                        <option>Temporary</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Work Mode</Form.Label>
                      <Form.Select name="mode" value={job.mode} onChange={handleChange}>
                        <option>On-site</option>
                        <option>Remote</option>
                        <option>Hybrid</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Skills Required (comma separated)</Form.Label>
                  <Form.Control type="text" name="skills" value={job.skills} onChange={handleChange} placeholder="e.g. JavaScript, React, Node.js" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Job Description *</Form.Label>
                  <Form.Control as="textarea" rows={5} name="description" value={job.description} onChange={handleChange} required />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Application Deadline</Form.Label>
                      <Form.Control type="date" name="deadline" value={job.deadline} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Job Status</Form.Label>
                      <Form.Select name="status" value={job.status} onChange={handleChange}>
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closePostJobModal">Close</button>
                  <button type="submit" className="btn btn-primary">Post Job</button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      {selectedJob && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Job: {selectedJob.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={selectedJob.title} onChange={(e) => setSelectedJob({ ...selectedJob, title: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company</Form.Label>
                    <Form.Control type="text" value={selectedJob.company} onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })} />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" value={selectedJob.location} onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={selectedJob.status} onChange={(e) => setSelectedJob({ ...selectedJob, status: e.target.value })}>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={4} value={selectedJob.description} onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
      
      <Footer />
    </div>
  );
};

export default RecruiterDashboard;