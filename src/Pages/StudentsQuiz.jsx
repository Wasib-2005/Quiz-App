import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import Quiz from "../Components/Quiz/Quiz";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { LoadingContext } from "../Contexts/LoadingContext/LoadingContext";
import { SingOut } from "../Components/LoginComponents/UserManagment/SingOut";
import { formatTime } from "../Utility/formatTime";
import { IoMdTimer } from "react-icons/io";

const StudentsQuiz = () => {
  const navigate = useNavigate();
  const { withLoading } = useContext(LoadingContext);

  const [quizStarted, setQuizStarted] = useState(false);
  const [cheatDetected, setCheatDetected] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const [quizMeta, setQuizMeta] = useState(null);
  const [questionsData, setQuestionsData] = useState({});
  const [studentAnswers, setStudentAnswers] = useState([]);

  const { quizCode } = useParams();

  const violationRef = useRef([]);

  /** CHECK INTERNET CONNECTION */
  const checkConnection = () => navigator.onLine;

  /** RECORD VIOLATION */
  const recordViolation = useCallback(
    async (reason) => {
      const violationData = {
        quizCode,
        reason,
        timestamp: new Date().toISOString(),
      };

      if (!checkConnection()) {
        // Save locally if no net
        let violations =
          JSON.parse(localStorage.getItem("violations")) || [];
        violations.push(violationData);
        localStorage.setItem("violations", JSON.stringify(violations));
      } else {
        try {
          const token = localStorage.getItem("randomToken");
          await axios.post(
            `${import.meta.env.VITE_API_URL}/violation`,
            violationData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error("Violation report failed", err);
          // Save locally if post fails
          let violations =
            JSON.parse(localStorage.getItem("violations")) || [];
          violations.push(violationData);
          localStorage.setItem("violations", JSON.stringify(violations));
        }
      }

      setCheatDetected(true);
      setQuizStarted(false);
      setActiveQuestion(0);
      setIsDone(false);
      setStudentAnswers([]);
      localStorage.removeItem("inProgressAnswers");

      toast.error(`⚠ Violation detected: ${reason}`, {
        position: "top-right",
        autoClose: 5000,
        transition: Bounce,
      });
    },
    [quizCode]
  );

  /** SYNC LOCAL VIOLATIONS WHEN ONLINE */
  const syncViolations = useCallback(async () => {
    const violations = JSON.parse(localStorage.getItem("violations"));
    if (violations?.length && checkConnection()) {
      try {
        const token = localStorage.getItem("randomToken");
        await axios.post(
          `${import.meta.env.VITE_API_URL}/violation/batch`,
          { violations },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.removeItem("violations");
      } catch (err) {
        console.error("Violation batch upload failed", err);
      }
    }
  }, []);

  /** FETCH QUIZ META */
  useEffect(() => {
    const fetchQuizMeta = async () => {
      if (!checkConnection()) {
        recordViolation("No internet connection before quiz start");
        return;
      }

      await withLoading(async () => {
        try {
          const token = localStorage.getItem("randomToken");
          if (!token) {
            SingOut();
            navigate("/");
            return;
          }
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/quizTest?quizCode=${quizCode}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setQuizMeta(res.data);
        } catch (err) {
          toast.error(err.response?.data?.error || "❌ Failed to load quiz", {
            position: "top-right",
            autoClose: 4000,
            transition: Bounce,
          });
          navigate("/");
        }
      });
    };
    fetchQuizMeta();
  }, [quizCode, navigate, withLoading, recordViolation]);

  /** FETCH QUIZ QUESTIONS */
  const fetchQuizQuestions = useCallback(async () => {
    if (!checkConnection()) {
      recordViolation("No internet during quiz start");
      return;
    }

    await withLoading(async () => {
      try {
        const token = localStorage.getItem("randomToken");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/quiz?quizCode=${quizCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestionsData(res.data || {});
      } catch (err) {
        toast.error(err.response?.data?.error || "❌ Failed to fetch quiz", {
          position: "top-right",
          autoClose: 4000,
          transition: Bounce,
        });
        navigate("/");
      }
    });
  }, [quizCode, navigate, withLoading, recordViolation]);

  /** SUBMIT ANSWERS */
  const submitAnswers = useCallback(
    async (quizCode, studentAnswers) => {
      if (!checkConnection()) {
        recordViolation("No internet during answer submission");
        return;
      }

      await withLoading(async () => {
        try {
          const token = localStorage.getItem("randomToken");
          await axios.post(
            `${import.meta.env.VITE_API_URL}/submit_answers`,
            { quizCode, studentAnswers },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("✅ Answers submitted!", {
            position: "top-right",
            autoClose: 3000,
            transition: Bounce,
          });
          localStorage.removeItem("pendingAnswers");
          localStorage.removeItem("inProgressAnswers");
        } catch (err) {
          console.error(err);
          toast.error("❌ Failed to submit answers", {
            position: "top-right",
            autoClose: 4000,
            transition: Bounce,
          });
        }
      });
    },
    [withLoading, recordViolation]
  );

  /** AUTO SUBMIT WHEN DONE */
  useEffect(() => {
    if (isDone && studentAnswers.length === questionsData?.questions?.length) {
      submitAnswers(quizCode, studentAnswers);
    }
  }, [isDone, quizCode, studentAnswers, questionsData, submitAnswers]);

  /** FULLSCREEN HELPERS */
  const requestFullScreen = async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      try {
        await elem.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen request failed:", err);
      }
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  /** START QUIZ */
  const startQuiz = async () => {
    if (!checkConnection()) {
      recordViolation("No internet before quiz start");
      return;
    }

    await requestFullScreen();
    setQuizStarted(true);
    setCheatDetected(false);
    await fetchQuizQuestions();
  };

  /** ANTI-CHEATING EVENTS */
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && quizStarted) {
        recordViolation("Left fullscreen");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && quizStarted) {
        recordViolation("Changed tab or minimized");
      }
    };

    const handleWindowBlur = () => {
      if (quizStarted) {
        recordViolation("Switched windows");
      }
    };

    const handleOffline = () => {
      if (quizStarted) {
        recordViolation("Internet disconnected during quiz");
      }
    };

    const handleBeforeUnload = () => {
      if (quizStarted) {
        recordViolation("Browser closed or reload during quiz");
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("online", syncViolations);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("online", syncViolations);
    };
  }, [quizStarted, recordViolation, syncViolations]);

  /** NEXT QUESTION */
  const handleNextQuestion = useCallback(() => {
    if (activeQuestion + 1 < questionsData?.questions.length) {
      setActiveQuestion(activeQuestion + 1);
    } else {
      setQuizStarted(false);
      setIsDone(true);
      exitFullScreen();
    }
  }, [activeQuestion, questionsData?.questions]);

  return (
    <div className="flex items-center justify-center">
      {!quizStarted && !isDone ? (
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900">
            📚 {quizMeta?.title || "Loading quiz..."}
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            {quizMeta?.description ||
              "Get ready to sharpen your skills and test your knowledge!"}
          </p>

          <div className="flex flex-col md:flex-row justify-around items-center text-gray-800 ">
            <p className="font-medium">
              📝 <span className="font-semibold">Total Questions:</span>{" "}
              {quizMeta?.totalQuestions || "-"}
            </p>
            <p className="flex items-center font-medium">
              <IoMdTimer className="mr-1 text-indigo-600" />
              <span className="font-semibold">Time:</span>{" "}
              {formatTime(quizMeta?.totalNeededTime)}
            </p>
          </div>

          <div>
            <button
              onClick={startQuiz}
              className="mt-4 px-6 py-3 w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Start Quiz
            </button>
          </div>

          <p
            className={`mt-3 text-sm font-bold ${
              cheatDetected ? "text-red-600" : "text-green-600"
            }`}
          >
            {cheatDetected
              ? "⚠ Violation detected — quiz terminated!"
              : "✨ Enter fullscreen and focus for best results."}
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
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-4">
          <h1 className="text-3xl font-bold text-green-600">🎉 Well Done!</h1>
          <p className="text-gray-700">
            You’ve completed the quiz — keep up the great work! 🌟
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            🔄 Try Again
          </button>
        </div>
      ) : (
        <div className="text-white text-lg font-semibold animate-pulse">
          ⏳ Preparing your study session...
        </div>
      )}
    </div>
  );
};

export default React.memo(StudentsQuiz);
