
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

  // Function to download as plain text
  const downloadAsText = (content, fileName) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
  };

 
//   const downloadAsPDF = () => {
//     // Initialize PDF document
//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });
    
//     // Set up dimensions
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const margin = 15; // margin in mm
//     const textWidth = pageWidth - (margin * 2);
//     let y = margin; // Starting y position after margin
    
//     // Add title
//     const title = view === "description" 
//       ? `Job Description for ${role}` 
//       : `Interview Questions for ${role}`;
    
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(16);
//     pdf.text(title, margin, y);
//     y += 10; // Move down
    
//     // Add content based on current view
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(12);
    
//     if (view === "description") {
//       // Process description content
//       const lines = pdf.splitTextToSize(description, textWidth);
      
//       for (let i = 0; i < lines.length; i++) {
//         if (y > 280) { // Check if we need a new page (A4 height is ~297mm)
//           pdf.addPage();
//           y = margin;
//         }
        
//         pdf.text(lines[i], margin, y);
//         y += 6; // Line spacing
//       }
//     } else {
//       // Process interview questions
//       for (let i = 0; i < questions.length; i++) {
//         // Add question number
//         pdf.setFont("helvetica", "bold");
//         pdf.text(`Question ${i + 1}:`, margin, y);
//         y += 6;
        
//         // Add question text, handling line breaks
//         pdf.setFont("helvetica", "normal");
//         const questionLines = pdf.splitTextToSize(questions[i], textWidth - 5);
        
//         for (let j = 0; j < questionLines.length; j++) {
//           if (y > 280) { // Check if we need a new page
//             pdf.addPage();
//             y = margin;
//           }
          
//           pdf.text(questionLines[j], margin + 5, y); // Indent question text
//           y += 6; // Line spacing
//         }
        
//         y += 4; // Add extra space between questions
//       }
//     }
    
//     // Generate file name based on current view
//     const fileName = view === "description" 
//       ? `${role}_job_description.pdf` 
//       : `${role}_interview_questions.pdf`;
    
//     // Save the PDF
//     pdf.save(fileName);
//   };

  // For plain text downloads
  
  const downloadAsPDF = () => {
   
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  
   
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const textWidth = pageWidth - (margin * 2);
    let y = margin;
  
   
    const title = view === "description"
      ? `Job Description for ${role}`
      : `Interview Questions for ${role}`;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(title, margin, y);
    y += 10;
  
   
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    const body = view === "description"
      ? description
      : questions.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
  
   
    const lines = pdf.splitTextToSize(body, textWidth);
    lines.forEach(line => {
      pdf.text(line, margin, y);
      y += 6;
    });
  
   
    const fileName = view === "description"
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
      {/* Notion-like Tabs Navigation */}
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
          <button
            className="home-button"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <div className="role-label">For Role: {role}</div>
        </div>
        
        {/* Active Tab Indicator */}
        <div className="tab-indicator-container">
          <div 
            className="tab-indicator" 
            style={{ 
              left: view === "description" ? "0" : "120px", 
              width: view === "description" ? "120px" : "150px" 
            }}
          />
        </div>
      </div>

      {/* Job Description View */}
      {view === "description" && (
        <div className="content-card">
          <div className="card-header">
            <h2>Job Description</h2>
            <div className="action-buttons">
              <button className="action-button" onClick={goto}>
                Edit
              </button>
              <button
                className="action-button"
                onClick={() => copyToClipboard(description)}
              >
                Copy
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
              {copySuccess && (
                <span className="copy-success">{copySuccess}</span>
              )}
            </div>
          </div>
          <div className="markdown-content">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Interview Questions View */}
      {view === "questions" && (
        <div className="content-card">
          <div className="card-header">
            <h2>Interview Questions</h2>
            <div className="action-buttons">
              <button className="action-button" onClick={goto}>
                Edit
              </button>
              <button
                className="action-button"
                onClick={() => copyToClipboard(questions.join("\n\n"))}
              >
                Copy
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
              {copySuccess && (
                <span className="copy-success">{copySuccess}</span>
              )}
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