import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./JobSeekerDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(["personalDetails"]);

  // Personal Details
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");

  // Education
  const [educationList, setEducationList] = useState([{ university: "", degree: "", branch: "", percentage: "", passingYear: "" }]);
  const addEducation = () => setEducationList([...educationList, { university: "", degree: "", branch: "", percentage: "", passingYear: "" }]);
  const removeEducation = (index) => setEducationList(educationList.filter((_, i) => i !== index));

  // Skills
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter" && skillInput.trim() !== "") {
      event.preventDefault();
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const removeSkill = (index) => setSkills(skills.filter((_, i) => i !== index));

  // Experience
  const [experiences, setExperiences] = useState([{ company: "", role: "", startDate: "", endDate: "", jobType: "Internship", mode: "Remote" }]);
  const addExperience = () => setExperiences([...experiences, { company: "", role: "", startDate: "", endDate: "", jobType: "Internship", mode: "Remote" }]);
  const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
  const updateExperience = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  // Profile Picture
  const [profilePic, setProfilePic] = useState(null);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {

      const reader = new FileReader();
      
      reader.onloadend = () => {
      
      setProfilePic(reader.result);
      
      };
      
      reader.readAsDataURL(file);
      
      }
      
      };
      
       
      
      const removeProfilePic = () => {
      
      setProfilePic(null);
      
      };
      

  // About Me
  const [aboutMe, setAboutMe] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleAboutMeChange = (event) => {
    const text = event.target.value;
    setAboutMe(text);

    // Count words correctly by removing extra spaces
    const words = text.trim().split(/\s+/).filter(word => word !== "");
    setWordCount(words.length);
  };


  // Form Submission
  const handleSubmit = async () => {
    console.log("Submitting profile...");
  
    console.log("Full Name:", fullName);
    console.log("Mobile:", mobile);
    console.log("Email:", email);
    console.log("Address:", address);
    console.log("DOB:", dob);
    console.log("Gender:", gender);
    console.log("Skills:", skills);
    console.log("Experiences:", experiences);
    console.log("About Me:", aboutMe);
    console.log("Profile Pic:", profilePic);
  
    if (!fullName || !mobile || !email || !address || !dob || !gender || !skills.length || !experiences.length || !aboutMe || !profilePic) {
      alert("Please fill in all required fields before submitting.");
      console.warn("Form validation failed! Missing fields detected.");
      return;
    }
  
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("mobile", mobile);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("dob", dob);
    formData.append("gender", gender);
    formData.append("aboutMe", aboutMe);
    formData.append("profilePic", profilePic);
  
    console.log("Adding education details...");
    educationList.forEach((edu, index) => {
      console.log(`Education ${index}:`, edu);
      formData.append(`educationList[${index}].university`, edu.university);
      formData.append(`educationList[${index}].degree`, edu.degree);
      formData.append(`educationList[${index}].branch`, edu.branch);
      formData.append(`educationList[${index}].percentage`, edu.percentage);
      formData.append(`educationList[${index}].passingYear`, edu.passingYear);
    });
  
    console.log("Adding skills...");
    skills.forEach((skill, index) => {
      console.log(`Skill ${index}:`, skill);
      formData.append(`skills[${index}]`, skill);
    });
  
    console.log("Adding experience details...");
    experiences.forEach((exp, index) => {
      console.log(`Experience ${index}:`, exp);
      formData.append(`experiences[${index}].company`, exp.company);
      formData.append(`experiences[${index}].role`, exp.role);
      formData.append(`experiences[${index}].startDate`, exp.startDate);
      formData.append(`experiences[${index}].endDate`, exp.endDate);
      formData.append(`experiences[${index}].jobType`, exp.jobType);
      formData.append(`experiences[${index}].mode`, exp.mode);
    });
  
    try {
      console.log("Sending request to backend...");
      const response = await axios.post("http://localhost:9091/api/job-seeker/save", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
  
      if (response.status === 201) {
        console.log("Profile submitted successfully!");
        alert("Profile submitted successfully!");
        navigate("/JobListingDashboard");
      }
    } catch (error) {
      console.error("Failed to submit profile. Error:", error);
      alert("Failed to submit profile. Please try again.");
    }
  };
  

  const handleLogout = () => {

    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
    
    localStorage.removeItem("authToken"); // If using JWT
    
    sessionStorage.clear(); // If using session storage
    
    navigate("/login");
    
    }
    
    };

  const toggleSection = (section) => {

    if (!visibleSections.includes(section)) {
    
    setVisibleSections([...visibleSections, section]);
    
    }
    
    };

  return (

    <div className="header">

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="portal-name">DAG Job Portal</span>
          </div>
        </div>

        {/* Logout Button on Right */}
        <div className="navbar-right">
          <button className="logout-button btn btn-danger" onClick={handleLogout}>Logout
            <i className="bi bi-box-arrow-right me-2"></i> 
          </button>
        </div>
      </nav>


    <div className="job-seeker-dashboard d-flex">
      {/* Sidebar */}
      <div className="sidebar d-flex flex-column p-3 text-white">
      <h3 className="mb-4">Fill the Form</h3>
        <button className="btn btn-primary" onClick={() => toggleSection("education")}>Education</button>
        <button className="btn btn-primary" onClick={() => toggleSection("skills")}>Skills</button>
        <button className="btn btn-primary" onClick={() => toggleSection("experience")}>Experience</button>
        <button className="btn btn-primary" onClick={() => toggleSection("uploadPic")}>Upload Profile Picture</button>
        <button className="btn btn-primary" onClick={() => toggleSection("aboutMe")}>About Me</button>
      </div>

      {/* Main Content */}
      <div className="content p-4 w-100 ">
        <h2 className="mb-4">Create Your Profile</h2>

        {/* Personal Details (Always Visible) */}
{visibleSections.includes("personalDetails") && (
  <div className="section">
    <h4>Personal Details</h4>

    <div className="row-1 d-flex">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-person"></i></span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Full Name"
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)}
          required 
        />
      </div>

      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-telephone"></i></span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Mobile Number"
          value={mobile} 
          onChange={(e) => setMobile(e.target.value)}
          required
        />
      </div>
    </div>

    <div className="row-2 d-flex">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-envelope"></i></span>
        <input 
          type="email" 
          className="form-control" 
          placeholder="Email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Address"
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
    </div>

    <div className="row-3 d-flex">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-calendar"></i></span>
        <input 
          type="date" 
          className="form-control"
          value={dob} 
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>
    </div>

    <div className="input-group">
      <span className="input-group-text"><i className="bi bi-gender-ambiguous"></i></span>
      <select 
        className="form-control" 
        value={gender} 
        onChange={(e) => setGender(e.target.value)}
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div className="row-4 d-flex">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Location"
          value={address} // Assuming location is the same as address
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
    </div>
  </div>
)}

      



        {/* Education Section */}
        {visibleSections.includes("education") && (
          <div className="section">
            <h4>Education</h4>

            {educationList.map((education, index) => (
              <div key={index} className="education-entry">
                <div className="row-1 d-flex">
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-building"></i></span>
                    <input type="text" className="form-control" placeholder="College/University Name" />
                  </div>

                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-book"></i></span>
                    <input type="text" className="form-control" placeholder="Degree" />
                  </div>
                </div>

                <div className="row-2 d-flex">
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-diagram-3"></i></span>
                    <input type="text" className="form-control" placeholder="Branch/Specialization" />
                  </div>

                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-graph-up"></i></span>
                    <input type="text" className="form-control" placeholder="Percentage/CGPA" />
                  </div>
                </div>

                <div className="row-3">
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                    <input type="text" className="form-control" placeholder="Passing Year" />
                  </div>
                </div>

                {/* Remove Education Button */}
                {educationList.length > 1 && (
                  <button className="btn btn-danger mt-2" onClick={() => removeEducation(index)}>
                    <i className="bi bi-trash"></i> Remove Education
                  </button>
                )}

                {/* Dashed Separator Line */}
                {index < educationList.length - 1 && <hr className="dashed-line" />}
              </div>
            ))}

            {/* Add Education Button */}
            <button className="btn btn-success mt-2" onClick={addEducation}>
              <i className="bi bi-plus-circle"></i> Add Education
            </button>
          </div>
        )}



        {/* Skills Section */}
        {visibleSections.includes("skills") && (
          <div className="section w-100">
            <h4>Skills</h4>
    
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lightbulb"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
            </div>

            {/* Display Added Skills as Tags */}
            <div className="skill-tags" >
              {skills.map((skill, index) => (
                <span key={index} className="badge m-1" style={{color:"white", backgroundColor:"#008754", fontSize:"16px"}}>
                  {skill} <i className="bi bi-x-circle" onClick={() => removeSkill(index)}></i>
                </span>
              ))}
            </div>
          </div>
        )}


        {/* Experience Section */}
        {visibleSections.includes("experience") && (
          <div className="section">
            <h4>Experience</h4>

            {experiences.map((exp, index) => (
              <div key={index}>
                <div className="row-3 d-flex">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-building"></i>
                    </span>
                      <input type="text" className="form-control" placeholder="Company/Organization Name" value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
                  </div>

                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-briefcase"></i></span>
                    <input type="text" className="form-control" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(index, "role", e.target.value)} />
                  </div>
                </div>

                <div className="row-3 d-flex">
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                    <input type="date" className="form-control" value={exp.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} />
                  </div>

                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                    <input type="date" className="form-control" value={exp.endDate} onChange={(e) => updateExperience(index, "endDate", e.target.value)} />
                  </div>
                </div>

                <div className="row-3 d-flex">
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-gear"></i></span>
                    <select className="form-control" value={exp.jobType} onChange={(e) => updateExperience(index, "jobType", e.target.value)}>
                      <option>Internship</option>
                      <option>Full-time</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                    <select className="form-control" value={exp.mode} onChange={(e) => updateExperience(index, "mode", e.target.value)}>
                      <option>Remote</option>
                      <option>In-Office</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Remove Experience Button */}
                {index > 0 && (
                  <button className="btn btn-danger mt-2" onClick={() => removeExperience(index)}>
                    <i className="bi bi-trash"></i> Remove Experience
                  </button>
                )}

                {/* Dashed Line Between Experiences */}
                {index !== experiences.length - 1 && <hr className="dashed-line" />}
              </div>
            ))}

            {/* Add Experience Button */}
            <button className="btn btn-success mt-3" onClick={addExperience}>
              <i className="bi bi-plus-circle"></i> Add Experience
            </button>
          </div>
        )}


        {/* Upload Profile Picture */}
        {visibleSections.includes("uploadPic") && (
          <div className="section text-center">
            <h4>Upload Profile Picture</h4>

            {/* Profile Image Preview */}
            {profilePic && (
              <div className="mb-3">
                <img src={profilePic} alt="Profile Preview" className="rounded-circle border border-secondary" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
              </div>
            )}

            {/* File Input with Icon */}
            <div className="input-group w-50 mx-auto">
              <span className="input-group-text">
                <i className="bi bi-camera"></i>
              </span>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* Remove Image Button */}
            {profilePic && (
              <button className="btn btn-danger mt-2" onClick={removeProfilePic}>
                <i className="bi bi-trash"></i> Remove Image
              </button>
            )}
          </div>
        )}


        {/* About Me Section */}
        {visibleSections.includes("aboutMe") && (
          <div className="section">
            <h4>About Me</h4>

            {/* Textarea with Icon */}
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-lines-fill"></i>
              </span>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Write a short bio about yourself..."
                maxLength="200"
                value={aboutMe}
                onChange={handleAboutMeChange}
              ></textarea>
            </div>

            {/* Word Counter */}
            <div className="text-end small text-muted">
              {wordCount} / 200 words
            </div>
          </div>
        )}



        {/* Submit Button */}
        <button 
          className="btn btn-success mt-4"
          onClick={handleSubmit}
          
          // disabled={!isFormComplete}
          >Submit Profile
        </button>

        {/* Warning Message (if any field is missing)
        {!isFormComplete && (
          <div className="text-danger mt-2">
            Please fill in all required fields before submitting.
          </div>
        )} */}
      </div>   
    </div>
  </div>
  

  
  );
};

export default JobSeekerDashboard;
