import React, { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

const CreateQuiz = () => {
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

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (typeof field === "number") {
      updatedQuestions[index].options[field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct: 0,
        neededTime: 30,
        score: 1,
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      quizTitle,
      quizDescription,
      questions,
    });
    alert("Quiz created! (mock functionality)");
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
          Create a New Quiz
        </h1>
        <p className="text-sm sm:text-base text-gray-200 mb-6">
          Fill out the form below to create your quiz. Add questions, set
          options, and save.
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

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div
                key={idx}
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
                  className="w-full p-2 mt-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black resize-none overflow-hidden"
                  rows={1}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  required
                />

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {q.options.map((opt, i) => (
                    <div className="flex flex-col justify-end gap-2">
                      {opt && <label>Option {i + 1}</label>}
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

                {/* Time & Score */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="w-full sm:w-1/2">
                    {q.neededTime && (
                      <label className="block text-white mb-2 font-medium">
                        Time (sec)
                      </label>
                    )}
                    <input
                      type="number"
                      value={q.neededTime}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[idx].neededTime = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      placeholder="Time (sec)"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
                      style={{ MozAppearance: "textfield" }}
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    {q.score && (
                      <label className="block text-white mb-2 font-medium">
                        Score
                      </label>
                    )}
                    <input
                      type="number"
                      value={q.score}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[idx].score = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      placeholder="Score"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80 text-black"
                      style={{ MozAppearance: "textfield" }}
                    />
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
