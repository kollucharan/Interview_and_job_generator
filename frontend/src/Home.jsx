
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./HomeStyles.css";

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
      const { data } = await axios.post("https://interview-and-job-generator.onrender.com/generate", {
        role: jobRole,
      });

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
      <main className="main-content">
        <section className="hero">
          <h1 className="main-heading">Generate Job Descriptions Instantly</h1>
          <p className="sub-heading">
            Create polished job descriptions and interview questions for any role
          </p>
        </section>

        <section className="generator-card">
          <h2 className="card-title">Start by entering a job role </h2>
          <input
            type="text"
            className="job-input"
            placeholder="e.g. Junior Frontend Developer, Senior Data Scientist"
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

      <footer className="footer">
        <p>© 2025 Talview. All rights reserved.</p>
      </footer>
    </div>
  );
}