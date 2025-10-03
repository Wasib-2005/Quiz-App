import React from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

const roadmap = [
  {
    day: "Milestone 1",
    date: "6th Oct",
    title: "Introduction to Python",
    description: "Setup Python environment and write your first script.",
    completed: true, // ✅ milestone complete
  },
  {
    day: "Milestone 2",
    date: "9th Oct",
    title: "Variables & Data Types",
    description: "Learn about different data types and variables.",
    completed: true,
  },
  {
    day: "Milestone 3",
    date: "12th Oct",
    title: "Operators & Expressions",
    description: "Understand operators and expressions in Python.",
    completed: false,
  },
  {
    day: "Milestone 4",
    date: "15th Oct",
    title: "Control Flow",
    description: "Dive into if-else statements and loops.",
    completed: false,
  },
  {
    day: "Milestone 5",
    date: "18th Oct",
    title: "Loops",
    description:
      "Learn for loops, while loops, and loop controls (break, continue).",
    completed: false,
  },
  {
    day: "Milestone 6",
    date: "21st Oct",
    title: "Functions & Revision",
    description: "Learn functions and review all topics learned so far.",
    completed: false,
  },
];

export default function Progress() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        🛤 Lead with Python Roadmap
      </h1>

      <div className="grid justify-center">
        {roadmap.map((step, index) => (
          <div key={index} className="mb-10 relative">
            <div className="absolute -left-7 top-4 w-9 h-9 bg-gradient-to-br border-green-400 border-4 text-white rounded-full flex justify-center items-center shadow-lg">
              {step.completed ? <IoCheckmarkDoneOutline size={30} /> : <></>}
            </div>
            <div className="pl-6">
              <span className="text-sm text-white/70">
                {step.day} — {step.date}
              </span>
              <h2 className="text-2xl font-semibold text-white mt-1">
                {step.title}
              </h2>
              <p className="text-white/80 mt-2">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
