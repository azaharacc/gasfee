import { Link } from "react-router-dom";

export default function Navbar({ token, onLogout }) {
  return (
    <nav>
        <Link to="/" className="mr-4 font-semibold hover:underline">Home</Link> | 
        {token ? (
          <>
            <Link to="/dashboard" className="mr-4 hover:underline"> Dashboard</Link> |
            <button onClick={onLogout} className="link-button">Logout</button>          </>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline"> Login</Link> |
            <Link to="/register" className="hover:underline"> Register</Link>
          </>
        )}
    </nav>
  );
}
