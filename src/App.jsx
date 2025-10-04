import { Outlet, useNavigate } from "react-router";
import { useContext, useEffect } from "react";
import { LoadingContext } from "./Contexts/LoadingContext/LoadingContext";
import { ToastContainer } from "react-toastify";
import Loading from "./Components/Loading";
import { UserContext } from "./Contexts/UserContext/UserContext";

const App = () => {
  const { isLoading } = useContext(LoadingContext);
  const { userData } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) navigate("/sing_in_up");
  }, [userData, navigate]);
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
