import { Outlet } from "react-router";
import { useContext } from "react";
import { LoadingContext } from "./Contexts/LoadingContext/LoadingContext";
import { ToastContainer } from "react-toastify";
import Loading from "./Components/Loading";

const App = () => {
  const { isLoading } = useContext(LoadingContext);

  return (
    <div className="relative min-h-screen text-black">
      {/* Spinner Overlay */}
      {isLoading && <Loading />}

      {/* Main App Content */}
      <ToastContainer limit={5} />
      <div
        className={`min-h-screen flex items-center justify-center p-4 merriweather bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default App;
