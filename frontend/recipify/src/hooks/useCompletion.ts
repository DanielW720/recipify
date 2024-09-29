import { useEffect, useState } from "react";

export default function useCompletion(query: string) {
  const [completions, setCompletions] = useState<string[]>([]);

  useEffect(() => {
    const completion = async () => {
      if (query) {
        setCompletions(["Apple", "Banana", "Cherry"]);

        //   const url = `url?${query}`;
        // const response = await fetch(`url?${query}`);
        // const data = await response.json();
        // console.log(data);
      }
    };

    // Clear completions instantly if query is empty
    if (!query) setCompletions([]);

    const timer = setTimeout(() => completion(), 200);

    return () => clearTimeout(timer);
  }, [query]);

  return completions;
}
