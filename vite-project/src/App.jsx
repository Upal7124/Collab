import React, { useState, useEffect } from "react";
import Navbar from "./Components/Navbar.jsx";
import Hero from "./Components/Hero.jsx";
import SkillsSection from "./Components/SkillsSelection.jsx";
import Login from "./Components/pages/login.jsx";
import Register from "./Components/pages/Register.jsx";
import Profile from "./Components/pages/Profile.jsx";
import SkillDiscovery from "./Components/pages/SkillDiscovery.jsx";
import Footer from "./Components/Footer.jsx";
import About from "./Components/pages/About.jsx";
import Contact from "./Components/pages/Contact.jsx";
import ProjectsPage from "./Components/pages/ProjectsPage.jsx";
import MatchChecker from "./Components/pages/MatchChecker.jsx";
import ScheduleMeeting from "./Components/pages/ScheduleMeeting.jsx";

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load session when page refreshes
  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) setIsLoggedIn(true);
  }, []);

  function handleLogin() {
    setIsLoggedIn(true);
    setPage("home");
  }

  function handleLogout() {
    localStorage.removeItem("session");
    setIsLoggedIn(false);
    setPage("home");
  }

  return (
    <>
      <Navbar
        onPageChange={setPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        currentPage={page}
      />

      {page === "home" && (
        <>
          <Hero />
          <SkillsSection onPageChange={setPage} />
        </>
      )}

      {page === "skills" && <SkillDiscovery />}
      {page === "projects" && <ProjectsPage />}
      {page === "about" && <About />}
      {page === "contact" && <Contact />}
      {page === "profile" && <Profile />}
      {page === "match" && <MatchChecker onPageChange={setPage} />}

      {page === "schedule" && <ScheduleMeeting />}

      {page === "login" && (
        <Login onLogin={handleLogin} onPageChange={setPage} />
      )}

      {page === "Reg" && <Register onRegister={() => setPage("login")} />}

      <Footer />
    </>
  );
}

export default App;
