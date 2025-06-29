
import React from 'react';
import { useLocation } from 'react-router-dom';
import OfferCard from '@/components/OfferCard';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Offers = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  const fromPreview = location.state?.fromPreview || false;
  const bookId = location.state?.bookId || null;
  
  const offers = [
    {
      title: "Ebook",
      price: "15 000",
      description: "Version numérique avec liens interactifs",
      features: [
        "Livre version PDF (100-200 pages)",
        "Couverture classique", 
        "Liens intégrés pour écouter les notes et lire les vidéos"
      ],
      actionText: "Choisir l'Ebook",
      popular: false,
      bookFormat: "EBOOK" as const,
      fromPreview: fromPreview,
      bookId: bookId
    },
    {
      title: "Offre Classique",
      price: "25 000", 
      description: "Livre physique de qualité professionnelle",
      features: [
        "Livre de 150 pages max qualité pro",
        "Couleur et titre personnalisés",
        "QR codes pour lire les notes et vidéos"
      ],
      actionText: "Choisir Classique",
      popular: true,
      bookFormat: "PRINT_STANDARD" as const,
      fromPreview: fromPreview,
      bookId: bookId
    },
    {
      title: "Offre Médium",
      price: "35 000",
      description: "Formule complète avec livre physique et numérique",
      features: [
        "Livre de 200 pages max qualité pro",
        "Couverture personnalisée",
        "Images intégrées", 
        "QR codes pour lire les notes et vidéos",
        "+ Ebook inclus"
      ],
      actionText: "Choisir Médium",
      popular: false,
      bookFormat: "PRINT_PREMIUM" as const,
      fromPreview: fromPreview,
      bookId: bookId
    }
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {fromPreview ? (
          <>
            <h2 className="centered-section-title mx-auto">Offres disponibles pour votre livre</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Choisissez l'offre qui vous convient pour accéder à l'intégralité de votre livre et le recevoir dans le format de votre choix.
            </p>
          </>
        ) : (
          <>
            <h2 className="centered-section-title mx-auto">{t('offers.title')}</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              {t('offers.subtitle')}
            </p>
          </>
        )}
        
        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8 mb-12`}>
          {offers.map((offer, index) => (
            <OfferCard 
              key={index} 
              {...offer} 
            />
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            {t('offers.specific')}
          </p>
          <Button variant="outline" className="border-ts-terracotta text-ts-terracotta hover:bg-ts-terracotta/10">
            {t('offers.customQuote')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Offers;
