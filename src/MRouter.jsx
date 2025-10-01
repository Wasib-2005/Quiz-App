import { createBrowserRouter } from "react-router";
import App from "./App";
import SingInSingUp from "./Pages/SingInSingUp";
import Home from "./Pages/Home";
import StudentsQuiz from "./Pages/StudentsQuiz";
import CreateQuiz from "./Components/Quiz/CreateQuiz";
import Dashboard from "./Pages/Dashboard";

const Mrouther = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/quiz/:quizCode", element: <StudentsQuiz /> },
      { path: "/create-quiz", element: <CreateQuiz /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/sing_in_up", element: <SingInSingUp /> },
    ],
  },
]);
export default Mrouther;
