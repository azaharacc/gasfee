import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <h1>Gas Fee Detector</h1>
      <p>A small tool that lets you know when the gas fee is low</p>
      <p>
        <Link to="/login">Log In</Link> or <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
}
