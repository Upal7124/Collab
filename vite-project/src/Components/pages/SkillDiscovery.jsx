import React, { useState } from "react";

const allSkills = [
  "Python", "JavaScript", "Java", "C++", "C#", "Go",
  "Rust", "Kotlin", "Ruby", "Swift", "PHP", "TypeScript"
];

const mockUsers = {
  Python: [
    { name: "Aarav Patel", img: "https://i.pravatar.cc/150?img=1" },
    { name: "Meera Singh", img: "https://i.pravatar.cc/150?img=2" },
    { name: "Rohan Verma", img: "https://i.pravatar.cc/150?img=3" }
  ],
  JavaScript: [
    { name: "Neha Sharma", img: "https://i.pravatar.cc/150?img=4" },
    { name: "Vikram Joshi", img: "https://i.pravatar.cc/150?img=5" },
    { name: "Kushal Sen", img: "https://i.pravatar.cc/150?img=6" }
  ],
  Java: [
    { name: "Sarthak Malhotra", img: "https://i.pravatar.cc/150?img=7" },
    { name: "Priya Yadav", img: "https://i.pravatar.cc/150?img=8" }
  ],
  "C++": [
    { name: "Manav Thakur", img: "https://i.pravatar.cc/150?img=9" },
    { name: "Anisha Roy", img: "https://i.pravatar.cc/150?img=10" }
  ],
  "C#": [
    { name: "John Mathews", img: "https://i.pravatar.cc/150?img=11" }
  ],
  Go: [
    { name: "Ishan Garg", img: "https://i.pravatar.cc/150?img=12" }
  ],
  Rust: [
    { name: "Harsh Chauhan", img: "https://i.pravatar.cc/150?img=13" }
  ],
  Kotlin: [
    { name: "Rhea Kapoor", img: "https://i.pravatar.cc/150?img=14" }
  ],
  Ruby: [
    { name: "Aditi Jain", img: "https://i.pravatar.cc/150?img=15" }
  ],
  Swift: [
    { name: "Sanya Mehta", img: "https://i.pravatar.cc/150?img=16" }
  ],
  PHP: [
    { name: "Zaid Ali", img: "https://i.pravatar.cc/150?img=17" }
  ],
  TypeScript: [
    { name: "Kiran Rao", img: "https://i.pravatar.cc/150?img=18" },
    { name: "Riti Tiwari", img: "https://i.pravatar.cc/150?img=19" }
  ]
};

function SkillDiscovery() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [search, setSearch] = useState("");

  const filteredSkills = allSkills.filter(skill =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="section-alt text-center py-20">
      <div className="container">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Explore <span className="text-yellow-500">Skills </span>  
          & Find <span className="text-yellow-600">Experts</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-700 max-w-2xl mx-auto mb-12 text-lg">
          Search for a programming language and discover people who excel at it.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-3 w-full max-w-md rounded-full shadow-lg border-none focus:border-yellow-500 focus:outline-none text-gray-700"
          />
        </div>

        {/* Skills in 2 Rows */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-3xl mx-auto mb-16 border-none">
          {filteredSkills.map((lang, index) => (
            <button
              key={index}
              onClick={() => setSelectedSkill(lang)}
              className="
                bg-white shadow-lg px-4 py-3 rounded-full 
                text-gray-800 font-semibold text-sm transition-all
                hover:bg-yellow-500 hover:text-white
                transform hover:scale-105 border-none
              "
            >
              {lang}
            </button>
          ))}
        </div>

        {/* FULL SCREEN OVERLAY */}
        {selectedSkill && (
          <div
            className="
              fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex 
              justify-center items-center p-6 z-50 animate-fadeIn
            "
          >
            <div
              className="
                bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl 
                animate-slideUp relative
              "
            >

              {/* Close Button */}
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
              >
                ✕
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Users skilled in <span className="text-yellow-600">{selectedSkill}</span>
              </h2>

              {/* User Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                {mockUsers[selectedSkill]?.map((user, idx) => (
                  <div
                    key={idx}
                    className="
                      bg-gray-100 p-5 rounded-xl shadow-md flex items-center gap-4 
                      transition hover:bg-yellow-100 hover:shadow-xl
                    "
                  >
                    <img
                      src={user.img}
                      className="w-16 h-16 rounded-full shadow"
                      alt={user.name}
                    />
                    <p className="text-lg font-semibold text-gray-800">{user.name}</p>
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

export default SkillDiscovery;
