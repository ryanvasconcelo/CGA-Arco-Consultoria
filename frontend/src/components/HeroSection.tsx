import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import heroImage from "@/assets/hero-image.jpg";
import solutionsImage from "@/assets/solutions-image.jpg";

const slides = [
  {
    title: "Tecnologia e Inovação",
    subtitle: "para informações integradas",
    description: "Soluções corporativas avançadas para gestão unificada, monitoramento em tempo real.",
    image: heroImage,
    primaryButton: "Explorar Soluções",
    secondaryButton: "Saiba Mais"
  },
  {
    title: "Soluções Inteligentes",
    subtitle: "para seu negócio crescer",
    description: "Plataformas integradas que transformam dados em insights valiosos para decisões estratégicas.",
    image: solutionsImage,
    primaryButton: "Ver Catálogo",
    secondaryButton: "Conhecer Mais"
  },
  {
    title: "Gestão Centralizada",
    subtitle: "controle total em suas mãos",
    description: "Sistema completo de gestão com interface intuitiva e recursos avançados de monitoramento.",
    image: heroImage,
    primaryButton: "Começar Agora",
    secondaryButton: "Demonstração"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Auto scroll every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  return (
    <section className="relative bg-gradient-to-r from-secondary via-secondary-light to-secondary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-full object-cover opacity-30 transition-opacity duration-1000"
        />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-primary">{slides[currentSlide].title.split(' ')[0]}</span>{" "}
              {slides[currentSlide].title.split(' ').slice(1).join(' ')}
              <br />
              <span className="text-white/90 text-3xl lg:text-5xl">
                {slides[currentSlide].subtitle}
              </span>
            </h1>

            <p className="text-white/80 text-lg lg:text-xl mb-8 leading-relaxed max-w-lg">
              {slides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-primary text-lg px-8 py-4 hover-glow">
                {slides[currentSlide].primaryButton}
              </Button>
              <Button variant="outline" className="text-secondary border-white hover:border-slate-400 hover:bg-gray-200 text-lg px-8 py-4">
                {slides[currentSlide].secondaryButton}
              </Button>
            </div>
          </div>

          <div className="relative lg:block animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl"></div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;