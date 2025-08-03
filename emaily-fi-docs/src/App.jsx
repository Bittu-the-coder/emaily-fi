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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Always apply dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main
            className="flex-1 lg:ml-64 min-h-screen"
            style={{ paddingTop: "64px" }}
          >
            <div className="w-full h-full">
              <div className="responsive-container py-6 md:py-8 lg:py-12">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/getting-started" element={<GettingStarted />} />
                  <Route path="/installation" element={<Installation />} />
                  <Route path="/configuration" element={<Configuration />} />
                  <Route path="/api-reference" element={<APIReference />} />
                  <Route path="/examples" element={<Examples />} />
                  <Route path="/migration" element={<Migration />} />
                  <Route
                    path="/troubleshooting"
                    element={<Troubleshooting />}
                  />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
