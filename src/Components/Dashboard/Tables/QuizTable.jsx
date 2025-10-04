import React from "react";
import { BarChart3, Trash2, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

const QuizTable = ({ quizzes = [], onDelete }) => {
  if (!Array.isArray(quizzes) || quizzes.length === 0) {
    return (
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center text-gray-300 backdrop-blur-lg">
        No quizzes found. Create your first one!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-2 sm:p-4">
      <table className="min-w-full text-white text-center text-xs sm:text-sm md:text-base">
        <thead>
          <tr className="border-b border-gray-400/40 text-gray-200">
            <th className="py-2 px-1 sm:px-2">Title</th>
            <th className="py-2 px-1 sm:px-2">Quiz Code</th>
            <th className="py-2 px-1 sm:px-2">Deadline</th>
            <th className="py-2 px-1 sm:px-2">Quiz Count</th>
            <th className="py-2 px-1 sm:px-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr
              key={quiz._id}
              className="border-b border-gray-700/40 hover:bg-white/5 transition"
            >
              <td className="py-2 px-1 sm:px-2 font-medium text-sm">
                {quiz.title}
              </td>
              <td className="py-2 px-1 sm:px-2 text-xs break-all">
                {quiz._id}
              </td>
              <td className="py-2 px-1 sm:px-2 text-sm">
                {quiz.dateLine ? new Date(quiz.dateLine).toLocaleString() : "—"}
              </td>
              <td className="py-2 px-1 sm:px-2 text-sm">
                {quiz.questions?.length || 0}
              </td>
              <td className="py-2 px-1 sm:px-2 flex justify-center gap-2">
                <Link
                  to={`/update_quiz/${quiz._id}`}
                  className="text-blue-400 hover:text-blue-500"
                >
                  <Edit3 size={16} />
                </Link>
                <button
                  onClick={() => onDelete(quiz._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
