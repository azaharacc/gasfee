import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Verify() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const res = await fetch(`http://localhost:3000/auth/verify/${token}`);
        if (res.ok) {
          // La ruta en backend hace res.redirect, pero aquí esperamos json,
          // así que quizá debas modificar backend para que devuelva JSON en vez de redirect
          setStatus("✅ Email successfully verified. You can now log in.");
        } else {
          const data = await res.json();
          setStatus(`❌ Error: ${data.error || "Invalid token"}`);
        }
      } catch (err) {
        setStatus("❌ Could not connect to the server.");
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{status}</p>
      {status.includes("correctamente") && <Link to="/login">Go to Login</Link>}
    </div>
  );
}
