import Snowfall from "./components/Snowfall";
import Header from "./components/Header";
import Countdown from "./components/Countdown";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Snowfall />
      <Header />
      <main className="min-h-dvh flex justify-center-safe items-center-safe">
        <Countdown />
      </main>
      <Footer />
    </>
  );
}
