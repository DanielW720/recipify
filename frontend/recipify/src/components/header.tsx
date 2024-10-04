import { Lines } from "./lines";
import Title from "./title";

export default function Header() {
  return (
    <header className="relative flex h-[8rem] w-full items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <Lines />
      </div>
      <Title />
    </header>
  );
}
