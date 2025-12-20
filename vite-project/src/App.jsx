import React, { useState, useEffect } from "react";

import Navbar from "./Components/Navbar.jsx";
import Hero from "./Components/Hero.jsx";
import SkillsSection from "./Components/SkillsSelection.jsx";
import Login from "./Components/pages/Login.jsx";
import Register from "./Components/pages/Register.jsx";
import Profile from "./Components/pages/Profile.jsx";
import SkillDiscovery from "./Components/pages/SkillDiscovery.jsx";
import Footer from "./Components/Footer.jsx";
import About from "./Components/pages/About.jsx";
import Contact from "./Components/pages/Contact.jsx";
import ProjectsPage from "./Components/pages/ProjectsPage.jsx";
import MatchChecker from "./Components/pages/MatchChecker.jsx";
import ScheduleMeeting from "./Components/pages/ScheduleMeeting.jsx";
import Skillsetup from "./Components/pages/Skillsetup.jsx";
import FloatingMatchButton from "./Components/FloatingMatchButton.jsx";


function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Restore login session on refresh
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  /* ---------------- AUTH HANDLERS ---------------- */

  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setPage("home");
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <Navbar
        onPageChange={setPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        currentPage={page}
      />

      {/* HOME */}
      {page === "home" && (
        <>
          <Hero />
          <SkillsSection onPageChange={setPage} />
        </>
      )}

      {/* AUTH */}
      {page === "login" && (
        <Login onLogin={handleLogin} onPageChange={setPage} />
      )}

      {page === "Reg" && (
        <Register onRegister={() => setPage("Skillsetup")} />
      )}

      {page === "Skillsetup" && (
        <Skillsetup onDone={() => setPage("home")} />
      )}

      {/* USER PAGES */}
      {page === "profile" && <Profile />}
      {page === "skills" && <SkillDiscovery />}
      {page === "projects" && <ProjectsPage />}
      {page === "about" && <About />}
      {page === "contact" && <Contact />}

      {/* MATCH FLOW */}
      {page === "match" && <MatchChecker onPageChange={setPage} />}
      {page === "schedule" && <ScheduleMeeting />}
     {isLoggedIn && page !== "match" && (
  <FloatingMatchButton onClick={() => setPage("match")} />
)}



      <Footer />
    </>
  );
}

export default App;
