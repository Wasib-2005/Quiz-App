import React, { useContext } from "react";
import StudentHome from "../Components/Home/StudentHome";
import { UserContext } from "../Contexts/UserContext/UserContext";

const Home = () => {
  const { userData } = useContext(UserContext);
  console.log(userData?.role);
  return <div>{userData?.role === "student" ? <StudentHome /> : <></>}</div>;
};

export default Home;
