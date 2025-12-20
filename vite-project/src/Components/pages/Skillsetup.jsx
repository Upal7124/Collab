import React, { useState } from "react";
import axios from "axios";

export default function Skillsetup({ onDone }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [skillsTeach, setSkillsTeach] = useState("");
  const [skillsLearn, setSkillsLearn] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Session expired. Please login again.");
      return;
    }

    if (!skillsTeach || !skillsLearn) {
      alert("Please fill both skill fields");
      return;
    }

    const formData = new FormData();
    formData.append("skills_to_teach", skillsTeach);
    formData.append("skills_to_learn", skillsLearn);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:5000/update-skills/${user.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Profile updated successfully!");
      onDone(); // go to home or profile
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#FFFBEA] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-yellow-200"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Skill Setup
        </h1>

        <label className="font-semibold">Skills you can teach</label>
        <input
          type="text"
          value={skillsTeach}
          onChange={(e) => setSkillsTeach(e.target.value)}
          placeholder="React, Node, Python"
          className="w-full p-3 mt-1 mb-4 rounded-lg border"
        />

        <label className="font-semibold">Skills you want to learn</label>
        <input
          type="text"
          value={skillsLearn}
          onChange={(e) => setSkillsLearn(e.target.value)}
          placeholder="AI, ML, DevOps"
          className="w-full p-3 mt-1 mb-4 rounded-lg border"
        />

        <label className="font-semibold">Profile picture (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="w-full mt-2 mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-full font-bold"
        >
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </section>
  );
}
