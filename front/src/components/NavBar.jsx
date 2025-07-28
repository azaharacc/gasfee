import { Link } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="/gasfee-detector.svg" alt="Logo" />
      </Link>
      <span className="separator">|</span>
      {token ? (
        <>
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <span className="separator">|</span>
          <button onClick={onLogout} className="link-button">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-link">Login</Link>
          <span className="separator">|</span>
          <Link to="/register" className="navbar-link">Register</Link>
        </>
      )}
    </nav>
  );
}
