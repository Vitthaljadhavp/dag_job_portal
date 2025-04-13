import React, { useState, useEffect } from "react";
import { FaChartLine, FaRegClock, FaRegThumbsUp, FaUsers, FaBell } from "react-icons/fa";
import "./ApplicationInsights.css";

function ApplicationInsights() {
  // Dummy Data for the Application Insights
  const [insightsData, setInsightsData] = useState({
    totalApplications: 1200,
    pendingApplications: 320,
    approvedApplications: 880,
    totalUsers: 500,
    recentApplications: [
      { id: 1, user: "John Doe", role: "Software Engineer", status: "Approved" },
      { id: 2, user: "Jane Smith", role: "Product Manager", status: "Pending" },
      { id: 3, user: "Samuel Green", role: "UX Designer", status: "Approved" },
    ],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  // Filter Applications by Status
  const filteredApplications = insightsData.recentApplications.filter((app) => {
    return (
      app.user.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterStatus === "All" || app.status === filterStatus)
    );
  });

  // Export Data as CSV
  const exportData = () => {
    const csvContent = [
      ["User", "Role", "Status"],
      ...insightsData.recentApplications.map((app) => [app.user, app.role, app.status]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
  };

  // Handle user selection
  const handleUserClick = (userId) => {
    const user = insightsData.recentApplications.find((app) => app.id === userId);
    setSelectedUser(user);
  };

  // Close user details modal
  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  // Navbar functions
  const handleDashboardClick = () => {
    alert("Navigating to Dashboard...");
  };

  const handleProfileClick = () => {
    alert("Navigating to Profile...");
  };

  const handleSettingsClick = () => {
    alert("Navigating to Settings...");
  };

  const handleLogoutClick = () => {
    alert("Logging out...");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="portal-name">DAG Job Portal</span>
          </div>
        </div>
        <div className="navbar-right">
          <input
            type="text"
            placeholder="Search applications..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-dropdown"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
          </select>
          <button className="nav-button" onClick={exportData}>
            Export CSV
          </button>
          <button className="nav-button" onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <FaBell className="notification-bell" />
          <button className="nav-button" onClick={handleDashboardClick}>
            Dashboard
          </button>
          <button className="nav-button" onClick={handleProfileClick}>
            Profile
          </button>
          <button className="nav-button" onClick={handleSettingsClick}>
            Settings
          </button>
          <button className="nav-button" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Container */}
      <div className="dashboard-container">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card glass">
            <FaChartLine className="card-icon" />
            <h3>Total Applications</h3>
            <p>{insightsData.totalApplications}</p>
          </div>
          <div className="card glass">
            <FaRegClock className="card-icon" />
            <h3>Pending Applications</h3>
            <p>{insightsData.pendingApplications}</p>
          </div>
          <div className="card glass">
            <FaRegThumbsUp className="card-icon" />
            <h3>Approved Applications</h3>
            <p>{insightsData.approvedApplications}</p>
          </div>
          <div className="card glass">
            <FaUsers className="card-icon" />
            <h3>Total Users</h3>
            <p>{insightsData.totalUsers}</p>
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="recent-applications">
          <h3>Recent Applications</h3>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.user}</td>
                  <td>{app.role}</td>
                  <td
                    className={
                      app.status === "Approved" ? "approved" : "pending"
                    }
                  >
                    {app.status}
                  </td>
                  <td>
                    <button
                      className="details-button"
                      onClick={() => handleUserClick(app.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="user-details-modal">
            <div className="modal-content">
              <h3>User Details</h3>
              <p><strong>Name:</strong> {selectedUser.user}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <button className="close-button" onClick={closeUserDetails}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ApplicationInsights;
