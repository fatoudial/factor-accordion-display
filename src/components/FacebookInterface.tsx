
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageSquare, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FacebookBookInterfaceProps {
  onBack: () => void;
}

const FacebookBookInterface: React.FC<FacebookBookInterfaceProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      number: "1",
      title: "Créer un livre à partir de Facebook Messenger",
      description: "Transformez vos conversations Facebook Messenger en un magnifique livre souvenir. Suivez ces étapes pour exporter vos messages depuis Facebook.",
      instructions: [
        "Connectez-vous à votre compte Facebook depuis un navigateur web",
        "Accédez aux paramètres de votre compte",
        "Suivez le guide pour télécharger vos données"
      ],
      image: "/covers/fb1.png"
    },
    {
      number: "2",
      title: "Accéder aux paramètres Facebook",
      description: "Connectez-vous à Facebook et naviguez vers les paramètres de votre compte.",
      instructions: [
        "Ouvrez facebook.com dans votre navigateur",
        "Cliquez sur votre photo de profil en haut à droite",
        "Sélectionnez 'Paramètres et confidentialité'"
      ],
      image: "/covers/fb2.png"
    },
    {
      number: "3",
      title: "Vos informations Facebook",
      description: "Accédez à la section qui vous permet de télécharger vos données personnelles.",
      instructions: [
        "Dans le menu de gauche, cliquez sur 'Vos informations Facebook'",
        "Sélectionnez 'Télécharger vos informations'"
      ],
      image: "/covers/fb3.png"
    },
    {
      number: "4",
      title: "Sélectionner les messages",
      description: "Choisissez uniquement les messages pour créer votre livre.",
      instructions: [
        "Décochez 'Sélectionner tout'",
        "Cochez uniquement 'Messages'",
        "Choisissez le format JSON"
      ],
      image: "/covers/fb4.png"
    },
    {
      number: "5",
      title: "Télécharger vos données",
      description: "Lancez le processus de création de votre archive de messages.",
      instructions: [
        "Cliquez sur 'Créer un fichier'",
        "Attendez la notification de Facebook",
        "Téléchargez votre archive quand elle est prête"
      ],
      image: "/covers/fb5.png"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUploadFile = () => {
    navigate('/designer/upload');
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux plateformes
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Guide Facebook Messenger</h1>
          </div>
          
          <div className="w-[140px]"></div>
        </div>

        {/* Étape actuelle */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
              {/* Texte à gauche */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 text-lg font-bold rounded-full">
                    Étape n°{currentStepData.number}
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {currentStepData.title}
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {currentStepData.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  {currentStepData.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold mt-0.5 flex-shrink-0">
                        •
                      </div>
                      <p className="text-gray-700 flex-1 leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>

                {/* Bouton de téléversement */}
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <Button 
                    onClick={handleUploadFile}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Téléverser mon fichier maintenant
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Vous avez déjà exporté votre conversation ? Passez directement à l'étape suivante
                  </p>
                </div>
              </div>

              {/* Image à droite */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                <div className="relative">
                  <div className="w-72 h-96 bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                    <img 
                      src={currentStepData.image} 
                      alt={`Étape ${currentStep + 1}: ${currentStepData.title}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
          
          {/* Indicateurs de progression */}
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : index < currentStep
                    ? 'bg-gray-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FacebookBookInterface;
