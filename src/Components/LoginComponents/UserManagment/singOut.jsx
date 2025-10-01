import { signOut } from "firebase/auth";
import { auth } from "./Auth";

export const singOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
};
