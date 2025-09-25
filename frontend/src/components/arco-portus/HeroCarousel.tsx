import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Banner1 from "@/assets/BannerArcoportus01.png";
import Banner2 from "@/assets/BannerArcoportus02.png";
import Banner3 from "@/assets/BannerArcoportus03.png";
import Banner4 from "@/assets/BannerArcoportus04.png";
import Banner5 from "@/assets/BannerArcoportus05.png";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Plataforma",
      subtitle: "ARCOPORTUS",
      description: "A sua aliada essencial para as auditorias da CONPORTOS e CESPORTOS.",
      image: Banner1
    },
    {
      title: "Gestão",
      subtitle: "PORTUÁRIA",
      description: "Tecnologia avançada para controle e monitoramento de operações portuárias.",
      image: Banner2
    },
    {
      title: "Segurança",
      subtitle: "TOTAL",
      description: "Soluções integradas para máxima proteção das operações marítimas.",
      image: Banner3
    },
    {
      title: "Porto",
      subtitle: "TOTAL",
      description: "Soluções integradas para máxima proteção das operações marítimas.",
      image: Banner4
    },
    {
      title: "Forte",
      subtitle: "TOTAL",
      description: "Soluções integradas para máxima proteção das operações marítimas.",
      image: Banner5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[270px] overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            className="h-full w-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default HeroCarousel;