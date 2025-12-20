require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors({
  origin: "https://collab-theta-steel.vercel.app",
  credentials: true
}));

const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const fetch = require("node-fetch");

dotenv.config();

/* =========================
   APP SETUP
========================= */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   DB CONNECTION
========================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL failed:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

/* =========================
   MULTER
========================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

/* =========================
   GEMINI REST HELPER (FIX)
========================= */
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!data.candidates) {
    throw new Error("Gemini returned no candidates");
  }

  return data.candidates[0].content.parts[0].text;
}

/* =========================
   USER ROUTES
========================= */
app.get("/users", (req, res) => {
  db.query(
    "SELECT id, fullName, skills_to_learn, skills_to_teach FROM users",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

app.get("/users/top/:id", (req, res) => {
  db.query(
    "SELECT id, fullName, skills_to_learn, skills_to_teach FROM users WHERE id != ? LIMIT 5",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

app.get("/user/:id", (req, res) => {
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length) return res.status(404).json({});
      res.json(rows[0]);
    }
  );
});

app.post("/register", (req, res) => {
  const { fullName, email, password } = req.body;
  db.query(
    "INSERT INTO users (fullName,email,password) VALUES (?,?,?)",
    [fullName, email, password],
    (err, result) => {
      if (err) return res.status(400).json({ message: "User exists" });
      res.json({ userId: result.insertId });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      if (!rows.length)
        return res.status(401).json({ message: "Invalid credentials" });
      res.json({ user: rows[0] });
    }
  );
});

app.post("/update-skills/:id", upload.single("profilePic"), (req, res) => {
  const { skills_to_learn, skills_to_teach } = req.body;
  const pic = req.file ? req.file.filename : null;

  db.query(
    "UPDATE users SET skills_to_learn=?, skills_to_teach=?, profile_pic=? WHERE id=?",
    [skills_to_learn, skills_to_teach, pic, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
});

/* =========================
   🔥 AI MATCH (ONE → MANY)
========================= */
app.post("/ai-match-many", async (req, res) => {
  const { userId } = req.body;

  db.query("SELECT * FROM users WHERE id = ?", [userId], async (err, meRows) => {
    if (err || !meRows.length) return res.json([]);

    const me = meRows[0];

    db.query(
      "SELECT * FROM users WHERE id != ?",
      [userId],
      async (err, users) => {
        if (err || !users.length) return res.json([]);

        const prompt = `
Return ONLY valid JSON array.

[
 { "userId": number, "score": NUMBER (not string), "reason": "short reason" }
]

Rules:
- Score from 0 to 100
- Higher score = better skill exchange
- Be realistic

MY PROFILE:
Learn: ${me.skills_to_learn}
Teach: ${me.skills_to_teach}

OTHER USERS:
${users
  .map(
    (u) => `
UserId: ${u.id}
Learn: ${u.skills_to_learn}
Teach: ${u.skills_to_teach}
`
  )
  .join("\n")}
`;

        try {
          let text = await callGemini(prompt);
          text = text.replace(/```json|```/g, "").trim();

          let parsed = JSON.parse(text);

// 🔥 FORCE score to number
parsed = parsed.map(m => ({
  ...m,
  score: Number(m.score)
}));

// ✅ FILTER AFTER CONVERSION
const filteredMatches = parsed.filter(m => m.score >= 50);

// sort highest first
filteredMatches.sort((a, b) => b.score - a.score);

res.json(filteredMatches);


          // OPTIONAL: sort highest first
          filteredMatches.sort((a, b) => b.score - a.score);

          res.json(filteredMatches);
        } catch (e) {
          // Silent fallback
          res.json([]);
        }
      }
    );
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

