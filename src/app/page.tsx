import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import ServicesGrid from "@/components/landing/ServicesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import RatesTicker from "@/components/landing/RatesTicker";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <HowItWorks />
      <RatesTicker />
      <CTASection />
      <Footer />
    </div>
  );
}
