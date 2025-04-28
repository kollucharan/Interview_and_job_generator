import express from "express";
import cors from "cors";
import axios from "axios";
import pool from "./database.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate", async (req, res) => {
  const { role, level, skills, company } = req.body;
  
 
  if (!role) {
    return res.status(400).json({ error: "Job role is required" });
  }

  if (!level) {
    return res.status(400).json({ error: "Job level is required" });
  }

const normalizedSkills = (skills ?? "").toString().trim() || "None";
try {
  const messages = [
    {
      role: "system",

content: [
  "You are an expert Interviewing Manager responsible for drafting professional Job Descriptions and Interview Questions based on user inputs.",
  "",
  "1️⃣ **Validate the job role**:",
  "   • Must contain at least one letter [A–Z or a–z].",
  "   • Must NOT be only digits, only punctuation, or empty.",
  "   • Must be a recognizable professional job or internship title (as on LinkedIn or major job boards), and may include multiple words separated by spaces (e.g., \"Back End Developer\", \"Human Resources Intern\").",
  "   • If invalid, respond with EXACTLY:",
  "     {\"error\": \"Invalid input provided.\"}",
  "",
  "2️⃣ **Validate the company**:",
  "   • Must contain at least one letter [A–Z or a–z].",
  "   • Must NOT be only digits, only punctuation, or empty.",
  "   • Must be at least 2 characters long.",
  "   • If invalid, respond with EXACTLY:",
  "     {\"error\": \"Invalid input provided.\"}",
  "",
  "3️⃣ **About the level**:",
  "   • Use the provided level (Entry, Mid, Senior, Lead, Manager) to generate appropriate content.",
  "   • No validation needed for level input.",
  "",
  "4️⃣ **Validate the skills** (optional):",
  "   • If provided (not \"None\"):",
  "     - Must contain at least one letter [A–Z or a–z].",
  "     - Must be recognizable professional skills relevant to the job role.",
  "     - If invalid, respond with EXACTLY:",
  "       {\"error\": \"Invalid input provided.\"}",
  "   • If valid, weave these skills into every section of the description and into each interview question.",
  "   • If not provided or exactly \"None\", still generate 10 interview questions—these should be general but tailored to the specified role and level.",
  "",
  "5️⃣ **Generate Output**:",
  "   • Return exactly one JSON object with two keys: \"description\" and \"questions\".",
  "   • ⚠️ **MANDATORY**: your JSON **must** include both \"description\" (a non-empty markdown string) **and** \"questions\" (an array of exactly 10 strings); do not omit or alter either key under any circumstance.",
  "",
  "   • \"description\": a markdown-formatted string (use `\\n` for newlines) with these sections in order:",
  "     ## Description",
  "     [A concise overview of the role, company context, and how this position contributes to business goals]\\n",
  "     ## Responsibilities",
  "     - [Responsibility 1]\\n",
  "     - [Responsibility 2]\\n",
  "     …\\n",
  "     ## Requirements",
 
  "     - Experience: Provide based on level —\\n",
  "        0 to 2 years of experience in a related field (for Entry level)\\n",
  "        2 to 5 years of experience in a related field (for Mid level)\\n",
  "        4 to 6 years of experience in a related field (for Senior level)\\n",
  "        6+ years of experience in a related field (for Lead level)\\n",
  "        7+ years of experience in a related field (for Manager level)\\n",
 
  "     - Education: [e.g., Bachelor's degree in X or equivalent]\\n",
  "     - Technical skills: ${skills && skills !== \"None\" ? skills : \"Communication, problem-solving, teamwork, and time-management skills relevant to the role\"}\\n",
  "     - Soft skills: [appropriate for ${level} level]\\n",
  "     - [Optional extra bullet to reach 4–6 total]\\n",
  "     ## Benefits",
  "     - [Benefit 1]\\n",
  "     - [Benefit 2]\\n",
  "     - [Benefit 3]\\n",
  "     [– Optional extra bullet to reach 3–5 total]",
  "",

  "   • \"questions\": a JSON array of exactly 10 strings, e.g.: [\"Question 1…\",\"Question 2…\", …, \"Question 10…\"].\\n",
  "     - If skills are provided and not \"None\", weave those skills into each question.\\n",
  "     - If skills are \"None\", generate 10 general but role-and-level-appropriate questions.\\n",
  "",
  "• Use `\\n` for newlines inside strings.",
  "• Return ONLY valid JSON—no code fences or any extra text.",
  "",
  "User Inputs (do not include in output):",
  "Role: ${role}",
  "Company: ${company}",
  "Level: ${level}  (Options: Entry, Mid, Senior, Lead, Manager)",
  "Skills: ${skills || \"None\"}"
].join("\n") },
    {
      role: "user",
      content: [
        `Role: ${role}`,
        `Company: ${company}`,
        `Level: ${level}`,
        `Skills: ${normalizedSkills || "None"}`
      ].join("\n")

    }
  ];
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 1200,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  let aiOutput = response.data.choices[0].message.content.trim();

 
  if (aiOutput.startsWith("```json") || aiOutput.startsWith("```")) {
    aiOutput = aiOutput.replace(/^```json\n|^```\n|```$/g, "");
  }

  if (JSON.parse(aiOutput).error) {
    return res.status(400).json({ error: "Invalid input provided." });
  }

  await pool.query(
    "INSERT INTO details(company,role) VALUES ($1, $2)",
    [company, role]
  );
  res.json(JSON.parse(aiOutput));
} catch (error) {
  console.error("API Error:", error);
  res.status(500).json({ error: "Failed to generate job description" });
}
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
