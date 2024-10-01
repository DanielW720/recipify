import { createContext, ReactNode, useContext } from "react";
import useCompletion, { Completion } from "../hooks/useCompletion";

export const CompletionContext = createContext<
  [
    {
      completions: Completion[];
    },
    () => void,
  ]
>([{ completions: [] }, () => {}]);

export const CompletionProvider = ({
  query,
  children,
}: {
  query: string;
  children: ReactNode;
}) => {
  const [completions, reset] = useCompletion(query);

  return (
    <CompletionContext.Provider value={[completions, reset]}>
      {children}
    </CompletionContext.Provider>
  );
};

export const useCompletionContext = () => {
  const context = useContext(CompletionContext);

  if (!context) {
    throw new Error(
      "useCompletionContext must be used within a CompletionProvider",
    );
  }

  return context;
};
