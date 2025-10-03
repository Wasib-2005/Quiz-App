import { SpinnerDotted } from "spinners-react";

const Loading = () => {
  return (
    <div>
      <div className="absolute inset-0 flex justify-center items-center z-50 bg-black/50">
        <SpinnerDotted size={100} thickness={150} speed={100} color="#00ffff" />
      </div>
    </div>
  );
};

export default Loading;
