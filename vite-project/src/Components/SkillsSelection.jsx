import React from "react";

function SkillsSection({ onPageChange }) {
  const people = [
    {
      name: "Aarav Sen",
      skill: "Full Stack Developer",
      desc: "Frontend React developer looking for collaboration.",
      img: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Riya Malhotra",
      skill: "Frontend Development",
      desc: "Specializes in React, Tailwind & UI/UX. Available for modern web builds.",
      img: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Kabir Das",
      skill: "Backend Development",
      desc: "Node.js & Express developer. Builds fast and scalable APIs.",
      img: "https://i.pravatar.cc/150?img=3",
    },
    {
      name: "Saanvi Verma",
      skill: "Data Analysis",
      desc: "Python, Pandas, and SQL expert. Helps with dashboards & insights.",
      img: "https://i.pravatar.cc/150?img=4",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <h3 className="text-4xl font-extrabold text-gray-900 text-center mb-14">
        People With <span className="text-yellow-600">Skills</span>
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-6">
        {people.map((person, index) => (
          <div onClick={() => onPageChange("match")}
            key={index}
            className="p-8 bg-white shadow-lg rounded-3xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src={person.img}
              alt={person.name}
              className="w-28 h-28 rounded-full mx-auto mb-4 object-cover ring-4 ring-yellow-300"
            />

            <h4 className="text-xl font-semibold text-gray-900">
              {person.name}
            </h4>
            <p className="text-yellow-600 font-medium mt-1">{person.skill}</p>
            <p className="text-gray-600 text-sm mt-3">{person.desc}</p>

            {/* <button
              className="mt-5 bg-yellow-500 text-white px-5 py-2.5 rounded-xl font-medium w-full hover:bg-yellow-600 transition"
              onClick={() => onPageChange("match")}
            >
              Collaborate
            </button> */}
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
