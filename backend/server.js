
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate", async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ error: "Job role is required" });
  }
  
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: `
          Generate a JSON object with two keys:
            1. "description": a markdown string that contains exactly four sub‑sections, each marked with these Markdown headings and filled in for the ${role} role:
                
                ## Description
                (a 2–3 sentence overview of the ${role})
                
                ## Responsibilities
                (a bullet‑list of 5–7 key responsibilities, e.g.:
                - Item 1
                - Item 2
                …)
                
                ## Requirements
                (a bullet‑list of 5–7 must‑have requirements, e.g.:
                - Item 1
                - Item 2
                …)
                
                ## Benefits
                (a bullet‑list of 3–5 benefits, e.g.:
                - Item 1
                - Item 2
                …)
                
            2. "questions": an array of ten interview questions for a ${role}.
            
            Output **only** valid JSON—no extra text, no explanations.
        ` }],
        max_tokens: 1000,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    const aiOutput = response.data.choices[0].message.content.trim();
    // console.log(aiOutput);
    // console.log(JSON.parse(aiOutput));
    
    res.json(JSON.parse(aiOutput));
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate job description" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});