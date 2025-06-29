
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, Upload, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface InstagramBookInterfaceProps {
  onBack: () => void;
}

const InstagramBookInterface: React.FC<InstagramBookInterfaceProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 13;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleStartUpload = () => {
    navigate('/designer/upload');
  };

 const handleUploadFile = () => {
    navigate('/designer/upload');
  };

  const steps = [
    {
      step: 1,
      title: "Créer un livre à partir de Instagram",
      content: (
        <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
          <p>
            Souvenez-vous de ces messages marquants sur Instagram ? Transformez-les en un livre, 
            un trésor de souvenirs à parcourir sans fin.
          </p>
          <p>
            En quelques clics, convertissez vos échanges Instagram en un livre personnalisé. 
            Préservez vos souvenirs les plus précieux et <span className="text-purple-600 font-semibold">offrez un cadeau 
            unique à vos proches !</span>
          </p>
          <p>
            Dans les étapes qui suivent, nous vous expliquerons comment exporter votre conversation Instagram 
            afin de la transformer en un magnifique livre souvenir.
          </p>
        </div>
      ),
      image: "/covers/instaStep1.png"
    },
    {
      step: 2,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Pour commencer, ouvrez l'application Instagram.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Accédez aux <strong>Paramètres</strong> en cliquant sur les trois points en haut à droite.</span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep2.png"
    },
    {
      step: 3,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Sélectionnez <strong>Espace Comptes</strong>.</span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep3.png"
    },
    {
      step: 4,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Cliquez sur <strong>Vos Informations et Autorisations</strong>.</span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep4.png"
    },
    {
      step: 5,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Choisissez <strong>Télécharger vos informations</strong>.</span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep5.png"
    },
    {
      step: 6,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Allez dans <strong>Télécharger ou Transférer des Informations</strong>.</span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep6.png"
    },
    {
      step: 7,
      title: "Créer un livre à partir de Instagram",
      content: (
        <div className="space-y-4 text-gray-600 text-lg">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-orange-500 font-bold text-xl">•</span>
              <span>Sélectionnez <strong>Instagram</strong></span>
            </li>
          </ul>
          <p className="text-sm text-gray-500">
            Cette étape peut ne pas apparaître sur certains comptes.
          </p>
        </div>
      ),
      image: "/covers/instaStep7.png"
    },
    {
      step: 8,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Choisissez <strong>Certaines de vos informations</strong></span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep8.png"
    },
    {
      step: 9,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Faites défiler jusqu'à <strong>Messages</strong>.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Sélectionnez-le, puis cliquez sur <strong>Suivant</strong></span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep8.png"
    },
    {
      step: 10,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Cliquez sur <strong>Télécharger sur l'appareil</strong></span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep9.png"
    },
    {
      step: 11,
      title: "Créer un livre à partir de Instagram",
      content: (
        <ul className="space-y-3 text-gray-600 text-lg">
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Choisissez la période souhaitée.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-orange-500 font-bold text-xl">•</span>
            <span>Sélectionnez le format <strong>JSON</strong> et une qualité de contenu multimédia faible pour un téléchargement plus rapide.</span>
          </li>
        </ul>
      ),
      image: "/covers/instaStep10.png"
    },
    {
      step: 12,
      title: "Créer un livre à partir de Instagram",
      content: (
        <div className="space-y-4 text-gray-600 text-lg">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-orange-500 font-bold text-xl">•</span>
              <span>Votre fichier sera téléchargé sur votre appareil.</span>
            </li>
          </ul>
          <p className="text-sm text-gray-500 italic leading-relaxed">
            <strong>Note :</strong> Tous vos messages seront inclus dans l'archive téléchargée, mais grâce à notre site, vous 
            pourrez sélectionner uniquement la conversation que vous souhaitez imprimer. Seule cette 
            conversation choisie sera utilisée pour la création de votre livre.
          </p>
        </div>
      ),
      image: "/covers/instaStep12.png"
    },
    {
      step: 13,
      title: "Créer un livre à partir de Instagram",
      content: (
        <div className="space-y-4 text-gray-600 text-lg">
          <p>
            Parfait ! Vous avez maintenant votre fichier Instagram. Il ne vous reste plus qu'à l'importer dans notre 
            application pour créer votre livre souvenir personnalisé.
          </p>
          <p className="text-purple-600 font-semibold">
            Cliquez sur "Commencer" pour débuter la création de votre livre !
          </p>
        </div>
      ),
      image: "/covers/instaStep13.png"
    }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <main className="flex-grow">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Left side - Text content */}
                <div className="space-y-6">
                  <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Étape n°{currentStep}
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                    {currentStepData.title}
                  </h1>
                  
                  {currentStepData.content}
                  
                  {/* Bouton de téléversement sous chaque étape */}
                  <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Button 
                      onClick={handleUploadFile}
                      className="w-full bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white flex items-center gap-2 mb-2"
                    >
                      <Upload className="w-5 h-5" />
                      Téléverser mon fichier maintenant
                    </Button>
                    <p className="text-sm text-purple-600 text-center">
                      Vous avez déjà exporté votre conversation ? Passez directement à l'étape suivante
                    </p>
                  </div>
                  
                  {currentStep === 13 && (
                    <Button 
                      className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full text-lg font-medium mt-4"
                      onClick={handleStartUpload}
                    >
                      Commencer
                    </Button>
                  )}
                </div>

                {/* Right side - Image */}
                <div className="flex justify-center">
                  <img 
                    src={currentStepData.image}
                    alt={`Étape ${currentStep} - Instagram`}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>

              {/* Navigation arrows */}
              <div className="flex justify-center mt-12 gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevStep}
                  className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextStep}
                  disabled={currentStep === totalSteps}
                  className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InstagramBookInterface;
