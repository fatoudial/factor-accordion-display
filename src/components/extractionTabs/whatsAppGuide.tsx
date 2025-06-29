
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const WhatsAppGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Créer un livre à partir de WhatsApp",
      description: "Pour imprimer vos messages WhatsApp dans un livre, vous devez d'abord exporter une copie de votre conversation. Quel que soit le téléphone que vous utilisez, il vous sera demandé de mettre à jour votre application WhatsApp pour vous assurer d'avoir la dernière version.",
      icon: "📱",
      image: "/covers/whatsappStep1.png",
      instructions: [
        "Étape n°1 : Exporter votre conversation WhatsApp avant impression",
        "Pour imprimer vos messages WhatsApp dans un livre, vous devez d'abord exporter une copie de votre conversation.",
        "Quel que soit le téléphone que vous utilisez, il vous sera demandé de mettre à jour votre application WhatsApp pour vous assurer d'avoir la dernière version."
      ]
    },
    {
      title: "Ouvrir l'application WhatsApp",
      description: "Ouvrez l'application WhatsApp et accédez à la conversation que vous souhaitez imprimer.",
      icon: "💬",
      image: "/covers/whatsappStep2.png",
      instructions: [
        "Ouvrir l'application WhatsApp",
        "Accédez à la conversation que vous souhaitez imprimer"
      ]
    },
    {
      title: "Accéder aux détails du contact",
      description: "Cliquez sur le nom du contact en haut de la conversation pour accéder aux détails.",
      icon: "👤",
      image: "/covers/whatsappStep3.png",
      instructions: [
        "Accéder aux détails du contact",
        "Cliquez sur le nom du contact en haut"
      ]
    },
    {
      title: "Défiler vers le bas",
      description: "Défilez vers le bas de la page pour découvrir l'option 'Exporter la discussion'.",
      icon: "⬇️",
      image: "/covers/whatsappStep4.png",
      instructions: [
        "Défilez vers le bas de la page pour découvrir Exporter la discussion"
      ]
    },
    {
      title: "Exporter la discussion",
      description: "Cliquez sur 'Exporter la discussion' pour commencer le processus d'exportation.",
      icon: "📤",
      image: "/covers/whatsappStep5.png",
      instructions: [
        "Cliquez sur Exporter la discussion"
      ]
    },
    {
      title: "Choisir l'option avec ou sans médias",
      description: "Choisissez l'option avec ou sans médias selon vos préférences.",
      icon: "🎯",
      image: "/covers/whatsappStep6.png",
      instructions: [
        "Choisir l'option avec ou sans médias",
        "Avec médias : Sauvegardez le fichier .zip dans Fichiers ou un cloud (Google Drive, Dropbox)",
        "Sans médias : Vous aurez un fichier texte (.txt) de la conversation",
        "Évitez d'utiliser Mail, car la limite de 15Mo pourrait restreindre le nombre de messages et d'images exportés"
      ]
    },
    {
      title: "Sauvegarder le fichier",
      description: "Enregistrez le fichier dans 'Fichiers' pour le retrouver facilement. Cliquez ensuite sur le bouton ci-dessous 'Sélectionner un fichier' afin de démarrer la création de votre livre.",
      icon: "💾",
      image: "/covers/whatsappStep7.png",
      instructions: [
        "Enregistrez le fichier dans 'Fichiers' pour le retrouver facilement",
        "Cliquez ensuite sur le bouton ci-dessous 'Sélectionner un fichier' afin de démarrer la création de votre livre"
      ]
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

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg border border-green-100">
        <div className="relative">
          <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">{steps[currentStep].icon}</span>
            <span>{steps[currentStep].title}</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-6 rounded-md shadow-sm min-h-[180px] flex items-center">
              <div>
                <p className="mb-4">{steps[currentStep].description}</p>
                <ul className="space-y-2">
                  {steps[currentStep].instructions.map((instruction, idx) => (
                    <li key={idx} className="text-sm text-gray-600">• {instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <AspectRatio ratio={16/10} className="bg-muted">
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={steps[currentStep].image} 
                    alt={`Étape ${currentStep + 1}: ${steps[currentStep].title}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>

        <div className="flex justify-center my-6">
          <div className="flex space-x-2">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 w-2 rounded-full ${currentStep === idx ? 'bg-green-600' : 'bg-green-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Précédent
          </Button>
          <Button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="bg-green-600 hover:bg-green-700 flex items-center"
          >
            Suivant <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGuide;
