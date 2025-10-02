import { Outlet } from "react-router";
import { SpinnerDotted } from "spinners-react";
import { useContext } from "react";
import { LoadingContext } from "./Contexts/LoadingContext/LoadingContext";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { isLoading } = useContext(LoadingContext);

  return (
    <div className="relative min-h-screen">
      {/* Spinner Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center z-50 bg-black/50">
          <SpinnerDotted
            size={100}
            thickness={150}
            speed={100}
            color="#00ffff"
          />
        </div>
      )}

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
