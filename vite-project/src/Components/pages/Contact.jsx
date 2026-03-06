import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  return (
    <section className="section-alt text-center py-20">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Get in <span className="text-yellow-500">Touch</span>
        </h1>

        <p className="text-gray-700 max-w-2xl mx-auto mb-14 text-lg">
          Have questions, collaboration ideas, or feedback?  
          We'd love to connect with you. Reach out anytime!
        </p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          
          {/* Email */}
          <div className="bg-white shadow-lg border border-yellow-400 rounded-2xl p-6 flex items-start gap-4 hover:shadow-2xl transition">
            <Mail className="w-10 h-10 text-yellow-600" />
            <div className="text-left">
              <h2 className="text-xl font-semibold">Email</h2>
              <p className="text-gray-700">support@collab.in</p>
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white shadow-lg border border-yellow-400 rounded-2xl p-6 flex items-start gap-4 hover:shadow-2xl transition">
            <Phone className="w-10 h-10 text-yellow-600" />
            <div className="text-left">
              <h2 className="text-xl font-semibold">Phone</h2>
              <p className="text-gray-700">+91 72783 13646</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white shadow-lg border border-yellow-400 rounded-2xl p-6 flex items-start gap-4 hover:shadow-2xl transition">
            <MapPin className="w-10 h-10 text-yellow-600" />
            <div className="text-left">
              <h2 className="text-xl font-semibold">Location</h2>
              <p className="text-gray-700">Howrah, West Bengal</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl mx-auto border border-yellow-400">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Send Us a <span className="text-yellow-500">Message</span>
          </h2>

          <div className="flex flex-col gap-5 text-left">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold transition"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-14">
          © 2025 <span className="text-yellow-600 font-semibold">Collab Network</span> — Empowering Tech Collaborations
        </p>

      </div>
    </section>
  );
}
