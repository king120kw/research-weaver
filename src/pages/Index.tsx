import Hero from "@/components/Hero";
import ModulesSection from "@/components/ModulesSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ModulesSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
