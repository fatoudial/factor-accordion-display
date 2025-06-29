
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Instagram, MessageSquare, Smartphone, Download, Settings, FileText, Share } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RunwareService, GenerateImageParams } from '@/services/imageGenerationService';
import { toast } from 'sonner';

interface Step {
  id: number;
  title: string;
  description: string;
  illustration: string;
  instructions: string[];
  platform: 'instagram' | 'whatsapp' | 'messenger';
  generatedImage?: string;
  detailedInstructions: string[];
}

const platformSteps: Record<string, Step[]> = {
  instagram: [
    {
      id: 1,
      title: "Ouvrez Instagram",
      description: "Accédez à votre application Instagram sur votre téléphone",
      illustration: "",
      instructions: [
        "Ouvrez l'application Instagram sur votre téléphone",
        "Assurez-vous d'être connecté à votre compte"
      ],
      detailedInstructions: [
        "Sur votre écran d'accueil, recherchez l'icône Instagram (caméra colorée dans un carré)",
        "Appuyez sur l'icône pour ouvrir l'application",
        "Si vous n'êtes pas connecté, entrez vos identifiants de connexion",
        "Vous devriez voir votre flux Instagram avec les publications de vos amis"
      ],
      platform: 'instagram'
    },
    {
      id: 2,
      title: "Accédez aux paramètres",
      description: "Naviguez vers les paramètres de votre compte Instagram",
      illustration: "",
      instructions: [
        "Appuyez sur votre photo de profil en bas à droite",
        "Appuyez sur les trois lignes en haut à droite",
        "Sélectionnez 'Paramètres et confidentialité'"
      ],
      detailedInstructions: [
        "En bas de votre écran, vous verrez 5 icônes. Appuyez sur la dernière à droite (votre photo de profil)",
        "Vous êtes maintenant sur votre profil. En haut à droite, vous verrez trois lignes horizontales (≡)",
        "Appuyez sur ces trois lignes pour ouvrir le menu",
        "Dans le menu qui s'ouvre, recherchez et appuyez sur 'Paramètres et confidentialité'"
      ],
      platform: 'instagram'
    },
    {
      id: 3,
      title: "Trouvez 'Télécharger vos informations'",
      description: "Localisez l'option pour télécharger vos données",
      illustration: "",
      instructions: [
        "Faites défiler vers le bas dans les paramètres",
        "Appuyez sur 'Comptes Center'",
        "Sélectionnez 'Vos informations et autorisations'",
        "Appuyez sur 'Télécharger vos informations'"
      ],
      detailedInstructions: [
        "Dans la page des paramètres, faites défiler vers le bas jusqu'à voir 'Comptes Center'",
        "Appuyez sur 'Comptes Center' - c'est là où Meta gère vos comptes",
        "Dans Comptes Center, recherchez 'Vos informations et autorisations'",
        "Appuyez dessus, puis recherchez l'option 'Télécharger vos informations'"
      ],
      platform: 'instagram'
    },
    {
      id: 4,
      title: "Sélectionnez les messages",
      description: "Choisissez les conversations à exporter",
      illustration: "",
      instructions: [
        "Sélectionnez votre compte Instagram",
        "Choisissez 'Informations spécifiques'",
        "Cochez 'Messages'",
        "Sélectionnez le format JSON"
      ],
      detailedInstructions: [
        "Vous verrez une liste de vos comptes. Sélectionnez votre compte Instagram",
        "Choisissez 'Informations spécifiques' au lieu de 'Toutes les informations disponibles'",
        "Dans la liste qui apparaît, décochez tout et cochez uniquement 'Messages'",
        "Plus bas, choisissez le format 'JSON' qui est compatible avec notre application"
      ],
      platform: 'instagram'
    },
    {
      id: 5,
      title: "Demandez le téléchargement",
      description: "Lancez le processus d'export de vos données",
      illustration: "",
      instructions: [
        "Appuyez sur 'Créer des fichiers'",
        "Instagram préparera vos données",
        "Vous recevrez un email quand c'est prêt"
      ],
      detailedInstructions: [
        "Une fois vos sélections faites, appuyez sur le bouton 'Créer des fichiers'",
        "Instagram vous informera que la préparation peut prendre du temps",
        "Confirmez votre demande en appuyant sur 'Soumettre la demande'",
        "Vous recevrez une notification sur Instagram et un email quand vos données seront prêtes"
      ],
      platform: 'instagram'
    },
    {
      id: 6,
      title: "Téléchargez vos données",
      description: "Récupérez votre fichier de conversations",
      illustration: "",
      instructions: [
        "Ouvrez l'email d'Instagram",
        "Cliquez sur 'Télécharger vos informations'",
        "Téléchargez le fichier ZIP",
        "Extrayez et trouvez le dossier 'messages'"
      ],
      detailedInstructions: [
        "Vérifiez votre boîte email pour un message d'Instagram",
        "Ouvrez l'email et cliquez sur 'Télécharger vos informations'",
        "Vous serez redirigé vers Instagram. Entrez votre mot de passe si demandé",
        "Téléchargez le fichier ZIP, extrayez-le et recherchez le dossier 'messages' contenant vos conversations"
      ],
      platform: 'instagram'
    }
  ],
  whatsapp: [
    {
      id: 1,
      title: "Ouvrez WhatsApp",
      description: "Lancez l'application WhatsApp sur votre téléphone",
      illustration: "",
      instructions: [
        "Ouvrez WhatsApp sur votre téléphone",
        "Assurez-vous d'avoir la dernière version"
      ],
      detailedInstructions: [
        "Sur votre écran d'accueil, recherchez l'icône WhatsApp (bulle verte avec un téléphone blanc)",
        "Appuyez sur l'icône pour ouvrir l'application",
        "Vous verrez la liste de vos conversations récentes",
        "Si l'application demande des mises à jour, effectuez-les d'abord"
      ],
      platform: 'whatsapp'
    },
    {
      id: 2,
      title: "Sélectionnez la conversation",
      description: "Choisissez la conversation que vous souhaitez exporter",
      illustration: "",
      instructions: [
        "Ouvrez la conversation à exporter",
        "Appuyez sur le nom du contact en haut"
      ],
      detailedInstructions: [
        "Dans la liste de vos conversations, appuyez sur celle que vous voulez transformer en livre",
        "Une fois dans la conversation, regardez en haut de l'écran",
        "Vous verrez le nom du contact ou du groupe. Appuyez dessus",
        "Cela ouvrira les informations de la conversation"
      ],
      platform: 'whatsapp'
    },
    {
      id: 3,
      title: "Accédez aux options",
      description: "Trouvez l'option d'exportation dans les paramètres",
      illustration: "",
      instructions: [
        "Faites défiler vers le bas",
        "Appuyez sur 'Exporter la discussion'",
        "Choisissez 'Avec les médias' ou 'Sans les médias'"
      ],
      detailedInstructions: [
        "Dans les informations de la conversation, faites défiler vers le bas",
        "Vous verrez plusieurs options comme 'Médias, liens et docs'",
        "Continuez à défiler jusqu'à voir 'Exporter la discussion'",
        "Appuyez sur cette option et choisissez si vous voulez inclure les photos/vidéos ou non"
      ],
      platform: 'whatsapp'
    },
    {
      id: 4,
      title: "Exportez la conversation",
      description: "Sauvegardez votre conversation",
      illustration: "",
      instructions: [
        "Sélectionnez l'application pour partager",
        "Choisissez 'Enregistrer dans les fichiers'",
        "Donnez un nom à votre fichier"
      ],
      detailedInstructions: [
        "WhatsApp vous proposera différentes options de partage",
        "Recherchez et appuyez sur 'Enregistrer dans les fichiers' ou 'Fichiers'",
        "Choisissez un dossier où sauvegarder (comme 'Téléchargements')",
        "Donnez un nom reconnaissable à votre fichier, par exemple 'Conversation_Maman_2024'"
      ],
      platform: 'whatsapp'
    }
  ],
  messenger: [
    {
      id: 1,
      title: "Ouvrez Facebook",
      description: "Accédez à Facebook via votre navigateur web",
      illustration: "",
      instructions: [
        "Allez sur facebook.com",
        "Connectez-vous à votre compte"
      ],
      detailedInstructions: [
        "Ouvrez votre navigateur web (Chrome, Safari, Firefox, etc.)",
        "Tapez 'facebook.com' dans la barre d'adresse",
        "Entrez votre email/téléphone et mot de passe pour vous connecter",
        "Vous devriez voir votre fil d'actualité Facebook"
      ],
      platform: 'messenger'
    },
    {
      id: 2,
      title: "Paramètres et confidentialité",
      description: "Naviguez vers les paramètres de votre compte",
      illustration: "",
      instructions: [
        "Cliquez sur votre photo de profil en haut à droite",
        "Sélectionnez 'Paramètres et confidentialité'",
        "Cliquez sur 'Paramètres'"
      ],
      detailedInstructions: [
        "En haut à droite de votre écran, vous verrez votre photo de profil",
        "Cliquez dessus pour ouvrir un menu déroulant",
        "Dans ce menu, recherchez et cliquez sur 'Paramètres et confidentialité'",
        "Un sous-menu s'ouvrira, cliquez sur 'Paramètres'"
      ],
      platform: 'messenger'
    },
    {
      id: 3,
      title: "Vos informations Facebook",
      description: "Accédez à la section de téléchargement des données",
      illustration: "",
      instructions: [
        "Dans le menu de gauche, cliquez sur 'Vos informations Facebook'",
        "Sélectionnez 'Télécharger vos informations'"
      ],
      detailedInstructions: [
        "Sur la page des paramètres, regardez le menu à gauche de votre écran",
        "Faites défiler ce menu jusqu'à voir 'Vos informations Facebook'",
        "Cliquez dessus pour développer les options",
        "Vous verrez 'Télécharger vos informations', cliquez dessus"
      ],
      platform: 'messenger'
    },
    {
      id: 4,
      title: "Sélectionnez les messages",
      description: "Choisissez les données à télécharger",
      illustration: "",
      instructions: [
        "Décochez 'Sélectionner tout'",
        "Cochez uniquement 'Messages'",
        "Choisissez le format JSON",
        "Sélectionnez la qualité 'Moyenne'"
      ],
      detailedInstructions: [
        "Vous verrez une liste avec 'Sélectionner tout' coché. Décochez cette option",
        "Parcourez la liste et cochez uniquement 'Messages'",
        "Plus bas, dans 'Format', sélectionnez 'JSON' au lieu de 'HTML'",
        "Dans 'Qualité des médias', choisissez 'Moyenne' pour un bon compromis taille/qualité"
      ],
      platform: 'messenger'
    },
    {
      id: 5,
      title: "Créez le fichier",
      description: "Lancez la création de votre archive",
      illustration: "",
      instructions: [
        "Cliquez sur 'Créer un fichier'",
        "Facebook préparera vos données",
        "Vous recevrez une notification quand c'est prêt"
      ],
      detailedInstructions: [
        "Une fois vos sélections terminées, cliquez sur le bouton 'Créer un fichier'",
        "Facebook vous demandera peut-être de confirmer votre mot de passe",
        "Le processus de création peut prendre plusieurs heures ou jours selon la quantité de données",
        "Vous recevrez une notification Facebook et un email quand c'est prêt"
      ],
      platform: 'messenger'
    },
    {
      id: 6,
      title: "Téléchargez vos messages",
      description: "Récupérez votre fichier de conversations",
      illustration: "",
      instructions: [
        "Retournez dans 'Télécharger vos informations'",
        "Cliquez sur 'Télécharger' quand disponible",
        "Extrayez le fichier ZIP",
        "Trouvez le dossier 'messages'"
      ],
      detailedInstructions: [
        "Retournez dans Facebook > Paramètres > Vos informations Facebook > Télécharger vos informations",
        "Vous verrez votre demande avec un statut. Quand c'est prêt, un bouton 'Télécharger' apparaîtra",
        "Cliquez sur 'Télécharger' et sauvegardez le fichier ZIP sur votre ordinateur",
        "Extrayez le fichier ZIP et recherchez le dossier 'messages' qui contient toutes vos conversations"
      ],
      platform: 'messenger'
    }
  ]
};

const StepByStepGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<'instagram' | 'whatsapp' | 'messenger'>('instagram');
  const [steps, setSteps] = useState<Step[]>(platformSteps.instagram);
  const [apiKey, setApiKey] = useState('');
  const [runwareService, setRunwareService] = useState<RunwareService | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setSteps(platformSteps[selectedPlatform]);
    setCurrentStep(0);
  }, [selectedPlatform]);

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

  const getPlatformColor = (platform: string) => {
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-6 w-6" />;
      case 'whatsapp':
        return <MessageSquare className="h-6 w-6" />;
      case 'messenger':
        return <MessageSquare className="h-6 w-6" />;
      default:
        return <Smartphone className="h-6 w-6" />;
    }
  };

  const generateStepImage = async (step: Step) => {
    if (!runwareService) {
      toast.error("Veuillez d'abord entrer votre clé API Runware");
      return;
    }

    setIsGenerating(true);
    
    const prompts = {
      instagram: {
        1: "Mobile phone showing Instagram app icon on home screen, colorful camera icon in square frame, modern smartphone interface",
        2: "Instagram mobile app profile page showing three horizontal lines menu button in top right corner, modern purple gradient interface",
        3: "Instagram settings page on mobile showing 'Accounts Center' option highlighted, clean mobile interface design",
        4: "Instagram data download selection screen showing 'Messages' checkbox selected, mobile interface with JSON format option",
        5: "Instagram file creation confirmation screen with 'Create files' button, modern mobile interface",
        6: "Email notification interface showing Instagram data download ready with download link button"
      },
      whatsapp: {
        1: "Smartphone home screen showing WhatsApp application icon, green chat bubble icon, modern mobile interface",
        2: "WhatsApp conversation list showing contact names and recent messages, green interface theme",
        3: "WhatsApp conversation info screen showing 'Export chat' option highlighted, green mobile interface",
        4: "WhatsApp export dialog showing 'Include media' and 'Without media' options, green theme interface"
      },
      messenger: {
        1: "Facebook website login page on computer screen, blue Facebook interface with login form",
        2: "Facebook settings dropdown menu showing 'Settings & Privacy' option highlighted, blue web interface",
        3: "Facebook settings page showing 'Your Facebook Information' section in left sidebar, web interface",
        4: "Facebook download information page showing 'Messages' checkbox selection, blue web interface",
        5: "Facebook file creation progress screen showing 'Create File' button, blue web interface",
        6: "Facebook download ready page showing available file with download button, blue web interface"
      }
    };

    try {
      const prompt = prompts[step.platform][step.id as keyof typeof prompts[typeof step.platform]] || 
                    `Mobile app interface showing ${step.title.toLowerCase()}, modern design, ${step.platform} style interface`;
      
      const result = await runwareService.generateImage({
        positivePrompt: prompt,
        numberResults: 1
      });

      // Update the step with the generated image
      const updatedSteps = steps.map(s => 
        s.id === step.id && s.platform === step.platform 
          ? { ...s, generatedImage: result.imageURL }
          : s
      );
      setSteps(updatedSteps);
      
      toast.success("Image générée avec succès!");
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error("Erreur lors de la génération de l'image");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllImages = async () => {
    if (!runwareService) {
      toast.error("Veuillez d'abord entrer votre clé API Runware");
      return;
    }

    setIsGenerating(true);
    
    for (const step of steps) {
      if (!step.generatedImage) {
        await generateStepImage(step);
        // Small delay between generations
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsGenerating(false);
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      const service = new RunwareService(apiKey.trim());
      setRunwareService(service);
      toast.success("Service Runware initialisé!");
    } else {
      toast.error("Veuillez entrer une clé API valide");
    }
  };

  return (
  <div className="max-w-6xl mx-auto p-6">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Créer un livre à partir de {selectedPlatform === 'instagram' ? 'Instagram' : selectedPlatform === 'whatsapp' ? 'WhatsApp' : 'Messenger'}
      </h1>
      <div className="flex justify-center gap-4 mb-6">
        {(['instagram', 'whatsapp', 'messenger'] as const).map((platform) => (
          <Button
            key={platform}
            variant={selectedPlatform === platform ? "default" : "outline"}
            onClick={() => setSelectedPlatform(platform)}
            className={`${selectedPlatform === platform ? `bg-gradient-to-r ${getPlatformColor(platform)} border-0` : ''} text-white`}
          >
            {getPlatformIcon(platform)}
            <span className="ml-2 capitalize">{platform === 'whatsapp' ? 'WhatsApp' : platform}</span>
          </Button>
        ))}
      </div>

      {runwareService && (
        <Button 
          onClick={generateAllImages} 
          disabled={isGenerating}
          className="mb-6"
        >
          {isGenerating ? 'Génération en cours...' : 'Générer toutes les images'}
        </Button>
      )}
    </div>

    <Card className="mb-8 shadow-xl border-0 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${getPlatformColor(currentStepData.platform)}`}></div>
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Contenu textuel */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="secondary" className={`bg-gradient-to-r ${getPlatformColor(currentStepData.platform)} text-white px-4 py-2 text-sm font-medium rounded-full border-0`}>
                Étape {currentStepData.id}/{steps.length}
              </Badge>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentStepData.title}
            </h2>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Instructions détaillées :</h3>
              {currentStepData.detailedInstructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getPlatformColor(currentStepData.platform)} flex items-center justify-center text-white text-sm font-bold mt-0.5`}>
                    {index + 1}
                  </div>
                  <p className="text-gray-700 flex-1 text-sm leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>

            {runwareService && !currentStepData.generatedImage && (
              <Button 
                onClick={() => generateStepImage(currentStepData)}
                disabled={isGenerating}
                className="mt-4 w-fit"
                variant="outline"
              >
                {isGenerating ? 'Génération...' : 'Générer l\'image pour cette étape'}
              </Button>
            )}
          </div>

          {/* Illustration */}
          <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8`}>
            <div className="relative">
              {currentStepData.generatedImage ? (
                <div className="relative">
                  <img 
                    src={currentStepData.generatedImage} 
                    alt={currentStepData.title}
                    className="max-w-full h-auto rounded-lg shadow-2xl border-4 border-white"
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              ) : (
                <div className="w-64 h-96 bg-white rounded-lg shadow-2xl flex items-center justify-center border-4 border-dashed border-gray-300">
                  <div className="text-center">
                    {getPlatformIcon(currentStepData.platform)}
                    <p className="mt-2 text-gray-500 text-sm">Image d'illustration</p>
                    <p className="mt-1 text-gray-400 text-xs">À générer</p>
                  </div>
                </div>
              )}
              <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${getPlatformColor(currentStepData.platform)} rounded-full shadow-lg flex items-center justify-center`}>
                {getPlatformIcon(currentStepData.platform)}
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
                ? `bg-gradient-to-r ${getPlatformColor(currentStepData.platform)}`
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
        className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${getPlatformColor(currentStepData.platform)} text-white border-0`}
      >
        Suivant
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
}
export default StepByStepGuide;
