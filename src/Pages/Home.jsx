import React, { useContext } from "react";
import StudentHome from "../Components/Home/StudentHome";
import { UserContext } from "../Contexts/UserContext/UserContext";
import TeacherHome from "../Components/Home/TeacherHome";
import AdminHome from "../Components/Home/AdminHome";

const Home = () => {
  const { userData } = useContext(UserContext);
  console.log(userData?.role);
  return (
    <div>
      {userData?.role === "student" ? (
        <StudentHome />
      ) : userData?.role === "teacher" ? (
        <TeacherHome />
      ) : (
        <AdminHome />
      )}
    </div>
  );
};

export default Home;
