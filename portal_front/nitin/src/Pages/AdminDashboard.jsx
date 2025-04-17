import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9091/api/users/job_seekers");

      // Assuming backend returns: { jobSeekers: [...], recruiters: [...] }
      setJobSeekers(response.data.jobSeekers || []);
      setRecruiters(response.data.recruiters || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (activeSection === "users" || activeSection === "recruiters") {
      fetchUsers();
    }
  }, [activeSection]);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <h1>Admin Dashboard</h1>
        <div className="profile">
          <span className="profile-name">Profile</span>
        </div>
      </nav>

      <div className="main">
        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            <li
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={activeSection === "users" ? "active" : ""}
              onClick={() => setActiveSection("users")}
            >
              Users
            </li>
            <li
              className={activeSection === "recruiters" ? "active" : ""}
              onClick={() => setActiveSection("recruiters")}
            >
              Recruiters
            </li>
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </li>
          </ul>
        </aside>

        {/* Dashboard Content */}
        <section className="dashboard">
          {activeSection === "dashboard" && (
            <>
              <h2>Welcome to the Admin Panel</h2>
              <p>This is where your data will appear.</p>
            </>
          )}

          {activeSection === "users" && (
            <div className="users-section">
              <h2>Users Section</h2>
              <p>List of Job Seekers:</p>
              <table className="users-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Jobs Applied</th>
                </tr>
              </thead>
              <tbody>
                {jobSeekers.length > 0 ? (
                  jobSeekers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td> {/* Serial Number */}
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.jobsApplied}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No job seekers found</td>
                  </tr>
                )}
              </tbody>
            </table>

            </div>
          )}

          {activeSection === "recruiters" && (
            <div className="users-section">
              <h2>Recruiters Section</h2>
              <p>List of Recruiters:</p>
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
                {recruiters.length > 0 ? (
                  recruiters.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td> {/* Serial Number */}
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.jobsPosted}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No recruiters found</td>
                  </tr>
                )}
              </tbody>
            </table>

            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
