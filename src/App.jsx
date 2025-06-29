import "./App.css";

// Importing Libraries
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Scale, Star, UserRound, Calculator } from "lucide-react";

// Importing components
import Sidebar from "./components/Sidebar";

// Importing pages
import CriteriaPage from "./pages/CriteriaPage";
import AlternativePage from "./pages/AlternativePage";
import CalculationPage from "./pages/CalculationPage";
import SubCriteriaPage from "./pages/SubCriteriaPage";

function App() {
  const menuItems = [
    { id: "calculation", label: "Calculation", icon: <Calculator />, path: "/" },
    { id: "criteria", label: "Criteria", icon: <Scale />, path: "/criteria" },
    { id: "sub-criteria", label: "Sub Criteria", icon: <Star />, path: "/sub-criteria" },
    { id: "alternative", label: "Alternative", icon: <UserRound />, path: "/alternative" },
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
              <span className="text-xl font-bold">SMART Pemilihan Smartphone</span>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 bg-base-100">
            <Routes>
              <Route
                path="/"
                element={<CalculationPage />}
              />
              <Route
                path="/criteria"
                element={<CriteriaPage />}
              />
              <Route
                path="/alternative"
                element={<AlternativePage />}
              />
              <Route
                path="/sub-criteria"
                element={<SubCriteriaPage />}
              />
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

