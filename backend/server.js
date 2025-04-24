
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

// app.post("/generate", async (req, res) => {
//   const { role } = req.body;
//   if (!role) {
//     return res.status(400).json({ error: "Job role is required" });
//   }

  
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4-turbo",
//         messages: [{ role: "user", content: `
//           Generate a JSON object with two keys:
//             1. "description": a markdown string that contains exactly four sub‑sections, each marked with these Markdown headings and filled in for the ${role} role:
                
//                 ## Description
//                 (a 4–5 sentence overview of the ${role})
                
//                 ## Responsibilities
//                 (a bullet‑list of 5–7 key responsibilities, e.g.:
//                 - Item 1
//                 - Item 2
//                 …)
                
//                 ## Requirements
//                 (a bullet‑list of 5–7 must‑have requirements, e.g.:
//                 - Item 1
//                 - Item 2
//                 …)
                
//                 ## Benefits
//                 (a bullet‑list of 3–5 benefits, e.g.:
//                 - Item 1
//                 - Item 2
//                 …)
                
//             2. "questions": an array of ten interview questions for a ${role}.
            
//             Output **only** valid JSON—no extra text, no explanations.
//         ` }],
//         max_tokens: 1000,
//       },
//       {
//         headers: {
//           "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const aiOutput = response.data.choices[0].message.content.trim();
   
//     res.json(JSON.parse(aiOutput));
//   }


//   catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to generate job description" });
//   }
// });

app.post("/generate", async (req, res) => {
  // console.log("Received request to generate job description");
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: "Job role is required" });
  }

  try {
   
    // const response = await axios.post(
    //   "https://api.openai.com/v1/chat/completions",
    //   {
    //     model: "gpt-4-turbo",
    //     messages: [
    //       {
    //         role: "user",
    //         content: `
    //         Generate a JSON object with two keys:
    //           1. "description": a markdown string that contains exactly four sub‑sections, each marked with these Markdown headings and filled in for the ${role} role:
                  
    //               ## Description
    //               (a 4–5 sentence overview of the ${role})
                  
    //               ## Responsibilities
    //               (a bullet‑list of 5–7 key responsibilities, e.g.:
    //               - Item 1
    //               - Item 2
    //               …)
                  
    //               ## Requirements
    //               (a bullet‑list of 5–7 must‑have requirements, e.g.:
    //               - Item 1
    //               - Item 2
    //               …)
                  
    //               ## Benefits
    //               (a bullet‑list of 3–5 benefits, e.g.:
    //               - Item 1
    //               - Item 2
    //               …)
                  
    //           2. "questions": an array of ten interview questions for a ${role}.
              
    //           Output **only** valid JSON—no extra text, no explanations.
    //         `,
    //       },
    //     ],
    //     max_tokens: 1000,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
     
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `
    You are an expert HR assistant. The user will provide a job role.
    
     A valid job role is any professional title composed of alphabetic words (with optional modifiers like "Junior", "Senior", "Lead", "Associate", etc.).  
  Examples: "Junior Software Engineer", "Marketing Manager", "Lead UX Designer".

 If the input is NOT a professional job title (e.g., only digits, pure gibberish, empty, or punctuation), respond exactly with:
  {
    "error": "Invalid job role provided."
  }
    
    If the role is valid, generate a JSON object with two keys:
    
    1. "description": a markdown string with four sections, filled out for the "${role}" role:
    
    ## Description
    (Write a 4–5 sentence overview of the ${role})
    
    ## Responsibilities
    (A bullet-list of 5–7 responsibilities)
    
    ## Requirements
    (A bullet-list of 5–7 requirements)
    
    ## Benefits
    (A bullet-list of 3–5 benefits)
    
    2. "questions": an array of ten relevant interview questions for a ${role}.
    
    Respond with **only valid JSON**—no extra text, no explanations.
            `,
          },
        ],
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    // await pool.query("INSERT INTO roles (jobrole) VALUES ($1)", [role]);
 
    // const aiOutput = response.data.choices[0].message.content.trim();

    // res.json(JSON.parse(aiOutput));

    const aiOutput = response.data.choices[0].message.content.trim();

  // const parsed = JSON.parse(aiOutput);

  
  if (JSON.parse(aiOutput).error) {
    // return res.status(400).json(JSON.parse(aiOutput)); 
    return res.status(400).json({ error: "Invalid job role provided." });
  }

 
  await pool.query("INSERT INTO roles (jobrole) VALUES ($1)", [role]);

  res.json(JSON.parse(aiOutput));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate job description" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});