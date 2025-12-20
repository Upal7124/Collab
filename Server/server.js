const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   DATABASE CONNECTION
========================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

/* =========================
   MULTER SETUP (PROFILE PIC)
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* =========================
   GEMINI SETUP
========================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =========================
   ROUTES
========================= */

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

/* ---------- USERS ---------- */

// Get all users
app.get("/users", (req, res) => {
  db.query(
    "SELECT id, fullName, email, skills_to_learn, skills_to_teach FROM users",
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    }
  );
});

// Get users except logged-in user
// Get logged-in user profile
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT id, fullName, email, skills_to_teach, skills_to_learn, profile_pic
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0)
      return res.status(404).send({ message: "User not found" });

    res.send(result[0]);
  });
});

// Register
app.post("/register", (req, res) => {
  const { fullName, email, password } = req.body;

  const sql =
    "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)";

  db.query(sql, [fullName, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).send({
        message: "Email already exists or DB error"
      });
    }

    res.send({
      message: "✅ User registered successfully!",
      userId: result.insertId
    });
  });
});


// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "DB error" });
    }

    if (results.length === 0) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    res.send({
      message: "✅ Login successful",
      user: results[0],
    });
  });
});


/* ---------- SKILL SETUP (🔥 IMPORTANT) ---------- */
app.post(
  "/update-skills/:id",
  upload.single("profilePic"),
  (req, res) => {
    const userId = req.params.id;
    const { skills_to_teach, skills_to_learn } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    const sql = `
      UPDATE users
      SET skills_to_teach = ?, skills_to_learn = ?, profile_pic = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [skills_to_teach, skills_to_learn, profilePic, userId],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("DB update failed");
        }

        res.send({ message: "✅ Skills updated successfully" });
      }
    );
  }
);

/* =========================
   🔥 GEMINI MATCHING APIs
========================= */

// Match two users
app.post("/ai-match", async (req, res) => {
  try {
    const { userAId, userBId } = req.body;

    const getUser = (id) =>
      new Promise((resolve, reject) => {
        db.query(
          "SELECT fullName, skills_to_learn, skills_to_teach FROM users WHERE id = ?",
          [id],
          (err, result) => {
            if (err) reject(err);
            else resolve(result[0]);
          }
        );
      });

    const userA = await getUser(userAId);
    const userB = await getUser(userBId);

    if (!userA || !userB)
      return res.status(404).send({ message: "User not found" });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are an AI matching engine for a skill-exchange platform.

User A:
Name: ${userA.fullName}
Wants to learn: ${userA.skills_to_learn}
Can teach: ${userA.skills_to_teach}

User B:
Name: ${userB.fullName}
Wants to learn: ${userB.skills_to_learn}
Can teach: ${userB.skills_to_teach}

Return ONLY valid JSON:
{
  "matchScore": number,
  "reason": "short explanation"
}
`;

    const result = await model.generateContent(prompt);
    res.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("AI Match Error:", error);
    res.status(500).send({ message: "AI matching failed" });
  }
});

// Match one user with many
app.post("/ai-match-many", async (req, res) => {
  try {
    const { userId } = req.body;

    db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      async (err, meResult) => {
        if (err || meResult.length === 0)
          return res.status(404).send("User not found");

        const me = meResult[0];

        db.query(
          "SELECT * FROM users WHERE id != ?",
          [userId],
          async (err, users) => {
            if (err) return res.status(500).send(err);

            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
My profile:
Name: ${me.fullName}
Learn: ${me.skills_to_learn}
Teach: ${me.skills_to_teach}

Other users:
${users
  .map(
    (u) => `
User ID: ${u.id}
Name: ${u.fullName}
Learn: ${u.skills_to_learn}
Teach: ${u.skills_to_teach}
`
  )
  .join("\n")}

Return ONLY JSON array:
[
  { "userId": number, "score": number, "reason": "short" }
]
`;

            const result = await model.generateContent(prompt);
            res.json(JSON.parse(result.response.text()));
          }
        );
      }
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

/* =========================
   SERVER START
========================= */
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
