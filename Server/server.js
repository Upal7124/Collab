require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fetch = require("node-fetch");

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    message: "Too many requests, please try again later.",
  },
});

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
  }),
);
app.use(apiLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error(" Pool Connection Failed:", err);
  } else {
    console.log(" MySQL Pool Connected");
    connection.release();
  }
});
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

app.use("/api/auth", authRoutes(db));
app.use("/api/users", userRoutes(db));
app.use("/api/matches", matchRoutes(db));

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post(
  "/update-skills",
  authenticateToken,
  upload.single("profilePic"),
  (req, res) => {
    const { skills_to_learn, skills_to_teach } = req.body;
    const pic = req.file ? req.file.filename : null;

    db.query(
      "UPDATE users SET skills_to_learn=?, skills_to_teach=?, profile_pic=? WHERE id=?",
      [skills_to_learn, skills_to_teach, pic, req.user.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Updated" });
      },
    );
  },
);

app.post("/api/collab-requests", authenticateToken, (req, res) => {
  console.log(" SEND ROUTE HIT");
  console.log("BODY:", req.body);
  const { receiverId } = req.body;
  const senderId = req.user.id;

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
      console.error(" INSERT ERROR:", err);
      return res.status(500).json({ message: "Insert failed" });
    }

    console.log(" Inserted ID:", result.insertId);
    res.json({ success: true });
  });
});

app.get("/api/collab-requests", authenticateToken, (req, res) => {
  const userId = req.user.id;

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
      console.error(" Collab Request Fetch Error:", err);
      return res.status(500).json([]);
    }

    res.json(rows);
  });
});
app.patch(
  "/api/collab-requests/:requestId/accept",
  authenticateToken,
  (req, res) => {
    const { requestId } = req.params;

    db.query(
      `UPDATE collab_requests
     SET status = 'accepted'
     WHERE id = ?
     AND receiver_id = ?
     AND status = 'pending'`,
      [requestId, req.user.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Request not found",
          });
        }

        res.json({ success: true });
      },
    );
  },
);
app.patch(
  "/api/collab-requests/:requestId/reject",
  authenticateToken,
  (req, res) => {
    const { requestId } = req.params;

    db.query(
      `UPDATE collab_requests
     SET status = 'rejected'
     WHERE id = ?
     AND receiver_id = ?
     AND status = 'pending'`,
      [requestId, req.user.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Request not found",
          });
        }

        res.json({ success: true });
      },
    );
  },
);
app.get("/api/collab-requests-count", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT COUNT(*) AS count
    FROM collab_requests
    WHERE receiver_id = ?
      AND status = 'pending'
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) {
      console.error("Collab request count error:", err);
      return res.status(500).json({ count: 0 });
    }

    res.json({ count: rows[0].count });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
