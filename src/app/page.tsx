import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MarqueeSection from "@/components/MarqueeSection";
import ProblemSection from "@/components/ProblemSection";
import PlatformSection from "@/components/PlatformSection";
import DeepDiveSection from "@/components/DeepDiveSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import SchoolsSection from "@/components/SchoolsSection";
import FaangRoadmapSection from "@/components/FaangRoadmapSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        <HeroSection />
        <FaangRoadmapSection />
        <MarqueeSection />
        <ProblemSection />
        <PlatformSection />
        <DeepDiveSection />
        <HowItWorksSection />
        <PricingSection />
        <SchoolsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
