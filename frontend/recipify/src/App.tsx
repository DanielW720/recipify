import { Lines } from "./components/lines";
import Search from "./components/search/search";
import Title from "./components/title";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d152e] to-[#152659]">
      <header className="relative flex h-32 w-full items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <Lines />
        </div>
        <Title />
      </header>
      <main className="flex flex-col items-center px-4 pb-10 pt-4">
        <Search />
      </main>
    </div>
  );
}
