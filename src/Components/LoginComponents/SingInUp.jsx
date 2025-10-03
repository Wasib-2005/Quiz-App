import { useContext, useState } from "react";
import { UserContext } from "../../Contexts/UserContext/UserContext";
import { userManageViaEmail } from "./UserManagment/userManageViaEmail";
import { IoIosMore, IoLogoGoogle } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa";
import { TbBrandGithubFilled } from "react-icons/tb";
import { googleProvider } from "./SingInWithProvider/googleProvider";
import { LoadingContext } from "../../Contexts/LoadingContext/LoadingContext";

const rollingWords = {
  in: ["S", "i", "g", "n", " ", "I", "n"],
  up: ["S", "i", "g", "n", " ", "U", "p"],
};

const SignInUp = () => {
  const { setUserData } = useContext(UserContext);
  const [isSignUpState, setIsSignUpState] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { setIsLoading } = useContext(LoadingContext);

  return (
    <div className="">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          await userManageViaEmail(e, setUserData, isSignUpState);
          setIsLoading(false);
        }}
        className="w-[380px] bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-2xl grid gap-6"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {isSignUpState ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-200">
            {isSignUpState ? "Sign up to get started" : "Sign in to continue"}
          </p>
        </div>

        {/* Name (Sign Up only) */}
        {isSignUpState && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered w-full bg-white/20 text-white placeholder-white"
            required={isSignUpState}
          />
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full bg-white/20 text-white placeholder-white"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full bg-white/20 text-white placeholder-white"
          required
        />

        {/* Toggle Sign In / Sign Up */}
        <p
          onClick={() => setIsSignUpState(!isSignUpState)}
          className="text-sm text-gray-300 text-center cursor-pointer"
        >
          {isSignUpState
            ? "Already have an account?"
            : "Don’t have an account?"}{" "}
          <span className="text-sky-400 hover:underline font-bold">
            {isSignUpState ? "Sign In" : "Sign Up"}
          </span>
        </p>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className={`relative mt-4 w-full py-3 rounded-xl overflow-hidden transition-colors duration-700 font-semibold ${
              isSignUpState
                ? "bg-sky-500 hover:bg-sky-600"
                : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            <span className="flex justify-center items-center gap-1">
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

        {/* Social Login */}
        <div className="flex flex-col gap-3">
          <p className="text-center text-gray-300">Or sign in with</p>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                await googleProvider();
                setIsLoading(false);
              }}
              className="btn btn-circle btn-outline text-white"
            >
              <IoLogoGoogle size={22} />
            </button>
            <button
              type="button"
              className="btn btn-circle btn-outline text-white"
            >
              <FaFacebookF size={22} />
            </button>
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="btn btn-circle btn-outline text-white"
            >
              <IoIosMore size={22} />
            </button>
          </div>
        </div>

        {/* Modal */}
        {openModal && (
          <dialog open className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">More Sign-In Options</h3>
              <div className="flex justify-center items-center py-6 gap-4">
                <button className="btn btn-circle btn-outline">
                  <TbBrandGithubFilled size={22} />
                </button>
              </div>
              <div className="modal-action">
                <button
                  className="btn btn-sm"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}
      </form>
    </div>
  );
};

export default SignInUp;
