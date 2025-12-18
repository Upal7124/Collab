import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");

  const projectTags = [
    "Frontend",
    "Backend",
    "Full Stack",
    "AI/ML",
    "Cybersecurity",
    "Mobile Apps",
    "Cloud Computing",
    "Data Science",
    "DevOps",
    "UI/UX",
  ];

  const projects = [
    {
      name: "AI-Based Anomaly Detection System",
      type: "AI/ML",
      desc: "Detects network anomalies using ML models. Auto-alerts & dashboard view.",
      img: "https://i.pravatar.cc/300?img=50",
      tech: "Python, Scikit-Learn, Flask, React",
    },
    {
      name: "DevOps Pipeline Automation",
      type: "DevOps",
      desc: "Fully automated CI/CD pipeline with Docker, Jenkins & GitHub Actions.",
      img: "https://i.pravatar.cc/300?img=52",
      tech: "Docker, Jenkins, AWS, GitHub Actions",
    },
    {
      name: "E-Commerce Full Stack Website",
      type: "Full Stack",
      desc: "Secure user login, payments, admin dashboard & product management.",
      img: "https://i.pravatar.cc/300?img=54",
      tech: "React, Node.js, MongoDB",
    },
    {
      name: "Mobile Fitness Tracking App",
      type: "Mobile Apps",
      desc: "Real-time step tracking and AI-based calorie predictions.",
      img: "https://i.pravatar.cc/300?img=56",
      tech: "Flutter, Firebase",
    },
    {
      name: "Cybersecurity Vulnerability Scanner",
      type: "Cybersecurity",
      desc: "Finds critical vulnerabilities in web apps using automated scanning.",
      img: "https://i.pravatar.cc/300?img=58",
      tech: "Python, Nmap, BurpSuite API",
    },
  ];

  const filteredProjects = projects.filter((p) =>
    p.type.toLowerCase().includes((selectedProject || "").toLowerCase())
  );

  return (
    <section className="section-alt text-center py-20">
      <div className="container mx-auto px-6">
        
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Explore <span className="text-yellow-500">Projects</span>
        </h1>

        <p className="text-gray-700 max-w-2xl mx-auto mb-12 text-lg">
          Browse project domains and check out real IT projects created by skilled developers.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-white shadow-lg rounded-full overflow-hidden w-full max-w-xl">
            <input
              type="text"
              placeholder="Search project domain..."
              className="flex-1 px-5 py-3 text-gray-700 focus:outline-none border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-yellow-500 border-none hover:bg-yellow-600 text-white px-6 py-3 font-semibold transition">
              Search
            </button>
          </div>
        </div>

        {/* Project Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {projectTags
            .filter((tag) =>
              tag.toLowerCase().includes(search.toLowerCase())
            )
            .map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setSelectedProject(tag)}
                whileTap={{ scale: 0.9 }}
                className="bg-white shadow-md hover:shadow-xl py-3 rounded-xl text-gray-800 font-semibold border border-yellow-400"
              >
                {tag}
              </motion.button>
            ))}
        </div>

        {/* Floating Projects Box */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4"
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.85 }}
                className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-yellow-100 hover:bg-yellow-200 p-2 rounded-full"
                >
                  <X size={22} className="text-yellow-600" />
                </button>

                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {selectedProject} <span className="text-yellow-500">Projects</span>
                </h2>

                {/* Cards */}
                <div className="flex flex-col gap-6">
                  {filteredProjects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 bg-gray-50 p-4 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition"
                    >
                      <img
                        src={proj.img}
                        alt=""
                        className="w-24 h-24 object-cover rounded-xl shadow-md"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {proj.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{proj.desc}</p>
                        <p className="text-sm mt-2">
                          <strong className="text-gray-800">Tech:</strong>{" "}
                          {proj.tech}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
