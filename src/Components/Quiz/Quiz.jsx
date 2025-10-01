import { useState, useEffect } from "react";

const Quiz = ({ questionData, activeQuestion, setActiveQuestion }) => {
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (questionData?.timeNeeded) {
      setTotalTime(questionData.timeNeeded);
      setTimeLeft(questionData.timeNeeded);
    }
  }, [questionData]);

  useEffect(() => {
    if (!totalTime) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setActiveQuestion(activeQuestion + 1);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTime, activeQuestion, setActiveQuestion]);

  const handleSelection = (index) => {
    if (isLocked) return;
    setSelected(index);
    setIsLocked(true);

    setTimeout(() => {
      setSelected(null);
      setIsLocked(false);
      setActiveQuestion(activeQuestion + 1);
    }, 600);
  };

  const progressPercentage = totalTime ? (timeLeft / totalTime) * 100 : 0;

  const progressColor =
    progressPercentage > 60
      ? "bg-green-500"
      : progressPercentage > 30
      ? "bg-yellow-400"
      : "bg-red-500";

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 max-w-3xl w-full border border-gray-200">
      {/* Question */}
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-6">
        {activeQuestion + 1}. {questionData?.question}
      </h1>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-right text-xs sm:text-sm text-gray-600 mt-1 font-medium">
        ⏳ {timeLeft}s left
      </p>

      {/* Options */}
      <ul className="grid gap-3 sm:gap-4 mt-6 sm:mt-8">
        {questionData?.options?.map((option, i) => (
          <li
            key={i}
            onClick={() => handleSelection(i + 1)}
            className={`relative px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-medium text-gray-700 flex items-center gap-2 sm:gap-3 border transition-all duration-300 
              ${
                selected === i + 1
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]"
                  : "hover:bg-indigo-50 hover:border-indigo-300"
              } ${isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span className="font-bold text-base sm:text-lg">
              {String.fromCharCode(97 + i)}.
            </span>
            <span className="text-sm sm:text-base">{option}</span>
          </li>
        ))}
      </ul>

      {/* Author */}
      {questionData?.weittenBy && (
        <p className="text-xs sm:text-sm text-gray-500 mt-6 italic">
          ✍️ Written by {questionData.weittenBy}
        </p>
      )}
    </div>
  );
};

export default Quiz;
