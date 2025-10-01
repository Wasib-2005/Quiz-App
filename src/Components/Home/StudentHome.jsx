import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Contexts/UserContext/UserContext";

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
    <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
      {/* Welcome Header */}
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome Back, {userData?.displayName || userData?.email}
        </h1>
        <p className="text-gray-600">
          Enter your Classroom Code to start a quiz
        </p>

        {/* Code Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Code"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Find The Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentHome;
