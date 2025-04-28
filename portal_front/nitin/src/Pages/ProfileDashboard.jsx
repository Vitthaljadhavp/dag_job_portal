import React, { useState } from "react";
import axios from "axios";
import "./ProfileDashboard.css"; // we'll create this next

function ProfileDashboard() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    aboutMe: "",
    skills: [],
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "skills") {
      const skillsArray = value.split(",").map((skill) => skill.trim());
      setFormData({ ...formData, [name]: skillsArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "profilePicture") {
      setProfilePicture(files[0]);
    } else if (name === "resume") {
      setResume(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("mobileNumber", formData.mobileNumber);
    submitData.append("address", formData.address);
    submitData.append("dateOfBirth", formData.dateOfBirth);
    submitData.append("gender", formData.gender);
    submitData.append("aboutMe", formData.aboutMe);

    formData.skills.forEach((skill, index) => {
      submitData.append(`skills[${index}]`, skill);
    });

    if (profilePicture) {
      submitData.append("profilePicture", profilePicture);
    }
    if (resume) {
      submitData.append("resume", resume);
    }

    try {
      const response = await axios.post(
        "http://localhost:9091/api/jobseeker/profile",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile saved successfully:", response.data);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile!");
    }
  };

  return (
    <>
    <nav className="navbar1">
    <div className="navbar-brand1">Job Portal</div>
    <div className="navbar-links1">
      <a href="/job-seeker-dashboard">Home</a>
    </div>
  </nav>
    <div className="profile-form-container">
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <textarea name="aboutMe" placeholder="About Me" value={formData.aboutMe} onChange={handleChange} />

        <input type="text" name="skills" placeholder="Skills (comma separated)" value={formData.skills.join(", ")} onChange={handleChange} />

        <label>Upload Profile Picture:</label>
        <input type="file" name="profilePicture" onChange={handleFileChange} />

        <label>Upload Resume:</label>
        <input type="file" name="resume" onChange={handleFileChange} />

        <button type="submit">Save Profile</button>
      </form>
    </div>
    </>
  );
}

export default ProfileDashboard;
