import { Outlet } from "react-router";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 merriweather">
      <Outlet />
    </div>
  );
};

export default App;
