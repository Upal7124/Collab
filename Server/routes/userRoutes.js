const authenticateToken = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

module.exports = (db) => {
  router.get("/top/:id", authenticateToken, (req, res) => {
    const userId = req.params.id;

    db.query(
      `SELECT 
       id,
       fullName,
       skills_to_teach,
       skills_to_learn,
       profile_pic
     FROM users
     WHERE id != ?
     ORDER BY 
       (LENGTH(skills_to_teach) - LENGTH(REPLACE(skills_to_teach, ',', '')) + 1)
       +
       (LENGTH(skills_to_learn) - LENGTH(REPLACE(skills_to_learn, ',', '')) + 1)
       DESC
     LIMIT 8`,
      [userId],
      (err, rows) => {
        if (err) {
          console.error("Top collaborators error:", err);
          return res.status(500).json({
            message: "Database error",
          });
        }

        res.json(rows);
      },
    );
  });

  router.get("/:id", authenticateToken, (req, res) => {
    const { id } = req.params;

    db.query(
      `SELECT id, fullName, email, skills_to_learn, skills_to_teach, profile_pic
       FROM users
       WHERE id = ?`,
      [id],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (!rows.length) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.json(rows[0]);
      },
    );
  });

  router.get("/skill/:skill", authenticateToken, (req, res) => {
    const skill = req.params.skill.toLowerCase();

    db.query(
      `SELECT id, fullName, skills_to_teach, skills_to_learn, profile_pic
       FROM users
       WHERE LOWER(skills_to_teach) LIKE ?`,
      [`%${skill}%`],
      (err, rows) => {
        if (err) {
          return res.status(500).json({
            message: "Database error",
          });
        }

        res.json(rows);
      },
    );
  });

  return router;
};
