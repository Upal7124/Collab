import React, { useEffect, useState } from "react";

function SkillsSection({ onPageChange }) {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // ✅ NEW

  useEffect(() => {
    if (!loggedUser?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`http://localhost:5000/users/top/${loggedUser.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched collaborators:", data);
        setPeople(data);
        setHasFetched(true); // ✅ mark fetch complete
      })
      .catch((err) => {
        console.error(err);
        setPeople([]);
        setHasFetched(true); // ✅ even on error
      })
      .finally(() => setLoading(false));
  }, [loggedUser?.id]);

  /* ---------------- UI STATES ---------------- */

  if (!loggedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
        Please log in to view collaborators.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-yellow-700">
        Loading collaborators...
      </div>
    );
  }

  // ✅ EMPTY STATE ONLY AFTER FETCH
  if (hasFetched && people.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold text-gray-700">
          No collaborators found 🤝
        </h3>
        <p className="text-gray-500 mt-2">
          Invite friends or wait for others to join.
        </p>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <section className="py-20 bg-gray-50">
      <h3 className="text-4xl font-extrabold text-gray-900 text-center mb-14">
        Top <span className="text-yellow-600">Collaborators</span>
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-6">
        {people.map((person) => (
          <div
            key={person.id}
            onClick={() => onPageChange?.("match", person)}
            className="p-8 bg-white shadow-lg rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <img
              src={
                person.profile_pic
                  ? `http://localhost:5000/uploads/${person.profile_pic}`
                  : `https://i.pravatar.cc/150?u=${person.id}`
              }
              alt={person.fullName}
              className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 ring-yellow-300"
            />

            <h4 className="text-xl font-semibold text-gray-900 text-center">
              {person.fullName}
            </h4>

            <p className="text-yellow-600 font-medium text-center mt-1">
              Teaches: {person.skills_to_teach || "—"}
            </p>

            <p className="text-gray-600 text-sm text-center mt-2">
              Learns: {person.skills_to_learn || "—"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
