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
  console.log("request recieved");

  if (!role) {
    return res.status(400).json({ error: "Job role is required" });
  }

  if (!level) {
    return res.status(400).json({ error: "Job level is required" });
  }

  //   try {
  //     const skillsText = skills ? `with expertise in ${skills}` : '';
  //     const skillsPrompt = skills ? `- Required Skills: ${skills}` : '- No specific skills provided';
  //     const skillsDescription = skills ? ` emphasizing the importance of skills in ${skills}` : '';
  //     const skillsResponsibilities = skills ? ` involving ${skills}` : '';
  //     const skillsQuestions = skills ? ` focusing on assessing expertise in ${skills}` : '';

  //     const promptContent = `You are an expert HR assistant. The user will provide a job role, level, and optionally skills.

  // A valid job role is any professional title composed of alphabetic words (with optional modifiers like "Junior", "Senior", "Lead", "Associate", etc.).
  // Examples: "Software Engineer", "Marketing Manager", "UX Designer".

  // If the input is NOT a professional job title (e.g., only digits, pure gibberish, empty, or punctuation), respond exactly with:
  // {
  //   "error": "Invalid job role provided."
  // }

  // Job details:
  // - Role: "${role}"
  // - Level: "${level}" (Options: Entry, Mid, Senior, Lead, Manager)
  // ${skillsPrompt}

  // If the role is valid, generate a JSON object with two keys:

  // 1. "description": a markdown string with four sections, tailored to the "${role}" role at the "${level}" level${skillsDescription}:

  // ## Description
  // (Write a 4–5 sentence overview of the ${role} at ${level} level${skillsDescription})

  // ## Responsibilities
  // (A bullet-list of 5–7 responsibilities appropriate for the ${level} level${skillsResponsibilities})

  // ## Requirements
  // (A bullet-list of 5–7 requirements, including:
  //  - Experience appropriate for ${level} level (Entry: 0-2 years, Mid: 2-5 years, Senior: 5-8 years, Lead: 8+ years, Manager: 7+ years)
  //  - Education requirements
  //  ${skills ? `- Technical skills including ${skills}` : '- Relevant technical skills'}
  //  - Soft skills appropriate for the level)

  // ## Benefits
  // (A bullet-list of 3–5 benefits suitable for this position level)

  // 2. "questions": an array of ten relevant interview questions for a ${level} level ${role}${skillsQuestions}.

  // The questions should be appropriate for the job level:
  // - Entry: Basic knowledge and fundamental concepts
  // - Mid: Applied experience and practical scenarios
  // - Senior: Advanced problem-solving and optimization
  // - Lead: Strategic thinking and technical leadership
  // - Manager: Team management, project oversight, and business alignment

  // IMPORTANT: Respond with ONLY pure JSON. Do not wrap the JSON in markdown code blocks or add any additional text.`;

  //     const response = await axios.post(
  //       "https://api.openai.com/v1/chat/completions",
  //       {

  //         model: "gpt-3.5-turbo",
  //         messages: [
  //           {
  //             role: "user",
  //             content: promptContent
  //           },
  //         ],
  //         max_tokens: 1500,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     let aiOutput = response.data.choices[0].message.content.trim();

  //     if (aiOutput.startsWith("```json") || aiOutput.startsWith("```")) {
  //       aiOutput = aiOutput.replace(/^```json\n|^```\n|```$/g, "");
  //     }

  //     if (JSON.parse(aiOutput).error) {

  //       return res.status(400).json({ error: "Invalid job role provided." });
  //     }

  //     await pool.query(
  //       "INSERT INTO details (company, role) VALUES ($1, $2)",
  //       [company, role]
  //     );

  //     res.json(JSON.parse(aiOutput));
  //   }

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
    "   • Must be a recognizable professional job title (as on LinkedIn or major job boards).",
    "   • If invalid, respond with EXACTLY:",
    "     {\"error\": \"Invalid or unrecognized job role provided.\"}",
    "",
    "2️⃣ **Validate the level**:",
    "   • Must be one of: Entry, Mid, Senior, Lead, Manager.",
    "   • If invalid, respond with EXACTLY:",
    "     {\"error\": \"Invalid level provided. Must be Entry, Mid, Senior, Lead, or Manager.\"}",
    "",
    "3️⃣ **Validate the skills** (optional):",
    "   • If provided and not \"None\", weave these skills into every section of the description and into each interview question.",
    "   • If not provided or exactly \"None\", still generate 10 interview questions—these should be general but tailored to the specified role and level.",
    "",
    "4️⃣ **Generate Output**:",
    "   • Return exactly one JSON object with two keys: \"description\" and \"questions\".",
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
   
    "     - Education: [e.g., Bachelor’s degree in X or equivalent]\\n",
    "     - Technical skills: ${skills && skills !== \"None\" ? skills : \"Communication, problem-solving, teamwork, and time-management skills relevant to the role\"}\\n",
    "     - Soft skills: [appropriate for ${level} level]\\n",
    "     - [Optional extra bullet to reach 4–6 total]\\n",
    "     ## Benefits",
    "     - [Benefit 1]\\n",
    "     - [Benefit 2]\\n",
    "     - [Benefit 3]\\n",
    "     [– Optional extra bullet to reach 3–5 total]",
    "",
    "   • \"questions\": an array of 10 interview questions tailored to the specified Role and Level.\\n",
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
          `Skills: ${skills || "None"}`
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
      return res.status(400).json({ error: "Invalid job role provided." });
    }

   
    await pool.query(
      "INSERT INTO details (company, role) VALUES ($1, $2)",
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
