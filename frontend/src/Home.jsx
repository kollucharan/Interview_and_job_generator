import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./HomeStyles.css";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import atsIcon from "./assets/images/ATS.svg";
import jdIcon from "./assets/images/job-description.svg";
import questionIcon from "./assets/images/question.svg";
import headlogo from "./assets/images/Talviewlogo.png";
import Header from "./Header/Header";
import Footer from "./Footer/footer";
import { useRef } from "react";
export default function Home() {
  const [jobRole, setJobRole] = useState("");
  const [jobLevel, setJobLevel] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState('');
  const [emailpopup, setEmailpoup] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);


  const handleExampleClick = (role) => {
    if (!loading) {
      setCompanyName("Talview");
      setJobRole(role);

      const roleDetails = {
        "Software Engineer": {
          level: "entry",
          skills: "Data Structures, Algorithms, Problem Solving"
        },
        "Marketing Specialist": {
          level: "mid",
          skills: "SEO, Digital Marketing, Communication"
        },
        "Sales Representative": {
          level: "entry",
          skills: "Negotiation, Lead Generation, CRM"
        },
      };

      const { level, skills } = roleDetails[role];

      setJobLevel(level);
      setRequiredSkills(skills);

      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGenerate = async () => {
    if (!jobRole.trim() || !jobLevel.trim() || !companyName.trim()) {
      toast.error("Please enter All Required Fields.");
      return;
    }
    setEmailpoup(true);
  };
  const closePopup = () => {
   setEmailpoup(false);
  };
  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please Enter Email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
  toast.error("Please enter a valid email address.");
  return;
}
    setEmailpoup(false);
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://interview-and-job-generator.onrender.com/generate",
        {
          email: email,
          role: jobRole,
          level: jobLevel,
          company: companyName,
          skills: requiredSkills.trim() ? requiredSkills : null,
        }
      );

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

      <Header />
      <main className="main-content">
        <section className="hero">
          <h1 className="main-heading">
            Effortless Job Description Generator & Interview Question Creation
            for Hiring Managers
          </h1>
          <p className="sub-heading">
            Quickly generate Free tailored interview questions and job
            descriptions for any role—so you can focus on finding the right fit,
            not writing questions.
          </p>
        </section>

        <section className="generator-card" ref={formRef}>
          <h2 className="card-title">
            Let's create your Job Description and Interview Questions
          </h2>

          <div className="input-group">
            <label htmlFor="job-role">Company Name</label>
            <input
              id="job-role"
              type="text"
              className="job-input"
              placeholder="Enter your company name (e.g. Microsoft,Talview)"
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
              placeholder="Enter the job role (e.g. Full-Stack Developer)"
              value={jobRole}
              disabled={loading}
              onChange={(e) => setJobRole(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="job-level">Experience Level</label>
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
              <option value="entry">Entry-Level (0-1 years)</option>
              <option value="junior">Junior (1-2 years)</option>
              <option value="mid">Mid-Level (2-4 years)</option>
              <option value="senior">Senior (5-7 years)</option>
              <option value="lead">Lead/Principal (8+ years)</option>
              <option value="manager">Manager (Team Management)</option>
              <option value="director">Director (Department Oversight)</option>
              <option value="executive">Executive (C-Suite/VP)</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="required-skills">Required Skills (Optional)</label>
            <textarea
              id="required-skills"
              className="skills-textarea"
              placeholder="Add relevant skills (e.g. React, Node.js,SEO)"
              value={requiredSkills}
              disabled={loading}
              onChange={(e) => setRequiredSkills(e.target.value)}
              rows="2"
              cols="30"
            />
          </div>
          <p className="form-tip">
            Add specific skills for more tailored responses and better results.
          </p>
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

          <h3 className="examples-heading">Quick Examples</h3>

          <div className="examples-grid">
            {[
              "Software Engineer",
              "Marketing Specialist",
              "Sales Representative",
            ].map((role, index) => (
              <div
                key={index}
                className="example-card"
                onClick={() => handleExampleClick(role)}
              >
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
  <Popup
        open={emailpopup}
        closeOnDocumentClick
        onClose={closePopup}
        closeOnEscape
        modal
        className="email-popup-content"
        overlayClassName="email-popup-overlay"
      >
        {() => (
          <div className="email-popup-inner">
            <h2 className="email-popup-header">
              Enter your email to generate Description
            </h2>
            <input
              type="email"
              placeholder="Enter Business Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-popup-input"
            />
            <button
              className="email-popup-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Generating..." : "Submit and Generate"}
            </button>
          </div>
        )}
      </Popup>
      </main>
      <Footer />
    </div>
  );
}
