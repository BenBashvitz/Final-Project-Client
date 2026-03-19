import { useContext, type Context } from "react";

const useGetContext = <T>(context: Context<T | null>): T => {
  const ctx = useContext(context);

  if (!ctx) {
    throw new Error("Context value is null");
  }

  return ctx;
};

export default useGetContext;
