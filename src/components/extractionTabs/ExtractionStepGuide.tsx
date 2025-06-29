
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Step {
  number: string;
  title: string;
  description: string;
  instructions: string[];
}

interface ExtractionStepGuideProps {
  platform: 'instagram' | 'whatsapp' | 'messenger';
}

const platformSteps: Record<string, Step[]> = {
  instagram: [
    {
      number: "1",
      title: "Créer un livre à partir de Instagram",
      description: "Souvenez-vous de ces messages marquants sur Instagram ? Imaginez-les transformés en un livre, un trésor de souvenirs à parcourir sans fin.",
      instructions: [
        "En quelques clics, convertissez vos échanges Instagram en un livre personnalisé.",
        "Préservez vos souvenirs les plus précieux et offrez un cadeau unique à vos proches !"
      ]
    },
    {
      number: "2", 
      title: "Accédez aux Paramètres",
      description: "Pour commencer, ouvrez l'application Instagram. Accédez aux Paramètres en cliquant sur les trois points en haut à droite.",
      instructions: [
        "Pour commencer, ouvrez l'application Instagram.",
        "Accédez aux Paramètres en cliquant sur les trois points en haut à droite."
      ]
    },
    {
      number: "3",
      title: "Sélectionnez Espace Comptes",
      description: "Dans le menu des paramètres, recherchez et sélectionnez 'Espace Comptes' ou 'Accounts Center'.",
      instructions: [
        "Sélectionnez Espace Comptes."
      ]
    },
    {
      number: "4",
      title: "Vos Informations et Autorisations",
      description: "Trouvez et cliquez sur 'Vos Informations et Autorisations' pour accéder aux options de téléchargement.",
      instructions: [
        "Cliquez sur Vos Informations et Autorisations."
      ]
    },
    {
      number: "5",
      title: "Télécharger vos informations",
      description: "Sélectionnez l'option 'Télécharger vos informations' pour commencer le processus d'export.",
      instructions: [
        "Choisissez Télécharger vos informations."
      ]
    },
    {
      number: "6",
      title: "Télécharger ou Transférer des Informations",
      description: "Accédez à la section de téléchargement pour configurer votre export de données.",
      instructions: [
        "Allez dans Télécharger ou Transférer des Informations."
      ]
    },
    {
      number: "7",
      title: "Sélectionnez Instagram",
      description: "Choisissez Instagram comme source de données à exporter. Cette étape peut ne pas apparaître sur certains comptes.",
      instructions: [
        "Sélectionnez Instagram",
        "Cette étape peut ne pas apparaître sur certains comptes."
      ]
    },
    {
      number: "8",
      title: "Certaines de vos informations",
      description: "Choisissez 'Certaines de vos informations' pour sélectionner spécifiquement les messages.",
      instructions: [
        "Choisissez Certaines de vos informations"
      ]
    },
    {
      number: "9",
      title: "Sélectionnez Messages",
      description: "Faites défiler jusqu'à 'Messages' et sélectionnez-le, puis cliquez sur 'Suivant' pour continuer.",
      instructions: [
        "Faites défiler jusqu'à Messages. Sélectionnez-le, puis cliquez sur Suivant"
      ]
    }
  ],
  whatsapp: [
    {
      number: "1",
      title: "Ouvrez WhatsApp",
      description: "Lancez l'application WhatsApp sur votre téléphone et sélectionnez la conversation à exporter.",
      instructions: [
        "Ouvrez WhatsApp sur votre téléphone",
        "Sélectionnez la conversation que vous souhaitez transformer en livre"
      ]
    },
    {
      number: "2",
      title: "Accédez aux informations",
      description: "Appuyez sur le nom du contact en haut de la conversation pour accéder aux options.",
      instructions: [
        "Appuyez sur le nom du contact en haut de l'écran",
        "Vous accéderez aux informations de la conversation"
      ]
    },
    {
      number: "3",
      title: "Exportez la conversation",
      description: "Faites défiler vers le bas et appuyez sur 'Exporter la discussion'.",
      instructions: [
        "Faites défiler vers le bas dans les informations",
        "Appuyez sur 'Exporter la discussion'"
      ]
    },
    {
      number: "4",
      title: "Choisissez les options",
      description: "Sélectionnez si vous voulez inclure les médias ou non, puis partagez le fichier.",
      instructions: [
        "Choisissez 'Avec les médias' ou 'Sans les médias'",
        "Sélectionnez comment partager le fichier d'export"
      ]
    }
  ],
  messenger: [
    {
      number: "1",
      title: "Accédez à Facebook",
      description: "Connectez-vous à Facebook via votre navigateur web pour accéder aux paramètres.",
      instructions: [
        "Ouvrez facebook.com dans votre navigateur",
        "Connectez-vous à votre compte Facebook"
      ]
    },
    {
      number: "2",
      title: "Paramètres et confidentialité",
      description: "Cliquez sur votre photo de profil puis sur 'Paramètres et confidentialité'.",
      instructions: [
        "Cliquez sur votre photo de profil en haut à droite",
        "Sélectionnez 'Paramètres et confidentialité' > 'Paramètres'"
      ]
    },
    {
      number: "3",
      title: "Vos informations Facebook",
      description: "Dans le menu de gauche, sélectionnez 'Vos informations Facebook'.",
      instructions: [
        "Dans le menu latéral gauche, cliquez sur 'Vos informations Facebook'",
        "Puis sur 'Télécharger vos informations'"
      ]
    },
    {
      number: "4",
      title: "Sélectionnez les Messages",
      description: "Décochez tout sauf 'Messages' et choisissez le format JSON.",
      instructions: [
        "Décochez 'Sélectionner tout'",
        "Cochez uniquement 'Messages'",
        "Choisissez le format JSON"
      ]
    },
    {
      number: "5",
      title: "Créez le fichier",
      description: "Cliquez sur 'Créer un fichier' et attendez la notification de Facebook.",
      instructions: [
        "Cliquez sur 'Créer un fichier'",
        "Attendez la notification de Facebook (peut prendre quelques heures)"
      ]
    }
  ]
};

const ExtractionStepGuide: React.FC<ExtractionStepGuideProps> = ({ platform }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = platformSteps[platform] || [];

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

  const currentStepData = steps[currentStep];

  const getPlatformColor = () => {
    switch (platform) {
      case 'instagram':
        return 'from-purple-500 via-pink-500 to-orange-500';
      case 'whatsapp':
        return 'from-green-400 to-green-600';
      case 'messenger':
        return 'from-blue-500 to-blue-700';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  if (!currentStepData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-8 shadow-xl border-0 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${getPlatformColor()}`}></div>
        <CardContent className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Badge 
              variant="secondary" 
              className={`bg-gradient-to-r ${getPlatformColor()} text-white px-6 py-3 text-lg font-bold rounded-full border-0`}
            >
              Étape n°{currentStepData.number}
            </Badge>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {currentStepData.title}
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {currentStepData.description}
          </p>
          
          <div className="space-y-4">
            {currentStepData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getPlatformColor()} flex items-center justify-center text-white text-sm font-bold mt-0.5`}>
                  •
                </div>
                <p className="text-gray-700 flex-1 leading-relaxed">{instruction}</p>
              </div>
            ))}
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
                  ? `bg-gradient-to-r ${getPlatformColor()}`
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
          className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${getPlatformColor()} text-white border-0`}
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExtractionStepGuide;