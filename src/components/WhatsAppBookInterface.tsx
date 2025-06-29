
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ChevronLeft, ChevronRight, MessageCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WhatsAppBookInterfaceProps {
  onBack: () => void;
}

const WhatsAppBookInterface: React.FC<WhatsAppBookInterfaceProps> = ({ onBack }) => {
   const navigate = useNavigate();
   const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      number: "1",
      title: "Créer un livre à partir de WhatsApp",
      description: "Pour imprimer vos messages WhatsApp dans un livre, vous devez d'abord exporter une copie de votre conversation.",
      instructions: [
        "Exporter votre conversation WhatsApp avant impression",
        "Mettre à jour votre application WhatsApp pour la dernière version"
      ],
      image: "/covers/whatsappStep1.png"
    },
    {
      number: "2",
      title: "Ouvrir l'application WhatsApp",
      description: "Ouvrez l'application WhatsApp et accédez à la conversation que vous souhaitez imprimer.",
      instructions: [
        "Ouvrir l'application WhatsApp",
        "Accédez à la conversation à imprimer"
      ],
      image: "/covers/whatsappStep2.png"
    },
    {
      number: "3",
      title: "Accéder aux détails du contact",
      description: "Cliquez sur le nom du contact en haut de la conversation pour accéder aux détails.",
      instructions: [
        "Cliquez sur le nom du contact en haut"
      ],
      image: "/covers/whatsappStep3.png"
    },
    {
      number: "4",
      title: "Défiler vers le bas",
      description: "Défilez vers le bas de la page pour découvrir l'option 'Exporter la discussion'.",
      instructions: [
        "Défilez vers le bas pour trouver 'Exporter la discussion'"
      ],
      image: "/covers/whatsappStep4.png"
    },
    {
      number: "5",
      title: "Exporter la discussion",
      description: "Cliquez sur 'Exporter la discussion' pour commencer le processus d'exportation.",
      instructions: [
        "Cliquez sur 'Exporter la discussion'"
      ],
      image: "/covers/whatsappStep5.png"
    },
    {
      number: "6",
      title: "Choisir l'option avec ou sans médias",
      description: "Choisissez l'option avec ou sans médias selon vos préférences.",
      instructions: [
        "Avec médias : Sauvegardez dans Fichiers ou un cloud",
        "Sans médias : Fichier texte (.txt) de la conversation",
        "Évitez Mail (limite de 15Mo)"
      ],
      image: "/covers/whatsappStep6.png"
    },
    {
      number: "7",
      title: "Sauvegarder le fichier",
      description: "Enregistrez le fichier dans 'Fichiers' pour le retrouver facilement.",
      instructions: [
        "Enregistrez dans 'Fichiers'",
        "Cliquez sur 'Sélectionner un fichier' pour créer votre livre"
      ],
      image: "/covers/whatsappStep7.png"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
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
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Guide WhatsApp</h1>
          </div>
          
          <div className="w-[140px]"></div>
        </div>

        {/* Étape actuelle */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
              {/* Texte à gauche */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold rounded-full">
                    Étape n°{currentStepData.number}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {currentStepData.title}
                </h2>
                
                <p className="text-base text-gray-600 mb-6 leading-relaxed">
                  {currentStepData.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {currentStepData.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold mt-0.5 flex-shrink-0">
                        •
                      </div>
                      <p className="text-gray-700 flex-1 text-sm leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>

                {/* Bouton de téléversement */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <Button 
                    onClick={handleUploadFile}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Téléverser mon fichier
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Vous avez déjà exporté ? Passez à l'étape suivante
                  </p>
                </div>
              </div>

              {/* Image à droite */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                <div className="relative">
                  <div className="w-60 h-80 bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-white">
                    <img 
                      src={currentStepData.image} 
                      alt={`Étape ${currentStep + 1}: ${currentStepData.title}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
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
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white border-0"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBookInterface;
