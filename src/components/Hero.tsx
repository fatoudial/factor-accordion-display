
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  const handleCreateBookClick = () => {
    if (isAuthenticated) {
      navigate('/designer');
    } else {
      navigate('/login', { state: { redirectAfterLogin: '/designer' } });
    }
  };

  const handleDiscoverOffersClick = () => {
    navigate('/offers');
  };

  return (
    <section id="home" className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots opacity-10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-ts-gold opacity-10 rounded-full -mr-20 -mb-20 -z-10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-ts-terracotta opacity-10 rounded-full -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-ts-indigo mb-6">
              {t('hero.title')}
              
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                className="btn-primary flex items-center gap-2"
                onClick={handleCreateBookClick}
              >
                <BookOpen className="h-5 w-5" />
                {t('hero.createBook')}
              </Button>
              <Button 
                variant="outline" 
                className="border-ts-terracotta text-ts-terracotta hover:bg-ts-terracotta/10"
                onClick={handleDiscoverOffersClick}
              >
                {t('hero.discoverOffers')}
              </Button>
            </div>
          </div>
          <div className={`w-full ${isMobile ? 'mt-10' : 'md:w-1/2'} relative`}>
            <div className="relative z-10 animate-float">
              <div className="bg-white rounded-lg shadow-xl p-4 transform rotate-3 mb-4 max-w-sm mx-auto">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-ts-gold flex items-center justify-center text-white font-bold">A</div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Cely</div>
                    {/* <div className="text-xs text-gray-500">En ligne</div>
                  */}
                   {/* Statut en ligne */}
                  <div className="bg-green-100 rounded-lg p-3 mb-3 text-sm">
                    {t('status.online')}
                  </div>

                  </div>
                </div>
                {/* <div className="bg-gray-100 rounded-lg p-3 mb-3 text-sm">
                  Bonjour ! Je pense à toi aujourd'hui. Comment vas-tu ?
                 */}
                 <div>
                {/* Message 1 */}
                <div className="bg-gray-100 rounded-lg p-3 mb-3 text-sm">
                  {t('message.1')} {/* Le texte change selon la langue */}
                </div>
                </div>
                {/* <div className="bg-ts-gold/20 rounded-lg p-3 mb-3 text-sm ml-auto max-w-[80%]">
                  Salut ! Ça fait plaisir de te lire. Tout va bien, je prépare une surprise pour toi !
                </div> */}
                  {/* Message 2 */}
                <div className="bg-ts-gold/20 rounded-lg p-3 mb-3 text-sm ml-auto max-w-[80%]">
                  {t('message.2')} {/* Le texte change selon la langue */}
                </div>
                <div className="text-xs text-gray-400 text-right">14:23</div>
              </div>
              <div className="absolute top-10 -right-4 w-40 h-40 bg-ts-terracotta/10 rounded-full -z-10"></div>
            </div>
            <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-ts-gold/20 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
