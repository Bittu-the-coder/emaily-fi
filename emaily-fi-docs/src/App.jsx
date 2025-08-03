import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import GettingStarted from "./pages/GettingStarted";
import Installation from "./pages/Installation";
import Configuration from "./pages/Configuration";
import APIReference from "./pages/APIReference";
import Examples from "./pages/Examples";
import Migration from "./pages/Migration";
import Troubleshooting from "./pages/Troubleshooting";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 lg:ml-64 pt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/getting-started" element={<GettingStarted />} />
                <Route path="/installation" element={<Installation />} />
                <Route path="/configuration" element={<Configuration />} />
                <Route path="/api-reference" element={<APIReference />} />
                <Route path="/examples" element={<Examples />} />
                <Route path="/migration" element={<Migration />} />
                <Route path="/troubleshooting" element={<Troubleshooting />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
