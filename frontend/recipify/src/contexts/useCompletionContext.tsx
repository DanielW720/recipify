import { createContext, ReactNode, useContext } from "react";
import useCompletion, { UseCompletionType } from "../hooks/useCompletion";

const CompletionContext = createContext<UseCompletionType | null>(null);

export const CompletionProvider = ({
  query,
  setQuery,
  children,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  children: ReactNode;
}) => {
  const { completions, reset, browseCompletions, activeIndex } = useCompletion(
    query,
    setQuery,
  );

  return (
    <CompletionContext.Provider
      value={{ completions, reset, browseCompletions, activeIndex }}
    >
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
