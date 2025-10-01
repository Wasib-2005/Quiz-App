import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, BarChart2, PlusCircle } from "lucide-react";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";

const TeacherHome = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  return (
    <div className=" flex flex-col items-center justify-center text-center px-4 sm:px-6">
      {/* Hero Section */}
      <div className="max-w-md sm:max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Welcome,{" "}
          <span className="text-yellow-300">
            {userData?.displayName || "Teacher"}
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-lg text-gray-200 leading-relaxed">
          Your digital classroom is ready. Create quizzes, manage students, and
          track progress — everything starts here.
        </p>

        {/* Illustration */}
        <div className="mt-6 flex justify-center">
          <LiaChalkboardTeacherSolid
            size={60}
            className="text-yellow-300"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/create-quiz")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg transition duration-300 text-white"
          >
            <PlusCircle size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Create Quiz
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/20 hover:bg-white/30 shadow-lg transition duration-300 text-white"
          >
            <MdDashboard size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Dashboard
            </span>
          </button>

          <button
            onClick={() => navigate("/students")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-green-500/80 hover:bg-green-600 shadow-lg transition duration-300 text-white"
          >
            <Users size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Students
            </span>
          </button>

          <button
            onClick={() => navigate("/results")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 shadow-lg transition duration-300 text-gray-900"
          >
            <BarChart2 size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Results
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherHome;
