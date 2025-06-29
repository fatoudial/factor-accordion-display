
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import QRCodeShowcase from '@/components/QRCodeShowcase';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Grid } from '@/components/ui/grid';
import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';
import CreateBookSection from '@/components/CreateBookSection';


const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleCreateBookClick = () => {
    if (isAuthenticated) {
      navigate('/designer');
    } else {
      navigate('/login', { state: { redirectAfterLogin: '/designer' } });
    }
  };

  const handleViewProcessClick = () => {
    navigate('/process');
  };

  // Sample book covers for the carousel
  const bookCovers = [
    { src: "/covers/book-cover-1.png", alt: "Exemple de livre souvenir" },
    { src: "/covers/book-cover-2.png", alt: "Livre de conversations" },
    { src: "/covers/book-cover-3.png", alt: "Souvenirs WhatsApp" },
    { src: "/covers/book-cover-4.png", alt: "Album de messages" },
  ];

  // Autoplay functionality for carousel - fixed to use window.setInterval
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (autoPlay) {
      intervalId = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % bookCovers.length);
      }, 3000);
    }
    
    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [autoPlay, bookCovers.length]);

  return (
    <div>
      <main>
        <Hero />
           {/* QR Code Showcase - New section added between Hero and Features */}
        <QRCodeShowcase />
         {/* Section Créer mon livre - Nouvelle interface */}
        <CreateBookSection />
        
        <Features />
        
        {/* Middle CTA */}
        <section className="py-20 bg-ts-gold/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              
              {/* Carousel des couvertures */}
              <div className="w-full lg:w-1/2">
                <div className="max-w-md mx-auto relative">
                  <div className="overflow-hidden rounded-lg shadow-xl">
                    <Carousel className="w-full" setApi={(api) => api?.scrollTo(currentSlide)}>
                      <CarouselContent>
                        {bookCovers.map((book, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1 mt-10">
                              <div className="overflow-hidden rounded-lg shadow-lg">
                                <AspectRatio ratio={3 / 4} className="bg-white">
                                  <img
                                    src={book.src}
                                    alt={book.alt}
                                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                                  />
                                </AspectRatio>
                              </div>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <div className="flex justify-center mt-4">
                        <CarouselPrevious />
                        <CarouselNext />
                      </div>
                    </Carousel>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <div className="w-3/4">
                      <Slider
                        value={[currentSlide]}
                        min={0}
                        max={bookCovers.length - 1}
                        step={1}
                        onValueChange={(value) => setCurrentSlide(value[0])}
                        className="my-4"
                      />
                    </div>
                  </div>

                  <Grid cols={4} className="gap-2 mt-2 max-w-sm mx-auto">
                    {bookCovers.map((book, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 ${currentSlide === index ? 'border-ts-gold' : 'border-transparent'}`}
                        onClick={() => setCurrentSlide(index)}
                      >
                        <AspectRatio ratio={3 / 4}>
                          <img
                            src={book.src}
                            alt={`Miniature ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </div>
                    ))}
                  </Grid>
                </div>
              </div>

              {/* Texte + boutons */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-ts-indigo mb-6">
                  Transformez vos souvenirs en un vrai livre 📖
                </h2>
                <p className="text-gray-700 mb-8 text-lg">
                  En quelques clics, créez un livre personnalisé à partir de vos messages. Le cadeau idéal pour vos proches — ou pour vous-même.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button 
                    className="btn-primary text-lg px-8 py-6 flex items-center gap-2"
                    onClick={handleCreateBookClick}
                  >
                    <BookOpen className="h-5 w-5" />
                    Créer mon livre
                  </Button>
                  <Button
                    variant="outline"
                    className="border-ts-indigo text-ts-indigo hover:bg-ts-indigo/10 flex items-center gap-2"
                    onClick={handleViewProcessClick}
                  >
                    Voir comment ça marche
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
