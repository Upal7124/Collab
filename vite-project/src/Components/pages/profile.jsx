import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:5000/user/${user.id}`)
      .then((res) => setProfile(res.data))
      .catch(() => alert("Could not fetch profile"));
  }, []);

  if (!user) {
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        Please login again
      </p>
    );
  }

  if (!profile) {
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        Loading profile...
      </p>
    );
  }

  const teachSkills = profile.skills_to_teach
    ? profile.skills_to_teach.split(",")
    : [];
  const learnSkills = profile.skills_to_learn
    ? profile.skills_to_learn.split(",")
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white px-6 py-12 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-36 relative">
          <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2">
            <img
              src={
                profile.profile_pic
                  ? `http://localhost:5000/uploads/${profile.profile_pic}`
                  : "https://ui-avatars.com/api/?name=" + profile.fullName
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
          </div>
        </div>

        {/* BODY */}
        <div className="pt-20 pb-10 px-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {profile.fullName}
          </h1>
          <p className="text-gray-500 mt-1">{profile.email}</p>

          {/* SKILLS SECTION */}
          <div className="grid md:grid-cols-2 gap-10 mt-12 text-left">

            {/* TEACH */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Skills You Teach
              </h3>
              <div className="flex flex-wrap gap-3">
                {teachSkills.length > 0 ? (
                  teachSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-medium shadow-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Not added yet</p>
                )}
              </div>
            </div>

            {/* LEARN */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Skills You Want to Learn
              </h3>
              <div className="flex flex-wrap gap-3">
                {learnSkills.length > 0 ? (
                  learnSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium shadow-sm"
                    >
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">Not added yet</p>
                )}
              </div>
            </div>

          </div>

          {/* ACTION */}
          <div className="mt-12">
            <button className="px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition shadow">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
