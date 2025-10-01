import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Database, Settings, Users, BarChart2 } from "lucide-react";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import { LiaChalkboardSolid } from "react-icons/lia";

const AdminHome = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6">
      {/* Hero Section */}
      <div className="max-w-md sm:max-w-2xl w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Welcome,{" "}
          <span className="text-red-400">
            {userData?.displayName || "Admin"}
          </span>
        </h1>
        <p className="mt-4 text-sm sm:text-lg text-gray-200 leading-relaxed">
          Manage the entire system from here. Create, review, and monitor all
          activities efficiently.
        </p>

        {/* Illustration */}
        <div className="mt-6 flex justify-center">
          <LiaChalkboardSolid
            size={60}
            className="text-red-400"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg transition duration-300 text-white"
          >
            <Users size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Manage Teacher
            </span>
          </button>

          <button
            onClick={() => navigate("/admin/quizzes")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/20 hover:bg-white/30 shadow-lg transition duration-300 text-white"
          >
            <Database size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Manage Quizzes
            </span>
          </button>

          <button
            onClick={() => navigate("/admin/settings")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-blue-500/80 hover:bg-blue-600 shadow-lg transition duration-300 text-white"
          >
            <Settings size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Settings
            </span>
          </button>

          <button
            onClick={() => navigate("/admin/reports")}
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 shadow-lg transition duration-300 text-gray-900"
          >
            <BarChart2 size={36} />
            <span className="mt-2 font-semibold text-base sm:text-lg">
              Reports
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
