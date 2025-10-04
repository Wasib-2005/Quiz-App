import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { LoadingContext } from "../Contexts/LoadingContext/LoadingContext";

const AnswersOne = () => {
  const { quizCode } = useParams();
  const { setIsLoading } = useContext(LoadingContext);

  const [answersData, setAnswersData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!quizCode) return;
      setIsLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("randomToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/answers/answers?quizCode=${quizCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnswersData(res.data);
      } catch (err) {
        console.error("❌ Error fetching answers:", err);
        setError(err.response?.data?.error || "Failed to fetch answers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [quizCode, setIsLoading]);

  // 🔴 Error State
  if (error) {
    return (
      <div className="text-red-500 text-center font-semibold mt-10">
        {error}
      </div>
    );
  }

  // 🕓 Loading State
  if (!answersData) {
    return (
      <div className="text-center text-gray-300 mt-10 animate-pulse">
        Loading answers...
      </div>
    );
  }

  // ✅ Calculate score stats
  const totalQuestions = answersData.answers?.length || 1;
  const correctAnswers =
    answersData.answers?.filter((a) => a.isCorrect).length || 0;
  const scorePercent = (correctAnswers / totalQuestions) * 100;

  const getResultMessage = () => {
    if (scorePercent === 100) return "🏆 Perfect Score!";
    if (scorePercent >= 70) return "🎉 Well Done!";
    if (scorePercent >= 50) return "👍 Good Effort!";
    return "😐 Keep Trying!";
  };

  // 🧾 Render
  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-center text-green-400">
        {getResultMessage()}
      </h1>

      <p className="text-center text-gray-300">
        You’ve completed the quiz — your score is{" "}
        <span className="font-semibold text-white">
          {scorePercent.toFixed(1)}%
        </span>{" "}
        🌟
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-gray-400 text-sm">Total Questions</p>
          <p className="text-xl font-bold">{totalQuestions}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-gray-400 text-sm">Correct</p>
          <p className="text-xl font-bold text-green-400">{correctAnswers}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-gray-400 text-sm">Score</p>
          <p className="text-xl font-bold">{answersData.getScore ?? 0}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-gray-400 text-sm">Total Score</p>
          <p className="text-xl font-bold">{answersData.totalScore ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 text-left">
        <h2 className="text-2xl font-bold mb-4">📝 Detailed Answers</h2>
        <div className="space-y-3">
          {answersData.answers?.map((ans, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition ${
                ans.isCorrect
                  ? "bg-green-500/10 border-green-400/30"
                  : "bg-red-500/10 border-red-400/30"
              }`}
            >
              <p className="text-sm sm:text-base">
                <strong>Q{idx + 1}:</strong> {ans.question}
              </p>
              <p className="text-sm sm:text-base mt-1">
                <strong>Your Answer:</strong> {ans.option || ans.answer}
              </p>
              <p className="text-sm sm:text-base mt-1">
                <strong>Score:</strong> {ans.score}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnswersOne;
