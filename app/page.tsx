import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Offers from "@/components/Offers";
import About from "@/components/About";
import Barbers from "@/components/Barbers";
import Branches from "@/components/Branches";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Offers />
        <About />
        <Barbers />
        <Branches />
        <Features />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
