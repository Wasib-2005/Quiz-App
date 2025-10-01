import { useNavigate, useLocation } from "react-router";
import SignInUp from "../Components/LoginComponents/SingInUp";
import { UserContext } from "../Contexts/UserContext/UserContext";
import { useContext, useEffect } from "react";

const SingInSingUp = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userData) {
      // If came from another protected route, redirect there
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [userData, navigate, location.state]);

  return (
    <div className=" min-h-[calc(100vh)] grid justify-center items-center text-center">
      <div>
        <SignInUp />
      </div>
    </div>
  );
};

export default SingInSingUp;
