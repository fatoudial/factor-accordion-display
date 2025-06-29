
import React from 'react';
import HowItWorks from '@/components/HowItWorks';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookOpen } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const ProcessPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleCreateBookClick = () => {
    if (isAuthenticated) {
      navigate('/designer');
    } else {
      navigate('/login', { state: { redirectAfterLogin: '/designer' } });
    }
  };

  // Sample book covers for display
  const bookExamples = [
    { src: "/covers/book-cover-4.png", alt: "Exemple de livre souvenir" },
    { src: "/covers/book-cover-2.png", alt: "Livre de conversations" },
    { src: "/covers/book-cover-3.png", alt: "Souvenirs WhatsApp" },
    { src: "/covers/book-cover-4.png", alt: "Album de messages" },
  ];

  return (
    <div>
      <HowItWorks />
      
      {/* Exemples de livres */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-semibold text-ts-indigo mb-8 text-center">
            Exemples de nos livres
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <Carousel>
              <CarouselContent>
                {bookExamples.map((book, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1 mt-8 sm:mt-12 md:mt-16 lg:mt-24">
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
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-semibold text-ts-indigo mb-6">
            Prêt à créer votre livre souvenir ?
          </h2>
          <Button 
            onClick={handleCreateBookClick}
            className="btn-primary flex items-center gap-2 px-8 py-6 text-lg"
          >
            <BookOpen className="h-5 w-5" />
            Commander mon livre maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ProcessPage;
