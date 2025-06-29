
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, FileUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StyleSelector } from '@/components/designer/StyleSelector';
import { BookPreview } from '@/components/designer/BookPreview';
import { useBookDesigner } from '@/hooks/useBookDesigner';
import { BookDesign } from '@/types/book';

const BookDesignerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const extractedMessages = location.state?.extractedMessages || 
    JSON.parse(sessionStorage.getItem('extractedMessages') || '[]');
  
  const {
    bookDesign,
    updateDesign,
    messages,
    setMessages,
    isLoading,
    bookId,
    isPremiumUser,
    handleSaveDesign,
    handleOrderBook,
  } = useBookDesigner();
  
  useEffect(() => {
    if (extractedMessages && extractedMessages.length > 0) {
      setMessages(extractedMessages);
    }
  }, [extractedMessages, setMessages]);

  useEffect(() => {
    if (!extractedMessages || extractedMessages.length === 0) {
      const storedMessages = sessionStorage.getItem('extractedMessages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        if (parsedMessages && parsedMessages.length > 0) {
          setMessages(parsedMessages);
          return;
        }
      }
      
      toast({
        title: "Aucun message à afficher",
        description: "Veuillez d'abord télécharger et traiter un fichier de conversation.",
        variant: "destructive"
      });
      navigate('/designer/upload');
    }
  }, [navigate, toast, extractedMessages, setMessages]);
  
  const steps = [
    {
      id: 1,
      title: "Couverture",
      description: "Couleur et titre"
    },
    {
      id: 2,
      title: "Messages", 
      description: "Style des bulles"
    },
    {
      id: 3,
      title: "Aperçu",
      description: "Résultat final"
    }
  ];

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!bookId) {
        await handleSaveDesign();
      }
      handleOrderBook();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/designer/upload');
    }
  };

  const handleStyleUpdate = (key: string, value: string | boolean | any) => {
    updateDesign({ [key]: value } as Partial<BookDesign>);
  };

  const predefinedColors = [
    { name: 'Bleu', value: '#3B82F6' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Rouge', value: '#EF4444' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        updateDesign({ coverImage: result });
        
        if (!bookDesign.coverTitle || bookDesign.coverTitle === '') {
          updateDesign({ coverTitle: 'Nos souvenirs' });
        }
        if (!bookDesign.coverSubtitle || bookDesign.coverSubtitle === '') {
          updateDesign({ coverSubtitle: 'Une histoire à nous' });
        }
        if (!bookDesign.coverColor || bookDesign.coverColor === '') {
          updateDesign({ coverColor: '#6366f1' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAICover = async () => {
    setIsGeneratingAI(true);
    try {
      console.log("Génération d'une couverture avec IA basée sur:", bookDesign.coverTitle);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAiImageUrl = "https://picsum.photos/800/1200";
      setPreviewImage(mockAiImageUrl);
      updateDesign({ coverImage: mockAiImageUrl });
      
      if (!bookDesign.coverTitle || bookDesign.coverTitle === '') {
        updateDesign({ coverTitle: 'Nos souvenirs' });
      }
      if (!bookDesign.coverSubtitle || bookDesign.coverSubtitle === '') {
        updateDesign({ coverSubtitle: 'Une histoire à nous' });
      }
      if (!bookDesign.coverColor || bookDesign.coverColor === '') {
        updateDesign({ coverColor: '#6366f1' });
      }
      
      toast({
        title: "Image générée",
        description: "L'image de couverture a été générée avec succès.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const renderCoverPreview = () => {
    return (
      <div 
        className="aspect-[2/3] w-full max-w-[300px] mx-auto rounded-lg shadow-xl overflow-hidden flex flex-col"
        style={{ backgroundColor: bookDesign.coverColor || '#3B82F6' }}
      >
        {/* Titre en haut */}
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            {bookDesign.coverTitle || 'Nos souvenirs'}
          </h2>
          <p className="text-sm text-white/90">
            {bookDesign.coverSubtitle || 'Une histoire à nous'}
          </p>
        </div>
        
        {/* Image au centre */}
        {(previewImage || (bookDesign.coverImage && bookDesign.coverImage !== "/placeholder.svg")) ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full h-32 rounded-lg overflow-hidden shadow-md">
              <img 
                src={previewImage || bookDesign.coverImage} 
                alt="Couverture" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full h-32 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
              <span className="text-white/60 text-sm">Image de couverture</span>
            </div>
          </div>
        )}
        
        {/* Espace en bas */}
        <div className="p-4"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-800">
            Créez votre livre souvenir
          </h1>
          
          <div className="w-[140px]"></div>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Personnalisez votre couverture
                </h2>
                <p className="text-gray-600">
                  Choisissez la couleur, le titre et l'image de votre livre
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Left column - Form sections */}
                <div className="space-y-6">
                  {/* Title section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Informations du livre</h3>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <Label htmlFor="cover-title" className="text-base font-medium">Titre du livre</Label>
                          <Input 
                            id="cover-title" 
                            value={bookDesign.coverTitle}
                            onChange={(e) => updateDesign({ coverTitle: e.target.value })}
                            placeholder="Nos souvenirs"
                            className="text-lg mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cover-subtitle" className="text-base font-medium">Sous-titre</Label>
                          <Input 
                            id="cover-subtitle" 
                            value={bookDesign.coverSubtitle}
                            onChange={(e) => updateDesign({ coverSubtitle: e.target.value })}
                            placeholder="Une histoire à nous"
                            className="mt-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Color palette section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Palette de couleurs</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {predefinedColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => updateDesign({ coverColor: color.value })}
                              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                bookDesign.coverColor === color.value 
                                  ? 'border-gray-900 shadow-md scale-105' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div 
                                className="w-full h-8 rounded mb-2 shadow-sm" 
                                style={{ backgroundColor: color.value }}
                              />
                              <span className="text-sm font-medium">{color.name}</span>
                            </button>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                          <Label htmlFor="custom-color" className="text-sm font-medium flex-1">
                            Couleur personnalisée
                          </Label>
                          <input 
                            type="color" 
                            id="custom-color"
                            value={bookDesign.coverColor || '#3B82F6'}
                            onChange={(e) => updateDesign({ coverColor: e.target.value })}
                            className="w-10 h-10 rounded border-2 border-white shadow-sm cursor-pointer"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Image section */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Image de couverture</h3>
                    <Card>
                      <CardContent className="p-6 space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            id="cover-image"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label htmlFor="cover-image" className="cursor-pointer">
                            <div className="flex flex-col items-center">
                              <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                              <span className="text-sm font-medium text-gray-700">
                                Télécharger une image
                              </span>
                              <span className="text-xs text-gray-500">
                                JPG, PNG ou GIF - Max 5MB
                              </span>
                            </div>
                          </label>
                        </div>
                        
                        <div className="text-center">
                          <span className="text-sm text-gray-500 inline-block mb-2">ou</span>
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="w-full"
                            onClick={handleGenerateAICover}
                            disabled={isGeneratingAI}
                          >
                            {isGeneratingAI ? 'Génération en cours...' : 'Générer une image avec l\'IA'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Right column - Preview only */}
                <div className="lg:sticky lg:top-8">
                  <h3 className="text-xl font-semibold mb-4 text-center">Aperçu</h3>
                  <div className="flex justify-center">
                    {renderCoverPreview()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Style de vos messages
                </h2>
                <p className="text-gray-600">
                  Choisissez l'apparence de vos bulles de conversation
                </p>
              </div>
              <StyleSelector design={bookDesign} onUpdate={handleStyleUpdate} />
            </div>
          )}
          
          {currentStep === 3 && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Aperçu de votre livre
                </h2>
                <p className="text-gray-600">
                  Voici à quoi ressemblera votre livre final
                </p>
              </div>
              <BookPreview 
                design={bookDesign} 
                messages={messages} 
                isPremiumUser={isPremiumUser}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-6xl mx-auto">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            className="px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 1 ? 'Retour' : 'Précédent'}
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            {isLoading ? 'Chargement...' : currentStep === 3 ? 'Commander mon livre' : 'Continuer'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDesignerPage;
