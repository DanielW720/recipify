import Footer from "./components/footer";
import Header from "./components/header";
import Search from "./components/search/search";

export default function App() {
  return (
    <div className="font-playwrite">
      <Background />
      <Header />
      <div className="flex min-h-[calc(100vh-8rem)] flex-col justify-between">
        <main className="flex flex-col items-center px-4 pb-14 pt-4">
          <Search />
        </main>
        <Footer />
      </div>
    </div>
  );
}

const Background = () => (
  <div className="from-darkestBlue to-darkBlue fixed -z-10 h-screen w-full bg-gradient-to-b" />
);
