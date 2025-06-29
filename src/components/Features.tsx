
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const Features = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  
  const handleCreateBookClick = () => {
    if (isAuthenticated) {
      navigate('/designer');
    } else {
      navigate('/login', { state: { redirectAfterLogin: '/designer' } });
    }
  };

  const handleViewOffersClick = () => {
    navigate('/offers');
  };

  const translations = {
    fr: {
      title: "Pourquoi nous choisir",
      subtitle: "Notre solution unique transforme vos conversations numériques en souvenirs tangibles avec une attention particulière aux détails et à l'esthétique africaine.",
      createButton: "Créer mon livre",
      discoverButton: "Découvrir nos offres",
      features: [
        {
          title: "Extraction sécurisée",
          description: "Vos conversations sont traitées en toute confidentialité, sans stockage permanent de vos données personnelles."
        },
        {
          title: "Multi-plateforme",
          description: "Compatible avec WhatsApp (Android & iPhone), Messenger et Instagram Direct."
        },
        {
          title: "Design personnalisé",
          description: "Des mises en page élégantes qui reflètent l'identité africaine et s'adaptent à votre relation."
        },
        {
          title: "Filtres intelligents",
          description: "Sélectionnez facilement les périodes, participants et types de contenu à inclure dans votre livre."
        },
        {
          title: "Photos intégrées",
          description: "Intégrez les images partagées dans vos conversations pour des souvenirs plus riches."
        },
        {
          title: "Formats variés",
          description: "Choisissez entre un ebook digital, un livre imprimé ou une édition de luxe sur mesure."
        }
      ]
    },
    en: {
      title: "Why choose us",
      subtitle: "Our unique solution transforms your digital conversations into tangible memories with special attention to details and African aesthetics.",
      createButton: "Create my book",
      discoverButton: "Discover our offers",
      features: [
        {
          title: "Secure extraction",
          description: "Your conversations are processed in complete confidentiality, without permanent storage of your personal data."
        },
        {
          title: "Multi-platform",
          description: "Compatible with WhatsApp (Android & iPhone), Messenger and Instagram Direct."
        },
        {
          title: "Custom design",
          description: "Elegant layouts that reflect African identity and adapt to your relationship."
        },
        {
          title: "Smart filters",
          description: "Easily select time periods, participants and types of content to include in your book."
        },
        {
          title: "Integrated photos",
          description: "Incorporate images shared in your conversations for richer memories."
        },
        {
          title: "Various formats",
          description: "Choose between a digital ebook, a printed book or a custom luxury edition."
        }
      ]
    },
    es: {
      title: "Por qué elegirnos",
      subtitle: "Nuestra solución única transforma tus conversaciones digitales en recuerdos tangibles con especial atención a los detalles y la estética africana.",
      createButton: "Crear mi libro",
      discoverButton: "Descubrir nuestras ofertas",
      features: [
        {
          title: "Extracción segura",
          description: "Tus conversaciones se procesan con total confidencialidad, sin almacenamiento permanente de tus datos personales."
        },
        {
          title: "Multiplataforma",
          description: "Compatible con WhatsApp (Android e iPhone), Messenger e Instagram Direct."
        },
        {
          title: "Diseño personalizado",
          description: "Diseños elegantes que reflejan la identidad africana y se adaptan a tu relación."
        },
        {
          title: "Filtros inteligentes",
          description: "Selecciona fácilmente períodos de tiempo, participantes y tipos de contenido para incluir en tu libro."
        },
        {
          title: "Fotos integradas",
          description: "Incorpora imágenes compartidas en tus conversaciones para obtener recuerdos más enriquecedores."
        },
        {
          title: "Formatos diversos",
          description: "Elige entre un libro electrónico, un libro impreso o una edición de lujo personalizada."
        }
      ]
    },
    ar: {
      title: "لماذا تختارنا",
      subtitle: "حلنا الفريد يحول محادثاتك الرقمية إلى ذكريات ملموسة مع اهتمام خاص بالتفاصيل والجمالية الأفريقية.",
      createButton: "إنشاء كتابي",
      discoverButton: "اكتشف عروضنا",
      features: [
        {
          title: "استخراج آمن",
          description: "تتم معالجة محادثاتك بسرية تامة، دون تخزين دائم لبياناتك الشخصية."
        },
        {
          title: "متعدد المنصات",
          description: "متوافق مع واتساب (أندرويد وآيفون)، ماسنجر وانستغرام دايركت."
        },
        {
          title: "تصميم مخصص",
          description: "تصميمات أنيقة تعكس الهوية الأفريقية وتتكيف مع علاقتك."
        },
        {
          title: "مرشحات ذكية",
          description: "اختر بسهولة الفترات الزمنية والمشاركين وأنواع المحتوى لتضمينها في كتابك."
        },
        {
          title: "صور مدمجة",
          description: "دمج الصور المشتركة في محادثاتك للحصول على ذكريات أكثر ثراءً."
        },
        {
          title: "تنسيقات متنوعة",
          description: "اختر بين كتاب إلكتروني، كتاب مطبوع أو طبعة فاخرة مخصصة."
        }
      ]
    }
  };

  // Sélectionne la traduction appropriée
  const content = translations[language as keyof typeof translations] || translations.fr;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-ts-sand/30">
      <div className="container mx-auto px-4">
        <h2 className="centered-section-title mx-auto text-ts-forest">{content.title}</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          {content.subtitle}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-ts-terracotta">
              <div className="flex items-start mb-4">
                <CheckCircle className="text-ts-terracotta h-6 w-6 mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-ts-forest">{feature.title}</h3>
              </div>
              <p className="text-gray-600 ml-9">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleCreateBookClick}
            className="bg-ts-forest hover:bg-ts-forest/90 text-white"
          >
            {content.createButton}
          </Button>
          {/* <Button 
            onClick={handleViewOffersClick}
            variant="outline" 
            className="border-ts-terracotta text-ts-terracotta hover:bg-ts-terracotta/10"
          >
            {content.discoverButton}
          </Button> */}
        </div>
      </div>
    </section>
  );
};

export default Features;
