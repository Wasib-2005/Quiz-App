// CreateUserViaEmailPass.js
import { auth } from "./Auth";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const userManageViaEmail = async (e, setUserData, isSignUpState) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name"); // may be null in Sign-In

  try {
    if (isSignUpState) {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (name) await updateProfile(user, { displayName: name });
      await sendEmailVerification(user);
      setUserData(user);
    } else {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUserData(user);
    }
  } catch (error) {
    console.error("Auth error:", error.code, error.message);
    // Show a toast / message to the user
  }
};

