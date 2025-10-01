import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import Mrouther from "./MRouter.jsx";
import UserContextProvider from "./Contexts/UserContext/UserContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={Mrouther} />
    </UserContextProvider>
  </StrictMode>
);
