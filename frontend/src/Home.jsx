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

export default function Home() {
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!jobRole.trim()) {
      toast.error("Please enter a job role.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://interview-and-job-generator.onrender.com/generate",
        {
          role: jobRole,
        }
      );

      navigate("/details", {
        state: {
          description: data.description,
          questions: data.questions || [],
          role: jobRole,
        },
      });
    } catch (error) {
      toast.error("Error generating content.");
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
            {/* <svg
              className="logo-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg> */}
            <img src={headlogo} alt="Talview Logo" className="head-logo" />
            {/* <span className="logo-text">Talview</span> */}
          </div>
        </div>
      </header>
      <main className="main-content">
        <section className="hero">
          <h1 className="main-heading"> Free AI Job Description Generator</h1>
          <p className="sub-heading">
            Our AI hiring tool help you generate accurate, ready-to-use job
            descriptions and interview questions instantly
          </p>
        </section>

        <section className="generator-card">
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
                <span className="loader-text">Creating amazing content...</span>
              </div>
            ) : (
              "Generate"
            )}
          </button>
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
