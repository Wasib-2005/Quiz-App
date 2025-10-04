import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import axios from "axios";

export default function Progress() {
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/roadmap`);
      setRoadmap(res.data);
    } catch (err) {
      console.error("Failed to load roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Loading roadmap...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        🛤 Lead with Python Roadmap
      </h1>

      <div className="grid justify-center">
        {roadmap.map((step, index) => (
          <div key={index} className="mb-10 relative">
            <div className="absolute -left-7 top-4 w-9 h-9 bg-gradient-to-br border-green-400 border-4 text-white rounded-full flex justify-center items-center shadow-lg">
              {step.completed ? <IoCheckmarkDoneOutline size={30} /> : <></>}
            </div>
            <div className="pl-6">
              <span className="text-sm text-white/70">
                {step.day} — {step.date}
              </span>
              <h2 className="text-2xl font-semibold text-white mt-1">
                {step.title}
              </h2>
              <p className="text-white/80 mt-2">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
