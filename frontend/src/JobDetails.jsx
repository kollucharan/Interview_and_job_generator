
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./Jobdetails.css"; // Import your CSS file

export default function JobDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState("description");
  const [description] = useState(state?.description || "");
  const [questions] = useState(state?.questions || []);
  const [role] = useState(state?.role || "");
  const [copySuccess, setCopySuccess] = useState("");

  if (!state) {
    return (
      <div className="job-details-container text-center mt-10">
        <p className="text-red-500">No data found. Please go back.</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  const goto = () => {
    window.open('https://www.talview.com/en/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="job-details-container">
      {/* Header Buttons */}
      <div className="flex-row mb-4">
        <button
          className={`button ${
            view === "description" ? "active" : ""
          }`}
          onClick={() => setView("description")}
        >
          Job Description
        </button>
        <button
          className={`button ${
            view === "questions" ? "active" : ""
          }`}
          onClick={() => setView("questions")}
        >
          Interview Questions
        </button>
        <button
          className="button"
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <div className="role-label">For Role {role}</div>
      </div>

      {/* Job Description View */}
      {view === "description" && (
        <div className="card">
          <div className="flex-row mb-2">
            <h2>Job Description</h2>
            <div className="flex-row">
              <button className="button" onClick={goto}>
                Edit
              </button>
              <button
                className="button"
                onClick={() => copyToClipboard(description)}
              >
                Copy
              </button>
              {copySuccess && (
                <span className="copy-success">{copySuccess}</span>
              )}
            </div>
          </div>
          <div className="markdown">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Interview Questions View */}
      {view === "questions" && (
        <div className="card">
          <div className="flex-row mb-2">
            <h2>Interview Questions</h2>
            <div className="flex-row">
              <button className="button" onClick={goto}>
                Edit
              </button>
              <button
                className="button"
                onClick={() => copyToClipboard(questions.join("\n\n"))}
              >
                Copy
              </button>
              {copySuccess && (
                <span className="copy-success">{copySuccess}</span>
              )}
            </div>
          </div>
          <ol>
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
