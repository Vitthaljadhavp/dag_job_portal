import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ApplicationInsights.css";

function ApplicationInsights() {
  
  const navigate = useNavigate();

  

  return (
    <>
      {/* Navbar */}
<nav className="navbar">
  <div className="navbar-left">
    <div className="navbar-logo">
      <img src="/logo.png" alt="Logo" className="logo-img" />
      <span className="portal-name">DAG Job Portal</span>

      <h1>Hey its a Application Insight Dashboard</h1>
    </div>
  </div>

</nav>
    </>
  );
}

export default ApplicationInsights;