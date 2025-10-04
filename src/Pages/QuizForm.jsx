import React, { useState, useContext } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { UserContext } from "../Contexts/UserContext/UserContext";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { formatDateTimeLocal } from "../Utility/formatDateTimeLocal";
import { useParams } from "react-router";

const QuizForm = () => {
  const { userData } = useContext(UserContext);
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

  const handleFieldChange = (field, value) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizData.questions];
    if (field === "question") updatedQuestions[index].question = value;
    else if (typeof field === "number")
      updatedQuestions[index].options[field] = value;
    else if (field === "correct") updatedQuestions[index].correct = value;
    else if (field === "neededTime") updatedQuestions[index].neededTime = value;
    else if (field === "score") updatedQuestions[index].score = value;
    setQuizData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleNumberChange = (index, field, value, min, max) => {
    const updatedErrors = { ...errors };

    // Check if empty or not a number
    if (value === "" || /^\d+$/.test(value)) {
      let numericValue = Number(value);

      if (value !== "") {
        if (min !== undefined && max !== undefined) {
          if (numericValue < min || numericValue > max) {
            updatedErrors[
              `${index}-${field}`
            ] = `Number must be between ${min} and ${max}`;
          } else {
            updatedErrors[`${index}-${field}`] = "";
            handleQuestionChange(index, field, value);
          }
        } else if (min !== undefined) {
          if (numericValue < min) {
            updatedErrors[`${index}-${field}`] = `Number must be ≥ ${min}`;
          } else {
            updatedErrors[`${index}-${field}`] = "";
            handleQuestionChange(index, field, value);
          }
        } else if (max !== undefined) {
          if (numericValue > max) {
            updatedErrors[`${index}-${field}`] = `Number must be ≤ ${max}`;
          } else {
            updatedErrors[`${index}-${field}`] = "";
            handleQuestionChange(index, field, value);
          }
        } else {
          // No min/max defined
          updatedErrors[`${index}-${field}`] = "";
          handleQuestionChange(index, field, value);
        }
      } else {
        updatedErrors[`${index}-${field}`] = "";
        handleQuestionChange(index, field, value);
      }
    } else {
      updatedErrors[`${index}-${field}`] = "Number only";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("randomToken");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quiz/create`,
        { quiz: quizData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Quiz created successfully!", { transition: Bounce });
      console.log("Created quiz:", res.data.quiz);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create quiz", {
        transition: Bounce,
      });
      console.error("Quiz creation error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          Create a New Quiz
        </h1>
        <p className="text-sm sm:text-base text-gray-200 mb-6">
          Fill out the form below to create your quiz. Add questions, options,
          correct answers, scoring, and set quiz dates.
        </p>

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
              placeholder="Enter quiz author name"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 text-black"
              required
            />
          </div>

          {/* Quiz Title */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Quiz Title
            </label>
            <input
              type="text"
              value={quizData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Enter quiz title"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 text-black"
              required
            />
          </div>

          {/* Quiz Description */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Description
            </label>
            <textarea
              value={quizData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Optional description..."
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/80 text-black resize-none overflow-hidden"
              rows={3}
            />
          </div>

          {/* Dates */}
          <div className="flex justify-between">
            <div className="w-[45%]">
              <label className="block text-white mb-2 font-medium">
                Quiz Start Date
              </label>
              <input
                type="datetime-local"
                value={quizData.date || formatDateTimeLocal(new Date())}
                onChange={(e) => handleFieldChange("date", e.target.value)}
                className="w-full p-2 px-5 rounded-lg border border-gray-300 bg-white/80 text-black"
                required
              />
            </div>

            <div className="w-[45%]">
              <label className="block text-white mb-2 font-medium">
                Quiz Deadline
              </label>
              <input
                type="datetime-local"
                value={quizData.dateLine}
                onChange={(e) => handleFieldChange("dateLine", e.target.value)}
                className="w-full p-2 px-5 rounded-lg border border-gray-300 bg-white/80 text-black"
                required
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {quizData.questions.map((q, idx) => (
              <div
                key={`question${idx}`}
                className="p-4 border border-gray-300 rounded-2xl bg-white/20 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-white">
                    Question {idx + 1}
                  </h2>
                  {quizData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>

                {/* Question Text */}
                {q.question && (
                  <label className="block text-white mb-2 font-medium">
                    Enter question text
                  </label>
                )}
                <textarea
                  placeholder="Enter question text"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(idx, "question", e.target.value)
                  }
                  className="w-full p-2 mt-2 rounded-lg border border-gray-300 bg-white/80 text-black"
                  rows={1}
                  required
                />

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {q.options.map((opt, i) => (
                    <div key={`opt${i}`} className="flex flex-col gap-2">
                      {opt && (
                        <label className="text-white text-sm">
                          Option {i + 1}
                        </label>
                      )}
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleQuestionChange(idx, i, e.target.value)
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 bg-white/80 text-black h-10"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Option */}
                {q.correct && (
                  <label className="block text-white mb-2 font-medium">
                    Correct Option Number
                  </label>
                )}
                <input
                  type="text"
                  value={q.correct}
                  onChange={(e) =>
                    handleNumberChange(idx, "correct", e.target.value, 1, 4)
                  }
                  placeholder="Correct Option (1-4)"
                  className="w-full p-2 rounded-lg border border-gray-300 bg-white/80 text-black"
                  required
                />
                {errors[`${idx}-correct`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`${idx}-correct`]}
                  </p>
                )}

                {/* Needed Time & Score */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="w-full sm:w-1/2 grid items-end">
                    {q.neededTime && (
                      <label className="block text-white mb-2 font-medium">
                        Time (sec)
                      </label>
                    )}
                    <input
                      type="text"
                      value={q.neededTime}
                      onChange={(e) =>
                        handleNumberChange(idx, "neededTime", e.target.value)
                      }
                      placeholder="Time (sec)"
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white/80 text-black"
                    />
                    {errors[`${idx}-neededTime`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`${idx}-neededTime`]}
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:w-1/2 grid items-end">
                    {q.score && (
                      <label className="block text-white mb-2 font-medium">
                        Score
                      </label>
                    )}
                    <input
                      type="text"
                      value={q.score}
                      onChange={(e) =>
                        handleNumberChange(idx, "score", e.target.value)
                      }
                      placeholder="Score"
                      className="w-full p-2 rounded-lg border border-gray-300 bg-white/80 text-black"
                    />
                    {errors[`${idx}-score`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`${idx}-score`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question */}
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
          >
            <PlusCircle />
            Add Question
          </button>

          {/* Save Quiz */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
          >
            Save Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
