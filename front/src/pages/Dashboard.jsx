import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [gasData, setGasData] = useState(null);
  const [threshold, setThreshold] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/gas`, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => {
        setGasData(data);
        setThreshold(data.threshold.replace(" gwei", ""));
      })
      .catch(err => console.error("Error fetching gas data:", err));
  }, [token]);

  const updateThreshold = async () => {
    try {
      const res = await fetch(`${API_URL}/gas/threshold`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ gasThreshold: Number(threshold) })
      });

      const data = await res.json();
      setMsg(data.message || data.error);

      // 🔁 Vuelve a obtener los datos actualizados del servidor
      const updatedRes = await fetch(`${API_URL}/gas`, {
        headers: { Authorization: token }
      });
      const updatedData = await updatedRes.json();
      setGasData(updatedData);
    } catch (error) {
      console.error("Error updating threshold:", error);
    }
  };


  if (!token) return <p>Please log in to see this page</p>;

  return (
    <div className="card">
      <h2>Dashboard</h2>
      {gasData && (
        <>
          <p>Current Gas: {gasData.gasPrice}</p>
          <p>Current Threshold: {gasData.threshold}</p>
          <p>¿Recommended deployment?: {gasData.goodToDeploy ? "✅ Yes" : "❌ No"}</p>
        </>
      )}
      <input
        type="number"
        value={threshold}
        onChange={e => setThreshold(e.target.value)}
        placeholder="New threshold (gwei)"
      />
      <button onClick={updateThreshold}>Update Threshold</button>
      <p>{msg}</p>
    </div>
  );
}
