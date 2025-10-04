import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext/UserContext";
import StudentDashboard from "../Components/Dashboard/StudentDashboard";
import TeacherDashboard from "../Components/Dashboard/TeacherDashboard";

const Dashboard = () => {
  const { userData } = useContext(UserContext);
  return (
    <div>
      {userData?.role === "student" ? (
        <StudentDashboard />
      ) : (
        <TeacherDashboard />
      )}
    </div>
  );
};

export default Dashboard;
