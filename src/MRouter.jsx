import { createBrowserRouter } from "react-router";
import App from "./App";
import SingInSingUp from "./Pages/SingInSingUp";
import Home from "./Pages/Home";
import StudentsQuiz from "./Pages/StudentsQuiz";

const Mrouther = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/quiz/:quizCode", element: <StudentsQuiz /> },
    ],
  },
  { path: "/sing-in-sing-up", element: <SingInSingUp /> },
]);
export default Mrouther;
