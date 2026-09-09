const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

module.exports = (db) => {
  router.get("/", authenticateToken, (req, res) => {
    const currentUserId = req.user.id;

    const query = `
      SELECT 
        id,
        fullName,
        skills_to_teach,
        skills_to_learn,
        profile_pic
      FROM users
      WHERE id != ?
    `;

    db.query(query, [currentUserId], (err, users) => {
      if (err) {
        console.error("Match query error:", err);
        return res.status(500).json({
          message: "Failed to find matches",
        });
      }

      // Convert "React, Node, Python" → ["react", "node", "python"]
      const parseSkills = (skills) => {
        if (!skills) return [];

        return skills
          .split(",")
          .map((skill) => skill.trim().toLowerCase())
          .filter(Boolean);
      };

      // Get current user's skills
      db.query(
        `SELECT skills_to_teach, skills_to_learn
         FROM users
         WHERE id = ?`,
        [currentUserId],
        (err, currentRows) => {
          if (err) {
            console.error("Current user query error:", err);
            return res.status(500).json({
              message: "Failed to load your skills",
            });
          }

          if (!currentRows.length) {
            return res.status(404).json({
              message: "User not found",
            });
          }

          const currentUser = currentRows[0];

          const myTeach = parseSkills(currentUser.skills_to_teach);
          const myLearn = parseSkills(currentUser.skills_to_learn);

          const matches = users
            .map((user) => {
              const theirTeach = parseSkills(user.skills_to_teach);
              const theirLearn = parseSkills(user.skills_to_learn);

              // You teach → They want to learn
              const teachLearnMatches = myTeach.filter((skill) =>
                theirLearn.includes(skill),
              );

              // You want to learn → They can teach
              const learnTeachMatches = myLearn.filter((skill) =>
                theirTeach.includes(skill),
              );

              const totalPossible = myTeach.length + myLearn.length;

              const totalMatches =
                teachLearnMatches.length + learnTeachMatches.length;

              const score =
                totalPossible > 0
                  ? Math.round((totalMatches / totalPossible) * 100)
                  : 0;

              if (score === 0) {
                return null;
              }

              const reasons = [];

              if (teachLearnMatches.length > 0) {
                reasons.push(
                  `They want to learn: ${teachLearnMatches.join(", ")}`,
                );
              }

              if (learnTeachMatches.length > 0) {
                reasons.push(`They can teach: ${learnTeachMatches.join(", ")}`);
              }

              return {
                userId: user.id,
                name: user.fullName,
                score,
                reason: reasons.join(" • "),
                profile_pic: user.profile_pic,
              };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score);

          res.json(matches);
        },
      );
    });
  });

  return router;
};
