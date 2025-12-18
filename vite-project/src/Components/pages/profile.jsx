import React from "react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-yellow-50 flex justify-center items-start p-10">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex gap-10">
        {/* Left: Profile Picture */}
        <div className="flex flex-col items-center w-1/3">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBPOLreayKgnbfO3xNsGKUhMsedk1oCGPwRA&s"
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-yellow-400 shadow-lg"
          />
          <h2 className="text-2xl font-bold mt-4 text-gray-800">Upal Ghosh</h2>
          <p className="text-gray-500">Computer Science Student</p>

          <button className="mt-5 px-5 py-2 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600">
            Edit Profile
          </button>
        </div>

        {/* Right: Profile Details */}
        <div className="w-2/3 space-y-5 relative">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Profile Information</h3>

          <div>
            <p className="text-gray-800">ghoshupal25@gmail.com</p>
          </div>

          {/* Rating Section */}
          <div>
            <div className="flex text-yellow-500 text-2xl">
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          {/* Credits Section */}
          <div className="absolute top-0 right-0 bg-yellow-300 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full shadow">
            CREDIT :120
          </div>

          

          <div>
            <p className="text-gray-600 font-medium">Address</p>
            <p className="text-gray-800">Howrah, Kolkata, India</p>
          </div>

          <div>
            <p className="text-gray-600 font-medium">About Me</p>
            <p className="text-gray-800">
              A passionate learner and developer working on various tech projects including web development and AI-based attendance systems.
            </p>

          {/* Programming Languages Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6">Programming Languages</h3>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="px-4 py-2 bg-yellow-200 text-gray-800 rounded-full font-medium shadow">Python</span>
              <span className="px-4 py-2 bg-yellow-200 text-gray-800 rounded-full font-medium shadow">Java</span>
              <span className="px-4 py-2 bg-yellow-200 text-gray-800 rounded-full font-medium shadow">C</span>
              <span className="px-4 py-2 bg-yellow-200 text-gray-800 rounded-full font-medium shadow">JavaScript</span>
              <span className="px-4 py-2 bg-yellow-200 text-gray-800 rounded-full font-medium shadow">PHP</span>
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mt-6">Projects</h3>
            <ul className="list-disc pl-5 text-gray-800 space-y-2 mt-3">
              <li>Online Attendance System with Face Recognition</li>
              <li>OrangeCup Product Website</li>
              <li>Event Management Website</li>
              <li>BookMyVibe - Home Event Decor Website</li>
              <li>Internship Portal for Nayepankh Foundation</li>
            </ul>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* */
