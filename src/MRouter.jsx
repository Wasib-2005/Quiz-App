import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import App from "./App";
import Loading from "./Components/Loading";

const SingInSingUp = lazy(() => import("./Pages/SingInSingUp"));
const Home = lazy(() => import("./Pages/Home"));
const StudentsQuiz = lazy(() => import("./Pages/StudentsQuiz"));
const CreateQuiz = lazy(() => import("./Components/Quiz/CreateQuiz"));
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
        path: "/create-quiz",
        element: (
          <Suspense fallback={<Loading />}>
            <CreateQuiz />
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
    ],
  },
]);

export default Mrouther;
