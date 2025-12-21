/**********************************
 * ENV SETUP
 **********************************/
require("dotenv").config();

/**********************************
 * IMPORTS
 **********************************/
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fetch = require("node-fetch"); // keep if Node < 18

/**********************************
 * APP INIT (MUST BE FIRST)
 **********************************/
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://collab-theta-steel.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**********************************
 * DATABASE CONNECTION
 **********************************/
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb",
});

db.connect(err => {
  if (err) {
    console.error("❌ MySQL failed:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

/**********************************
 * MULTER CONFIG
 **********************************/
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

/**********************************
 * GEMINI HELPER
 **********************************/
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    }
  );

  const data = await response.json();

  if (!data.candidates || !data.candidates.length) {
    throw new Error("Gemini returned no candidates");
  }

  return data.candidates[0].content.parts[0].text;
}

/**********************************
 * USER ROUTES
 **********************************/
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
  console.log("LOGIN BODY:", req.body);

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, rows) => {
      console.log("DB ROWS:", rows);

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
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
});

/**********************************
 * 🔥 AI MATCH (ONE → MANY)
 **********************************/
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
You are an AI skill-matching system.

Return a JSON ARRAY only.
Do not explain anything.

If users have ANY overlapping or complementary skills,
you MUST return at least one match.

Format:
[
  { "userId": number, "score": number, "reason": string }
]

Scoring rules:
- 70–100: strong reciprocal match
- 40–69: partial but useful match
- 20–39: weak but possible match

MY PROFILE:
Learn: ${me.skills_to_learn}
Teach: ${me.skills_to_teach}

OTHER USERS:
${users.map(u => `
UserId: ${u.id}
Learn: ${u.skills_to_learn}
Teach: ${u.skills_to_teach}
`).join("\n")}
`;


        try {
  let text = await callGemini(prompt);

  text = text.replace(/```json|```/g, "").trim();

  let parsed = JSON.parse(text);

  // If Gemini actually returns something valid
  if (Array.isArray(parsed) && parsed.length > 0) {
    parsed = parsed.map(m => ({
      userId: m.userId,
      score: Number(m.score) || 0,
      reason: m.reason || "AI-based compatibility analysis",
      isFallback: false
    }));

    parsed.sort((a, b) => b.score - a.score);
    return res.json(parsed);
  }

  throw new Error("Empty Gemini response");

} catch (err) {
  console.error("❌ Gemini HARD FAILURE:", err.message);

  // ✅ SMART FALLBACK (MOVED HERE)
  const fallback = users.map(u => {
    const myLearn = (me.skills_to_learn || "")
      .toLowerCase()
      .split(",")
      .map(s => s.trim());

    const myTeach = (me.skills_to_teach || "")
      .toLowerCase()
      .split(",")
      .map(s => s.trim());

    const uLearn = (u.skills_to_learn || "")
      .toLowerCase()
      .split(",")
      .map(s => s.trim());

    const uTeach = (u.skills_to_teach || "")
      .toLowerCase()
      .split(",")
      .map(s => s.trim());

    let score = 20;

    myLearn.forEach(skill => {
      if (uTeach.includes(skill)) score += 25;
    });

    myTeach.forEach(skill => {
      if (uLearn.includes(skill)) score += 25;
    });

    score = Math.min(score, 90);

    // ✅ THIS LOG WILL NOW APPEAR
    console.log("Fallback score for user", u.id, "=", score);

    return {
      userId: u.id,
      score,
      reason:
        score >= 60
          ? "Strong reciprocal skill match"
          : score >= 40
          ? "Partial skill overlap"
          : "Low skill overlap",
      isFallback: true
    };
  });

  fallback.sort((a, b) => b.score - a.score);
  return res.json(fallback);
}


      }
    );
  });
});

/**********************************
 * START SERVER
 **********************************/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
