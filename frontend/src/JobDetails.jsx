import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "./Jobdetails.css";

export default function JobDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState("description");
  const [description] = useState(state?.description || "");
  const [questions] = useState(state?.questions || []);
  const [role] = useState(state?.role || "");
  const [copying, setCopying] = useState(false);
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

  // const copyToClipboard = (text) => {
  //   navigator.clipboard.writeText(text)
  //     .then(() => {
  //       setCopySuccess("Copied!");
  //       setTimeout(() => setCopySuccess(""), 2000);
  //     })
  //     .catch(() => {
  //       setCopySuccess("Failed to copy");
  //       setTimeout(() => setCopySuccess(""), 2000);
  //     });
  // };
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopying(true);
        setTimeout(() => setCopying(false), 1000);
      })
      .catch(() => {
        setCopying(false);
      });
  };
  const goto = () => {
    window.open("https://www.talview.com/en/", "_blank", "noopener,noreferrer");
  };

  const downloadAsText = (content, fileName) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
  };

  

  const downloadAsPDF = () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const textWidth = pageWidth - margin * 2;
    let y = margin;

    const title =
      view === "description"
        ? `Job Description for ${role}`
        : `Interview Questions for ${role}`;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text(title, pageWidth / 2, y, { align: "center" });
    y += 10;

    pdf.setDrawColor(180);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);

    if (view === "description") {
      const lines = pdf.splitTextToSize(description, textWidth);
      lines.forEach((line) => {
        pdf.text(line, margin, y);
        y += 7;
      });
    } else {
      questions.forEach((q, i) => {
        const lines = pdf.splitTextToSize(`${i + 1}. ${q}`, textWidth);
        lines.forEach((line, index) => {
          pdf.text(line, margin, y);
          y += 6;
        });
        y += 2;
      });
    }

    const fileName =
      view === "description"
        ? `${role}_job_description.pdf`
        : `${role}_interview_questions.pdf`;

    pdf.save(fileName);
  };

  const downloadDescription = () => {
    downloadAsText(description, `${role}_job_description.txt`);
  };

  const downloadQuestions = () => {
    const questionsText = questions.join("\n\n");
    downloadAsText(questionsText, `${role}_interview_questions.txt`);
  };

  return (
    <div className="job-details-container">
      <div className="tabs-container">
        <div className="tabs-navigation">
          <button
            className={`tab ${view === "description" ? "active-tab" : ""}`}
            onClick={() => setView("description")}
          >
            Job Description
          </button>
          <button
            className={`tab ${view === "questions" ? "active-tab" : ""}`}
            onClick={() => setView("questions")}
          >
            Interview Questions
          </button>
          <button className="home-button" onClick={() => navigate("/")}>
            Home
          </button>
          <div className="role-label">For Role: {role}</div>
        </div>
      </div>

      {view === "description" && (
        <div className="content-card">
          <div className="card-header">
            <h2>Job Description</h2>
            <div className="action-buttons">
              <button className="action-button" onClick={goto}>
                Edit
              </button>
              <button
               className={`action-button ${copying ? "copied" : ""}`}
                onClick={() => copyToClipboard(description)}
              >
                {copying ? "Copied!" : "Copy"}
              </button>
              <button
                className="action-button download-button"
                onClick={downloadDescription}
              >
                Download TXT
              </button>
              <button
                className="action-button download-button pdf-button"
                onClick={downloadAsPDF}
              >
                Download PDF
              </button>
             
            </div>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      )}

      {view === "questions" && (
        <div className="content-card">
          <div className="card-header">
            <h2>Interview Questions</h2>
            <div className="action-buttons">
              <button className="action-button" onClick={goto}>
                Edit
              </button>
              <button
               className={`action-button ${copying ? "copied" : ""}`}
                onClick={() => copyToClipboard(questions.join("\n\n"))}
              >
                {copying ? "Copied!" : "Copy"}
              </button>
              <button
                className="action-button download-button"
                onClick={downloadQuestions}
              >
                Download TXT
              </button>
              <button
                className="action-button download-button pdf-button"
                onClick={downloadAsPDF}
              >
                Download PDF
              </button>
            </div>
          </div>
          <ol className="questions-list">
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
