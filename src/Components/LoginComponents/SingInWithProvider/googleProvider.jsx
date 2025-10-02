import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../UserManagment/Auth";

export const googleProvider = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    console.log("login with google");
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};
