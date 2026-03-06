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
const fetch = require("node-fetch"); // Node < 18

/**********************************
 * APP INIT
 **********************************/
const app = express();

/**********************************
 * CORS
 **********************************/
const allowedOrigins = [
  "http://localhost:5173",
  "https://collab-theta-steel.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**********************************
 * DATABASE
 **********************************/
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection once
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Pool Connection Failed:", err);
  } else {
    console.log("✅ MySQL Pool Connected");
    connection.release();
  }
});



/**********************************
 * MULTER
 **********************************/
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));



/**********************************
 * GEMINI API CALLER
 **********************************/
async function callGemini(prompt) {
  // Use v1beta for the most recent model features
 const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more consistent matching
          responseMimeType: "application/json" // Forces valid JSON output
        }
      }),
    });

    // 1. Check for HTTP errors (like 404, 429, or 500)
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Gemini API Error (${res.status}):`, errorText);
      throw new Error(`Gemini API failed with status ${res.status}`);
    }

    const data = await res.json();

    // 2. Validate the response structure
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Gemini returned no candidates (check safety settings)");
    }

    // 3. Extract the text
    const resultText = data.candidates[0].content.parts[0].text;
    
    return resultText;
  } catch (error) {
    console.error("❌ Error in callGemini:", error.message);
    throw error; // Re-throw so your 'ai-match-many' route hits the 'catch' and uses fallback
  }
}
/**********************************
 * SAFE JSON PARSER
 **********************************/
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[.*\]/s);
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid JSON");
  }
}
/**********************************
 * GET TOP COLLABORATORS
 **********************************/
app.get("/users/top/:id", (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT id, fullName, skills_to_teach, skills_to_learn, profile_pic FROM users WHERE id != ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json([]);
      }

      res.json(rows);
    }
  );
});

/**********************************
 * GET USER PROFILE BY ID
 **********************************/
app.get("/user/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT id, fullName, email, skills_to_learn, skills_to_teach, profile_pic FROM users WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.error("❌ DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!rows.length) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(rows[0]);
    }
  );
});

/**********************************
 * GET USERS BY SKILL
 **********************************/
app.get("/users/skill/:skill", (req, res) => {
  const skill = req.params.skill.toLowerCase();

  db.query(
    "SELECT id, fullName, skills_to_teach, skills_to_learn, profile_pic FROM users WHERE LOWER(skills_to_teach) LIKE ?",
    [`%${skill}%`],
    (err, rows) => {
      if (err) return res.status(500).json([]);
      res.json(rows);
    }
  );
});


/**********************************
 * USER ROUTES
 **********************************/
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

  db.query("SELECT * FROM users WHERE id=?", [userId], async (err, meRows) => {
    if (err || !meRows.length) return res.json([]);

    const me = meRows[0];

    db.query(
      "SELECT * FROM users WHERE id!=?",
      [userId],
      async (err, users) => {
        if (err || !users.length) return res.json([]);

        // 🔑 User lookup map
        const userMap = {};
        users.forEach(u => {
          userMap[u.id] = {
            name: u.fullName,
            profile_pic: u.profile_pic
          };
        });

        const prompt = `
You are an AI skill-matching engine.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations
- No comments

DEFINITION OF MATCH:
A STRONG or PERFECT match exists ONLY when:
- Skills that User A wants to learn are present in User B's teach skills
AND
- Skills that User A can teach are present in User B's learn skills

IMPORTANT:
- Same-skill overlap without reciprocity is NOT a strong match.

JSON FORMAT:
[
 { "userId": number, "score": number, "reason": string }
]

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

          const parsed = safeJsonParse(text);

          if (!Array.isArray(parsed) || !parsed.length)
            throw new Error("Empty AI response");

          const result = parsed
  .map(m => ({
    userId: m.userId, // 🔥 ADD THIS
    name: userMap[m.userId]?.name || "Unknown User",
    profile_pic: userMap[m.userId]?.profile_pic || null,
    score: Number(m.score) || 0,
    reason: m.reason || "AI skill compatibility",
    isFallback: false
  }))

            .sort((a, b) => b.score - a.score);

          return res.json(result);

        } catch (e) {
          console.error("⚠️ Gemini Failed → Fallback");

          const fallback = users.map(u => {
            const split = s =>
              (s || "")
                .toLowerCase()
                .split(",")
                .map(x => x.trim())
                .filter(Boolean);

            const myLearn = split(me.skills_to_learn);
            const myTeach = split(me.skills_to_teach);
            const uLearn = split(u.skills_to_learn);
            const uTeach = split(u.skills_to_teach);

            let reciprocalMatches = 0;
            let oneSidedMatches = 0;

            myLearn.forEach(skill => {
              if (uTeach.includes(skill)) reciprocalMatches++;
            });

            myTeach.forEach(skill => {
              if (uLearn.includes(skill)) reciprocalMatches++;
            });

            myTeach.forEach(skill => {
              if (uTeach.includes(skill)) oneSidedMatches++;
            });

            let score = 0;
            let reason = "Low skill overlap";

            if (reciprocalMatches >= 2) {
              score = 90;
              reason = "Perfect reciprocal skill exchange";
            } else if (reciprocalMatches === 1) {
              score = 65;
              reason = "Partial reciprocal skill match";
            } else if (oneSidedMatches > 0) {
              score = 30;
              reason = "Same-skill similarity without exchange value";
            } else {
              score = 15;
              reason = "No meaningful skill alignment";
            }

            return {
  userId: u.id, // 🔥 ADD THIS
  name: u.fullName,
  profile_pic: u.profile_pic,
  score,
  reason,
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
 * SEND COLLAB REQUEST
 **********************************/
app.post("/collab-request/send", (req, res) => {
  console.log("🔥 SEND ROUTE HIT");
  console.log("BODY:", req.body);

  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  if (senderId === receiverId) {
    return res.status(400).json({ message: "Cannot send request to yourself" });
  }

  const insertQuery = `
    INSERT INTO collab_requests (sender_id, receiver_id, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(insertQuery, [senderId, receiverId], (err, result) => {
    if (err) {
      console.error("❌ INSERT ERROR:", err);
      return res.status(500).json({ message: "Insert failed" });
    }

    console.log("✅ Inserted ID:", result.insertId);
    res.json({ success: true });
  });
});

/**********************************
 * GET COLLAB REQUESTS FOR USER
 **********************************/
app.get("/collab-requests/:userId", (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      cr.id AS requestId,
      u.fullName AS name,
      u.profile_pic,
      cr.status,
      cr.created_at
    FROM collab_requests cr
    JOIN users u ON cr.sender_id = u.id
    WHERE cr.receiver_id = ?
      AND cr.status = 'pending'
    ORDER BY cr.created_at DESC
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Collab Request Fetch Error:", err);
      return res.status(500).json([]);
    }

    res.json(rows);
  });
});
app.post("/collab-request/accept", (req, res) => {
  const { requestId } = req.body;

  db.query(
    "UPDATE collab_requests SET status='accepted' WHERE id=?",
    [requestId],
    err => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
});
app.post("/collab-request/reject", (req, res) => {
  const { requestId } = req.body;

  db.query(
    "UPDATE collab_requests SET status='rejected' WHERE id=?",
    [requestId],
    err => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
});
/**********************************
 * GET COLLAB REQUEST COUNT
 **********************************/
app.get("/collab-requests-count/:userId", (req, res) => {

  const { userId } = req.params;

  const query = `
    SELECT COUNT(*) AS count
    FROM collab_requests
    WHERE receiver_id = ?
    AND status = 'pending'
  `;

  db.query(query, [userId], (err, rows) => {

    if (err) {
      console.error("❌ Count Fetch Error:", err);
      return res.status(500).json({ count: 0 });
    }

    res.json({
      count: rows[0].count
    });

  });

});



/**********************************
 * START SERVER
 **********************************/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
