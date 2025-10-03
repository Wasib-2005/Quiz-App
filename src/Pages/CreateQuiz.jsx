import React, { useState, useContext } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { UserContext } from "../Contexts/UserContext/UserContext";

const CreateQuiz = () => {
  const { userData } = useContext(UserContext);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correct: "",
      neededTime: "",
      score: "",
    },
  ]);
  const [date, setDate] = useState("");
  const [dateLine, setDateLine] = useState("");
  const [errors, setErrors] = useState({});

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (typeof field === "number") {
      updatedQuestions[index].options[field] = value;
    } else if (field === "correct") {
      updatedQuestions[index].correct = value;
    } else if (field === "neededTime") {
      updatedQuestions[index].neededTime = value;
    } else if (field === "score") {
      updatedQuestions[index].score = value;
    }
    setQuestions(updatedQuestions);
  };

  // New number validation handler
  const handleNumberChange = (index, field, value) => {
    const updatedErrors = { ...errors };
    if (value === "" || /^\d+$/.test(value)) {
      updatedErrors[`${index}-${field}`] = "";
      handleQuestionChange(index, field, value);
    } else {
      updatedErrors[`${index}-${field}`] = "Number only";
    }
    setErrors(updatedErrors);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct: "",
        neededTime: "",
        score: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quizObject = {
      author: userData?.displayName || userData?.email || "Unknown",
      title: quizTitle,
      description: quizDescription,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
        neededTime: q.neededTime,
        score: q.score,
      })),
      date,
      dateLine,
    };
    console.log(quizObject);
    alert("Quiz created! Check console for output.");
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
          {/* Quiz Title */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Quiz Title
            </label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
              required
            />
          </div>

          {/* Quiz Description */}
          <div>
            <label className="block text-white mb-2 font-medium">
              Description
            </label>
            <textarea
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
              placeholder="Optional description..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black resize-none overflow-hidden"
              rows={3}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>
          <div className="flex justify-between">
            {/* Quiz Start Date */}
            <div className="w-[45%]">
              <label className="block text-white mb-2 font-medium">
                Quiz Start Date
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 px-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
                required
              />
            </div>

            {/* Quiz Deadline */}
            <div className="w-[45%]">
              <label className="block text-white mb-2 font-medium">
                Quiz Deadline
              </label>
              <input
                type="datetime-local"
                value={dateLine}
                onChange={(e) => setDateLine(e.target.value)}
                className="w-full p-2 px-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
                required
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={`question${idx}`}
                className="p-4 border border-gray-300 rounded-2xl bg-white/20 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-white">
                    Question {idx + 1}
                  </h2>
                  {questions.length > 1 && (
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
                  className="w-full p-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black resize-none"
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
                        key={i}
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleQuestionChange(idx, i, e.target.value)
                        }
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black h-10"
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Option */}
                <div>
                  {q.correct && (
                    <label className="block text-white mb-2 font-medium">
                      Correct Option Number
                    </label>
                  )}
                  <input
                    type="text"
                    value={q.correct}
                    onChange={(e) =>
                      handleNumberChange(idx, "correct", e.target.value)
                    }
                    placeholder="Correct Option (0-3)"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
                    required
                  />
                  {errors[`${idx}-correct`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`${idx}-correct`]}
                    </p>
                  )}
                </div>

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
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
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
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
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
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-300"
          >
            <PlusCircle />
            Add Question
          </button>

          {/* Save Quiz */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition duration-300"
          >
            Save Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
