import Footer from "./components/footer";
import Header from "./components/header";
import Search from "./components/search/search";

export default function App() {
  return (
    <div className="font-playwrite">
      <Background />
      <Header />
      <main className="flex flex-col items-center px-4 pb-28 pt-4 md:pt-10 xl:pt-14">
        <Search />
      </main>
      <Footer />
    </div>
  );
}

const Background = () => (
  <div className="fixed -z-10 h-screen w-full bg-gradient-to-b from-darkestBlue to-darkBlue" />
);
