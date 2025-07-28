import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ⛔ Si ya hay token, redirige automáticamente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      if (data.token) {
        localStorage.setItem("token", data.token);
        onLogin && onLogin(data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("❌ Error en el servidor");
    }
  };

  return (
      <div className="card">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email account"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>Log In</button>
      <p>{message}</p>
    </div>
  );
}
