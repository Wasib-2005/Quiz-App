import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { onAuthStateChanged } from "firebase/auth";

import axios from "axios";
import { auth } from "../../Components/LoginComponents/UserManagment/Auth";

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Firebase user:", currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();

          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/user_validation`,
            {}, // body (empty here, can pass data if needed)
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );

          console.log("Server response:", res.data);

          setUserData({
            ...currentUser,
            permissions: res.data.permissions,
            role: res.data.role,
          });
        } catch (error) {
          console.error(error);
        }
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
