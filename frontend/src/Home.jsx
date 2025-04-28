import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./HomeStyles.css";
import atsIcon from "./assets/images/ATS.svg";
import jdIcon from "./assets/images/job-description.svg";
import questionIcon from "./assets/images/question.svg";
import headlogo from "./assets/images/Talviewlogo.png";
import { useRef } from "react";
export default function Home() {
  const [jobRole, setJobRole] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);    
 
  const handleExampleClick = (role) => {
    if (!loading) {
      setCompanyName('Talview');
      setJobRole(role);
      setJobLevel('Entry');
      setRequiredSkills('');
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }; 

  const visit = () => {
    window.open("https://www.talview.com/", "_blank");
  }

  const handleGenerate = async () => {
    if (!jobRole.trim() && !jobLevel.trim()) {
      toast.error("Please enter a job role and select a job level.");
      return;
    } else if (!jobRole.trim()) {
      toast.error("Please enter a job role.");
      return;
    } else if (!jobLevel.trim()) 
     { toast.error("Select Job level.");
      return;
    }
      else if (!companyName.trim()) {
        toast.error("Please enter a company name.");
        return;
      }
    

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/generate", {
        role: jobRole,
        level: jobLevel,
        company: companyName,
        skills: requiredSkills.trim() ? requiredSkills : null,
      });

      if (data.error) {
        toast.error(data.error);
        return;
      }

      navigate("/details", {
        state: {
          description: data.description,
          questions: data.questions || [],
          role: jobRole,
        },
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Error generating content.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <img src={headlogo} alt="Talview Logo" className="head-logo" />
          </div>
          {/* <div><button onClick={visit}>Talview</button></div> */}
        </div>
      </header>
      <main className="main-content">
        <section className="hero">
          <h1 className="main-heading">
            Free AI Job Description & Interview Question Generator
          </h1>
          <p className="sub-heading">
            Role AI Agent helps you instantly generate accurate, ready-to-use
            job descriptions and interview questions tailored to any role.
          </p>
        </section>

     

        <section className="generator-card" ref={formRef} >
          <h2 className="card-title">
            Let's create your Job Description and Interview Questions
          </h2>
       
          <div className="input-group">
            <label htmlFor="job-role">Company Name</label>
            <input
              id="job-role"
              type="text"
              className="job-input"
              placeholder="Enter company name"
              value={companyName}
              disabled={loading}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>


          <div className="input-group">
            <label htmlFor="job-role">Job Role</label>
            <input
              id="job-role"
              type="text"
              className="job-input"
              placeholder="e.g. Frontend Developer ,Inside sales specialist"
              value={jobRole}
              disabled={loading}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-level">Job Level</label>
            <select
              id="job-level"
              className="job-level-select"
              value={jobLevel}
              disabled={loading}
              onChange={(e) => setJobLevel(e.target.value)}
            >
              <option value="" disabled>
                Select Level
              </option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Lead">Lead Level</option>
              <option value="Manager">Manager Level</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="required-skills">Required Skills (Optional)</label>
            <textarea
              id="required-skills"
              className="skills-textarea"
              placeholder="e.g. JavaScript, React, CSS, Git (separate with commas)"
              value={requiredSkills}
              disabled={loading}
              onChange={(e) => setRequiredSkills(e.target.value)}
              rows="2"
              cols="30"
            />
          </div>   
          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <div className="loader-container">
                <div className="pulse-loader">
                  <div className="pulse-bubble pulse-bubble-1"></div>
                  <div className="pulse-bubble pulse-bubble-2"></div>
                  <div className="pulse-bubble pulse-bubble-3"></div>
                </div>
                <span className="loader-text">
                  Writing your job spec. Thinking like a hiring manager.
                </span>
              </div>
            ) : (
              "Generate"
            )}
          </button> 
    
          <h3 className="examples-heading">Examples To Try out</h3>

<div className="examples-grid">
  {["Software Engineer",  "Marketing Specialist", "Sales Representative"].map((role, index) => (
    <div
      key={index}
      className="example-card"
      onClick={() => handleExampleClick(role)}
    >
      {/* <span className="example-icon">🧪</span> */}
      <span className="example-text">{role}</span>
    </div>
  ))}
</div>

        </section>

    
        <section className="features-section">
          <h2 className="features-heading">Why Use Our Tool?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <img src={atsIcon} alt="ATS Icon" className="icon" />
              <h3>ATS-Optimized Job Descriptions</h3>
              <ul>
                <li>ATS-friendly format for higher reach</li>
                <li>Compatible with major job boards</li>
                <li>Structured and clear for easy candidate matching</li>
              </ul>
            </div>
            <div className="feature-card">
              <img src={jdIcon} alt="JD ICON" className="icon" />
              <h3>Clear and Precise Job Descriptions</h3>
              <ul>
                <li>Keywords optimized for industry visibility</li>
                <li>
                  Responsibilities, Requirements and Benefits tailored to the
                  position
                </li>
                <li>Copy, Edit, or Download JD’s Easily</li>
              </ul>
            </div>
            <div className="feature-card">
              <img src={questionIcon} alt="QuestionIcon" className="icon" />
              <h3>Auto-Generate Interview Questions</h3>
              <ul>
                <li>
                  Questions tailored to the responsibilities and skills in your
                  JD
                </li>
                <li>Save time on creating interview questions manually</li>
                <li>Structured Questions for better candidate evaluation</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Talview. All rights reserved.</p>
      </footer>
    </div>
  );


}
