import "./App.css";
import { House, Scale } from "lucide-react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

function App() {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <House />, path: "/" },
    { id: "criteria", label: "Kriteria", icon: <Scale />, path: "/criteria" },
  ];

  return (
    <Router>
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* Main content */}
        <div className="drawer-content flex flex-col">
          {/* Navbar for smaller screen */}
          <div className="navbar bg-base-300 lg:hidden">
            <div className="flex-none">
              <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <span className="text-xl font-bold">My App</span>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 bg-base-100">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />
              {/* <Route path="/faq" element={<FAQPage />} /> */}
              {/* <Route path="/profile" element={<Profile />} /> */}
              {/* <Route path="/settings" element={<Settings />} /> */}
            </Routes>
          </main>
        </div>

        {/* Sidebar */}
        <Sidebar menuItems={menuItems} />
      </div>
    </Router>
  );
}

export default App;

