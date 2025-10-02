import React, { useState, useEffect } from "react";
import Quiz from "../Components/Quiz/Quiz";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

const StudentsQuiz = () => {
  const navigate = useNavigate();

  const [quizStarted, setQuizStarted] = useState(false);
  const [cheatDetected, setCheatDetected] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [questionsData, setQuestionsData] = useState({});
  const [studentAnswers, setStudentAnswers] = useState([]);
  console.log("studentAnswers", studentAnswers);

  const { quizCode } = useParams();

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("randomToken"); // ✅ get from localStorage

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/quiz?quizCode=${quizCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ send JWT token
            },
          }
        );
        console.log(res.data);
        setQuestionsData(res.data || {});
      } catch (err) {
        console.error("❌ Error fetching quiz:", err.response.data.error);
        toast.error(err.response.data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        navigate("/");
        if (err.response?.status === 401) {
          alert("⚠ Unauthorized! Please log in again.");
          // optional: redirect to login page
        }
      }
    };

    fetchQuiz();
  }, [quizCode, navigate]);

  // POST student answers once quiz is done
  console.log(studentAnswers.length, questionsData?.questions?.length);
  useEffect(() => {
    if (isDone && studentAnswers.length === questionsData?.questions?.length) {
      console.log("sending answare");
      const sendAnswers = async () => {
        try {
          const token = localStorage.getItem("randomToken");
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/submit_answers`,
            {
              quizCode,
              studentAnswers,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("✅ Answers submitted successfully!", {
            position: "top-right",
            autoClose: 3000,
            transition: Bounce,
          });
          console.log("Submission response:", res.data);
        } catch (err) {
          console.error(
            "❌ Error submitting answers:",
            err.response?.data?.error
          );
          toast.error("❌ Failed to submit answers", {
            position: "top-right",
            autoClose: 5000,
            transition: Bounce,
          });
        }
      };
      sendAnswers();
    }
  }, [isDone, quizCode, studentAnswers, questionsData]);

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
    if (activeQuestion + 1 < questionsData?.questions.length) {
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
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center grid gap-4">
          <h1 className="text-3xl text-gray-900 font-extrabold">
            🎓 Ready for your Quiz?
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            {questionsData?.title || "Loading quiz..."}
          </p>
          <p className="text-gray-500">{questionsData?.description}</p>

          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Start Quiz
          </button>

          <p
            className={`mt-3 text-sm font-bold ${
              cheatDetected ? "text-red-600" : "text-green-600"
            }`}
          >
            {cheatDetected
              ? "⚠ Cheating detected!"
              : "✅ Enter fullscreen and stay focused to start."}
          </p>
        </div>
      ) : quizStarted &&
        questionsData?.questions?.length > 0 &&
        activeQuestion < questionsData?.questions.length ? (
        <Quiz
          activeQuestion={activeQuestion}
          setActiveQuestion={handleNextQuestion}
          questionData={questionsData?.questions[activeQuestion]}
          author={questionsData?.author}
          studentAnswers={studentAnswers}
          setStudentAnswers={setStudentAnswers}
        />
      ) : isDone ? (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-green-600">
            ✅ Quiz Completed!
          </h1>
          <p className="mt-4 text-gray-700">
            Great job 🎉 — You’ve completed the quiz.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Retake Quiz
          </button>
        </div>
      ) : (
        <div className="text-white text-lg font-semibold animate-pulse">
          ⏳ Loading quiz...
        </div>
      )}
    </div>
  );
};

export default StudentsQuiz;
