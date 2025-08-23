
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';



const CreateBookSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePlatformSelect = (platform: string) => {
    // Temporairement sans vérification d'authentification
    // if (isAuthenticated) {
      navigate('/designer', { state: { selectedPlatform: platform } });
    // } else {
    //   navigate('/login', { state: { redirectAfterLogin: '/designer', selectedPlatform: platform } });
    // }
  };

  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      hoverColor: 'hover:bg-green-100',
      description: 'Transformez vos conversations WhatsApp en livre souvenir'
    },
    {
      id: 'facebook',
      name: 'Messenger',
      icon: FaFacebookMessenger,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      hoverColor: 'hover:bg-blue-100',
      description: 'Créez un livre à partir de vos messages Facebook'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      color: 'from-pink-400 via-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50',
      borderColor: 'border-pink-200',
      textColor: 'text-purple-700',
      hoverColor: 'hover:from-pink-100 hover:to-purple-100',
      description: 'Imprimez vos conversations Instagram Direct'
    }
  ];


  return (
    <section className="py-20 bg-gradient-to-br from-ts-sand to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-ts-forest mb-6">
            Créer mon livre
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choisissez votre plateforme de messagerie et transformez vos conversations 
            en un magnifique livre souvenir personnalisé
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <Card 
                key={platform.id}
                className={`${platform.bgColor} ${platform.borderColor} border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group ${platform.hoverColor}`}
                onClick={() => handlePlatformSelect(platform.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${platform.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold ${platform.textColor} mb-2`}>
                      {platform.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {platform.description}
                  </p>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${platform.color} text-white hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    size="lg"
                  >
                    Commencer
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            ✨ Processus simple et rapide • 📖 Qualité d'impression premium 
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreateBookSection;
