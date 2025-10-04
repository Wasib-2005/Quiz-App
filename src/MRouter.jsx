import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import App from "./App";
import Loading from "./Components/Loading";
import Violations from "./Pages/Violations";
import AnswersOne from "./Pages/AnswersOne";

const SingInSingUp = lazy(() => import("./Pages/SingInSingUp"));
const Home = lazy(() => import("./Pages/Home"));
const StudentsQuiz = lazy(() => import("./Pages/StudentsQuiz"));
const QuizForm = lazy(() => import("./Pages/QuizForm"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Progress = lazy(() => import("./Pages/Progress"));

const Mrouther = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/quiz/:quizCode",
        element: (
          <Suspense fallback={<div>Loading Quiz...</div>}>
            <StudentsQuiz />
          </Suspense>
        ),
      },
      {
        path: "/create_quiz",
        element: (
          <Suspense fallback={<div>Loading Quiz...</div>}>
            <QuizForm />
          </Suspense>
        ),
      },
      {
        path: "/update_quiz:updateID",
        element: (
          <Suspense fallback={<div>Loading Quiz...</div>}>
            <QuizForm />
          </Suspense>
        ),
      },
      {
        path: "/violation",
        element: (
          <Suspense fallback={<Loading />}>
            <Violations />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/progress",
        element: (
          <Suspense fallback={<Loading />}>
            <Progress />
          </Suspense>
        ),
      },
      {
        path: "/sing_in_up",
        element: (
          <Suspense fallback={<Loading />}>
            <SingInSingUp />
          </Suspense>
        ),
      },
      {
        path: "/answers/:quizCode",
        element: (
          <Suspense fallback={<Loading />}>
            <AnswersOne />
          </Suspense>
        ),
      }, // NEW
    ],
  },
]);

export default Mrouther;
