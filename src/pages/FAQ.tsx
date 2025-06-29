
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';

const FAQPage = () => {
  const { language } = useLanguage();
  
  // FAQs data for each language
  const faqData = {
    fr: [
      {
        question: "Comment fonctionne MonTchatSouvenir ?",
        answer: "Notre service vous permet d'extraire vos conversations WhatsApp, Messenger ou Instagram et de les transformer en un livre papier personnalisé ou en ebook. Vous importez votre fichier d'export de conversation, personnalisez la mise en page et la couverture, puis passez commande."
      },
      {
        question: "Quels formats de conversation sont acceptés ?",
        answer: "Nous acceptons les exports de WhatsApp (.txt ou .zip), Facebook Messenger (.json) et Instagram Direct (.json). Des instructions détaillées pour exporter vos conversations sont disponibles dans notre guide d'extraction."
      },
      {
        question: "Mes données sont-elles en sécurité ?",
        answer: "Absolument. Nous accordons la plus haute importance à la confidentialité de vos données. Vos conversations sont traitées de manière sécurisée, ne sont jamais partagées avec des tiers et sont supprimées de nos serveurs une fois votre livre produit."
      },
      {
        question: "Combien de temps faut-il pour recevoir mon livre ?",
        answer: "Le délai de livraison dépend de votre localisation et du format choisi. En général, comptez 5 à 10 jours ouvrables après validation de votre commande pour une livraison en Afrique de l'Ouest, et 10 à 15 jours pour le reste du monde."
      },
      {
        question: "Puis-je inclure des photos dans mon livre ?",
        answer: "Oui, vous pouvez intégrer les photos partagées dans vos conversations. Lors de l'étape de personnalisation, vous pourrez sélectionner quels types de médias inclure dans votre livre."
      },
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), par mobile money (Orange Money, MTN Mobile Money, Wave) ainsi que par PayPal pour les commandes internationales."
      },
      {
        question: "Puis-je suivre ma commande ?",
        answer: "Oui, vous pouvez suivre l'état de votre commande à tout moment depuis votre espace client. Vous recevrez également des notifications par email à chaque étape du processus de production et d'expédition."
      },
      {
        question: "Comment annuler ou modifier ma commande ?",
        answer: "Vous pouvez annuler ou modifier votre commande tant qu'elle n'est pas passée en production. Rendez-vous dans votre espace client ou contactez notre service client pour toute modification."
      },
      {
        question: "Proposez-vous des remises pour les commandes multiples ?",
        answer: "Oui, nous offrons des remises dégressives pour les commandes multiples. Contactez-nous pour obtenir un devis personnalisé pour vos projets de groupe ou d'entreprise."
      },
      {
        question: "Comment vous contacter en cas de problème ?",
        answer: "Notre équipe de support est disponible via le formulaire de contact sur notre site, par email à contact@montchatsouvenir.com ou par téléphone aux horaires indiqués sur la page Contact."
      }
    ],
    en: [
      {
        question: "How does MonTchatSouvenir work?",
        answer: "Our service allows you to extract your WhatsApp, Messenger, or Instagram conversations and transform them into a personalized paper book or ebook. You import your conversation export file, customize the layout and cover, then place your order."
      },
      {
        question: "What conversation formats are accepted?",
        answer: "We accept WhatsApp exports (.txt or .zip), Facebook Messenger (.json), and Instagram Direct (.json). Detailed instructions for exporting your conversations are available in our extraction guide."
      },
      {
        question: "Is my data secure?",
        answer: "Absolutely. We place the highest importance on the confidentiality of your data. Your conversations are processed securely, never shared with third parties, and are deleted from our servers once your book is produced."
      },
      {
        question: "How long does it take to receive my book?",
        answer: "Delivery time depends on your location and the chosen format. Generally, allow 5-10 working days after order approval for delivery in West Africa, and 10-15 days for the rest of the world."
      },
      {
        question: "Can I include photos in my book?",
        answer: "Yes, you can incorporate photos shared in your conversations. During the customization step, you can select which types of media to include in your book."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept payments by credit card (Visa, Mastercard), mobile money (Orange Money, MTN Mobile Money, Wave), as well as PayPal for international orders."
      },
      {
        question: "Can I track my order?",
        answer: "Yes, you can track the status of your order at any time from your customer account. You will also receive email notifications at each stage of the production and shipping process."
      },
      {
        question: "How can I cancel or modify my order?",
        answer: "You can cancel or modify your order as long as it has not gone into production. Visit your customer account or contact our customer service for any modifications."
      },
      {
        question: "Do you offer discounts for multiple orders?",
        answer: "Yes, we offer progressive discounts for multiple orders. Contact us for a personalized quote for your group or company projects."
      },
      {
        question: "How can I contact you if there's a problem?",
        answer: "Our support team is available via the contact form on our website, by email at contact@montchatsouvenir.com, or by phone during the hours indicated on the Contact page."
      }
    ],
    es: [
      {
        question: "¿Cómo funciona MonTchatSouvenir?",
        answer: "Nuestro servicio le permite extraer sus conversaciones de WhatsApp, Messenger o Instagram y transformarlas en un libro físico personalizado o un ebook. Importa su archivo de exportación de conversación, personaliza el diseño y la portada, y luego realiza el pedido."
      },
      {
        question: "¿Qué formatos de conversación se aceptan?",
        answer: "Aceptamos exportaciones de WhatsApp (.txt o .zip), Facebook Messenger (.json) e Instagram Direct (.json). Instrucciones detalladas para exportar sus conversaciones están disponibles en nuestra guía de extracción."
      },
      {
        question: "¿Están mis datos seguros?",
        answer: "Absolutamente. Otorgamos la máxima importancia a la confidencialidad de sus datos. Sus conversaciones se procesan de manera segura, nunca se comparten con terceros y se eliminan de nuestros servidores una vez que se produce su libro."
      },
      {
        question: "¿Cuánto tiempo lleva recibir mi libro?",
        answer: "El tiempo de entrega depende de su ubicación y el formato elegido. En general, cuente con 5-10 días hábiles después de la aprobación del pedido para la entrega en África Occidental, y 10-15 días para el resto del mundo."
      },
      {
        question: "¿Puedo incluir fotos en mi libro?",
        answer: "Sí, puede incorporar fotos compartidas en sus conversaciones. Durante el paso de personalización, puede seleccionar qué tipos de medios incluir en su libro."
      },
      {
        question: "¿Qué métodos de pago aceptan?",
        answer: "Aceptamos pagos con tarjeta de crédito (Visa, Mastercard), dinero móvil (Orange Money, MTN Mobile Money, Wave), así como PayPal para pedidos internacionales."
      },
      {
        question: "¿Puedo hacer seguimiento de mi pedido?",
        answer: "Sí, puede seguir el estado de su pedido en cualquier momento desde su cuenta de cliente. También recibirá notificaciones por correo electrónico en cada etapa del proceso de producción y envío."
      },
      {
        question: "¿Cómo puedo cancelar o modificar mi pedido?",
        answer: "Puede cancelar o modificar su pedido siempre que no haya entrado en producción. Visite su cuenta de cliente o contacte a nuestro servicio de atención al cliente para cualquier modificación."
      },
      {
        question: "¿Ofrecen descuentos para pedidos múltiples?",
        answer: "Sí, ofrecemos descuentos progresivos para pedidos múltiples. Contáctenos para obtener un presupuesto personalizado para sus proyectos de grupo o empresa."
      },
      {
        question: "¿Cómo puedo contactarlos si hay un problema?",
        answer: "Nuestro equipo de soporte está disponible a través del formulario de contacto en nuestro sitio web, por correo electrónico a contact@montchatsouvenir.com, o por teléfono durante las horas indicadas en la página de Contacto."
      }
    ],
    ar: [
      {
        question: "كيف يعمل MonTchatSouvenir؟",
        answer: "تتيح لك خدمتنا استخراج محادثاتك من واتساب أو ماسنجر أو انستغرام وتحويلها إلى كتاب ورقي مخصص أو كتاب إلكتروني. تقوم باستيراد ملف تصدير المحادثة، وتخصيص التخطيط والغلاف، ثم تقوم بتقديم طلبك."
      },
      {
        question: "ما هي تنسيقات المحادثة المقبولة؟",
        answer: "نقبل تصديرات واتساب (.txt أو .zip)، فيسبوك ماسنجر (.json)، وانستغرام دايركت (.json). تتوفر تعليمات مفصلة لتصدير محادثاتك في دليل الاستخراج الخاص بنا."
      },
      {
        question: "هل بياناتي آمنة؟",
        answer: "بالتأكيد. نولي أهمية قصوى لسرية بياناتك. تتم معالجة محادثاتك بشكل آمن، ولا تتم مشاركتها أبدًا مع أطراف ثالثة، ويتم حذفها من خوادمنا بمجرد إنتاج كتابك."
      },
      {
        question: "كم من الوقت يستغرق استلام كتابي؟",
        answer: "يعتمد وقت التسليم على موقعك والتنسيق المختار. بشكل عام، احسب 5-10 أيام عمل بعد الموافقة على الطلب للتسليم في غرب إفريقيا، و 10-15 يومًا لبقية العالم."
      },
      {
        question: "هل يمكنني تضمين صور في كتابي؟",
        answer: "نعم، يمكنك دمج الصور المشتركة في محادثاتك. أثناء خطوة التخصيص، يمكنك تحديد أنواع الوسائط التي تريد تضمينها في كتابك."
      },
      {
        question: "ما هي طرق الدفع التي تقبلونها؟",
        answer: "نقبل الدفع ببطاقة الائتمان (فيزا، ماستركارد)، أو المال المتنقل (أورانج موني، إم تي إن موبايل موني، ويف)، وكذلك باي بال للطلبات الدولية."
      },
      {
        question: "هل يمكنني تتبع طلبي؟",
        answer: "نعم، يمكنك تتبع حالة طلبك في أي وقت من حساب العميل الخاص بك. ستتلقى أيضًا إشعارات عبر البريد الإلكتروني في كل مرحلة من مراحل الإنتاج والشحن."
      },
      {
        question: "كيف يمكنني إلغاء أو تعديل طلبي؟",
        answer: "يمكنك إلغاء أو تعديل طلبك طالما لم يدخل في الإنتاج. قم بزيارة حساب العميل الخاص بك أو اتصل بخدمة العملاء لدينا لإجراء أي تعديلات."
      },
      {
        question: "هل تقدمون خصومات للطلبات المتعددة؟",
        answer: "نعم، نقدم خصومات تدريجية للطلبات المتعددة. اتصل بنا للحصول على عرض أسعار مخصص لمشاريع مجموعتك أو شركتك."
      },
      {
        question: "كيف يمكنني الاتصال بكم إذا كانت هناك مشكلة؟",
        answer: "فريق الدعم لدينا متاح عبر نموذج الاتصال على موقعنا الإلكتروني، أو عبر البريد الإلكتروني على contact@montchatsouvenir.com، أو عبر الهاتف خلال الساعات المحددة في صفحة الاتصال."
      }
    ]
  };
  
  // Get FAQs for current language or fallback to French
  const faqs = faqData[language as keyof typeof faqData] || faqData.fr;

  // Translations for the page title and description
  const titles = {
    fr: {
      title: "Foire Aux Questions",
      description: "Trouvez des réponses aux questions les plus fréquemment posées sur notre service de création de livres souvenirs basés sur vos conversations."
    },
    en: {
      title: "Frequently Asked Questions",
      description: "Find answers to the most frequently asked questions about our service for creating memory books based on your conversations."
    },
    es: {
      title: "Preguntas Frecuentes",
      description: "Encuentra respuestas a las preguntas más frecuentes sobre nuestro servicio de creación de libros de recuerdos basados en tus conversaciones."
    },
    ar: {
      title: "الأسئلة المتكررة",
      description: "ابحث عن إجابات للأسئلة الأكثر شيوعًا حول خدمتنا لإنشاء كتب الذكريات بناءً على محادثاتك."
    }
  };
  
  // Get titles for current language
  const currentTitles = titles[language as keyof typeof titles] || titles.fr;

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-ts-indigo mb-8 text-center">{currentTitles.title}</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          {currentTitles.description}
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 py-2 border-gray-200">
                <AccordionTrigger className="text-lg font-medium text-ts-indigo hover:text-ts-gold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
