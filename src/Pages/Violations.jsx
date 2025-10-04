import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { format } from "date-fns";
import { LoadingContext } from "../Contexts/LoadingContext/LoadingContext";

const Violations = () => {
  const { isloading, setIsLoading } = useContext(LoadingContext);
  const [violations, setViolations] = useState([]);
  console.log(violations)

  const fetchViolations = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("randomToken");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/violation`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViolations(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch violations", {
        position: "top-right",
        autoClose: 4000,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <IoWarningOutline size={28} className="text-red-500" />
        Violations
      </h1>

      {/* Loading */}
      {isloading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse w-full max-w-3xl space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : violations.length === 0 ? (
        <div className="text-center text-green-600 font-semibold text-lg">
          🎉 No violations detected!
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl">
          {/* Desktop Table */}
          <table className="hidden md:table min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Quiz Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {violations.map((violation) => (
                <tr key={violation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {violation.quizCode || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {violation.title || "Untitled Quiz"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {violation.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(violation.timestamp), "PPpp")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden p-3 space-y-4">
            {violations.map((violation) => (
              <div
                key={violation._id}
                className="border border-gray-200 bg-gray-50 rounded-2xl p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-800">
                  <span className="text-gray-500 font-normal">Quiz Code:</span>{" "}
                  {violation.quizCode || "—"}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  <span className="text-gray-500 font-normal">Title:</span>{" "}
                  {violation.title || "Untitled Quiz"}
                </p>
                <p className="text-sm text-red-600 mt-1">
                  <span className="font-semibold">Reason:</span>{" "}
                  {violation.reason}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(violation.timestamp), "PPpp")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Violations;
