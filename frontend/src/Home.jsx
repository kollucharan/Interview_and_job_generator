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
  const navigate = useNavigate();
  const formRef = useRef(null);    
 

  const handleGenerate = async () => {
    if (!jobRole.trim() && !jobLevel.trim()) {
      toast.error("Please enter a job role and select a job level.");
      return;
    } else if (!jobRole.trim()) {
      toast.error("Please enter a job role.");
      return;
    } else if (!jobLevel.trim()) {
      toast.error("Select Job level.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("https://interview-and-job-generator.onrender.com/generate", {
        role: jobRole,
        level: jobLevel,
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

        {/* <section className="generator-card">
          <h2 className="card-title">Start by entering a job role </h2>
          <input
            type="text"
            className="job-input"
            placeholder="e.g. Junior Frontend Developer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />
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
                <span className="loader-text">Writing your job spec. Thinking like a hiring manager.</span>
              </div>
            ) : (
              "Generate"
            )}
          </button>
        </section> */}

        <section className="generator-card" ref={formRef} >
          <h2 className="card-title">
            Let's create your Job Description and Interview Questions
          </h2>

          <div className="input-group">
            <label htmlFor="job-role">Job Role</label>
            <input
              id="job-role"
              type="text"
              className="job-input"
              placeholder="e.g. Frontend Developer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-level">Job Level</label>
            <select
              id="job-level"
              className="job-level-select"
              value={jobLevel}
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
              onChange={(e) => setRequiredSkills(e.target.value)}
              rows="3"
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
        </section>

        <section className="examples-section">
          <h3>Examples to Try Out</h3>
          <div className="examples-container">
            <div
              className="example-card"
              onClick={() => {
                setJobRole("Software Engineer");
                setJobLevel("Entry");
                setRequiredSkills("");
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <h4>Example 1</h4>
              <p>Software Engineer</p>
            </div>
            <div
              className="example-card"
              onClick={() => {
                setJobRole("Inside Sales Specialist");
                setJobLevel("Entry");
                setRequiredSkills("");
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <h4>Example 2</h4>
              <p>Inside Sales Specialist</p>
            </div>
            <div
              className="example-card"
              onClick={() => {
                setJobRole("Accountant");
                setJobLevel("Entry");
                setRequiredSkills("");
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <h4>Example 3</h4>
              <p>Accountant</p>
            </div>
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
