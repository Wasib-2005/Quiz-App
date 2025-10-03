import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, Award, BarChart2, LogOut } from "lucide-react";
import { SingOut } from "../LoginComponents/UserManagment/SingOut";
import { auth } from "../LoginComponents/UserManagment/Auth";
import { CiWarning } from "react-icons/ci";
import axios from "axios";

const StudentDashboard = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [quizzesTaken, setQuizzesTaken] = useState(0);
  const [violations, setViolations] = useState(0);

  useEffect(() => {
    const fetchQuizzesTaken = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quiz/taken`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("randomToken")}`,
            },
          }
        );
        setQuizzesTaken(res.data.count || 0);
      } catch (err) {
        console.error("Error fetching quizzes taken:", err);
      }
    };
    const totalViolations = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/violation/count`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("randomToken")}`,
            },
          }
        );
        setViolations(res.data.count || 0);
      } catch (err) {
        console.error("Error fetching quizzes taken:", err);
      }
    };

    totalViolations();

    fetchQuizzesTaken();
  }, []);

  const stats = [
    {
      title: "Quizzes Taken",
      value: quizzesTaken,
      icon: <BookOpen size={24} className="text-blue-400" />,
    },
    {
      title: "Average Score",
      value: "85%", // Placeholder
      icon: <Award size={24} className="text-yellow-400" />,
    },
    {
      title: "Progress",
      value: "75%", // Placeholder
      icon: <BarChart2 size={24} className="text-green-400" />,
    },
  ];

  const handleSignOut = async () => {
    try {
      await SingOut(auth);
      navigate("/sing_in_up");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const cards = [
    {
      title: `Violations (${violations})`,
      route: "/violation",
      icon: <CiWarning size={28} />,
    },
    {
      title: "Progress Report",
      route: "/progress",
      icon: <BarChart2 size={28} />,
    },
    {
      title: "Sign Out",
      action: handleSignOut,
      icon: <LogOut size={28} />,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">
          Hello,{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300">
            {userData?.displayName || userData?.email}
          </span>
        </h1>
        <p className="text-gray-200 mt-2">Here’s your learning dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 flex items-center gap-4 shadow-lg"
          >
            <div className="p-4 bg-white/10 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-300">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={card.action ? card.action : () => navigate(card.route)}
            className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/30 transition"
          >
            <div className="text-white">{card.icon}</div>
            <p className="text-white font-semibold">{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
