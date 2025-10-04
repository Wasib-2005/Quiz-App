import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { PlusCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import QuizTable from "./QuizTable";
import { SingOut } from "../../Components/LoginComponents/UserManagment/SingOut";

const TeacherDashboard = () => {
  const { userData } = useContext(UserContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!userData?.email) return;
      try {
        const res = await axios.get(`/api/quiz/teacher/${userData.email}`);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.quizzes || [];
        setQuizzes(data);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [userData]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await axios.delete(`/api/quiz/${id}`);
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white/10 border border-white/20 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold text-white text-center sm:text-left">
            Teacher Dashboard
          </h1>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/create-quiz"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <PlusCircle size={18} /> Create Quiz
            </Link>

            <button
              onClick={SingOut}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Table / Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-300">
            Loading quizzes...
          </div>
        ) : (
          <QuizTable quizzes={quizzes} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
