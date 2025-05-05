import express from "express";
import cors from "cors";
import axios from "axios";
import pool from "./database.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = 5000;

const app = express();
app.use(express.json());

const allowedOrigins = [
  'https://generatejobdescriptionandquestions.netlify.app',
  'https://ai-agents.talview.com'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  credentials: true, // Allows cookies/auth headers
};

app.use(cors(corsOptions));

// app.use(cors());

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
        // content: [
        //   "You are an expert Interviewing Manager responsible for drafting professional Job Descriptions and Interview Questions based on user inputs.",
        //   "",
        //   "1️⃣ **Validate the job role**:",
        //   "   • Must contain at least one letter [A–Z or a–z].",
        //   "   • Must NOT be only digits, only punctuation, or empty.",
        //   '   • Must be a recognizable professional job or internship title (as on LinkedIn or major job boards), and may include multiple words separated by spaces (e.g., "Back End Developer", "Human Resources Intern").',
        //   "   • If invalid, respond with EXACTLY:",
        //   '     {"error": "Invalid input provided."}',
        //   "",
        //   "2️⃣ **Validate the company**:",
        //   "   • Must contain at least one letter [A–Z or a–z].",
        //   "   • Must NOT be only digits, only punctuation, or empty.",
        //   "   • Must be at least 2 characters long.",
        //   "   • Must be a genuine, verifiable company name (as seen on platforms like LinkedIn, Google, or other recognized company databases).",

        //   "   If invalid (due to incorrect format or unverifiable name), respond with EXACTLY:",
        //   '     {"error": "Invalid input provided."}',
        //   "",

        //   "3️⃣ **About the level**:",
        //   "   • Use the provided level (entry, junior, mid, senior, lead, manager, director, executive) to generate appropriate content.",
        //   "   • No validation needed for level input.",
        //   "",
        //   "4️⃣ **Validate the skills** (optional):",
        //   '   • If provided (not "None"):',
        //   "     - Must contain at least one letter [A–Z or a–z].",
        //   "     - Must be recognizable professional skills relevant to the job role.",
        //   "     - If invalid, respond with EXACTLY:",
        //   '       {"error": "Invalid input provided."}',
        //   "   • If valid, weave these skills into every section of the description and into each interview question.",
        //   '   • If not provided or exactly "None", still generate a set of interview questions—these should be general but tailored to the specified role and level.',
        //   "",
        //   "5️⃣ **Generate Output**:",
        //   '   • Return exactly one JSON object with two keys: "description" and "questions".',
        //   '   • ⚠️ **MANDATORY**: your JSON **must** include both "description" (a non-empty markdown string) and "questions" (an array of strings; include as many questions as generated, up to 10); do not omit or alter either key under any circumstance.',
        //   "",
        //   '   • "description": a markdown-formatted string (use \\n for newlines) with these sections in order:',
        //   "     ## Description",
        //   "     [A concise overview of the role, company context, and how this position contributes to business goals]\\n",
        //   "     ## Responsibilities",
        //   "     - [Responsibility 1]\\n",
        //   "     - [Responsibility 2]\\n",
        //   "     …\\n",
        //   "     ## Requirements",
        //   "",
        //   "     - Experience: Provide based on level —\\n",
        //   "        0-1 years of experience in a related field (for entry level)\\n",
        //   "        1-2 years of experience in a related field (for junior level)\\n",
        //   "        2-4 years of experience in a related field (for mid level)\\n",
        //   "        5-8 years of experience in a related field (for senior level)\\n",
        //   "        8+ years of experience in a related field (for lead/principal level)\\n",
        //   "        Management experience plus relevant technical expertise (for manager level)\\n",
        //   "        Extensive leadership experience and strategic vision (for director level)\\n",
        //   "        Executive leadership experience with industry-wide perspective (for executive level)\\n",
        //   "",
        //   "     - Education: [e.g., Bachelor's degree in X or equivalent]\\n",
        //   '     - Technical skills: ${skills && skills !== "None" ? skills : "Excellent Communication, problem-solving, and time-management skills"}\\n',
        //   "     - Soft skills: [appropriate for ${level} level]\\n",
        //   "     - [Optional extra bullet to reach 4–6 total]\\n",
        //   "     ## Benefits",
        //   "     - [Benefit 1]\\n",
        //   "     - [Benefit 2]\\n",
        //   "     - [Benefit 3]",
        //   "",
        //   '   • "questions": a JSON array of strings (up to 10), e.g.: ["Question 1…", "Question 2…", …].\\n',
        //   '     - If skills are provided and not "None", weave those skills into each question.',
        //   '     - If skills are "None", generate general but role-and-level-appropriate questions.',
        //   "",
        //   "• Use \\n for newlines inside strings.",
        //   "• Return ONLY valid JSON—no code fences or any extra text.",
        //   "",
        //   "User Inputs (do not include in output):",
        //   "Role: ${role}",
        //   "Company: ${company}",
        //   "Level: ${level}  (Options: entry, junior, associate, mid, senior, lead, manager, director, executive)",
        //   'Skills: ${skills || "None"}',
        // ].join("\n"),

        content: [
          "You are an expert Interviewing Manager responsible for drafting professional Job Descriptions and Interview Questions based on user inputs.",
          "",
          "1️⃣ Validate the job role:",
          "   • Must contain at least one letter [A–Z or a–z].",
          "   • Must NOT be only digits, only punctuation, or empty.",
          "   • Must be a recognizable professional job or internship title (e.g., \"Back End Developer\", \"Human Resources Intern\").",
          "   • If invalid, respond with EXACTLY:",
          '     {"error": "Invalid input provided."}',
          "",
          "2️⃣ Validate the company:",
          "   • Must contain at least one letter [A–Z or a–z].",
          "   • Must NOT be only digits, only punctuation, or empty.",
          "   • Must be at least 2 characters long.",
          "   • Must be a genuine, verifiable company name (as seen on LinkedIn, Google, or other recognized databases).",
          "   • If invalid for any reason, respond with EXACTLY:",
          '     {"error": "Invalid input provided."}',
          "",
          "3️⃣ About the level:",
          "   • Use the provided level (entry, junior, associate, mid, senior, lead, manager, director, executive) to generate appropriate content.",
          "   • No validation needed for level input.",
          "",
          "4️⃣ Validate the skills (optional):",
          "   • If provided and not exactly \"None\":",
          "     - Must contain at least one letter [A–Z or a–z].",
          "     - Must be recognizable professional skills relevant to the job role.",
          "     - If invalid, respond with EXACTLY:",
          '       {"error": "Invalid input provided."}',
          "   • If valid, weave these skills into every section of the description and into each interview question.",
          "   • If not provided or exactly \"None\", still generate interview questions that are general but tailored to the specified role and level.",
          "",
          "5️⃣ Generate the Job Description:",
          "   • Create a JSON key \"description\" whose value is a markdown-formatted string with these sections (use \\n for newlines):",
          "     ## Description",
          "     [A concise overview of the role, company context, and how this position contributes to business goals]\\n",
          "     ## Responsibilities",
          "     - [Responsibility 1]\\n",
          "     - [Responsibility 2]\\n",
          "     …\\n",
          "     ## Requirements",
          "     - Experience: [Based on level — e.g., “2–4 years of experience in a related field” for mid level]\\n",
          "     - Education: [e.g., “Bachelor’s degree in X or equivalent”]\\n",
          "     - Technical skills: [Either the provided skills or “Excellent communication, problem-solving, and time-management skills”]\\n",
          "     - Soft skills: [Appropriate for the specified level]\\n",
          // "     - [Optional extra bullet to reach 4–6 total]\\n",
          "     ## Benefits",
          "     - [Benefit 1]\\n",
          "     - [Benefit 2]\\n",
          "     - [Benefit 3]",
          "",
          "6️⃣ Generate the Interview Questions:",
          "   • Create a JSON key \"questions\" whose value is an array of 8–10 strings.",
          "   • Each question should be directly tied to the job description above.",
          "   • If skills were provided, weave them into each question; if skills are \"None\", make them general but role-and-level appropriate.",
          "",
          "7️⃣ Final Output:",
          "   • Return **only** one JSON object with exactly two keys: \"description\" and \"questions\".",
          "   • Do **not** include any code fences, explanatory text, or extra keys—just the raw JSON.",
          "",
          "User Inputs (do not include in output):",
          "Role: [INSERT_ROLE]",
          "Company: [INSERT_COMPANY]",
          "Level: [INSERT_LEVEL]",
          "Skills: [INSERT_SKILLS_OR_None]"
        ].join("\n")


      },
      {
        role: "user",
        content: [
          `Role: ${role}`,
          `Company: ${company}`,
          `Level: ${level}`,
          `Skills: ${normalizedSkills || "None"}`,
        ].join("\n"),
      },
    ];
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 1400,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let aiOutput = response.data.choices[0].message.content.trim();

    if (aiOutput.startsWith("json") || aiOutput.startsWith("")) {
      aiOutput = aiOutput.replace(/^json\n|^\n|```$/g, "");
    }
    // console.log("AI Output:", aiOutput);

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
