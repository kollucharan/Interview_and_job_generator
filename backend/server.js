
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
  const { role, level, skills } = req.body;
  
  if (!role) {
    return res.status(400).json({ error: "Job role is required" });
  }
  
  if (!level) {
    return res.status(400).json({ error: "Job level is required" });
  }
  
  try {
    const skillsText = skills ? `with expertise in ${skills}` : '';
    const skillsPrompt = skills ? `- Required Skills: ${skills}` : '- No specific skills provided';
    const skillsDescription = skills ? ` emphasizing the importance of skills in ${skills}` : '';
    const skillsResponsibilities = skills ? ` involving ${skills}` : '';
    const skillsQuestions = skills ? ` focusing on assessing expertise in ${skills}` : '';
    
    const promptContent = `You are an expert HR assistant. The user will provide a job role, level, and optionally skills.

A valid job role is any professional title composed of alphabetic words (with optional modifiers like "Junior", "Senior", "Lead", "Associate", etc.).
Examples: "Software Engineer", "Marketing Manager", "UX Designer".

If the input is NOT a professional job title (e.g., only digits, pure gibberish, empty, or punctuation), respond exactly with:
{
  "error": "Invalid job role provided."
}

Job details:
- Role: "${role}"
- Level: "${level}" (Options: Entry, Mid, Senior, Lead, Manager)
${skillsPrompt}

If the role is valid, generate a JSON object with two keys:

1. "description": a markdown string with four sections, tailored to the "${role}" role at the "${level}" level${skillsDescription}:

## Description
(Write a 4–5 sentence overview of the ${role} at ${level} level${skillsDescription})

## Responsibilities
(A bullet-list of 5–7 responsibilities appropriate for the ${level} level${skillsResponsibilities})

## Requirements
(A bullet-list of 5–7 requirements, including:
 - Experience appropriate for ${level} level (Entry: 0-2 years, Mid: 2-5 years, Senior: 5-8 years, Lead: 8+ years, Manager: 7+ years)
 - Education requirements
 ${skills ? `- Technical skills including ${skills}` : '- Relevant technical skills'}
 - Soft skills appropriate for the level)

## Benefits
(A bullet-list of 3–5 benefits suitable for this position level)

2. "questions": an array of ten relevant interview questions for a ${level} level ${role}${skillsQuestions}.

The questions should be appropriate for the job level:
- Entry: Basic knowledge and fundamental concepts
- Mid: Applied experience and practical scenarios
- Senior: Advanced problem-solving and optimization
- Lead: Strategic thinking and technical leadership
- Manager: Team management, project oversight, and business alignment

IMPORTANT: Respond with ONLY pure JSON. Do not wrap the JSON in markdown code blocks or add any additional text.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: promptContent
          },
        ],
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    // Get the raw content from the API response
    let aiOutput = response.data.choices[0].message.content.trim();
    
    // Remove markdown code block formatting if present
    if (aiOutput.startsWith("```json") || aiOutput.startsWith("```")) {
      aiOutput = aiOutput.replace(/^```json\n|^```\n|```$/g, "");
    }
    
    // Try parsing the JSON
    if (JSON.parse(aiOutput).error) {
        
      return res.status(400).json({ error: "Invalid job role provided." });
    }
  
   
    await pool.query("INSERT INTO roles (jobrole) VALUES ($1)", [role]);
  
    res.json(JSON.parse(aiOutput));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate job description" });
  }
  
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});