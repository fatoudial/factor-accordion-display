
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const TermsOfService = () => {
  const { language } = useLanguage();
  
  const termsContent = {
    fr: {
      title: "Conditions d'Utilisation",
      lastUpdated: "Dernière mise à jour",
      date: "3 mai 2025",
      welcome: {
        title: "Bienvenue sur MonTchatSouvenir",
        content: "Merci d'utiliser notre plateforme ! Ces conditions d'utilisation régissent votre utilisation de MonTchatSouvenir, accessibles via www.montchatsouvenir.com. En accédant à ce site, vous acceptez ces conditions. Veuillez les lire attentivement."
      },
      sections: [
        {
          title: "1. Acceptation des conditions",
          content: "En utilisant notre service, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service. Ces conditions s'appliquent à tous les visiteurs, utilisateurs et autres personnes qui accèdent ou utilisent le Service."
        },
        {
          title: "2. Utilisation du service",
          content: "Notre service vous permet de créer des livres physiques ou numériques à partir de vos conversations. Vous êtes responsable de maintenir la confidentialité de votre compte et de votre mot de passe. Vous acceptez de ne pas partager vos informations d'identification avec des tiers. Vous devez nous informer immédiatement en cas d'utilisation non autorisée de votre compte."
        },
        {
          title: "3. Contenu utilisateur",
          content: "Lorsque vous téléchargez du contenu sur notre plateforme, vous conservez tous les droits de propriété sur ce contenu. Cependant, vous nous accordez une licence mondiale, non exclusive, gratuite, pour utiliser, reproduire, adapter et publier ce contenu uniquement dans le but de vous fournir notre service. Vous déclarez et garantissez que vous avez tous les droits, pouvoirs et autorité nécessaires pour accorder les droits accordés dans le présent document pour tout contenu que vous téléchargez."
        },
        {
          title: "4. Limitation de responsabilité",
          content: "MonTchatSouvenir ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, y compris la perte de profits, de données, ou autres dommages intangibles résultant de (a) votre utilisation ou incapacité à utiliser le service; (b) un accès non autorisé ou une altération de vos transmissions ou données; ou (c) toute autre question relative au service."
        },
        {
          title: "5. Commandes et livraisons",
          content: "Nous nous engageons à produire et livrer votre commande dans les délais indiqués lors de l'achat. Les délais de livraison peuvent varier en fonction de votre localisation. En cas de retard important, nous nous engageons à vous en informer. Des frais de livraison s'appliquent selon votre localisation et le type de produit commandé."
        },
        {
          title: "6. Politique de remboursement",
          content: "Si vous n'êtes pas satisfait de votre livre pour des raisons de qualité d'impression ou d'erreurs dans la production, contactez-nous dans les 14 jours suivant la réception pour un remboursement ou un remplacement. Nous ne pouvons pas offrir de remboursement pour des erreurs dans le contenu que vous avez fourni ou approuvé lors du processus de création."
        },
        {
          title: "7. Confidentialité des données",
          content: "Vos conversations et données personnelles sont traitées conformément à notre Politique de Confidentialité. Nous prenons très au sérieux la sécurité de vos données et mettons en place des mesures techniques appropriées pour les protéger."
        },
        {
          title: "8. Droits d'auteur et propriété intellectuelle",
          content: "Le service et son contenu original, fonctionnalités et fonctionnalités sont et resteront la propriété exclusive de MonTchatSouvenir. Le service est protégé par le droit d'auteur, les marques de commerce et d'autres lois. Nos marques et notre habillage commercial ne peuvent pas être utilisés en relation avec un produit ou service sans notre consentement écrit préalable."
        },
        {
          title: "9. Modifications des conditions",
          content: "Nous nous réservons le droit, à notre seule discrétion, de modifier ou remplacer ces conditions à tout moment. Si une révision est importante, nous nous efforcerons de fournir un préavis d'au moins 15 jours avant l'entrée en vigueur des nouvelles conditions. Il est de votre responsabilité de consulter nos conditions périodiquement pour les modifications."
        },
        {
          title: "10. Résiliation",
          content: "Nous pouvons résilier ou suspendre l'accès à notre service immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans limitation, si vous violez les conditions. Toutes les dispositions des conditions qui, par leur nature, devraient survivre à la résiliation survivront à la résiliation, y compris, sans limitation, les dispositions de propriété, les clauses de non-responsabilité, l'indemnité et les limitations de responsabilité."
        },
        {
          title: "11. Droit applicable",
          content: "Ces conditions seront régies et interprétées conformément aux lois du Sénégal, sans égard aux dispositions relatives aux conflits de lois. Notre incapacité à faire respecter un droit ou une disposition de ces conditions ne sera pas considérée comme une renonciation à ces droits."
        },
        {
          title: "12. Nous contacter",
          content: "Si vous avez des questions concernant ces conditions, veuillez nous contacter à contact@montchatsouvenir.com ou à notre adresse à Dakar, Sénégal."
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated",
      date: "May 3, 2025",
      welcome: {
        title: "Welcome to MonTchatSouvenir",
        content: "Thank you for using our platform! These terms of service govern your use of MonTchatSouvenir, accessible via www.montchatsouvenir.com. By accessing this website, you accept these terms. Please read them carefully."
      },
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By using our service, you agree to be bound by these terms. If you do not agree to these terms, please do not use our service. These terms apply to all visitors, users, and others who access or use the Service."
        },
        {
          title: "2. Use of Service",
          content: "Our service allows you to create physical or digital books from your conversations. You are responsible for maintaining the confidentiality of your account and password. You agree not to share your credentials with third parties. You must notify us immediately of any unauthorized use of your account."
        },
        {
          title: "3. User Content",
          content: "When you upload content to our platform, you retain all ownership rights to that content. However, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, and publish this content solely for the purpose of providing our service to you. You represent and warrant that you have all rights, power, and authority necessary to grant the rights granted herein to any content that you upload."
        },
        {
          title: "4. Limitation of Liability",
          content: "MonTchatSouvenir will not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses resulting from (a) your use or inability to use the service; (b) unauthorized access to or alteration of your transmissions or data; or (c) any other matter relating to the service."
        },
        {
          title: "5. Orders and Deliveries",
          content: "We commit to producing and delivering your order within the timeframes indicated at purchase. Delivery times may vary depending on your location. In case of significant delay, we commit to informing you. Delivery charges apply based on your location and the type of product ordered."
        },
        {
          title: "6. Refund Policy",
          content: "If you are not satisfied with your book due to printing quality issues or errors in production, contact us within 14 days of receipt for a refund or replacement. We cannot offer refunds for errors in content that you provided or approved during the creation process."
        },
        {
          title: "7. Data Privacy",
          content: "Your conversations and personal data are processed in accordance with our Privacy Policy. We take the security of your data very seriously and implement appropriate technical measures to protect it."
        },
        {
          title: "8. Copyright and Intellectual Property",
          content: "The service and its original content, features, and functionality are and will remain the exclusive property of MonTchatSouvenir. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent."
        },
        {
          title: "9. Changes to Terms",
          content: "We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material, we will try to provide at least 15 days' notice before the new terms take effect. It is your responsibility to review our terms periodically for changes."
        },
        {
          title: "10. Termination",
          content: "We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the terms. All provisions of the terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability."
        },
        {
          title: "11. Governing Law",
          content: "These terms shall be governed and construed in accordance with the laws of Senegal, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these terms will not be considered a waiver of those rights."
        },
        {
          title: "12. Contact Us",
          content: "If you have any questions about these terms, please contact us at contact@montchatsouvenir.com or at our address in Dakar, Senegal."
        }
      ]
    },
    es: {
      title: "Términos de Servicio",
      lastUpdated: "Última actualización",
      date: "3 de mayo de 2025",
      welcome: {
        title: "Bienvenido a MonTchatSouvenir",
        content: "¡Gracias por utilizar nuestra plataforma! Estos términos de servicio rigen su uso de MonTchatSouvenir, accesible a través de www.montchatsouvenir.com. Al acceder a este sitio web, acepta estos términos. Por favor léalos cuidadosamente."
      },
      sections: [
        {
          title: "1. Aceptación de los Términos",
          content: "Al utilizar nuestro servicio, acepta estar sujeto a estos términos. Si no está de acuerdo con estos términos, por favor no utilice nuestro servicio. Estos términos se aplican a todos los visitantes, usuarios y otras personas que accedan o utilicen el Servicio."
        },
        {
          title: "2. Uso del Servicio",
          content: "Nuestro servicio le permite crear libros físicos o digitales a partir de sus conversaciones. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Acepta no compartir sus credenciales con terceros. Debe notificarnos inmediatamente de cualquier uso no autorizado de su cuenta."
        },
        {
          title: "3. Contenido del Usuario",
          content: "Cuando sube contenido a nuestra plataforma, conserva todos los derechos de propiedad sobre ese contenido. Sin embargo, nos otorga una licencia mundial, no exclusiva, libre de regalías para usar, reproducir, adaptar y publicar este contenido únicamente con el propósito de proporcionarle nuestro servicio. Usted declara y garantiza que tiene todos los derechos, poderes y autoridad necesarios para otorgar los derechos aquí concedidos a cualquier contenido que cargue."
        },
        {
          title: "4. Limitación de Responsabilidad",
          content: "MonTchatSouvenir no será responsable por ningún daño indirecto, incidental, especial, consecuente o punitivo, incluida la pérdida de beneficios, datos u otras pérdidas intangibles resultantes de (a) su uso o imposibilidad de usar el servicio; (b) acceso no autorizado o alteración de sus transmisiones o datos; o (c) cualquier otro asunto relacionado con el servicio."
        },
        {
          title: "5. Pedidos y Entregas",
          content: "Nos comprometemos a producir y entregar su pedido dentro de los plazos indicados en el momento de la compra. Los tiempos de entrega pueden variar según su ubicación. En caso de un retraso significativo, nos comprometemos a informarle. Se aplican gastos de envío según su ubicación y el tipo de producto solicitado."
        },
        {
          title: "6. Política de Reembolso",
          content: "Si no está satisfecho con su libro debido a problemas de calidad de impresión o errores en la producción, contáctenos dentro de los 14 días posteriores a la recepción para un reembolso o reemplazo. No podemos ofrecer reembolsos por errores en el contenido que proporcionó o aprobó durante el proceso de creación."
        },
        {
          title: "7. Privacidad de Datos",
          content: "Sus conversaciones y datos personales se procesan de acuerdo con nuestra Política de Privacidad. Nos tomamos muy en serio la seguridad de sus datos e implementamos medidas técnicas apropiadas para protegerlos."
        },
        {
          title: "8. Derechos de Autor y Propiedad Intelectual",
          content: "El servicio y su contenido original, características y funcionalidades son y seguirán siendo propiedad exclusiva de MonTchatSouvenir. El servicio está protegido por derechos de autor, marcas comerciales y otras leyes. Nuestras marcas comerciales y presentación comercial no pueden ser utilizadas en relación con ningún producto o servicio sin nuestro consentimiento previo por escrito."
        },
        {
          title: "9. Cambios en los Términos",
          content: "Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos términos en cualquier momento. Si una revisión es importante, intentaremos proporcionar al menos 15 días de aviso antes de que los nuevos términos entren en vigor. Es su responsabilidad revisar nuestros términos periódicamente para detectar cambios."
        },
        {
          title: "10. Terminación",
          content: "Podemos terminar o suspender el acceso a nuestro servicio inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo, incluyendo, sin limitación, si incumple los términos. Todas las disposiciones de los términos que por su naturaleza deberían sobrevivir a la terminación sobrevivirán a la terminación, incluyendo, sin limitación, disposiciones de propiedad, renuncias de garantía, indemnización y limitaciones de responsabilidad."
        },
        {
          title: "11. Ley Aplicable",
          content: "Estos términos se regirán e interpretarán de acuerdo con las leyes de Senegal, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Nuestra falta de aplicación de cualquier derecho o disposición de estos términos no se considerará una renuncia a esos derechos."
        },
        {
          title: "12. Contáctenos",
          content: "Si tiene alguna pregunta sobre estos términos, contáctenos en contact@montchatsouvenir.com o en nuestra dirección en Dakar, Senegal."
        }
      ]
    },
    ar: {
      title: "شروط الخدمة",
      lastUpdated: "آخر تحديث",
      date: "3 مايو 2025",
      welcome: {
        title: "مرحبًا بك في MonTchatSouvenir",
        content: "شكرًا لاستخدام منصتنا! تحكم شروط الخدمة هذه استخدامك لـ MonTchatSouvenir، المتاح عبر www.montchatsouvenir.com. بالوصول إلى هذا الموقع، فإنك تقبل هذه الشروط. يرجى قراءتها بعناية."
      },
      sections: [
        {
          title: "1. قبول الشروط",
          content: "باستخدام خدمتنا، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق على هذه الشروط، فيرجى عدم استخدام خدمتنا. تنطبق هذه الشروط على جميع الزوار والمستخدمين وغيرهم ممن يصلون أو يستخدمون الخدمة."
        },
        {
          title: "2. استخدام الخدمة",
          content: "تتيح لك خدمتنا إنشاء كتب مادية أو رقمية من محادثاتك. أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. توافق على عدم مشاركة بيانات اعتمادك مع أطراف ثالثة. يجب عليك إخطارنا فورًا بأي استخدام غير مصرح به لحسابك."
        },
        {
          title: "3. محتوى المستخدم",
          content: "عندما تقوم بتحميل محتوى إلى منصتنا، فإنك تحتفظ بجميع حقوق الملكية لذلك المحتوى. ومع ذلك، فإنك تمنحنا ترخيصًا عالميًا، غير حصري، خالي من حقوق الملكية لاستخدام ونسخ وتكييف ونشر هذا المحتوى فقط لغرض تقديم خدمتنا لك. أنت تقر وتضمن أن لديك جميع الحقوق والسلطات والصلاحيات اللازمة لمنح الحقوق الممنوحة هنا لأي محتوى تقوم بتحميله."
        },
        {
          title: "4. تحديد المسؤولية",
          content: "لن يكون MonTchatSouvenir مسؤولاً عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية، بما في ذلك فقدان الأرباح أو البيانات أو الخسائر غير الملموسة الأخرى الناجمة عن (أ) استخدامك أو عدم قدرتك على استخدام الخدمة؛ (ب) الوصول غير المصرح به أو تغيير إرسالاتك أو بياناتك؛ أو (ج) أي مسألة أخرى تتعلق بالخدمة."
        },
        {
          title: "5. الطلبات والتسليم",
          content: "نلتزم بإنتاج وتسليم طلبك ضمن الأطر الزمنية المحددة عند الشراء. قد تختلف أوقات التسليم حسب موقعك. في حالة حدوث تأخير كبير، نلتزم بإبلاغك. تنطبق رسوم التوصيل بناءً على موقعك ونوع المنتج المطلوب."
        },
        {
          title: "6. سياسة الاسترداد",
          content: "إذا لم تكن راضيًا عن كتابك بسبب مشاكل في جودة الطباعة أو أخطاء في الإنتاج، اتصل بنا في غضون 14 يومًا من الاستلام للحصول على استرداد أو استبدال. لا يمكننا تقديم استردادات للأخطاء في المحتوى الذي قدمته أو وافقت عليه أثناء عملية الإنشاء."
        },
        {
          title: "7. خصوصية البيانات",
          content: "تتم معالجة محادثاتك وبياناتك الشخصية وفقًا لسياسة الخصوصية الخاصة بنا. نأخذ أمن بياناتك على محمل الجد ونقوم بتنفيذ التدابير الفنية المناسبة لحمايتها."
        },
        {
          title: "8. حقوق النشر والملكية الفكرية",
          content: "الخدمة ومحتواها الأصلي وميزاتها ووظائفها هي وستظل الملكية الحصرية لـ MonTchatSouvenir. الخدمة محمية بموجب حقوق النشر والعلامات التجارية والقوانين الأخرى. لا يجوز استخدام علاماتنا التجارية وهويتنا التجارية فيما يتعلق بأي منتج أو خدمة دون موافقتنا الكتابية المسبقة."
        },
        {
          title: "9. التغييرات في الشروط",
          content: "نحتفظ بالحق، وفقًا لتقديرنا الخاص، في تعديل أو استبدال هذه الشروط في أي وقت. إذا كانت المراجعة جوهرية، فسنحاول تقديم إشعار قبل 15 يومًا على الأقل من دخول الشروط الجديدة حيز التنفيذ. من مسؤوليتك مراجعة شروطنا بشكل دوري للتغييرات."
        },
        {
          title: "10. الإنهاء",
          content: "يجوز لنا إنهاء أو تعليق الوصول إلى خدمتنا على الفور، دون إشعار مسبق أو مسؤولية، لأي سبب من الأسباب، بما في ذلك، على سبيل المثال لا الحصر، إذا انتهكت الشروط. جميع أحكام الشروط التي يجب أن تبقى بطبيعتها بعد الإنهاء ستبقى بعد الإنهاء، بما في ذلك، على سبيل المثال لا الحصر، أحكام الملكية وإخلاء المسؤولية عن الضمانات والتعويضات وحدود المسؤولية."
        },
        {
          title: "11. القانون الحاكم",
          content: "تخضع هذه الشروط وتفسر وفقًا لقوانين السنغال، دون مراعاة أحكام تعارض القوانين الخاصة بها. لن يعتبر فشلنا في إنفاذ أي حق أو حكم من هذه الشروط تنازلاً عن تلك الحقوق."
        },
        {
          title: "12. اتصل بنا",
          content: "إذا كانت لديك أي أسئلة حول هذه الشروط، فيرجى الاتصال بنا على contact@montchatsouvenir.com أو في عنواننا في داكار، السنغال."
        }
      ]
    }
  };
  
  // Get content for current language or fallback to French
  const content = termsContent[language as keyof typeof termsContent] || termsContent.fr;
  
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-ts-indigo mb-8 text-center">{content.title}</h1>
        
        <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-ts-indigo prose-headings:font-serif">
          <p className="text-gray-600 mb-8">
            {content.lastUpdated}: {content.date}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl">{content.welcome.title}</h2>
            <p>{content.welcome.content}</p>
          </section>
          
          {content.sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-xl font-medium">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
