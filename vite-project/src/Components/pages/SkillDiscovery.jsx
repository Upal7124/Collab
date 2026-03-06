import React, { useState } from "react";

const allSkills = [
  "Python", "JavaScript", "Java", "C++", "C#", "Go",
  "Rust", "Kotlin", "Ruby", "Swift", "PHP", "TypeScript"
];

export default function SkillDiscovery({ onPageChange }) {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredSkills = allSkills.filter(skill =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- FETCH USERS FROM MYSQL ---------------- */
  const fetchUsersBySkill = async (skill) => {
    setSelectedSkill(skill);
    setUsers([]);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/users/skill/${skill}`
      );
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CLICK USER → MATCHCHECKER ---------------- */
  const handleUserClick = (user) => {
    localStorage.setItem("selectedMatchUser", JSON.stringify(user));
    if (onPageChange) {
      onPageChange("match");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <section className="py-20 text-center bg-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">

        <h1 className="text-5xl font-extrabold mb-6 text-gray-900">
          Explore <span className="text-yellow-500">Skills</span> & Find{" "}
          <span className="text-yellow-600">Experts</span>
        </h1>

        <p className="text-gray-700 mb-12 text-lg">
          Click a skill to see real collaborators from the platform.
        </p>

        {/* SEARCH */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-6 py-3 w-full max-w-md rounded-full shadow focus:outline-none"
          />
        </div>

        {/* SKILL BUTTONS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-3xl mx-auto mb-16">
          {filteredSkills.map(skill => (
            <button
              key={skill}
              onClick={() => fetchUsersBySkill(skill)}
              className="
                bg-white px-5 py-3 rounded-full shadow
                font-semibold text-gray-800
                hover:bg-yellow-500 hover:text-white
                transition
              "
            >
              {skill}
            </button>
          ))}
        </div>

        {/* MODAL */}
        {selectedSkill && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm
                          flex justify-center items-center z-50 px-6">

            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full relative">

              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 text-2xl"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold mb-6">
                Users skilled in{" "}
                <span className="text-yellow-600">{selectedSkill}</span>
              </h2>

              {loading && (
                <p className="text-lg text-gray-600">Loading users...</p>
              )}

              {!loading && users.length === 0 && (
                <p className="text-gray-600">
                  No users found for this skill.
                </p>
              )}

              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="
                      bg-gray-100 p-6 rounded-2xl shadow-md
                      flex items-center gap-5 cursor-pointer
                      hover:bg-yellow-100 hover:shadow-xl
                      hover:scale-[1.02]
                      transition-all
                    "
                  >
                    <img
                      src={
                        user.profile_pic
                          ? `http://localhost:5000/uploads/${user.profile_pic}`
                          : `https://i.pravatar.cc/150?u=${user.id}`
                      }
                      className="w-16 h-16 rounded-full"
                      alt={user.fullName}
                    />

                    <div className="text-left">
                      <p className="font-semibold text-lg text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Teaches: {user.skills_to_teach || "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
