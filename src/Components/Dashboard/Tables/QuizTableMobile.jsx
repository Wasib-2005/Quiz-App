import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const QuizTableMobile = ({ quizzes = [], onDelete }) => {
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return (
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-gray-300 backdrop-blur-lg">
        No quizzes found. Create your first one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          className="bg-white/10 border border-white/20 rounded-2xl p-4 flex flex-col gap-3 shadow-md backdrop-blur-lg"
        >
          {/* Title */}
          <h2 className="text-lg font-bold text-white">{quiz.title}</h2>

          {/* Quiz Details */}
          <div className="flex flex-col gap-1 text-sm text-gray-700">
            <div>
              <span className="font-semibold">Quiz Code:</span>{" "}
              <span className="break-all">{quiz._id}</span>
            </div>
            <div>
              <span className="font-semibold">Date:</span>{" "}
              {quiz.createdAt
                ? new Date(quiz.createdAt).toLocaleString()
                : "Not set"}
            </div>
            <div>
              <span className="font-semibold">Deadline:</span>{" "}
              {quiz.dateLine
                ? new Date(quiz.dateLine).toLocaleString()
                : "Not set"}
            </div>
            <div>
              <span className="font-semibold">Quiz Count:</span>{" "}
              {quiz.questions?.length || 0}
            </div>
            {quiz.totalScore !== undefined && (
              <div>
                <span className="font-semibold">Total Score:</span>{" "}
                {quiz.totalScore}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-2">
            <Link
              to={`/update_quiz/${quiz._id}`}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-500"
            >
              <Edit3 size={16} /> Edit
            </Link>
            <button
              onClick={() => onDelete(quiz._id)}
              className="flex items-center gap-1 text-red-500 hover:text-red-600"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizTableMobile;
