
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
  const { t, language } = useLanguage();

  // Translation data
  const aboutContent = {
    fr: {
      title: "À Propos de Nous",
      mission: "Notre Mission",
      missionText: "Notre mission Offrir à chacun la possibilité de préserver ses échanges les plus précieux dans un format unique, intime et intemporel : le livre personnalisé de vos conversations. Alors : immortalisez vos souvenirs avec simplicité, sécurité et émotion.",
      story: "Notre Histoire",
      storyText: "Tout a commencé avec une conversation WhatsApp que nous ne voulions pas oublier… Un échange rempli d’émotions, de souvenirs, de rires, et de mots simples qui voulaient tout dire. Alors, on s’est dit : “Et si on en faisait un vrai livre ?” C’est ainsi qu’est né Mon Tchatsouvenir : une idée du cœur, pour offrir à chacun la possibilité de conserver une trace tangible de ses moments forts. Parce qu’au fond, nos messages racontent notre histoire.",
      values: "Nos Valeurs",
      valuesItems: [
        {
          title: "Qualité",
          description: "Chaque livre que nous produisons est fabriqué avec soin et attention aux détails."
        },
        {
          title: "Confidentialité",
          description: "Vos conversations privées restent privées. Nous traitons vos données avec le plus grand respect."
        },
        {
          title: "Innovation",
          description: "Nous cherchons constamment à améliorer nos produits et services pour vous offrir la meilleure expérience."
        },
        {
          title: "Accessibilité",
          description: "Nous rendons la création de souvenirs personnalisés accessible à tous, peu importe où vous vous trouvez."
        }
      ],
      team: "Notre Équipe",
      contact: "Contactez-nous",
      contactText: "Vous avez des questions ou des suggestions ? Nous serions ravis de vous entendre.",
      address: "Adresse: Dakar, Sénégal",
      email: "Email: contact@montchatsouvenir.com",
      phone: "Téléphone: +221 XX XXX XX XX"
    },
    en: {
      title: "About Us",
      mission: "Our Mission",
      missionText: "Give everyone the opportunity to preserve their most precious conversations in a unique, intimate, and timeless format: a personalized book of your chats. So go ahead — immortalize your memories with simplicity, security, and emotion.",
      story: "Our Story",
      storyText: "It all started with a WhatsApp conversation we didn’t want to forget… A moment filled with emotions, memories, laughter, and simple words that meant so much. So we thought: “What if we turned it into a real book?” That’s how Mon Tchatsouvenir was born — an idea from the heart, giving everyone a way to preserve a tangible trace of their most meaningful moments. Because in the end, our messages tell our story.",
      values: "Our Values",
      valuesItems: [
        {
          title: "Quality",
          description: "Every book we produce is crafted with care and attention to detail."
        },
        {
          title: "Privacy",
          description: "Your private conversations stay private. We treat your data with the utmost respect."
        },
        {
          title: "Innovation",
          description: "We constantly seek to improve our products and services to offer you the best experience."
        },
        {
          title: "Accessibility",
          description: "We make creating personalized memories accessible to everyone, regardless of where you are."
        }
      ],
      team: "Our Team",
      contact: "Contact Us",
      contactText: "Do you have questions or suggestions? We'd love to hear from you.",
      address: "Address: Dakar, Senegal",
      email: "Email: contact@montchatsouvenir.com",
      phone: "Phone: +221 XX XXX XX XX"
    },
    es: {
      title: "Sobre Nosotros",
      mission: "Nuestra Misión",
      missionText: "Ofrecer a cada persona la posibilidad de preservar sus conversaciones más preciadas en un formato único, íntimo y atemporal: el libro personalizado de tus charlas. Así que adelante: inmortaliza tus recuerdos con sencillez, seguridad y emoción.",
      story: "Nuestra Historia",
      storyText: "Todo comenzó con una conversación de WhatsApp que no queríamos olvidar… Un intercambio lleno de emociones, recuerdos, risas y palabras simples que decían mucho.Entonces dijimos: “¿Y si lo convertimos en un libro real?” Así nació Mon Tchatsouvenir: una idea que viene del corazón, para que todos puedan conservar una huella tangible de sus momentos más significativos. Porque, al final, nuestros mensajes cuentan nuestra historia.",
      values: "Nuestros Valores",
      valuesItems: [
        {
          title: "Calidad",
          description: "Cada libro que producimos se elabora con cuidado y atención al detalle."
        },
        {
          title: "Privacidad",
          description: "Tus conversaciones privadas siguen siendo privadas. Tratamos tus datos con el máximo respeto."
        },
        {
          title: "Innovación",
          description: "Constantemente buscamos mejorar nuestros productos y servicios para ofrecerte la mejor experiencia."
        },
        {
          title: "Accesibilidad",
          description: "Hacemos que la creación de recuerdos personalizados sea accesible para todos, sin importar dónde te encuentres."
        }
      ],
      team: "Nuestro Equipo",
      contact: "Contáctanos",
      contactText: "¿Tienes preguntas o sugerencias? Nos encantaría escucharte.",
      address: "Dirección: Dakar, Senegal",
      email: "Correo electrónico: contact@montchatsouvenir.com",
      phone: "Teléfono: +221 XX XXX XX XX"
    },
    ar: {
      title: "عن الشركة",
      mission: "مهمتنا",
      missionText: "قدم لكل شخص فرصة الحفاظ على محادثاته الأثمن في شكل فريد، حميمي وخالد: كتاب مخصص لمحادثاتك. فلا تتردد — خلد ذكرياتك ببساطة، أمان وعاطفة.",
      story: "قصتنا",
      storyText: "تأسست في عام 2023 في داكار من قبل فريق من رواد الأعمال الشغوفين بالتكنولوجيا وسرد القصص، تستجيب MonTchatSouvenir للحاجة المتزايدة لتجسيد حياتنا الرقمية. ما بدأ كمشروع بين الأصدقاء أصبح سريعًا شركة مبتكرة تخدم العملاء عبر إفريقيا وخارجها.",
      values: "قيمنا",
      valuesItems: [
        {
          title: "الجودة",
          description: "كل كتاب ننتجه مصنوع بعناية واهتمام بالتفاصيل."
        },
        {
          title: "الخصوصية",
          description: "محادثاتك الخاصة تبقى خاصة. نتعامل مع بياناتك باحترام كبير."
        },
        {
          title: "الابتكار",
          description: "نسعى باستمرار لتحسين منتجاتنا وخدماتنا لنقدم لك أفضل تجربة."
        },
        {
          title: "سهولة الوصول",
          description: "نجعل إنشاء ذكريات مخصصة متاحًا للجميع، بغض النظر عن مكان وجودك."
        }
      ],
      team: "فريقنا",
      contact: "اتصل بنا",
      contactText: "هل لديك أسئلة أو اقتراحات؟ يسعدنا أن نسمع منك.",
      address: "العنوان: داكار، السنغال",
      email: "البريد الإلكتروني: contact@montchatsouvenir.com",
      phone: "الهاتف: +221 XX XXX XX XX"
    }
  };

  const content = aboutContent[language as keyof typeof aboutContent];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-ts-indigo mb-4 text-center">{content.title}</h1>
        
        <div className="max-w-4xl mx-auto prose prose-lg">
          <section className="mb-12">
            <h2 className="text-2xl font-serif text-ts-indigo mb-4">{content.mission}</h2>
            <p className="mb-6">{content.missionText}</p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif text-ts-indigo mb-4">{content.story}</h2>
            <p className="mb-6">{content.storyText}</p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif text-ts-indigo mb-4">{content.values}</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {content.valuesItems.map((value, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-medium text-ts-indigo mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-serif text-ts-indigo mb-4">{content.contact}</h2>
            <p className="mb-6">{content.contactText}</p>
            <div className="bg-slate-50 p-6 rounded-lg">
              <p className="mb-2">{content.address}</p>
              <p className="mb-2">{content.email}</p>
              <p>{content.phone}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
