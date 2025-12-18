import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Menu, X } from "lucide-react";

function Navbar({ onPageChange, isLoggedIn, onLogout, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", page: "home" },
    { name: "Skills", page: "skills" },
    { name: "Projects", page: "projects" },
    { name: "About", page: "about" },
    { name: "Contact", page: "contact" }
  ];

  return (
    <nav className="bg-white shadow fixed w-full top-0 left-0 z-50">
      <div className="flex items-center justify-between px-8 h-16">

        {/* LOGO */}
        <div
          className="cursor-pointer flex items-center"
          onClick={() => onPageChange("home")}
        >
          <img
            src="https://res.cloudinary.com/dakzbu1db/image/upload/v1763837370/WhatsApp_Image_2025-11-23_at_00.09.08_b4747849-removebg-preview_qytvhm.png"
            alt="logo"
            className="w-40"
          />
        </div>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <li
              key={link.page}
              onClick={() => onPageChange(link.page)}
              className={`cursor-pointer transition list-none ${
                currentPage === link.page
                  ? "text-yellow-500 font-semibold"
                  : "hover:text-yellow-500"
              }`}
            >
              {link.name}
            </li>
          ))}
        </ul>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <button
                className="border border-yellow-500 text-yellow-600 px-4 py-1.5 rounded-full hover:bg-yellow-500 hover:text-white transition"
                onClick={() => onPageChange("login")}
              >
                Login
              </button>

              <button
                className="bg-yellow-500 text-white px-5 py-1.5 rounded-full hover:bg-yellow-600 transition"
                onClick={() => onPageChange("Reg")}
              >
                Join Now
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onPageChange("profile")}
                className="flex items-center justify-between w-10 text-4xl text-gray-700 hover:text-yellow-500 transition border-none bg-transparent"
              >
                <FaUserCircle />
              </button>

              <button
                onClick={onLogout}
                className="border border-yellow-600 text-yellow-600 px-4 py-1.5 rounded-full hover:bg-yellow-500 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white shadow px-8 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <p
              key={link.page}
              onClick={() => {
                onPageChange(link.page);
                setIsOpen(false);
              }}
              className={`py-2 border-b cursor-pointer ${
                currentPage === link.page ? "text-yellow-600 font-semibold" : ""
              }`}
            >
              {link.name}
            </p>
          ))}

          {!isLoggedIn ? (
            <>
              <button
                className="w-full border border-yellow-500 text-yellow-600 py-2 rounded-full"
                onClick={() => {
                  onPageChange("login");
                  setIsOpen(false);
                }}
              >
                Login
              </button>

              <button
                className="w-full bg-yellow-500 text-white py-2 rounded-full"
                onClick={() => {
                  onPageChange("Reg");
                  setIsOpen(false);
                }}
              >
                Join Now
              </button>
            </>
          ) : (
            <>
              <button
                className="flex items-center gap-2 text-gray-700 text-lg"
                onClick={() => {
                  onPageChange("profile");
                  setIsOpen(false);
                }}
              >
                <FaUserCircle className="text-3xl" />
                Profile
              </button>

              <button
                className="w-full border border-red-500 text-red-600 py-2 rounded-full"
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
