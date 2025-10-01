import React, { useState, useEffect } from "react";
import Quiz from "../Components/Quiz/Quiz";
import { useParams } from "react-router";
import axios from "axios";

const StudentsQuiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [cheatDetected, setCheatDetected] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);

  const { quizCode } = useParams();

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/quiz?quizCode=${quizCode}`,
          { withCredentials: true }
        );
        setQuestionsData(res.data.questions || []);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    fetchQuiz();
  }, [quizCode]);

  const requestFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem
        .requestFullscreen()
        .catch((err) => console.error("Fullscreen request failed:", err));
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  const startQuiz = () => {
    requestFullScreen();
    setTimeout(() => {
      if (document.fullscreenElement) {
        setQuizStarted(true);
        setCheatDetected(false);
      } else {
        alert("⚠ You must be in fullscreen to start the quiz.");
      }
    }, 100);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && quizStarted) {
        setCheatDetected(true);
        alert("⚠ You left fullscreen mode — cheating detected!");
        setQuizStarted(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && quizStarted) {
        setCheatDetected(true);
        alert("⚠ You changed tab or minimized — cheating detected!");
        setQuizStarted(false);
      }
    };

    const handleWindowBlur = () => {
      if (quizStarted) {
        setCheatDetected(true);
        alert("⚠ You switched windows — cheating detected!");
        setQuizStarted(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [quizStarted]);

  const handleNextQuestion = () => {
    if (activeQuestion + 1 < questionsData.length) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      setQuizStarted(false);
      setIsDone(true);
      exitFullScreen();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {!quizStarted && !isDone ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-4">🎓 Ready for your Quiz?</h1>
          <p className="mb-6 text-gray-600">
            Enter fullscreen and stay focused to start.
          </p>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md"
          >
            Start Quiz
          </button>
          {cheatDetected && (
            <p className="mt-4 text-red-600 font-bold">⚠ Cheating detected!</p>
          )}
        </div>
      ) : quizStarted && activeQuestion < questionsData.length ? (
        <Quiz
          questionData={questionsData[activeQuestion]}
          activeQuestion={activeQuestion}
          setActiveQuestion={handleNextQuestion}
        />
      ) : isDone ? (
        <div className="bg-green-50 p-8 rounded-3xl shadow-xl max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-green-600">
            ✅ Quiz Completed!
          </h1>
          <p className="mt-4 text-gray-700">
            Great job 🎉 — You’ve completed the quiz.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            Retake Quiz
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StudentsQuiz;
