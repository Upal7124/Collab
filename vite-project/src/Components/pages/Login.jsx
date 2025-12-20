import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ onLogin, onPageChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleLogin(e) {
    e.preventDefault();

    axios
      .post("http://localhost:5000/login", {
        email: form.email,
        password: form.password,
      })
      .then((res) => {
  if (!res.data.user) {
    throw new Error("No user data");
  }

  // Save logged-in user safely
  localStorage.setItem("user", JSON.stringify(res.data.user));

  alert("✅ Login successful!");
  onLogin();
})

      .catch(() => {
        alert("❌ Invalid email or password");
      });
  }

  return (
    <section className="min-h-screen bg-[#FFFBEA] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border border-yellow-200">
        
        <h1 className="text-4xl font-extrabold text-center mb-3 text-gray-900">
          Login
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Welcome back! Sign in to continue 🌟
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 py-3 px-4 rounded-full bg-gray-50 border border-gray-300 
              focus:border-yellow-500 focus:ring-yellow-400 focus:outline-none shadow-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 py-3 px-4 rounded-full bg-gray-50 border border-gray-300 
              focus:border-yellow-500 focus:ring-yellow-400 focus:outline-none shadow-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 -translate-y-1/2 text-gray-600 border-none bg-transparent"
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-full hover:bg-yellow-600 transition shadow border-none"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-700 mt-6">
          New here?{" "}
          <span
            className="text-yellow-600 font-semibold cursor-pointer"
            onClick={() => onPageChange("Reg")}
          >
            Create an Account
          </span>
        </p>
      </div>
    </section>
  );
}
