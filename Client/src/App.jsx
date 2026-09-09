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
import CollabRequests from "./Components/pages/CollabRequests.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  const [currentPage, setCurrentPage] = useState({
    name: "home",
    data: null,
  });

  const navigate = (name, data = null) => {
    setCurrentPage({ name, data });
  };

  const page = currentPage.name;
  const pageData = currentPage.data;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setRequestCount(0);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) return;

    const fetchCount = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/collab-requests-count",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch request count");
        }

        const data = await res.json();

        setRequestCount(data.count || 0);
      } catch (err) {
        console.error("Request count error:", err);
        setRequestCount(0);
      }
    };

    fetchCount();

    const interval = setInterval(fetchCount, 30000);

    return () => clearInterval(interval);

  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("home");
  };

  return (
    <>
      <Navbar
        onPageChange={navigate}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        currentPage={page}
        requestCount={requestCount}
      />

      {page === "home" && (
        <>
          <Hero />
          <SkillsSection onPageChange={navigate} />
        </>
      )}

      {page === "login" && (
        <Login onLogin={handleLogin} onPageChange={navigate} />
      )}

      {page === "Reg" && <Register onRegister={() => navigate("Skillsetup")} />}

      {page === "Skillsetup" && <Skillsetup onDone={() => navigate("home")} />}

      {page === "profile" && <Profile />}

      {page === "skills" && <SkillDiscovery onPageChange={navigate} />}

      {page === "projects" && <ProjectsPage />}
      {page === "about" && <About />}
      {page === "contact" && <Contact />}

      {page === "match" && <MatchChecker onPageChange={navigate} />}

      {page === "schedule" && (
        <ScheduleMeeting
          onPageChange={navigate}
          requestId={pageData?.requestId}
        />
      )}

      {page === "requests" && (
        <CollabRequests
          onPageChange={navigate}
          onRequestCountChange={setRequestCount}
        />
      )}

      {isLoggedIn && page !== "match" && (
        <FloatingMatchButton onClick={() => navigate("match")} />
      )}

      <Footer />
    </>
  );
}
