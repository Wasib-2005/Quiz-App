import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../Contexts/UserContext/UserContext";
import { LoadingContext } from "../Contexts/LoadingContext/LoadingContext";
import { Bounce } from "react-toastify";
import { useParams } from "react-router";

const AnswersOne = () => {
  const { quizCode } = useParams();
  const { setIsLoading } = useContext(LoadingContext);

  const [answersData, setAnswersData] = useState(null);
  const [error, setError] = useState("");

  const fetchAnswers = async () => {
    setIsLoading(true)
    try {
        const token = localStorage.getItem("randomToken");
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/answers/answers?quizCode=${quizCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAnswersData(res.data);
     
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch answers");
    }
    setIsLoading(false)
  };

  useEffect(() => {
    fetchAnswers();
  }, [quizCode,]);

  if (error) {
    return (
      <div className="text-red-600 font-bold text-center mt-10">{error}</div>
    );
  }

  if (!answersData) {
    return <div className="text-center mt-10">Loading answers...</div>;
  }

  const totalQuestions = answersData.answers.length || 1;
  const correctAnswers = answersData.answers.filter((a) => a.isCorrect).length;
  const scorePercent = (correctAnswers / totalQuestions) * 100;

  const getResultMessage = () => {
    if (scorePercent === 100) return "🏆 Perfect Score!";
    if (scorePercent >= 70) return "🎉 Well Done!";
    if (scorePercent >= 50) return "👍 Good Effort!";
    return "😐 Keep Trying!";
  };

  return (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center mx-auto mt-10 space-y-4">
      <h1 className="text-3xl font-bold text-green-600">
        {getResultMessage()}
      </h1>
      <p className="text-gray-700">
        You’ve completed the quiz — your score is {scorePercent.toFixed(1)}% 🌟
      </p>

      <div className="space-y-2">
        <p className="font-semibold text-lg">
          Total Questions: {totalQuestions}
        </p>
        <p className="font-semibold text-lg">
          Correct Answers: {correctAnswers}
        </p>
        <p className="font-semibold text-lg">
          Total Score: {answersData.totalScore || 0}
        </p>
      </div>

      <div className="mt-6 text-left">
        <h2 className="text-2xl font-bold">Detailed Answers</h2>
        {answersData.answers.map((ans, idx) => (
          <div
            key={idx}
            className={`p-4 border rounded mb-3 ${
              ans.isCorrect ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p>
              <strong>Q{idx + 1}:</strong> {ans.question}
            </p>
            <p>
              <strong>Answer:</strong> {ans.option}
            </p>
            <p>
              <strong>Score:</strong> {ans.score}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswersOne;
