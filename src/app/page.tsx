import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import dynamic from "next/dynamic";

// Lazy load below-the-fold components to reduce initial JavaScript payload size and achieve lightning-fast LCP
const FaangRoadmapSection = dynamic(() => import("@/components/FaangRoadmapSection"));
const MarqueeSection = dynamic(() => import("@/components/MarqueeSection"));
const CompanyPracticeSection = dynamic(() => import("@/components/CompanyPracticeSection"));
const PlatformSection = dynamic(() => import("@/components/PlatformSection"));
const DeepDiveSection = dynamic(() => import("@/components/DeepDiveSection"));
const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection"));
const PricingSection = dynamic(() => import("@/components/PricingSection"));
const SchoolsSection = dynamic(() => import("@/components/SchoolsSection"));
const CTASection = dynamic(() => import("@/components/CTASection"));

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        <HeroSection />
        <FaangRoadmapSection />
        <MarqueeSection />
        <CompanyPracticeSection />
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
