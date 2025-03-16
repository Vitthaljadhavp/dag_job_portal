import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";import Register from "./components/Register";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminDashboard from "./Pages/AdminDashboard";
import JobSeekerDashboard from "./Pages/JobSeekerDashboard";
import RecruiterDashboard from "./Pages/RecruiterDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Footer from "./components/Footer";



function App() {
  return (
    // <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        
      </Routes>
      
    // </>
  );
}

export default App;
