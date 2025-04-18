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

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await axios.get("http://localhost:9091/api/applied-jobs/user/1");
        const appliedJobs = response.data;

        const transformedJobs = appliedJobs.map((job) => ({
          id: job.id,
          title: job.job.title,
          company: job.job.company,
          status: job.status,
          date: new Date(job.appliedDate).toISOString().split("T")[0],
          location: job.job.location,
          role: job.job.tittle || "N/A",
        }));

        setJobs(transformedJobs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch applied jobs");
        setLoading(false);
        console.error("Error fetching applied jobs:", err);
      }
    };

    fetchAppliedJobs();
  }, []);

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

          <div className="jobs-list">
            {paginatedJobs.map((job) => (
              <div key={job.id} className="job-card" onClick={() => openJobModal(job)}>
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
                <p className={`status ${job.status.toLowerCase()}`}><strong>Status:</strong> {job.status}</p>
                <p><strong>Date Applied:</strong> {job.date}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Role:</strong> {job.role}</p>
              </div>
            ))}
          </div>

          <div className="pagination-controls">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              ⬅️ Prev
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev * jobsPerPage < filteredJobs.length ? prev + 1 : prev
                )
              }
              disabled={currentPage * jobsPerPage >= filteredJobs.length}
            >
              Next ➡️
            </button>
          </div>

          {/* Job Details Modal */}
          {isModalOpen && selectedJob && (
            <div className="modal-overlay" onClick={closeJobModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={closeJobModal}>
                  ×
                </button>
                <h3>{selectedJob.title}</h3>
                <p><strong>Company:</strong> {selectedJob.company}</p>
                <p><strong>Status:</strong> {selectedJob.status}</p>
                <p><strong>Date Applied:</strong> {selectedJob.date}</p>
                <p><strong>Location:</strong> {selectedJob.location}</p>
                <p><strong>Role:</strong> {selectedJob.role}</p>
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
};

export default AppliedJobs;
