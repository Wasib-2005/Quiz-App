import { useContext, useState } from "react";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import { userManageViaEmail } from "./UserManagment/userManageViaEmail";
import { IoIosMore, IoLogoGoogle } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { TbBrandGithubFilled } from "react-icons/tb";
import { googleProvider } from "./SingInWithProvider/googleProvider";

const rollingWords = {
  in: ["S", "i", "g", "n", " ", "I", "n"],
  up: ["S", "i", "g", "n", " ", "U", "p"],
};

const SignInUp = () => {
  const { setUserData } = useContext(UserContext);
  const [isSignUpState, setIsSignUpState] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-[380px]">
      <form
        onSubmit={(e) => userManageViaEmail(e, setUserData, isSignUpState)}
        className="border rounded-3xl p-6 grid gap-3 shadow-lg bg-base-100"
      >
        <div className="rounded-2xl p-6 grid gap-5">
          {/* Name field (only visible in Sign Up) */}
          <div
            className={`transition-all duration-700 overflow-hidden ${
              isSignUpState
                ? "opacity-100 max-h-40"
                : "opacity-0 max-h-0 pointer-events-none"
            }`}
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="input input-bordered w-full"
              required={isSignUpState}
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full"
            required
          />

          {/* Toggle between Sign In / Sign Up */}
          {isSignUpState ? (
            <p
              onClick={() => setIsSignUpState(false)}
              className="cursor-pointer text-sm text-gray-600"
            >
              Already have an account?{" "}
              <span className="text-sky-500 hover:underline font-bold">
                Sign In
              </span>
            </p>
          ) : (
            <p
              onClick={() => setIsSignUpState(true)}
              className="cursor-pointer text-sm text-gray-600"
            >
              Don’t have an account?{" "}
              <span className="text-sky-500 hover:underline font-bold">
                Sign Up
              </span>
            </p>
          )}

          {/* Social login buttons */}
          <div className="flex gap-3 justify-center items-center">
            <button
              type="button"
              onClick={googleProvider}
              className="btn btn-circle btn-outline"
            >
              <IoLogoGoogle size={22} />
            </button>
            <button type="button" className="btn btn-circle btn-outline">
              <FaFacebookF size={22} />
            </button>
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="btn btn-circle btn-outline"
            >
              <IoIosMore size={22} />
            </button>
          </div>

          {/* Modal (DaisyUI) */}
          {openModal && (
            <dialog open className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">More Sign-In Options</h3>
                <div className="flex justify-center items-center py-6">
                  <button className="btn btn-circle btn-outline">
                    <TbBrandGithubFilled size={22} />
                  </button>
                </div>
                <div className="modal-action">
                  <button
                    className="btn"
                    onClick={() => setOpenModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          )}

          {/* Rolling text button */}
          <div className="text-center">
            <button
              type="submit"
              className={`relative mt-4 w-[120px] h-10 rounded-xl overflow-hidden transition-colors duration-700
                ${
                  isSignUpState
                    ? "bg-sky-500 hover:bg-sky-600 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
            >
              <span className="flex items-center justify-center gap-[2px]">
                {(isSignUpState ? rollingWords.up : rollingWords.in).map(
                  (char, index) => (
                    <span
                      key={index}
                      style={{
                        transform: `rotateX(${isSignUpState ? 0 : 360}deg)`,
                        transition: `transform 0.6s ${index * 0.05}s`,
                        display: "inline-block",
                      }}
                    >
                      {char}
                    </span>
                  )
                )}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInUp;
