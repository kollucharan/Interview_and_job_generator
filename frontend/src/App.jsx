import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import JobDetails from "./JobDetails";

export default function App() {
  return (
    <Router basename="/jd-generator">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<JobDetails />} />
      </Routes>
    </Router>
  );
}
