
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const FacebookGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Connectez-vous à Facebook",
      description: "Connectez-vous à votre compte Facebook depuis un navigateur web.",
      icon: "🌐",
      image: "/covers/fb1.png"
    },
    {
      title: "Accédez aux paramètres",
      description: "Cliquez sur votre photo de profil puis sur 'Paramètres et confidentialité'.",
      icon: "⚙️",
      image: "/covers/fb2.png"
    },
    {
      title: "Vos informations Facebook",
      description: "Dans le menu latéral gauche, sélectionnez 'Vos informations Facebook'.",
      icon: "📋",
      image: "/covers/fb3.png"
    },
    {
      title: "Téléchargez vos informations",
      description: "Cliquez sur 'Télécharger vos informations' dans les options disponibles.",
      icon: "⬇️",
      image: "/covers/fb4.png"
    },
    {
      title: "Sélectionnez les messages",
      description: "Désélectionnez tout sauf 'Messages' pour obtenir uniquement vos conversations.",
      icon: "💬",
      image: "/covers/fb5.png"
    },
    {
      title: "Choisissez le format JSON",
      description: "Sélectionnez le format JSON pour une compatibilité optimale avec notre application.",
      icon: "📄",
      image: "/covers/fb7.png"
    },
    {
      title: "Créez la demande",
      description: "Cliquez sur 'Créer un fichier' pour lancer le processus d'extraction.",
      icon: "🔄",
      image: "/covers/fb8.png"
    },
    {
      title: "Attendez la notification",
      description: "Facebook vous enverra une notification quand vos données seront prêtes à télécharger.",
      icon: "⏳",
      image: "/covers/fb9.png"
    },
    {
      title: "Téléchargez et importez",
      description: "Téléchargez l'archive et importez-la dans notre application pour créer votre livre.",
      icon: "📚",
      image: "/covers/fb10.png"
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
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <div className="relative">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">{steps[currentStep].icon}</span>
            <span>Étape {currentStep + 1}: {steps[currentStep].title}</span>
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-6 rounded-md shadow-sm min-h-[180px] flex items-center">
              <p className="mb-0">{steps[currentStep].description}</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <AspectRatio ratio={9/16} className="bg-muted">
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
                className={`h-2 w-2 rounded-full ${currentStep === idx ? 'bg-blue-600' : 'bg-blue-200'}`}
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
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            Suivant <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FacebookGuide;
