
import React from 'react';
import { QRCode } from '@/components/designer/preview/pages/QRCode';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { QrCode, Headphones, Video } from 'lucide-react';

const QRCodeShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const handleCreateClick = () => {
    navigate('/designer');
  };
  
  const translations = {
    fr: {
      title: "Donnez vie à vos souvenirs numériques",
      subtitle: "Avec MonThatSouvenir, vous avez la possibilité d’écouter vos notes vocales et de lire vos vidéos grâce à des QR codes intégrés. Génial, n’est-ce pas ? 😄",
      cta: "Créer mon livre interactif",
      audioLabel: "Écoutez vos vocaux",
      videoLabel: "Regardez vos vidéos",
      linkLabel: "Accédez à vos liens",
      description: "Transformez votre livre en une expérience multimédia. Chaque QR code imprimé est une porte vers vos souvenirs audio et vidéo. Un simple scan et revivez ces moments précieux."
    },
    en: {
      title: "Bring your digital memories to life",
      subtitle: "With MonThatSouvenir, you can listen to your voice notes and watch your videos thanks to integrated QR codes. Awesome, right? 😄",
      cta: "Create my interactive book",
      audioLabel: "Listen to your audio",
      videoLabel: "Watch your videos",
      linkLabel: "Access your links",
      description: "Transform your book into a multimedia experience. Each printed QR code is a gateway to your audio and video memories. A simple scan and relive these precious moments."
    },
    es: {
      title: "Da vida a tus recuerdos digitales",
      subtitle: "Con MonThatSouvenir, puedes escuchar tus notas de voz y ver tus videos gracias a los códigos QR integrados.¡Genial, verdad? 😄",
      cta: "Crear mi libro interactivo",
      audioLabel: "Escucha tus audios",
      videoLabel: "Mira tus videos",
      linkLabel: "Accede a tus enlaces",
      description: "Transforma tu libro en una experiencia multimedia. Cada código QR impreso es una puerta a tus recuerdos de audio y video. Un simple escaneo y revive esos momentos preciosos."
    },
    ar: {
      title: "أحي ذكرياتك الرقمية",
      subtitle: "مع MonThatSouvenir، يمكنك الاستماع إلى ملاحظاتك الصوتية ومشاهدة مقاطع الفيديو الخاصة بك من خلال رموز QR المدمجة. رائع، أليس كذلك؟ 😄",
      cta: "إنشاء كتابي التفاعلي",
      audioLabel: "استمع إلى تسجيلاتك",
      videoLabel: "شاهد مقاطع الفيديو الخاصة بك",
      linkLabel: "الوصول إلى روابطك",
      description: "حوّل كتابك إلى تجربة متعددة الوسائط. كل رمز QR مطبوع هو بوابة إلى ذكرياتك الصوتية والمرئية. مسح بسيط واسترجع تلك اللحظات الثمينة."
    }
  };
  
  // Select the appropriate translation
  const content = translations[language as keyof typeof translations] || translations.fr;
  
  return (
    <section className="py-16 bg-gradient-to-b from-ts-sand/30 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side: QR code examples */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative bg-white p-6 rounded-xl shadow-lg max-w-md border border-gray-100">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-ts-terracotta/10 rounded-full -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-ts-gold/20 rounded-full -z-10"></div>
              
              <h3 className="text-xl font-semibold text-ts-indigo mb-6 text-center">
                {content.subtitle}
              </h3>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-ts-terracotta/10 p-3 rounded-full mb-3">
                    <Headphones className="h-8 w-8 text-ts-terracotta" />
                  </div>
                  <QRCode url="https://example.com/audio" label={content.audioLabel} />
                </div>
                
                <div className="flex flex-col items-center bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-ts-indigo/10 p-3 rounded-full mb-3">
                    <Video className="h-8 w-8 text-ts-indigo" />
                  </div>
                  <QRCode url="https://example.com/video" label={content.videoLabel} />
                </div>
                
                <div className="flex flex-col items-center bg-white/80 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-ts-forest/10 p-3 rounded-full mb-3">
                    <QrCode className="h-8 w-8 text-ts-forest" />
                  </div>
                  <QRCode url="https://example.com/link" label={content.linkLabel} />
                </div>
              </div>
              
              <div className="animate-pulse flex justify-center">
                <div className="w-40 h-1 bg-gradient-to-r from-transparent via-ts-gold to-transparent rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Right side: Text content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-ts-indigo mb-6">
              {content.title}
            </h2>
            <p className="text-gray-700 mb-8 text-lg">
              {content.description}
            </p>
            <Button 
              onClick={handleCreateClick}
              className="bg-ts-indigo hover:bg-ts-indigo/90 text-white flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              {content.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeShowcase;
