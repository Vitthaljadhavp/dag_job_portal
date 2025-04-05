// AppliedJobs.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Search,
  Filter,
  CalendarCheck,
  RefreshCcw,
  MapPin,
  Briefcase,
  Heart,
} from "lucide-react";
import "./AppliedJobs.css";

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
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;

  const jobs = [
    { id: 1, title: "Frontend Developer", company: "Apple", status: "Pending", date: "2025-04-02", location: "Remote", role: "Engineering" },
    { id: 2, title: "Software Engineer", company: "Google", status: "Pending", date: "2025-04-01", location: "Remote", role: "Engineering" },
    { id: 3, title: "Backend Developer", company: "Facebook", status: "Pending", date: "2025-03-29", location: "Pune", role: "Engineering" },
    { id: 4, title: "UI/UX Designer", company: "Adobe", status: "Accepted", date: "2025-03-28", location: "Bangalore", role: "Design" },
    { id: 5, title: "Product Manager", company: "Amazon", status: "Rejected", date: "2025-03-25", location: "Hyderabad", role: "Management" },
    { id: 6, title: "QA Engineer", company: "Microsoft", status: "Pending", date: "2025-03-24", location: "Remote", role: "Engineering" },
    { id: 7, title: "DevOps Engineer", company: "Netflix", status: "Accepted", date: "2025-03-22", location: "Mumbai", role: "Infrastructure" },
    { id: 8, title: "Marketing Specialist", company: "Spotify", status: "Pending", date: "2025-03-20", location: "Delhi", role: "Marketing" },
    { id: 9, title: "HR Coordinator", company: "LinkedIn", status: "Rejected", date: "2025-03-18", location: "Bangalore", role: "HR" },
    { id: 10, title: "Full Stack Developer", company: "Twitter", status: "Pending", date: "2025-03-15", location: "Chennai", role: "Engineering" },
  ];

  useEffect(() => {
    localStorage.setItem("favoriteJobs", JSON.stringify(favoriteJobs));
  }, [favoriteJobs]);

  const toggleFavorite = (id) => {
    setFavoriteJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  const handleApplyNow = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
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
        (searchQuery === "" || job.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const uniqueLocations = ["all", ...new Set(jobs.map(job => job.location))];
  const uniqueRoles = ["all", ...new Set(jobs.map(job => job.role))];

  return (
    <div className={`applied-jobs-container ${darkMode ? "dark-mode" : ""}`}>
      <Navbar />
      <h2 className="section-title">Application Insights</h2>

      <button onClick={() => setDarkMode(!darkMode)} className="dark-toggle">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {showSuccessMessage && (
        <div className="success-message">
          🎉 Congratulations! You successfully applied for this job.
        </div>
      )}

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
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
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
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div className="filter-item">
            <Briefcase size={16} />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {uniqueRoles.map((r) => (
                <option key={r} value={r}>{r}</option>
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
              /> Favorites
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
            <button className="apply-now" onClick={(e) => { e.stopPropagation(); handleApplyNow(); }}>Apply Now</button>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>⬅️ Prev</button>
        <span>Page {currentPage}</span>
        <button onClick={() => setCurrentPage((prev) => prev * jobsPerPage < filteredJobs.length ? prev + 1 : prev)} disabled={currentPage * jobsPerPage >= filteredJobs.length}>Next ➡️</button>
      </div>

      {isModalOpen && selectedJob && (
        <div className="modal-overlay" onClick={closeJobModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeJobModal}>×</button>
            <h3>{selectedJob.title}</h3>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Status:</strong> {selectedJob.status}</p>
            <p><strong>Date Applied:</strong> {selectedJob.date}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Role:</strong> {selectedJob.role}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AppliedJobs;
