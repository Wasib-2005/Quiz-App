import { useContext } from "react";
import { UserContext } from "../Contexts/UserContext/UserContext";
import StudentDashboard from "../Components/Dashboard/StudentDashboard";

const Dashboard = () => {
  const { userData } = useContext(UserContext);
  return (
    <div>
      {userData?.role === "student" ? <StudentDashboard /> : <div></div>}
    </div>
  );
};

export default Dashboard;
