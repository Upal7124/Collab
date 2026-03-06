import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // null = loading, false = error

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    skills_to_teach: "",
    skills_to_learn: "",
    profilePic: null,
  });

  /**********************************
   * LOAD USER + PROFILE
   **********************************/
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (!storedUser?.id) {
      setProfile(false);
      return;
    }

    fetchProfile(storedUser.id);
  }, []);

  const fetchProfile = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfile(false);
    }
  };

  /**********************************
   * SAVE PROFILE CHANGES
   **********************************/
  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("skills_to_teach", formData.skills_to_teach);
      data.append("skills_to_learn", formData.skills_to_learn);
      if (formData.profilePic) {
        data.append("profilePic", formData.profilePic);
      }

      await axios.post(
        `http://localhost:5000/update-skills/${user.id}`,
        data
      );

      await fetchProfile(user.id);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  /**********************************
   * UI STATES
   **********************************/
  if (!user) {
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        Please login again
      </p>
    );
  }

  if (profile === null) {
    return (
      <p className="text-center mt-20 text-lg text-gray-600">
        Loading profile...
      </p>
    );
  }

  if (profile === false) {
    return (
      <p className="text-center mt-20 text-lg text-red-500">
        Failed to load profile
      </p>
    );
  }

  /**********************************
   * DATA PARSING
   **********************************/
  const teachSkills = profile.skills_to_teach
    ? profile.skills_to_teach.split(",")
    : [];

  const learnSkills = profile.skills_to_learn
    ? profile.skills_to_learn.split(",")
    : [];

  /**********************************
   * MAIN UI
   **********************************/
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
                  : `https://ui-avatars.com/api/?name=${profile.fullName}`
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

          {/* SKILLS */}
          <div className="grid md:grid-cols-2 gap-10 mt-12 text-left">

            {/* TEACH */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Skills You Teach
              </h3>
              <div className="flex flex-wrap gap-3">
                {teachSkills.length ? (
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
                {learnSkills.length ? (
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
            <button
              onClick={() => {
                setFormData({
                  skills_to_teach: profile.skills_to_teach || "",
                  skills_to_learn: profile.skills_to_learn || "",
                  profilePic: null,
                });
                setIsEditing(true);
              }}
              className="px-8 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition shadow"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-xl">

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Edit Profile
            </h2>

            <input
              type="text"
              placeholder="Skills to Teach (comma separated)"
              value={formData.skills_to_teach}
              onChange={(e) =>
                setFormData({ ...formData, skills_to_teach: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            <input
              type="text"
              placeholder="Skills to Learn (comma separated)"
              value={formData.skills_to_learn}
              onChange={(e) =>
                setFormData({ ...formData, skills_to_learn: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded-lg"
            />

            <input
              type="file"
              onChange={(e) =>
                setFormData({ ...formData, profilePic: e.target.files[0] })
              }
              className="w-full mb-6"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
