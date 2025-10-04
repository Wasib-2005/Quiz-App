import React, { useState, useContext, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useParams } from "react-router";
import { UserContext } from "../Contexts/UserContext/UserContext";
import { LoadingContext } from "../Contexts/LoadingContext/LoadingContext";
import { formatDateTimeLocal } from "../Utility/formatDateTimeLocal";

const QuizForm = () => {
  const { userData } = useContext(UserContext);
  const { setIsLoading } = useContext(LoadingContext);
  const { updateID } = useParams();

  const [quizData, setQuizData] = useState({
    title: "",
    author: userData?.displayName || "",
    description: "",
    date: "",
    dateLine: "",
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correct: "",
        neededTime: "",
        score: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});

  // 🧠 Fetch existing quiz if updateID is present
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!updateID) return;
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/quiz/teacher/${updateID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("randomToken")}`,
            },
          }
        );

        const data = res.data;
        if (data) {
          setQuizData({
            title: data.title || "",
            author: data.author || userData?.displayName || "",
            description: data.description || "",
            date: data.date || "",
            dateLine: data.dateLine || "",
            questions:
              Array.isArray(data.questions) && data.questions.length > 0
                ? data.questions
                : [
                    {
                      question: "",
                      options: ["", "", "", ""],
                      correct: "",
                      neededTime: "",
                      score: "",
                    },
                  ],
          });
        }
      } catch (error) {
        toast.error("❌ Failed to load quiz", { transition: Bounce });
        console.error("Error fetching quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [updateID, userData, setIsLoading]);

  // 🧩 Handle field updates
  const handleFieldChange = (field, value) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...quizData.questions];
    if (typeof field === "number") updated[index].options[field] = value;
    else updated[index][field] = value;
    setQuizData((prev) => ({ ...prev, questions: updated }));
  };

  // 🔢 Handle numeric input validation
  const handleNumberChange = (index, field, value, min, max) => {
    const updatedErrors = { ...errors };
    const isNumeric = /^\d*$/.test(value);

    if (!isNumeric) {
      updatedErrors[`${index}-${field}`] = "Numbers only";
    } else if (value !== "") {
      const num = Number(value);
      if (min && num < min) {
        updatedErrors[`${index}-${field}`] = `Minimum is ${min}`;
      } else if (max && num > max) {
        updatedErrors[`${index}-${field}`] = `Maximum is ${max}`;
      } else {
        updatedErrors[`${index}-${field}`] = "";
        handleQuestionChange(index, field, value);
      }
    } else {
      updatedErrors[`${index}-${field}`] = "";
      handleQuestionChange(index, field, value);
    }

    setErrors(updatedErrors);
  };

  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correct: "",
          neededTime: "",
          score: "",
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("randomToken");
      if (updateID) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/quiz/update/${updateID}`,
          quizData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Quiz updated successfully!", { transition: Bounce });
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/quiz/create`,
          { quiz: quizData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("✅ Quiz created successfully!", { transition: Bounce });
        setQuizData({
          title: "",
          author: userData?.displayName || "",
          description: "",
          date: "",
          dateLine: "",
          questions: [
            {
              question: "",
              options: ["", "", "", ""],
              correct: "",
              neededTime: "",
              score: "",
            },
          ],
        });
      }
    } catch (err) {
      console.error("Error saving quiz:", err);
      toast.error(err.response?.data?.error || "❌ Failed to save quiz", {
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 🧱 Render
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-8">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          {updateID ? "Update Quiz" : "Create a New Quiz"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Author */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Quiz Author
            </label>
            <input
              type="text"
              value={quizData.author}
              onChange={(e) => handleFieldChange("author", e.target.value)}
              className="w-full p-3 rounded-lg border bg-white/80 text-black"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Quiz Title
            </label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full p-3 rounded-lg border bg-white/80 text-black"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Description
            </label>
            <textarea
              value={quizData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              rows={3}
              className="w-full p-3 rounded-lg border bg-white/80 text-black"
            />
          </div>

          {/* Dates */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-white mb-2 font-medium">
                Quiz Start Date
              </label>
              <input
                type="datetime-local"
                value={quizData.date || formatDateTimeLocal(new Date())}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                className="w-full p-2 rounded-lg border bg-white/80 text-black"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-white mb-2 font-medium">
                Quiz Deadline
              </label>
              <input
                type="datetime-local"
                value={quizData.dateLine}
                onChange={(e) => handleFieldChange("dateLine", e.target.value)}
                className="w-full p-2 rounded-lg border bg-white/80 text-black"
                required
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {quizData.questions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-2xl bg-white/20 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-white">
                    Question {idx + 1}
                  </h2>
                  {quizData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <textarea
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(idx, "question", e.target.value)
                  }
                  placeholder="Enter question"
                  className="w-full p-2 rounded-lg border bg-white/80 text-black"
                  rows={2}
                  required
                />

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, i) => (
                    <div key={i}>
                      <label className="text-white text-sm">
                        Option {i + 1}
                      </label>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) =>
                          handleQuestionChange(idx, i, e.target.value)
                        }
                        placeholder={`Option ${i + 1}`}
                        className="w-full p-2 rounded-lg border bg-white/80 text-black"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Option */}
                <input
                  type="text"
                  value={q.correct}
                  onChange={(e) =>
                    handleNumberChange(idx, "correct", e.target.value, 1, 4)
                  }
                  placeholder="Correct Option (1–4)"
                  className="w-full p-2 rounded-lg border bg-white/80 text-black"
                  required
                />
                {errors[`${idx}-correct`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`${idx}-correct`]}
                  </p>
                )}

                {/* Time & Score */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={q.neededTime}
                    onChange={(e) =>
                      handleNumberChange(idx, "neededTime", e.target.value)
                    }
                    placeholder="Time (sec)"
                    className="w-full p-2 rounded-lg border bg-white/80 text-black"
                  />
                  <input
                    type="text"
                    value={q.score}
                    onChange={(e) =>
                      handleNumberChange(idx, "score", e.target.value)
                    }
                    placeholder="Score"
                    className="w-full p-2 rounded-lg border bg-white/80 text-black"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Question */}
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            <PlusCircle size={18} /> Add Question
          </button>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
          >
            {updateID ? "Update Quiz" : "Save Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
