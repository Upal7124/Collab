import React from "react";
import Banner from "./Banner.png";

function Hero() {
  return (
    <section className="section-alt text-center py-20">
      <div className="container">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Exchange <span className="text-yellow-500">Skills</span>, Grow{" "}
          <span className="text-yellow-600">Together</span>
        </h1>

        {/* Subheading */}
        <p className="text-gray-700 max-w-2xl mx-auto mb-10 text-lg">
          Learn new things, share your expertise, and connect with others
          through the power of barter. No money — just skills and collaboration
          ⚡
        </p>

        {/* Search Bar */}
        <div className="flex justify-center mb-12 border-none">
          <div className="flex items-center bg-white shadow-lg rounded-full overflow-hidden w-full max-w-xl border-none">
            <input
              type="text"
              placeholder="Search for a skill (e.g., Photography, Web Dev...)"
              className="flex-1 px-5 py-3 text-gray-700 focus:outline-none border-none"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 font-semibold transition rounded-none border-none">
              Search
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-5">
          <button className="btn-primary px-6 py-3">Get Started</button>

          <button className="btn-outline px-6 py-3">
            <a onClick={() => onPageChange("skills")}>Explore Skills</a>
          </button>
        </div>

        {/* Illustration */}
        <div className="mt-16 flex justify-center">
          <img
            src={Banner}
            alt="Skill exchange illustration"
            className="w-full max-w-3xl opacity-90 drop-shadow-xl rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
