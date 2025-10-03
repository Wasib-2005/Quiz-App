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
    const initUser = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("Firebase user:", currentUser);

        if (currentUser) {
          setIsLoading(true);
          try {
            const token = await currentUser.getIdToken();
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/user/validation`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (res.data.token) {
              localStorage.setItem("randomToken", res.data.token);
            }

            setUserData({
              ...currentUser,
              permissions: res.data.permissions,
              role: res.data.role,
            });
          } catch (error) {
            console.error("User validation failed:", error);
            setUserData(null);
            localStorage.removeItem("randomToken");
          }
          setIsLoading(false);
        } else {
          setUserData(null);
          localStorage.removeItem("randomToken");
        }
      });

      return unsubscribe;
    };

    const unsubscribe = initUser();
    return () => {
      unsubscribe && unsubscribe.then((fn) => fn());
    };
  }, [setIsLoading]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
