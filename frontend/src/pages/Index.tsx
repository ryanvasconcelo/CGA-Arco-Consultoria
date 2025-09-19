import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SolutionsGrid from "@/components/SolutionsGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SolutionsGrid />
      <Footer />
    </div>
  );
};

export default Index;
