import { signOut } from "firebase/auth";
import { auth } from "./Auth";

export const SingOut = () => {
  signOut(auth).then(() => {
    // Sign-out successful.
  });
};
