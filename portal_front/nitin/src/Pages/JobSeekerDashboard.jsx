import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSave, FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ workMode: "", location: "" });

  useEffect(() => {
    axios.get("http://localhost:9091/api/jobs").then((response) => {
      setJobs(response.data);
    });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search jobs..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100">
            <FaSearch /> Search
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <h5>Filters</h5>
          <label>Work Mode:</label>
          <select className="form-control" name="workMode" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
          </select>
          <label>Location:</label>
          <select className="form-control" name="location" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
          </select>
        </div>
        <div className="col-md-9">
          <h5>Job Listings</h5>
          {filteredJobs.map((job) => (
            <div key={job.id} className="card mb-3 p-3">
              <h6>{job.title}</h6>
              <p>{job.company}</p>
              <p>
                <FaMapMarkerAlt /> {job.location}
              </p>
              <button className="btn btn-outline-success">
                <FaSave /> Save Job
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
