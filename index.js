const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "devansh0322.be23@chitkara.edu.in";

// GET /health
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

// Helper functions
const fibonacci = (n) => {
  let a = 0, b = 1, arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(a);
    [a, b] = [b, a + b];
  }
  return arr;
};

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);

// POST /bfhl
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (body.fibonacci !== undefined) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: fibonacci(body.fibonacci)
      });
    }

    if (body.prime !== undefined) {
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: body.prime.filter(isPrime)
      });
    }

    if (body.lcm !== undefined) {
      const result = body.lcm.reduce((a, b) => lcm(a, b));
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: result
      });
    }

    if (body.hcf !== undefined) {
      const result = body.hcf.reduce((a, b) => gcd(a, b));
      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: result
      });
    }

    if (body.AI !== undefined) {
      const aiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`,
        {
          contents: [{ parts: [{ text: body.AI }] }]
        }
      );

      const answer = aiRes.data.candidates[0].content.parts[0].text.split(" ")[0];

      return res.json({
        is_success: true,
        official_email: EMAIL,
        data: answer
      });
    }

    res.status(400).json({ is_success: false });

  } catch (err) {
    res.status(500).json({ is_success: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
