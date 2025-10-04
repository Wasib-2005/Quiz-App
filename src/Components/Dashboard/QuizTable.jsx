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
    <div className="overflow-x-auto bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl p-4">
      <table className="min-w-full text-left text-white text-sm sm:text-base">
        <thead>
          <tr className="border-b border-gray-400/40 text-gray-200">
            <th className="py-3 px-2">Title</th>
            <th className="py-3 px-2">Start Date</th>
            <th className="py-3 px-2">Deadline</th>
            <th className="py-3 px-2">Questions</th>
            <th className="py-3 px-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr
              key={quiz._id}
              className="border-b border-gray-700/40 hover:bg-white/5 transition"
            >
              <td className="py-3 px-2 font-medium">{quiz.title}</td>
              <td className="py-3 px-2">
                {quiz.date ? new Date(quiz.date).toLocaleString() : "—"}
              </td>
              <td className="py-3 px-2">
                {quiz.dateLine
                  ? new Date(quiz.dateLine).toLocaleString()
                  : "—"}
              </td>
              <td className="py-3 px-2">{quiz.questions?.length || 0}</td>
              <td className="py-3 px-2 flex justify-center gap-3">
                <Link
                  to={`/results/${quiz._id}`}
                  className="text-green-400 hover:text-green-500"
                >
                  <BarChart3 size={18} />
                </Link>
                <Link
                  to={`/edit-quiz/${quiz._id}`}
                  className="text-blue-400 hover:text-blue-500"
                >
                  <Edit3 size={18} />
                </Link>
                <button
                  onClick={() => onDelete(quiz._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
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
