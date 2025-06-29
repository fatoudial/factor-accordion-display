
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, ArrowLeft, BookOpen, Heart, Star, Sparkles } from 'lucide-react';
import { FaWhatsapp, FaFacebookMessenger, FaInstagram } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import InstagramBookInterface from '@/components/InstagramBookInterface';
import FacebookBookInterface from '@/components/FacebookInterface';
import WhatsAppBookInterface from '@/components/WhatsAppBookInterface';
const BookDesigner = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'platforms' | 'instagram' | 'facebook'| 'whatsApp'>('platforms');
  
  // Redirect if the user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          redirectAfterLogin: '/designer',
        } 
      });
    }
  }, [isAuthenticated, navigate]);

  const handlePlatformSelect = (platform: string) => {
    if (platform === 'instagram') {
      setCurrentView('instagram');
    } 
    
    else if (platform === 'facebook') {
      setCurrentView('facebook');
       } 
    else if (platform === 'whatsApp') {
      setCurrentView('whatsApp');
    } else {
      navigate('/designer/upload', { state: { selectedPlatform: platform } });
    }
  };

  const handleBackToPlatforms = () => {
    setCurrentView('platforms');
  };

  const platforms = [
    {
      id: 'whatsApp',
      name: 'WHATSAPP',
      icon: FaWhatsapp,
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'facebook',
      name: 'Messenger',
      icon: FaFacebookMessenger,
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      id: 'instagram',
      name: 'INSTAGRAM',
      icon: FaInstagram,
  bgColor: 'bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500',
      hoverColor: 'hover:bg-gray-800'
    }
  ];

  // Vue avec les plateformes
  if (currentView === 'platforms') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <main className="flex-grow">
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à l'accueil
                  </Button>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Left side - Inspiration */}
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 rounded-3xl p-8 shadow-lg">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-3 mb-6">
                          <BookOpen className="w-8 h-8 text-purple-600" />
                          <h3 className="text-2xl font-bold text-gray-800">
                            Transformez vos souvenirs
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                          Créez un livre unique à partir de vos conversations les plus précieuses. 
                          Un cadeau inoubliable pour vous ou vos proches.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-white/60 rounded-xl">
                            <Heart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Souvenirs précieux</p>
                          </div>
                          <div className="text-center p-4 bg-white/60 rounded-xl">
                            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">Qualité premium</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right side - Créer un livre */}
                  <Card className="bg-white border-2 border-gray-200 rounded-3xl p-12 shadow-xl">
                    <CardContent className="p-0 text-center">
                      <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">+</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800">
                          Créer un livre
                        </h3>
                      </div>
                      
                      <p className="text-gray-600 mb-8">
                        Sélectionnez votre plateforme de messagerie
                      </p>
                      
                      <div className="flex justify-center gap-8">
                        {platforms.map((platform) => {
                          const Icon = platform.icon;
                          return (
                            <div 
                              key={platform.id}
                              className="text-center cursor-pointer group"
                              onClick={() => handlePlatformSelect(platform.id)}
                            >
                              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${platform.bgColor} ${platform.hoverColor} flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg`}>
                                <Icon className="w-10 h-10 text-white" />
                              </div>
                              <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                                {platform.name}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Vue Instagram
  if (currentView === 'instagram') {
    return (
      <InstagramBookInterface onBack={handleBackToPlatforms} />
    );
  }

  // Vue Facebook
  if (currentView === 'facebook') {
    return (
      <FacebookBookInterface onBack={handleBackToPlatforms} />
    );
  }
// Vue whatsapp
  if (currentView === 'whatsApp') {
    return (
      <WhatsAppBookInterface onBack={handleBackToPlatforms} />
    );
  }

  return null;
};

export default BookDesigner;
