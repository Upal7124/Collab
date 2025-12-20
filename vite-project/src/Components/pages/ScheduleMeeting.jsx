import React, { useEffect, useState } from "react";

function SkillsSection({ onPageChange }) {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  if (!loggedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Please log in to view collaborators.
      </div>
    );
  }

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/users/${loggedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ Show only top 5 users
        setPeople(data.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
        setLoading(false);
      });
  }, [loggedUser.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-yellow-700">
        Loading collaborators...
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <h3 className="text-4xl font-extrabold text-gray-900 text-center mb-14">
        Top <span className="text-yellow-600">Collaborators</span>
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-6">
        {people.map((person) => (
          <div
            key={person.id}
            onClick={() => onPageChange("match", person)}
            className="cursor-pointer p-8 bg-white shadow-lg rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={`https://i.pravatar.cc/150?u=${person.id}`}
              alt={person.fullName}
              className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 ring-yellow-300"
            />

            <h4 className="text-xl font-semibold text-gray-900 text-center">
              {person.fullName}
            </h4>

            <p className="text-yellow-600 font-medium mt-1 text-center">
              Teaches: {person.skills_to_teach || "—"}
            </p>

            <p className="text-gray-600 text-sm mt-3 text-center">
              Wants to learn: {person.skills_to_learn || "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Optional CTA */}
      <div className="text-center mt-12">
        <button
          onClick={() => onPageChange("skills")}
          className="px-6 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
        >
          View All Collaborators
        </button>
      </div>
    </section>
  );
}

export default SkillsSection;
