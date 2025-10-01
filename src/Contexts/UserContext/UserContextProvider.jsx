import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { auth } from "../../Components/LoginComponents/UserManagment/Auth";
import { LoadingContext } from "../LoadingContext/LoadingContext";

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Firebase user:", currentUser);

      if (currentUser) {
        try {
          setIsLoading(true);

          const token = await currentUser.getIdToken();
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/user_validation`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.data.token) {
            localStorage.setItem("jwt", res.data.token);
          }

          setUserData({
            ...currentUser,
            permissions: res.data.permissions,
            role: res.data.role,
          });
        } catch (error) {
          console.error("User validation failed:", error);
          setUserData(null);
          localStorage.removeItem("jwt");
        } finally {
          setIsLoading(false);
        }
      } else {
        setUserData(null);
        localStorage.removeItem("jwt");
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setIsLoading]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
