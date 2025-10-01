import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import { GraduationCap, Search } from "lucide-react"; // install lucide-react for icons

const StudentHome = () => {
  const { userData } = useContext(UserContext);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/quiz/${code.trim()}`);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center text-white">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <GraduationCap size={48} className="text-yellow-300" />
        </div>
        <h1 className="text-3xl font-extrabold">
          Welcome Back,{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300">
            {userData?.displayName || userData?.email}
          </span>
        </h1>
        <p className="text-gray-200">
          Enter your <span className="font-semibold">Classroom Code</span>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-8 text-left"
      >
        <div>
          <label className="text-sm text-gray-200 font-medium">Quiz Code</label>
          <input
            type="text"
            placeholder="e.g. ABC123"
            className="w-full mt-2 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        {code && (
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300"
          >
            <Search size={20} />
            Find The Quiz
          </button>
        )}
      </form>

      {/* Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 w-full px-6 py-3 bg-white/30 hover:bg-white/40 text-white font-semibold rounded-lg transition duration-300"
      >
        📊 Go to Dashboard
      </button>
      <div>
        
      </div>
    </div>
  );
};

export default StudentHome;
