// AppliedJobs.jsx
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";

import {
  Search,
  Filter,
  CalendarCheck,
  RefreshCcw,
  MapPin,
  Briefcase,
  Heart,
  Moon,
  Sun,
  User,
} from "lucide-react";
import "./AppliedJobs.css";
import axios from "axios";

const AppliedJobs = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [location, setLocation] = useState("all");
  const [role, setRole] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteJobs, setFavoriteJobs] = useState(() => {
    const saved = localStorage.getItem("favoriteJobs");
    return saved ? JSON.parse(saved) : [];
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const jobsPerPage = 6;
  const [appliedJobs, setAppliedJobs] = useState(new Set()); // Set of jobIds applied by the user

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
  



// Fetch jobs applied by the user
// Inside the useEffect for fetching applied jobs
useEffect(() => {
  const userId = localStorage.getItem("userId");
  console.log("User ID:", userId); // Check if user ID is correct
  const fetchAppliedJobs = async () => {
    setLoading(true); // Set loading to true initially
    try {
      const response = await axios.get(`http://localhost:9091/api/applied-jobs/${userId}/applied`);
      console.log("Response from API:", response.data);
      setAppliedJobs(response.data); // Set the jobs
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      setError("Failed to fetch applied jobs");
      setLoading(false); // Set loading to false even in case of error
    }
  };

  fetchAppliedJobs();
}, []); // This effect runs once on component mount

useEffect(() => {
  console.log("Applied Jobs:", appliedJobs); // Log the applied jobs state after it gets set
}, [appliedJobs]); // This effect runs only once on component mount



// Empty dependency array means this effect runs only once when the component mounts



  useEffect(() => {
    localStorage.setItem("favoriteJobs", JSON.stringify(favoriteJobs));
  }, [favoriteJobs]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleFavorite = (id) => {
    setFavoriteJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  const openJobModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeJobModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const filteredJobs = jobs
    .filter((job) => {
      return (
        (filterStatus === "all" || job.status === filterStatus) &&
        (location === "all" || job.location === location) &&
        (role === "all" || job.role === role) &&
        (!favoritesOnly || favoriteJobs.includes(job.id)) &&
        (searchQuery === "" ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const uniqueLocations = ["all", ...new Set(jobs.map((job) => job.location))];
  const uniqueRoles = ["all", ...new Set(jobs.map((job) => job.role))];

  return (
    <div className={`applied-jobs-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Navbar */}
      <nav className="custom-navbar">
        <div className="nav-left">
          <h2 className="logo">JobPortal</h2>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/jobs">Jobs</a></li>
            <li><a href="/applied">Applied</a></li>
            <li><a href="/favorites">Favorites</a></li>
          </ul>
        </div>
        <div className="nav-right">
          <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="profile-icon">
            <User size={24} />
          </div>
        </div>
      </nav>

      {showSuccessMessage && (
        <div className="success-message">
          🎉 Congratulations! You successfully applied for this job.
        </div>
      )}

      {loading && <div className="loading-message">Loading your applications...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && (
        <>
          <div className="filters-wrapper">
            <div className="filters">
              <div className="filter-item">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search title/company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-item">
                <Filter size={16} />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="filter-item">
                <CalendarCheck size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="date">Sort by Date</option>
                </select>
              </div>
              <div className="filter-item">
                <MapPin size={16} />
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <Briefcase size={16} />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  {uniqueRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <Heart size={16} />
                <label>
                  <input
                    type="checkbox"
                    checked={favoritesOnly}
                    onChange={() => setFavoritesOnly(!favoritesOnly)}
                  />{" "}
                  Favorites
                </label>
              </div>
              <button
                className="reset-button"
                onClick={() => {
                  setFilterStatus("all");
                  setSortBy("date");
                  setLocation("all");
                  setRole("all");
                  setFavoritesOnly(false);
                  setSearchQuery("");
                }}
              >
                <RefreshCcw size={16} /> Reset
              </button>
            </div>
          </div>

          {/* Render Applied Jobs */}
          <div className={`applied-jobs-container ${darkMode ? "dark-mode" : ""}`}>
    {loading && <div className="loading-message">Loading your applications...</div>}
    {error && <div className="error-message">{error}</div>}
    {!loading && !error && (
      <div className="jobs-list">
        {appliedJobs.length === 0 ? (
          <div>No jobs applied yet!</div>
        ) : (
          appliedJobs.map((appliedJob) => {
            const { job, appliedDate, status } = appliedJob; // Destructure the nested job object
            return (
              <div key={job.id} className="job-card">
                <div className="card-header">
                  <h3>{job.title}</h3>
                  <Heart
                    className={`favorite-icon ${favoriteJobs.includes(job.id) ? "favorited" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(job.id);
                    }}
                  />
                </div>
                <p><strong>Company:</strong> {job.company}</p>
                <p className={`status ${status.toLowerCase()}`}><strong>Status:</strong> {status}</p>
                <p><strong>Date Applied:</strong> {new Date(appliedDate).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Role:</strong> {job.role}</p>
              </div>
            );
          })
        )}
      </div>
    )}
  </div>

        </>
      )}

      <Footer />
    </div>
  );
};

export default AppliedJobs;
