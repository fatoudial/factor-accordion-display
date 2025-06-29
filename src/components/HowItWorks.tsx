
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const HowItWorks = () => {
  const { language } = useLanguage();
  
  // Ces objets contiennent nos traductions pour chaque langue
  const translations = {
    fr: {
      title: "Comment ça marche",
      subtitle: "Transformez vos conversations en souvenirs en seulement quelques étapes simples",
      steps: [
        {
          number: "01",
          title: "Exportez vos conversations",
          description: "Suivez notre guide simple pour exporter vos conversations depuis WhatsApp, Messenger ou Instagram."
        },
        {
          number: "02",
          title: "Téléchargez votre fichier",
          description: "Utilisez notre formulaire pour télécharger le fichier exporté et vos photos préférées."
        },
        {
          number: "03",
          title: "Personnalisez votre livre",
          description: "Choisissez votre style, couverture, période à inclure et format souhaité."
        },
        {
          number: "04",
          title: "Recevez votre création",
          description: "Nous créons et vous livrons votre livre souvenir où que vous soyez en Afrique."
        }
      ]
    },
    en: {
      title: "How it works",
      subtitle: "Transform your conversations into memories in just a few simple steps",
      steps: [
        {
          number: "01",
          title: "Export your conversations",
          description: "Follow our simple guide to export your conversations from WhatsApp, Messenger or Instagram."
        },
        {
          number: "02",
          title: "Upload your file",
          description: "Use our form to upload the exported file and your favorite photos."
        },
        {
          number: "03",
          title: "Customize your book",
          description: "Choose your style, cover, period to include and desired format."
        },
        {
          number: "04",
          title: "Receive your creation",
          description: "We create and deliver your souvenir book anywhere in Africa."
        }
      ]
    },
    es: {
      title: "Cómo funciona",
      subtitle: "Transforma tus conversaciones en recuerdos en solo unos simples pasos",
      steps: [
        {
          number: "01",
          title: "Exporta tus conversaciones",
          description: "Sigue nuestra guía sencilla para exportar tus conversaciones de WhatsApp, Messenger o Instagram."
        },
        {
          number: "02",
          title: "Sube tu archivo",
          description: "Utiliza nuestro formulario para subir el archivo exportado y tus fotos favoritas."
        },
        {
          number: "03",
          title: "Personaliza tu libro",
          description: "Elige tu estilo, portada, período a incluir y formato deseado."
        },
        {
          number: "04",
          title: "Recibe tu creación",
          description: "Creamos y entregamos tu libro recuerdo donde sea que estés en África."
        }
      ]
    },
    ar: {
      title: "كيف يعمل",
      subtitle: "حوّل محادثاتك إلى ذكريات في بضع خطوات بسيطة",
      steps: [
        {
          number: "٠١",
          title: "تصدير محادثاتك",
          description: "اتبع دليلنا البسيط لتصدير محادثاتك من واتساب أو ماسنجر أو انستغرام."
        },
        {
          number: "٠٢",
          title: "تحميل ملفك",
          description: "استخدم نموذجنا لتحميل الملف المُصدَّر وصورك المفضلة."
        },
        {
          number: "٠٣",
          title: "تخصيص كتابك",
          description: "اختر الأسلوب والغلاف والفترة المراد تضمينها والتنسيق المطلوب."
        },
        {
          number: "٠٤",
          title: "استلم إبداعك",
          description: "نحن ننشئ ونسلم كتاب الذكريات الخاص بك أينما كنت في أفريقيا."
        }
      ]
    }
  };

  // Sélectionne la bonne traduction selon la langue actuelle
  const content = translations[language as keyof typeof translations] || translations.fr;
  
  return (
    <section id="process" className="py-16 bg-ts-forest/5">
      <div className="container mx-auto px-4">
        <h2 className="centered-section-title mx-auto text-ts-forest">{content.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {content.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-xl p-6 h-full shadow-sm border border-ts-gold/20 hover:border-ts-gold/50 transition-colors">
                <div className="text-4xl font-bold text-ts-gold mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-ts-forest mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              {index < content.steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="text-ts-terracotta h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
