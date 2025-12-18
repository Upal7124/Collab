import React from "react";

function About() {
  return (
    <section className="section-alt py-20">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-gray-900 leading-tight mb-10">
          About <span className="text-yellow-500">Collab</span>
        </h1>

        {/* Subheading */}
        <p className="text-center text-gray-700 max-w-3xl mx-auto text-lg mb-16">
          Collab is a skill-based barter platform where people exchange knowledge 
          instead of money. Learn anything, teach anything — together we grow.
        </p>

        {/* Section 1: Mission */}
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-5">
            Our <span className="text-yellow-600">Mission</span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Our mission is simple — bring people together through the power of shared skills.  
            Whether you're a developer, writer, designer, or simply someone who loves learning,
            Collab gives you the space to grow, teach, and connect with passionate individuals.
          </p>
        </div>

        {/* Section 2: How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How <span className="text-yellow-600">Collab Works</span>
          </h2>

          <ul className="space-y-6 text-lg">
            <li className="flex items-start gap-4">
              <span className="bg-yellow-500 text-white w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl shadow">
                1
              </span>
              <p className="text-gray-700">
                Search for the skill you want to learn — whether it’s programming, design, music, or communication.
              </p>
            </li>

            <li className="flex items-start gap-4">
              <span className="bg-yellow-500 text-white w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl shadow">
                2
              </span>
              <p className="text-gray-700">
                Browse users who are skilled in that topic and open to collaboration.
              </p>
            </li>

            <li className="flex items-start gap-4">
              <span className="bg-yellow-500 text-white w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl shadow">
                3
              </span>
              <p className="text-gray-700">
                Offer a skill in return — your expertise becomes your currency.
              </p>
            </li>

            <li className="flex items-start gap-4">
              <span className="bg-yellow-500 text-white w-10 h-10 flex justify-center items-center rounded-full font-bold text-xl shadow">
                4
              </span>
              <p className="text-gray-700">
                Collaborate, grow, and build meaningful connections — no money involved.
              </p>
            </li>
          </ul>
        </div>

        {/* Section 3: Why Choose Us */}
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Why <span className="text-yellow-600">Choose Us?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

            <div className="p-6 bg-gray-100 rounded-xl hover:bg-yellow-50 shadow transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skill for Skill</h3>
              <p className="text-gray-700">
                No money required — exchange a skill you have for one you want to learn.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-xl hover:bg-yellow-50 shadow transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Community</h3>
              <p className="text-gray-700">
                A space to meet like-minded learners, creators, and tech enthusiasts.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-xl hover:bg-yellow-50 shadow transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Barriers</h3>
              <p className="text-gray-700">
                Anyone can share a skill — whether you’re a student or a working professional.
              </p>
            </div>

            <div className="p-6 bg-gray-100 rounded-xl hover:bg-yellow-50 shadow transition">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mutual Growth</h3>
              <p className="text-gray-700">
                Learning goes both ways — grow by teaching, grow by learning.
              </p>
            </div>

          </div>
        </div>

        {/* Section 4: Footer Note */}
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Built for Learners. Powered by Community.
          </h2>
          <p className="text-gray-600">
            Collab — where skills create connections.
          </p>
        </div>

      </div>
    </section>
  );
}

export default About;
