import { useState } from "react";
import { LoadingContext } from "./LoadingContext";

const LoadingContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = async (asyncFn) => {
    setIsLoading(true);
    try {
      await asyncFn(); // Let errors propagate without try/catch
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        withLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContextProvider;
