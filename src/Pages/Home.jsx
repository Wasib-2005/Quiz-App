import React, { useContext, useEffect } from "react";
import StudentHome from "../Components/Home/StudentHome";
import { UserContext } from "../Contexts/UserContext/UserContext";
import TeacherHome from "../Components/Home/TeacherHome";
import AdminHome from "../Components/Home/AdminHome";
import { Link, useNavigate } from "react-router";

const Home = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      // If came from another protected route, redirect there

      navigate("/sing_in_up");
    }
  }, [userData, navigate]);
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
