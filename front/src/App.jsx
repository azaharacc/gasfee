import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute"; 
import Verify from "./pages/Verify";
import Navbar from "./components/NavBar";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <div className="div-contents">
        <Navbar token={token} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login onLogin={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/verify/:token" element={<Verify />} />
          </Routes>
          </div>
    </Router>
  );
}

export default App;
