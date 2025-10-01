import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../UserManagment/Auth";

export const googleProvider = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Google Access Token
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    // Signed-in user info
    const user = result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
  }
};
