import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        fullName: name,
        email,
        password,
      });

      // ✅ AUTO LOGIN AFTER REGISTER
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: res.data.userId,
          fullName: name,
          email: email,
        })
      );

      alert("Registration successful!");
      onRegister(); // go to SkillSetup
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <section className="min-h-screen bg-[#FFFBEA] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border border-yellow-200">

        <h1 className="text-4xl font-extrabold text-center mb-3 text-gray-900">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Join us and start exploring!
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>

          <div>
            <label className="font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 py-3 px-4 rounded-full bg-gray-50 border"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 py-3 px-4 rounded-full bg-gray-50 border"
            />
          </div>

          <div className="relative">
            <label className="font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Create a password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 py-3 px-4 rounded-full bg-gray-50 border"
            />
            <span
              className="absolute right-4 top-11 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <div className="relative">
            <label className="font-semibold text-gray-700">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Re-enter your password"
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 py-3 px-4 rounded-full bg-gray-50 border"
            />
            <span
              className="absolute right-4 top-11 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-full"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
}
