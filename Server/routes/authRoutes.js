const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  registerSchema,
  loginSchema,
  validate,
} = require("../middleware/validation");

const router = express.Router();

module.exports = (db) => {
  router.post("/register", validate(registerSchema), async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)",
        [fullName, email, hashedPassword],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(409).json({
                message: "Email is already registered",
              });
            }

            return res.status(500).json({
              message: "Database error",
            });
          }

          res.status(201).json({
            message: "Registration successful",
            userId: result.insertId,
          });
        },
      );
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  });

  router.post("/login", validate(loginSchema), (req, res) => {
    const { email, password } = req.body;

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, rows) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (!rows.length) {
          return res.status(401).json({
            message: "Invalid email or password",
          });
        }

        const user = rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json({
            message: "Invalid email or password",
          });
        }

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          },
        );

        res.json({
          user,
          token,
        });
      },
    );
  });

  return router;
};
