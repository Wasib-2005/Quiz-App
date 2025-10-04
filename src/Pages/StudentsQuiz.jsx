import React, { useState, useEffect, useContext, useCallback } from "react";
import Quiz from "../Components/Quiz/Quiz";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { LoadingContext } from "../Contexts/LoadingContext/LoadingContext";
import { UserContext } from "../Contexts/UserContext/UserContext";
import { formatTime } from "../Utility/formatTime";

const StudentsQuiz = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);
  const { quizCode } = useParams();

  const [quizMeta, setQuizMeta] = useState(null);
  const [questionsData, setQuestionsData] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const VIOLATION_STORAGE_KEY = "quizViolations";

  /** Send violations to backend */
  const sendViolations = useCallback(async (ban = false) => {
    const violations =
      JSON.parse(localStorage.getItem(VIOLATION_STORAGE_KEY)) || [];
    if (!violations.length) return;

    try {
      const token = localStorage.getItem("randomToken");
      for (const v of violations) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/violation`,
          v,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const violationRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/violation/count`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (violationRes.data.banned) {
        toast.error("🚫 You have been banned from this quiz due to violations.");
        navigate(-1);
      }

      localStorage.removeItem(VIOLATION_STORAGE_KEY);
      localStorage.removeItem("violationCount");
    } catch (err) {
      console.error("Error sending violations:", err);
    }
  }, [navigate]);

  /** Record violation locally */
  const recordViolation = useCallback(
    (reason) => {
      const violation = {
        quizCode,
        reason,
        timestamp: new Date().toISOString(),
        email: userData?.email || "",
        title: quizMeta?.title || "Unknown Quiz",
      };

      const violations =
        JSON.parse(localStorage.getItem(VIOLATION_STORAGE_KEY)) || [];
      violations.push(violation);
      localStorage.setItem(VIOLATION_STORAGE_KEY, JSON.stringify(violations));

      let violationCount = Number(localStorage.getItem("violationCount")) || 0;
      violationCount++;
      localStorage.setItem("violationCount", violationCount);

      toast.error(`🚨 Violation: ${reason}. Quiz reset!`, {
        transition: Bounce,
      });

      if (violationCount >= 5) {
        sendViolations(true);
      }

      resetQuiz();
    },
    [quizCode, userData?.email, quizMeta?.title, sendViolations]
  );

  const resetQuiz = () => {
    setQuizStarted(false);
    setActiveQuestion(0);
    setStudentAnswers([]);
    document.exitFullscreen?.().catch(() => {});
  };

  /** Fetch quiz data */
  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("randomToken");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quiz`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { quizCode },
        }
      );

      const { title, description, questions } = res.data;

      setQuizMeta({
        title,
        description,
        totalQuestions: questions.length,
        totalNeededTime: questions.reduce(
          (a, q) => a + Number(q.neededTime || 0),
          0
        ),
      });

      setQuestionsData(questions);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.error ||
        "❌ Failed to load quiz. Please try again.";
      setError(message);
      toast.error(message);
      navigate(-1);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  }, [quizCode, navigate, setIsLoading]);

  useEffect(() => {
    fetchQuiz();
    sendViolations();
  }, [fetchQuiz, sendViolations]);

  const handleNextQuestion = useCallback(() => {
    setActiveQuestion((prev) => prev + 1);
  }, []);

  const submitAnswers = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("randomToken");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quiz/submit_answers`,
        { quizCode, studentAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await sendViolations();
      navigate(`/answers/${quizCode}`);
    } catch (err) {
      toast.error(err?.response?.data?.error || "❌ Failed to submit answers", {
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  }, [studentAnswers, quizCode, navigate, sendViolations, setIsLoading]);

  useEffect(() => {
    if (activeQuestion >= questionsData.length && quizStarted) {
      setQuizStarted(false);
      submitAnswers();
    }
  }, [activeQuestion, questionsData, quizStarted, submitAnswers]);

  const startQuiz = () => {
    setQuizStarted(true);
    document.documentElement.requestFullscreen?.().catch(() => {
      toast.warn("⚠️ Fullscreen mode failed.");
    });
  };

  /** Anti-cheat listeners */
  useEffect(() => {
    if (!quizStarted) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) recordViolation("Exited fullscreen");
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden")
        recordViolation("Changed tab/minimized");
    };
    const handleWindowBlur = () => recordViolation("Switched window/tab");
    const handleOffline = () => recordViolation("Internet disconnected");
    const handleBeforeUnload = (e) => {
      recordViolation("Browser closed/refreshed");
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let lastFocus = document.hasFocus();
    const focusInterval = setInterval(() => {
      if (!document.hasFocus() && lastFocus) {
        lastFocus = false;
        recordViolation("Lost focus");
      } else if (document.hasFocus()) {
        lastFocus = true;
      }
    }, 150);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(focusInterval);
    };
  }, [quizStarted, recordViolation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-4 w-80">
          <div className="h-6 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-10 bg-indigo-400/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-800 p-6 rounded-xl shadow-md">
          <h1 className="text-xl font-bold">⚠️ Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {!quizStarted ? (
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
          <h1 className="text-3xl font-bold">
            {quizMeta?.title || "Loading..."}
          </h1>
          <p className="mt-2 text-gray-600">{quizMeta?.description}</p>
          <p>Total Questions: {quizMeta?.totalQuestions}</p>
          <p>Time: {formatTime(quizMeta?.totalNeededTime)}</p>
          <button
            onClick={startQuiz}
            className="bg-indigo-600 text-white px-4 py-2 mt-4 rounded hover:bg-indigo-700 transition"
            disabled={!quizMeta}
          >
            Start Quiz
          </button>
        </div>
      ) : questionsData.length > 0 && activeQuestion < questionsData.length ? (
        <Quiz
          questionData={questionsData[activeQuestion]}
          activeQuestion={activeQuestion}
          setActiveQuestion={handleNextQuestion}
          studentAnswers={studentAnswers}
          setStudentAnswers={setStudentAnswers}
        />
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default StudentsQuiz;
