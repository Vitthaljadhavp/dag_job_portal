import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { motion } from "framer-motion";
import { Bell, Moon, Settings, UserCircle, Briefcase, Clipboard, Users } from "lucide-react"; // 3D-style icons

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(3);
  const [adminName, setAdminName] = useState("");

  // Fetch users, job postings, and applications
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9091/api/users/job_seekers");
      setJobSeekers(response.data.jobSeekers || []);
      setRecruiters(response.data.recruiters || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchJobPostings = async () => {
    try {
      const response = await axios.get("http://localhost:9091/api/jobs");
      setJobPostings(response.data || []);
    } catch (error) {
      console.error("Error fetching job postings:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:9091/api/applications");
      setApplications(response.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Fetch the admin's name
  const fetchAdminName = async () => {
    try {
      const response = await axios.get("http://localhost:9091/api/admin");
      setAdminName(response.data.name || "Admin");
    } catch (error) {
      console.error("Error fetching admin name:", error);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:9091/api/users/${userId}`);
      setJobSeekers(jobSeekers.filter(user => user.id !== userId));
      setRecruiters(recruiters.filter(user => user.id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Block user
  const blockUser = async (userId) => {
    try {
      await axios.put(`http://localhost:9091/api/users/block/${userId}`);
      // Update the UI to reflect the blocked user status (optional)
      const updatedUsers = jobSeekers.map(user => 
        user.id === userId ? { ...user, status: "Blocked" } : user
      );
      setJobSeekers(updatedUsers);
      alert("User blocked successfully!");
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchJobPostings();
    fetchApplications();
    fetchAdminName();
  }, [activeSection]);

  return (
    <div className="app">
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-actions">
          <input type="text" className="search-bar" placeholder="Search..." />
          <div className="icon-btn" title="Toggle Theme"><Moon /></div>
          <div className="icon-btn notify" title="Notifications">
            <Bell />
            <span className="badge">{notificationCount}</span>
          </div>
          <div className="icon-btn" title="Settings"><Settings /></div>
        </div>

        <div className="profile">
          <img src="/avatar.jpg" alt="Profile" className="avatar" />
          <ul className="profile-dropdown">
            <li><UserCircle className="icon" /> My Profile</li>
            <li><Settings className="icon" /> Settings</li>
            <li className="logout">🚪 Logout</li>
          </ul>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="main">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            {[ 
              { key: "dashboard", label: <><Briefcase /> Dashboard</> },
              { key: "users", label: <><Users /> Job Seekers</> },
              { key: "recruiters", label: <><Users /> Recruiters</> },
              { key: "jobPostings", label: <><Clipboard /> Jobs</> },
              { key: "applications", label: <><Clipboard /> Applications</> },
              { key: "settings", label: <><Settings /> Settings</> },
            ].map(({ key, label }) => (
              <li
                key={key}
                className={activeSection === key ? "active" : ""}
                onClick={() => setActiveSection(key)}
              >
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <motion.section
          className="dashboard-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeSection === "dashboard" && (
            <>
              <h2>Welcome, {adminName} 🎉</h2>
              <p>Here’s a summary of your platform activity.</p>

              {/* Summary Cards */}
              <div className="stats-summary">
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>{jobSeekers.length}</h3>
                  <p>Job Seekers</p>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>{recruiters.length}</h3>
                  <p>Recruiters</p>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>{jobPostings.length}</h3>
                  <p>Job Postings</p>
                </motion.div>
                <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
                  <h3>{applications.length}</h3>
                  <p>Applications</p>
                </motion.div>
              </div>

              {/* DAB: Dashboard Activity Breakdown */}
              <div className="dab-section">
                <h3>📈 Dashboard Activity Breakdown (DAB)</h3>
                <div className="dab-grid">
                  <div className="dab-card">🔐 1200 Logins Today</div>
                  <div className="dab-card">🆕 85 New Signups</div>
                  <div className="dab-card">🟢 730 Active Users</div>
                  <div className="dab-card">⏳ 45 Pending Actions</div>
                </div>
              </div>
            </>
          )}

          {activeSection === "users" && (
            <div className="users-section">
              <h2>Job Seekers</h2>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Jobs Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobSeekers.length > 0 ? jobSeekers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.jobsApplied}</td>
                      <td>
                      <button onClick={() => deleteUser(user.id)}>DELETE</button>
                        <button onClick={() => blockUser(user.id)}>EDIT</button>
                        <button onClick={() => blockUser(user.id)}>BLOCK</button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6">No job seekers found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Recruiters, Job Postings, and Applications sections would go here */}
          
          {activeSection === "recruiters" && (
            <div className="users-section">
              <h2>Recruiters</h2>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Jobs Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiters.length > 0 ? recruiters.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.jobsPosted}</td>
                      <td>
                        <button onClick={() => deleteUser(user.id)}>DELETE</button>
                        <button onClick={() => blockUser(user.id)}>EDIT</button>
                        <button onClick={() => blockUser(user.id)}>BLOCK</button>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5">No recruiters found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "jobPostings" && (
            <div className="job-postings-section">
              <h2>Job Postings</h2>
              <table className="job-postings-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobPostings.length > 0 ? jobPostings.map((job, index) => (
                    <tr key={job.id}>
                      <td>{index + 1}</td>
                      <td>{job.title}</td>
                      <td>{job.company}</td>
                      <td>{job.location}</td>
                      <td>{job.status}</td>
                    </tr>
                  )) : <tr><td colSpan="5">No job postings found</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === "applications" && (
            <div className="applications-section">
              <h2>Applications</h2>
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User</th>
                    <th>Job Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? applications.map((app, index) => (
                    <tr key={app.id}>
                      <td>{index + 1}</td>
                      <td>{app.userName}</td>
                      <td>{app.jobTitle}</td>
                      <td>{app.status}</td>
                    </tr>
                  )) : <tr><td colSpan="4">No applications found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

export default AdminDashboard;
