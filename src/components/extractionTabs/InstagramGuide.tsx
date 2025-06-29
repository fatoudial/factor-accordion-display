
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const InstagramGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Les étapes du guide Instagram avec images illustratives
  const steps = [
    {
      title: "Ouvrez votre application Instagram",
      description: "Pour commencer, ouvrez l'application Instagram sur votre téléphone et accédez à votre profil en appuyant sur votre photo de profil en bas à droite.",
      icon: "📱",
      image: "/images/instagram-open.png"
    },
    {
      title: "Accédez aux paramètres",
      description: "Dans votre profil, appuyez sur l'icône du menu (trois traits horizontaux) en haut à droite. Puis, sélectionnez \"Paramètres et confidentialité\" dans le menu qui apparaît.",
      icon: "⚙️",
      image: "/images/instagram-settings.png"
    },
    {
      title: "Sélectionnez \"Votre activité\"",
      description: "Dans le menu des paramètres, cherchez et appuyez sur \"Votre activité\" pour accéder à vos données et activités.",
      icon: "📊",
      image: "/images/instagram-your-activity.png"
    },
    {
      title: "Appuyez sur \"Télécharger vos informations\"",
      description: "Faites défiler jusqu'à trouver l'option \"Télécharger vos informations\" et appuyez dessus pour demander une copie de vos données.",
      icon: "⬇️",
      image: "/images/instagram-download-info.png"
    },
    {
      title: "Sélectionnez les données à exporter",
      description: "Assurez-vous que l'option \"Messages\" est cochée et choisissez le format JSON pour une compatibilité optimale avec notre application.",
      icon: "✓",
      image: "/images/instagram-select-data.png"
    },
    {
      title: "Téléchargez et importez vos données",
      description: "Une fois la demande traitée par Instagram (cela peut prendre jusqu'à 48 heures), vous recevrez une notification pour télécharger vos données. Téléchargez le fichier ZIP, puis importez-le dans notre application.",
      icon: "📦",
      image: "/images/instagram-import.png"
    }
  ];

  // Fonction pour aller à l'étape suivante
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
        <div className="relative">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
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
                  {steps[currentStep].image ? (
                    <img 
                      src={steps[currentStep].image} 
                      alt={`Étape ${currentStep + 1}: ${steps[currentStep].title}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-4 text-gray-500">
                      <p>Image illustrative</p>
                      <p className="text-xs">Visualisation des étapes pour Instagram</p>
                    </div>
                  )}
                </div>
              </AspectRatio>
            </div>
          </div>
        </div>

        {/* Indicateur de progression */}
        <div className="flex justify-center my-6">
          <div className="flex space-x-2">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 w-2 rounded-full ${currentStep === idx ? 'bg-purple-600' : 'bg-purple-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Boutons de navigation */}
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
            className="bg-purple-600 hover:bg-purple-700 flex items-center"
          >
            Suivant <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstagramGuide;
