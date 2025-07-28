import { useEffect, useState } from "react";

export default function Dashboard() {
  const [gasData, setGasData] = useState(null);
  const [threshold, setThreshold] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3000/gas", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setGasData(data);
        setThreshold(data.threshold.replace(" gwei", ""));
      });
  }, [token]);

  const updateThreshold = async () => {
    const res = await fetch("http://localhost:3000/gas/threshold", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ gasThreshold: Number(threshold) })
    });

    const data = await res.json();
    setMsg(data.message || data.error);
  };

  if (!token) return <p>Please log in to see this page</p>;

  return (
    <div className="card">
      <h2>Panel de control</h2>
      {gasData && (
        <>
          <p>Gas actual: {gasData.gasPrice}</p>
          <p>Umbral actual: {gasData.threshold}</p>
          <p>¿Deploy recomendado?: {gasData.goodToDeploy ? "✅ Yes" : "❌ No"}</p>
        </>
      )}
      <input
        type="number"
        value={threshold}
        onChange={e => setThreshold(e.target.value)}
        placeholder="Nuevo umbral en gwei"
      />
      <button onClick={updateThreshold}>Update Threshold</button>
      <p>{msg}</p>
    </div>
  );
}
