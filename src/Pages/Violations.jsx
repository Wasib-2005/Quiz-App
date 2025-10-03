import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { IoWarningOutline } from "react-icons/io5";
import { format } from "date-fns";

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchViolations = async () => {
    try {
      const token = localStorage.getItem("randomToken");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/violation`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setViolations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch violations", {
        position: "top-right",
        autoClose: 4000,
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <IoWarningOutline size={28} className="text-red-500" />  Violations
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading violations...</div>
      ) : violations.length === 0 ? (
        <div className="text-center text-green-600 font-semibold">
          🎉 No violations detected!
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Quiz Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {violations.map((violation) => (
                <tr key={violation._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {violation.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {violation.quizCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(violation.timestamp), "PPpp")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Violations;
