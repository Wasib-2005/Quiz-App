import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { PlusCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import QuizTable from "./Tables/QuizTable";
import QuizTableMobile from "./Tables/QuizTableMobile";
import { SingOut } from "../../Components/LoginComponents/UserManagment/SingOut";
import { LoadingContext } from "../../Contexts/LoadingContext/LoadingContext";

const TeacherDashboard = () => {
  const { userData } = useContext(UserContext);
  const { isLoading, setIsLoading } = useContext(LoadingContext); // ✅ fixed typo

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!userData?.email) return;
      setIsLoading(true);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quiz/all_quiz_teacher`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("randomToken")}`,
            },
          }
        );

        const data = Array.isArray(res.data) ? res.data : [];
        console.log("📚 Loaded quizzes:", data);
        setQuizzes(data);
      } catch (err) {
        console.error("❌ Error loading quizzes:", err);
        setQuizzes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [userData, setIsLoading]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    setIsLoading(true);

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/quiz/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("randomToken")}`,
        },
      });

      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.error("❌ Failed to delete quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white/10 border border-white/20 backdrop-blur-lg rounded-3xl p-4 sm:p-6 md:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">
            Teacher Dashboard
          </h1>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              to="/create-quiz"
              className="flex items-center gap-1 sm:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              <PlusCircle size={16} /> Create Quiz
            </Link>

            <button
              onClick={SingOut}
              className="flex items-center gap-1 sm:gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-300 animate-pulse">
            Loading quizzes...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center text-gray-300 py-20">
            No quizzes found. Create your first one!
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block">
              <QuizTable quizzes={quizzes} onDelete={handleDelete} />
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              <QuizTableMobile quizzes={quizzes} onDelete={handleDelete} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
