import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import solutionsImage from "@/assets/solutions-image.jpg";

const slides = [
  {
    title: "Gestão centralizada",
    subtitle: "para informações integradas",
    description: "Soluções corporativas avançadas para gestão unificada, monitoramento em tempo real.",
    image: heroImage,
    primaryButton: "Explorar Soluções",
    primaryLink: "/catalogo-solucoes",
    secondaryLink: "https://wa.me/5592991761245?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Arco%20Consultoria.",
    secondaryButton: "Demonstração"
  },
  {
    title: "Soluções inteligentes",
    subtitle: "para seu negócio crescer",
    description: "Plataformas integradas que transformam dados em insights valiosos para decisões estratégicas.",
    image: solutionsImage,
    primaryButton: "Explorar Soluções",
    primaryLink: "/catalogo-solucoes",
    secondaryLink: "https://wa.me/5592991761245?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Arco%20Consultoria.",
    secondaryButton: "Demonstração"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 200); // tempo da transição
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setFade(true);
    }, 200);
  };

  return (
    <section className="relative bg-gradient-to-r from-secondary via-secondary-light to-secondary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

      {/* Background Image */}
      <div className={`absolute animate-fade-in inset-0 transition-all duration-700 ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <img
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`text-center lg:text-left transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>
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
              <Link to={slides[currentSlide].primaryLink}>
                <Button className="btn-primary text-lg px-8 py-4 hover-glow">
                  {slides[currentSlide].primaryButton}
                </Button>
              </Link>

              <a
                href={slides[currentSlide].secondaryLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="text-secondary border-white hover:border-slate-400 hover:bg-gray-200 text-lg px-8 py-4">
                  {slides[currentSlide].secondaryButton}
                </Button>
              </a>
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/75'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
