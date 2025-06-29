import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'bot', time: string}[]>([]);
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Assistant ChatBot",
      placeholder: "Posez votre question ici...",
      welcomeMessage: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      send: "Envoyer",
      faq: [
        {
          question: "Quelles sont vos offres ?",
          answer: "Nous proposons 3 formats :\n* Ebook à 8 000 F CFA\n* Classique (imprimé) à 15 000 F CFA\n* Medium (imprimé + couverture personnalisée + Ebook) à 25 000 F CFA."
        },
        {
          question: "Comment passer commande ?",
          answer: "Cliquez sur « Commander » sur notre page d'accueil, choisissez votre offre et suivez les étapes pour importer votre conversation."
        },
        {
          question: "Quels types de conversations puis-je utiliser ?",
          answer: "WhatsApp, Messenger, Instagram. Nous traitons uniquement les conversations privées (pas les groupes)."
        },
        {
          question: "Comment vous envoyer ma conversation ?",
          answer: "Nous vous guidons étape par étape pour exporter vos messages. Vous pourrez ensuite nous les envoyer via notre interface ou par e-mail sécurisé."
        },
        {
          question: "En quel format dois-je envoyer mes messages ?",
          answer: "En général, nous acceptons les formats .txt, .zip (export WhatsApp), ou .json (Messenger, Instagram)."
        },
        {
          question: "Combien de temps pour recevoir mon livre ?",
          answer: "Ebook : 24 à 48h par mail\nClassique/Medium : 7 à 10 jours ouvrés (selon la livraison locale)"
        },
        {
          question: "Quels sont les moyens de paiement acceptés ?",
          answer: "Mobile Money (Orange Money, Wave, Moov Money, Airtel), carte bancaire, ou virement."
        },
        {
          question: "Le paiement est-il sécurisé ?",
          answer: "Oui, toutes nos transactions sont sécurisées via des passerelles de paiement certifiées."
        },
        {
          question: "Mes données sont-elles protégées ?",
          answer: "Oui. Nous ne lisons ni ne diffusons vos conversations. Un accord de confidentialité est appliqué automatiquement."
        },
        {
          question: "Supprimez-vous mes fichiers après impression ?",
          answer: "Oui, tous les fichiers sont supprimés 7 jours après livraison."
        },
        {
          question: "Puis-je choisir la couverture de mon livre ?",
          answer: "Oui, pour l'offre Medium uniquement. Nous proposons plusieurs styles ou vous pouvez nous envoyer votre visuel."
        },
        {
          question: "Puis-je modifier le titre de mon livre ?",
          answer: "Bien sûr ! Vous choisissez le titre au moment de la commande."
        },
        {
          question: "Où livrez-vous ?",
          answer: "Pour l'instant, nous livrons au Sénégal, Gabon et Côte d'Ivoire. D'autres pays seront disponibles bientôt."
        },
        {
          question: "Puis-je suivre ma livraison ?",
          answer: "Oui, un lien de suivi vous sera envoyé dès que le livre est expédié."
        },
        {
          question: "J'ai un problème avec ma commande. Qui contacter ?",
          answer: "Écrivez-nous via le formulaire de contact ou directement par WhatsApp, nous répondons sous 24h."
        }
      ]
    },
    en: {
      title: "ChatBot Assistant",
      placeholder: "Ask your question here...",
      welcomeMessage: "Hello! How can I help you today?",
      send: "Send",
      faq: [
        {
          question: "What offers do you have?",
          answer: "We offer 3 formats:\n* Ebook at 8,000 F CFA\n* Classic (printed) at 15,000 F CFA\n* Medium (printed + custom cover + Ebook) at 25,000 F CFA."
        },
        {
          question: "How do I place an order?",
          answer: "Click on 'Order' on our homepage, choose your offer and follow the steps to import your conversation."
        },
        {
          question: "What types of conversations can I use?",
          answer: "WhatsApp, Messenger, Instagram. We only process private conversations (not groups)."
        },
        {
          question: "How do I send you my conversation?",
          answer: "We guide you step by step to export your messages. You can then send them to us via our interface or secure email."
        },
        {
          question: "In what format should I send my messages?",
          answer: "Generally, we accept .txt, .zip (WhatsApp export), or .json (Messenger, Instagram) formats."
        },
        {
          question: "How long does it take to receive my book?",
          answer: "Ebook: 24 to 48 hours by email\nClassic/Medium: 7 to 10 business days (depending on local delivery)"
        },
        {
          question: "What payment methods are accepted?",
          answer: "Mobile Money (Orange Money, Wave, Moov Money, Airtel), credit card, or bank transfer."
        },
        {
          question: "Is payment secure?",
          answer: "Yes, all our transactions are secured via certified payment gateways."
        },
        {
          question: "Is my data protected?",
          answer: "Yes. We do not read or share your conversations. A confidentiality agreement is automatically applied."
        },
        {
          question: "Do you delete my files after printing?",
          answer: "Yes, all files are deleted 7 days after delivery."
        },
        {
          question: "Can I choose the cover of my book?",
          answer: "Yes, for the Medium offer only. We offer several styles or you can send us your visual."
        },
        {
          question: "Can I modify the title of my book?",
          answer: "Of course! You choose the title at the time of ordering."
        },
        {
          question: "Where do you deliver?",
          answer: "For now, we deliver to Senegal, Gabon and Ivory Coast. Other countries will be available soon."
        },
        {
          question: "Can I track my delivery?",
          answer: "Yes, a tracking link will be sent to you once the book is shipped."
        },
        {
          question: "I have a problem with my order. Who do I contact?",
          answer: "Write to us via the contact form or directly by WhatsApp, we respond within 24 hours."
        }
      ]
    },
    es: {
      title: "Asistente ChatBot",
      placeholder: "Haga su pregunta aquí...",
      welcomeMessage: "¡Hola! ¿Cómo puedo ayudarte hoy?",
      send: "Enviar",
      faq: [
        {
          question: "¿Cómo creo mi libro de recuerdos?",
          answer: "Para crear tu libro de recuerdos, haz clic en 'Crear mi libro' en la página de inicio, luego sigue los pasos para importar tu conversación y personalizar tu libro."
        },
        {
          question: "¿Cuál es el tiempo de entrega?",
          answer: "Los tiempos de entrega son típicamente de 5-10 días hábiles para África Occidental y 10-15 días para el resto del mundo después de que tu pedido sea validado."
        },
        {
          question: "¿Cómo extraigo mi conversación de WhatsApp?",
          answer: "En WhatsApp, abre la conversación, toca los 3 puntos > Más > Exportar chat. Elige 'Sin medios' o 'Incluir medios' según tus preferencias."
        },
        {
          question: "Mi cuenta no está activada, ¿qué debo hacer?",
          answer: "Revisa tu bandeja de entrada y confirma tu dirección de correo electrónico a través del enlace de confirmación. Si no lo has recibido, revisa tu carpeta de spam o contacta a nuestro soporte."
        }
      ]
    },
    ar: {
      title: "مساعد الدردشة الآلي",
      placeholder: "اطرح سؤالك هنا...",
      welcomeMessage: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
      send: "إرسال",
      faq: [
        {
          question: "كيف أنشئ كتاب ذكرياتي؟",
          answer: "لإنشاء كتاب ذكرياتك، انقر على 'إنشاء كتابي' في الصفحة الرئيسية، ثم اتبع الخطوات لاستيراد محادثتك وتخصيص كتابك."
        },
        {
          question: "ما هو وقت التسليم؟",
          answer: "أوقات التسليم عادة 5-10 أيام عمل لغرب أفريقيا و10-15 يوما لبقية العالم بعد التحقق من طلبك."
        },
        {
          question: "كيف أستخرج محادثتي من واتساب?",
          answer: "في واتساب، افتح المحادثة، انقر على النقاط الثلاث > المزيد > تصدير الدردشة. اختر 'بدون وسائط' أو 'تضمين الوسائط' حسب تفضيلاتك."
        },
        {
          question: "حسابي غير مفعل، ماذا أفعل?",
          answer: "تحقق من صندوق الوارد الخاص بك وقم بتأكيد عنوان بريدك الإلكتروني عبر رابط التأكيد. إذا لم تستلمه، تحقق من مجلد البريد العشوائي أو اتصل بالدعم الفني."
        }
      ]
    }
  };

  const t = translations[language as keyof typeof translations] || translations.fr;

  const handleOpen = () => {
    if (!isOpen && chatMessages.length === 0) {
      // Add welcome message when opening chat for the first time
      const now = new Date();
      setChatMessages([
        {
          text: t.welcomeMessage,
          sender: 'bot',
          time: `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
        }
      ]);
    }
    setIsOpen(true);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Add user message
    const newMessages = [
      ...chatMessages,
      { text: message, sender: 'user' as const, time: timeString }
    ];
    
    setChatMessages(newMessages);
    setMessage('');
    
    // Find a potential answer in FAQ or provide default response
    setTimeout(() => {
      const userMessage = message.toLowerCase();
      const faqItem = t.faq.find(item => 
        userMessage.includes(item.question.toLowerCase()) || 
        userMessage.split(' ').some(word => 
          item.question.toLowerCase().includes(word) && word.length > 4
        )
      );
      
      let botResponse;
      if (faqItem) {
        botResponse = faqItem.answer;
      } else {
        // Default responses based on detected keywords
        if (userMessage.includes('livre') || userMessage.includes('book') || userMessage.includes('libro') || userMessage.includes('كتاب')) {
          botResponse = language === 'fr' ? "Pour créer votre livre, utilisez l'outil d'extraction dans le menu Créer un livre." :
                        language === 'en' ? "To create your book, use the extraction tool in the Create a Book menu." :
                        language === 'es' ? "Para crear tu libro, utiliza la herramienta de extracción en el menú Crear un libro." :
                        "لإنشاء كتابك، استخدم أداة الاستخراج في قائمة إنشاء كتاب.";
        } else if (userMessage.includes('prix') || userMessage.includes('price') || userMessage.includes('precio') || userMessage.includes('سعر')) {
          botResponse = language === 'fr' ? "Nos prix commencent à 8,000 FCFA pour l'édition numérique. Consultez notre page d'offres pour plus de détails." :
                        language === 'en' ? "Our prices start at 8,000 FCFA for the digital edition. Check our offers page for more details." :
                        language === 'es' ? "Nuestros precios comienzan en 8,000 FCFA para la edición digital. Consulta nuestra página de ofertas para más detalles." :
                        "تبدأ أسعارنا من 8000 فرنك للنسخة الرقمية. راجع صفحة العروض لمزيد من التفاصيل.";
        } else if (userMessage.includes('contact') || userMessage.includes('help') || userMessage.includes('ayuda') || userMessage.includes('مساعدة')) {
          botResponse = language === 'fr' ? "Vous pouvez nous contacter via le formulaire de contact ou par email à contact@montchatsouvenir.com" :
                        language === 'en' ? "You can contact us via the contact form or by email at contact@montchatsouvenir.com" :
                        language === 'es' ? "Puedes contactarnos a través del formulario de contacto o por correo electrónico a contact@montchatsouvenir.com" :
                        "يمكنك الاتصال بنا عبر نموذج الاتصال أو عبر البريد الإلكتروني على contact@montchatsouvenir.com";
        } else {
          botResponse = language === 'fr' ? "Je ne comprends pas complètement votre demande. Pourriez-vous reformuler ou consulter notre FAQ pour plus d'informations ?" :
                        language === 'en' ? "I don't fully understand your request. Could you rephrase or check our FAQ for more information?" :
                        language === 'es' ? "No entiendo completamente tu solicitud. ¿Podrías reformularla o consultar nuestras FAQ para más información?" :
                        "لا أفهم طلبك تمامًا. هل يمكنك إعادة صياغته أو مراجعة الأسئلة الشائعة لدينا لمزيد من المعلومات؟";
        }
      }
      
      setChatMessages([
        ...newMessages,
        { text: botResponse, sender: 'bot', time: timeString }
      ]);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="h-14 w-14 rounded-full shadow-lg bg-ts-indigo hover:bg-ts-indigo/90"
            onClick={handleOpen}
          >
            <MessageCircle size={24} className="text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-[400px] p-0 flex flex-col h-[80vh] md:h-[600px] rounded-t-xl">
          <SheetHeader className="bg-ts-indigo text-white p-4 rounded-t-xl">
            <SheetTitle className="text-white flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-white">
                <img src="/covers/logo.jpeg" alt="Logo" className="object-cover" />
              </Avatar>
              {t.title}
            </SheetTitle>
          </SheetHeader>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="flex flex-col gap-3">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? 'bg-ts-indigo text-white rounded-br-none' 
                        : 'bg-white shadow-sm rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-gray-200' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input 
                placeholder={t.placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
            
            {/* Quick questions */}
            {chatMessages.length <= 2 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {t.faq.map((item, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="text-xs h-auto py-2 text-left justify-start"
                    onClick={() => {
                      setMessage(item.question);
                      handleSendMessage();
                    }}
                  >
                    {item.question}
                  </Button>
                )).slice(0, 4)}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatbotButton;
