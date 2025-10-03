import { useState, useEffect } from "react";

const Quiz = ({
  questionData,
  activeQuestion,
  setActiveQuestion,
  author,
  studentAnswers,
  setStudentAnswers,
}) => {
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Reset timer when question changes
  useEffect(() => {
    if (questionData?.neededTime) {
      const parsedTime = parseInt(questionData.neededTime, 10) || 0;
      setTotalTime(parsedTime);
      setTimeLeft(parsedTime);
      setSelected(null);
      setIsLocked(false);
    }
  }, [questionData]);

  // Countdown
  useEffect(() => {
    if (!totalTime) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setActiveQuestion(activeQuestion + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [totalTime, activeQuestion, setActiveQuestion]);

  const handleSelection = (index, option) => {
    if (isLocked) return;
    setSelected(index);
    setIsLocked(true);
    setStudentAnswers([
      ...studentAnswers,
      {
        question: questionData.question,
        questionNo: activeQuestion,
        answer: index,
        option: option,
      },
    ]);

    // move to next after short delay
    setTimeout(() => {
      setSelected(null);
      setIsLocked(false);
      setActiveQuestion(activeQuestion + 1);
    }, 800);
  };

  // progress
  const progressPercentage = totalTime ? (timeLeft / totalTime) * 100 : 0;
  const progressColor =
    progressPercentage > 60
      ? "bg-green-500"
      : progressPercentage > 30
      ? "bg-yellow-400"
      : "bg-red-500";

  return (
    <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 max-w-3xl w-full border border-gray-200 min-w-[400px] transition-all duration-500">
      {/* Question */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-relaxed mb-6">
        {activeQuestion + 1}. {questionData?.question}
      </h1>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-right text-sm sm:text-base text-gray-700 mt-2 font-semibold">
        ⏳ {timeLeft}s left
      </p>

      {/* Options */}
      <ul className="grid gap-3 sm:gap-4 mt-6 sm:mt-8">
        {questionData?.options?.map((option, i) => (
          <li
            key={i}
            onClick={() => handleSelection(i, option)}
            className={`relative px-5 sm:px-6 py-4 sm:py-5 rounded-xl font-medium flex items-center gap-3 sm:gap-4 border transition-all duration-300 shadow-sm
              ${
                selected === i
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]"
                  : "hover:bg-indigo-50 hover:border-indigo-300 text-gray-800 bg-white"
              } ${
              isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <span className="font-bold text-lg sm:text-xl">
              {String.fromCharCode(97 + i)}.
            </span>
            <span className="text-base sm:text-lg">{option}</span>
          </li>
        ))}
      </ul>

      {/* Author */}
      {author && (
        <div className="mt-6 flex justify-end">
          <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
            ✍️ Written by {author}
          </span>
        </div>
      )}
    </div>
  );
};

export default Quiz;
