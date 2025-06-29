
import React from 'react';
import OfferCard from './OfferCard';
import { BookFormat } from '@/types/book';

interface OffersSectionProps {
  fromPreview?: boolean;
  bookId?: number;
}

const OffersSection: React.FC<OffersSectionProps> = ({ fromPreview, bookId }) => {
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
      bookFormat: 'EBOOK' as BookFormat,
      popular: false
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
      bookFormat: 'STANDARD' as BookFormat,
      popular: true
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
      bookFormat: 'PREMIUM' as BookFormat,
      popular: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-ts-indigo mb-4">
            Choisissez votre formule
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Différentes options pour créer votre livre souvenir selon vos besoins et votre budget
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {offers.map((offer, index) => (
            <OfferCard
              key={index}
              title={offer.title}
              price={offer.price}
              description={offer.description}
              features={offer.features}
              actionText={offer.actionText}
              bookFormat={offer.bookFormat}
              popular={offer.popular}
              fromPreview={fromPreview}
              bookId={bookId}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
