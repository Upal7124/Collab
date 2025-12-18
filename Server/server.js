const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb"
});

db.connect(err => {
  if (err) {
    console.log("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.send(err);
    res.send(result);
  });
});

app.post("/register", (req, res) => {
  const { fullName, email, password } = req.body;

  const sql = "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)";

  db.query(sql, [fullName, email, password], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Error inserting user", err });
    }
    res.send({ message: "✅ User registered successfully!" });
  });
});

// ✅ LOGIN ROUTE OUTSIDE
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).send(err);

    if (results.length === 0)
      return res.status(401).send({ message: "Invalid credentials" });

    res.send({ user: results[0], message: "✅ Login successful!" });
  });
});

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
