
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./HomeStyles.css";

export default function Home() {
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState(""); 
  const navigate = useNavigate();

  const handleGenerate = async () => {
    // if (!jobRole.trim()) {
    //   toast.error("Please enter a job role.");
    //   return;
    if (!jobRole.trim() || !companyName.trim()) {
      toast.error("Please enter both job role and company name.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("https://interview-and-job-generator.onrender.com/generate", {
        role: jobRole,
        company: companyName, 
      });

      navigate("/details", {
        state: {
          description: data.description,
          questions: data.questions || [],
          role: jobRole,
          company: companyName,
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

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <svg
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
            </svg>
            <span className="logo-text">Talview</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        <section className="hero">
          <h1 className="main-heading">Generate Job Descriptions Instantly</h1>
          <p className="sub-heading">
            Create polished job descriptions and interview questions for any role
          </p>
        </section>

        <section className="generator-card">
          <h2 className="card-title">Start by entering a job role and Company Name</h2>
          <label className="input-label" htmlFor="job-role">
             Job Role
            </label>
            <input
            type="text"
            className="job-input"
            placeholder="e.g. Frontend Developer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
          />



          <label className="input-label" htmlFor="company-name">
             Company Name
           </label>
          <input
            type="text"
            className="job-input"
            placeholder="e.g. Google"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          
          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-wrapper">
                <svg
                  className="spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="spinner-circle"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="spinner-path"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </section>

        <section className="features-section">
          <h2 className="features-heading">Why Use Our Tool?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Fast & Reliable</h3>
              <p>Instantly create job content that meets hiring standards.</p>
            </div>
            <div className="feature-card">
              <h3>Tailored Output</h3>
              <p>Content is customized to the role you enter — no fluff!</p>
            </div>
            <div className="feature-card">
              <h3>Time Saver</h3>
              <p>Say goodbye to manual formatting and redundant writing.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Talview. All rights reserved.</p>
      </footer>
    </div>
  );
}
