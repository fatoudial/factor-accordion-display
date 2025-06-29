
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  
  const policyContent = {
    fr: {
      title: "Politique de Confidentialité",
      lastUpdated: "Dernière mise à jour",
      date: "3 mai 2025",
      introduction: {
        title: "1. Introduction",
        content: "MonTchatSouvenir (\"nous\", \"notre\", \"nos\") s'engage à protéger votre vie privée. Cette Politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web et nos services."
      },
      dataCollection: {
        title: "2. Informations que nous collectons",
        personalInfo: {
          title: "2.1 Informations personnelles",
          intro: "Nous pouvons collecter les informations personnelles suivantes :",
          items: [
            "Nom et prénom",
            "Adresse e-mail",
            "Adresse postale pour la livraison",
            "Numéro de téléphone",
            "Informations de paiement",
            "Contenu de vos conversations importées"
          ]
        },
        usageData: {
          title: "2.2 Données d'utilisation",
          intro: "Nous collectons également des informations sur la façon dont vous accédez et utilisez notre service, notamment :",
          items: [
            "Votre adresse IP",
            "Type de navigateur et version",
            "Pages visitées et temps passé",
            "Horodatage des visites",
            "Parcours de navigation sur le site"
          ]
        }
      },
      dataUse: {
        title: "3. Utilisation de vos informations",
        intro: "Nous utilisons vos informations personnelles pour :",
        items: [
          "Fournir et maintenir notre service",
          "Traiter et livrer vos commandes",
          "Vous informer des changements dans nos services",
          "Vous permettre de participer aux fonctionnalités interactives",
          "Fournir une assistance client",
          "Analyser l'utilisation pour améliorer nos services"
        ]
      },
      conversationsProcessing: {
        title: "4. Traitement des conversations",
        intro: "Les conversations que vous importez sur notre plateforme sont utilisées uniquement pour créer votre livre souvenir personnalisé. Nous appliquons les principes suivants :",
        items: [
          "Ces données sont stockées de manière sécurisée et cryptée",
          "Elles ne sont jamais partagées avec des tiers à des fins commerciales",
          "Elles sont automatiquement supprimées de nos serveurs 30 jours après la finalisation de votre commande",
          "Notre personnel n'a accès à ces données que dans la mesure nécessaire pour traiter votre commande"
        ]
      },
      dataRetention: {
        title: "5. Conservation des données",
        content: "Nous conservons vos informations personnelles aussi longtemps que nécessaire pour les finalités décrites dans cette politique, sauf si une période de conservation plus longue est requise ou permise par la loi."
      },
      dataSecurity: {
        title: "6. Sécurité des données",
        content: "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données contre l'accès, l'altération, la divulgation ou la destruction non autorisés. Ces mesures incluent le chiffrement des données, les pare-feu et les contrôles d'accès physiques à nos centres de données."
      },
      userRights: {
        title: "7. Vos droits",
        intro: "Vous disposez des droits suivants concernant vos données personnelles :",
        items: [
          "Droit d'accès à vos données",
          "Droit de rectification",
          "Droit à l'effacement",
          "Droit à la limitation du traitement",
          "Droit d'opposition au traitement",
          "Droit à la portabilité des données"
        ]
      },
      policyChanges: {
        title: "8. Modifications de la politique de confidentialité",
        content: "Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page et en vous envoyant un e-mail si les modifications sont substantielles."
      },
      contact: {
        title: "9. Contact",
        intro: "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :",
        email: "Email : contact@montchatsouvenir.com",
        address: "Adresse : Dakar, Sénégal"
      }
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated",
      date: "May 3, 2025",
      introduction: {
        title: "1. Introduction",
        content: "MonTchatSouvenir (\"we\", \"our\", \"us\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services."
      },
      dataCollection: {
        title: "2. Information We Collect",
        personalInfo: {
          title: "2.1 Personal Information",
          intro: "We may collect the following personal information:",
          items: [
            "First and last name",
            "Email address",
            "Shipping address",
            "Phone number",
            "Payment information",
            "Content of your imported conversations"
          ]
        },
        usageData: {
          title: "2.2 Usage Data",
          intro: "We also collect information about how you access and use our service, including:",
          items: [
            "Your IP address",
            "Browser type and version",
            "Pages visited and time spent",
            "Timestamp of visits",
            "Navigation path through the site"
          ]
        }
      },
      dataUse: {
        title: "3. Use of Your Information",
        intro: "We use your personal information to:",
        items: [
          "Provide and maintain our service",
          "Process and deliver your orders",
          "Inform you about changes to our services",
          "Allow you to participate in interactive features",
          "Provide customer support",
          "Analyze usage to improve our services"
        ]
      },
      conversationsProcessing: {
        title: "4. Processing of Conversations",
        intro: "The conversations you import to our platform are used solely to create your personalized memory book. We apply the following principles:",
        items: [
          "This data is stored securely and encrypted",
          "It is never shared with third parties for commercial purposes",
          "It is automatically deleted from our servers 30 days after your order is finalized",
          "Our staff only has access to this data to the extent necessary to process your order"
        ]
      },
      dataRetention: {
        title: "5. Data Retention",
        content: "We retain your personal information for as long as necessary for the purposes described in this policy, unless a longer retention period is required or permitted by law."
      },
      dataSecurity: {
        title: "6. Data Security",
        content: "We implement appropriate security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. These measures include data encryption, firewalls, and physical access controls to our data centers."
      },
      userRights: {
        title: "7. Your Rights",
        intro: "You have the following rights regarding your personal data:",
        items: [
          "Right to access your data",
          "Right to rectification",
          "Right to erasure",
          "Right to restriction of processing",
          "Right to object to processing",
          "Right to data portability"
        ]
      },
      policyChanges: {
        title: "8. Changes to the Privacy Policy",
        content: "We may update our privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and sending you an email if the changes are substantial."
      },
      contact: {
        title: "9. Contact",
        intro: "If you have any questions about this privacy policy, please contact us at:",
        email: "Email: contact@montchatsouvenir.com",
        address: "Address: Dakar, Senegal"
      }
    },
    es: {
      title: "Política de Privacidad",
      lastUpdated: "Última actualización",
      date: "3 de mayo de 2025",
      introduction: {
        title: "1. Introducción",
        content: "MonTchatSouvenir (\"nosotros\", \"nuestro\", \"nuestros\") se compromete a proteger su privacidad. Esta Política de privacidad explica cómo recopilamos, utilizamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios."
      },
      dataCollection: {
        title: "2. Información que recopilamos",
        personalInfo: {
          title: "2.1 Información personal",
          intro: "Podemos recopilar la siguiente información personal:",
          items: [
            "Nombre y apellido",
            "Dirección de correo electrónico",
            "Dirección postal para la entrega",
            "Número de teléfono",
            "Información de pago",
            "Contenido de sus conversaciones importadas"
          ]
        },
        usageData: {
          title: "2.2 Datos de uso",
          intro: "También recopilamos información sobre cómo accede y utiliza nuestro servicio, incluyendo:",
          items: [
            "Su dirección IP",
            "Tipo y versión del navegador",
            "Páginas visitadas y tiempo empleado",
            "Fecha y hora de las visitas",
            "Ruta de navegación por el sitio"
          ]
        }
      },
      dataUse: {
        title: "3. Uso de su información",
        intro: "Utilizamos su información personal para:",
        items: [
          "Proporcionar y mantener nuestro servicio",
          "Procesar y entregar sus pedidos",
          "Informarle sobre cambios en nuestros servicios",
          "Permitirle participar en funciones interactivas",
          "Proporcionar atención al cliente",
          "Analizar el uso para mejorar nuestros servicios"
        ]
      },
      conversationsProcessing: {
        title: "4. Procesamiento de conversaciones",
        intro: "Las conversaciones que importa a nuestra plataforma se utilizan únicamente para crear su libro de recuerdos personalizado. Aplicamos los siguientes principios:",
        items: [
          "Estos datos se almacenan de forma segura y cifrada",
          "Nunca se comparten con terceros con fines comerciales",
          "Se eliminan automáticamente de nuestros servidores 30 días después de la finalización de su pedido",
          "Nuestro personal solo tiene acceso a estos datos en la medida necesaria para procesar su pedido"
        ]
      },
      dataRetention: {
        title: "5. Conservación de datos",
        content: "Conservamos su información personal durante el tiempo necesario para los fines descritos en esta política, a menos que sea requerido o permitido por la ley un período de conservación más largo."
      },
      dataSecurity: {
        title: "6. Seguridad de datos",
        content: "Implementamos medidas de seguridad apropiadas para proteger sus datos contra el acceso, alteración, divulgación o destrucción no autorizados. Estas medidas incluyen cifrado de datos, firewalls y controles de acceso físico a nuestros centros de datos."
      },
      userRights: {
        title: "7. Sus derechos",
        intro: "Tiene los siguientes derechos respecto a sus datos personales:",
        items: [
          "Derecho de acceso a sus datos",
          "Derecho de rectificación",
          "Derecho de supresión",
          "Derecho a la limitación del tratamiento",
          "Derecho de oposición al tratamiento",
          "Derecho a la portabilidad de los datos"
        ]
      },
      policyChanges: {
        title: "8. Cambios en la política de privacidad",
        content: "Podemos actualizar nuestra política de privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva política en esta página y enviándole un correo electrónico si los cambios son sustanciales."
      },
      contact: {
        title: "9. Contacto",
        intro: "Si tiene alguna pregunta sobre esta política de privacidad, por favor contáctenos en:",
        email: "Correo electrónico: contact@montchatsouvenir.com",
        address: "Dirección: Dakar, Senegal"
      }
    },
    ar: {
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث",
      date: "3 مايو 2025",
      introduction: {
        title: "1. مقدمة",
        content: "تلتزم MonTchatSouvenir (\"نحن\"، \"لدينا\") بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام موقعنا الإلكتروني وخدماتنا."
      },
      dataCollection: {
        title: "2. المعلومات التي نجمعها",
        personalInfo: {
          title: "2.1 المعلومات الشخصية",
          intro: "قد نقوم بجمع المعلومات الشخصية التالية:",
          items: [
            "الاسم الأول واسم العائلة",
            "عنوان البريد الإلكتروني",
            "عنوان الشحن",
            "رقم الهاتف",
            "معلومات الدفع",
            "محتوى محادثاتك المستوردة"
          ]
        },
        usageData: {
          title: "2.2 بيانات الاستخدام",
          intro: "نقوم أيضًا بجمع معلومات حول كيفية وصولك واستخدامك لخدمتنا، بما في ذلك:",
          items: [
            "عنوان IP الخاص بك",
            "نوع وإصدار المتصفح",
            "الصفحات التي تمت زيارتها والوقت المستغرق",
            "توقيت الزيارات",
            "مسار التصفح عبر الموقع"
          ]
        }
      },
      dataUse: {
        title: "3. استخدام معلوماتك",
        intro: "نستخدم معلوماتك الشخصية من أجل:",
        items: [
          "توفير وصيانة خدمتنا",
          "معالجة وتسليم طلباتك",
          "إبلاغك بالتغييرات في خدماتنا",
          "السماح لك بالمشاركة في الميزات التفاعلية",
          "تقديم دعم العملاء",
          "تحليل الاستخدام لتحسين خدماتنا"
        ]
      },
      conversationsProcessing: {
        title: "4. معالجة المحادثات",
        intro: "يتم استخدام المحادثات التي تستوردها إلى منصتنا فقط لإنشاء كتاب الذكريات المخصص الخاص بك. نطبق المبادئ التالية:",
        items: [
          "يتم تخزين هذه البيانات بشكل آمن ومشفر",
          "لا يتم مشاركتها أبدًا مع أطراف ثالثة لأغراض تجارية",
          "يتم حذفها تلقائيًا من خوادمنا بعد 30 يومًا من الانتهاء من طلبك",
          "موظفونا لديهم فقط حق الوصول إلى هذه البيانات بالقدر الضروري لمعالجة طلبك"
        ]
      },
      dataRetention: {
        title: "5. الاحتفاظ بالبيانات",
        content: "نحتفظ بمعلوماتك الشخصية طالما كان ذلك ضروريًا للأغراض الموضحة في هذه السياسة، ما لم تكن هناك فترة احتفاظ أطول مطلوبة أو مسموح بها بموجب القانون."
      },
      dataSecurity: {
        title: "6. أمان البيانات",
        content: "نقوم بتنفيذ تدابير أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التغيير أو الإفصاح أو التدمير. تشمل هذه التدابير تشفير البيانات وجدران الحماية وضوابط الوصول المادي إلى مراكز البيانات الخاصة بنا."
      },
      userRights: {
        title: "7. حقوقك",
        intro: "لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:",
        items: [
          "الحق في الوصول إلى بياناتك",
          "الحق في التصحيح",
          "الحق في المحو",
          "الحق في تقييد المعالجة",
          "الحق في الاعتراض على المعالجة",
          "الحق في نقل البيانات"
        ]
      },
      policyChanges: {
        title: "8. التغييرات في سياسة الخصوصية",
        content: "قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات عن طريق نشر السياسة الجديدة على هذه الصفحة وإرسال بريد إلكتروني إليك إذا كانت التغييرات جوهرية."
      },
      contact: {
        title: "9. اتصل بنا",
        intro: "إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، فيرجى الاتصال بنا على:",
        email: "البريد الإلكتروني: contact@montchatsouvenir.com",
        address: "العنوان: داكار، السنغال"
      }
    }
  };
  
  // Get content for current language or fallback to French
  const content = policyContent[language as keyof typeof policyContent] || policyContent.fr;
  
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-ts-indigo mb-8 text-center">{content.title}</h1>
        
        <div className="max-w-3xl mx-auto prose prose-lg prose-headings:text-ts-indigo prose-headings:font-serif">
          <p className="text-gray-600 mb-8">
            {content.lastUpdated}: {content.date}
          </p>
          
          <h2>{content.introduction.title}</h2>
          <p>{content.introduction.content}</p>
          
          <h2>{content.dataCollection.title}</h2>
          <h3>{content.dataCollection.personalInfo.title}</h3>
          <p>{content.dataCollection.personalInfo.intro}</p>
          <ul>
            {content.dataCollection.personalInfo.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h3>{content.dataCollection.usageData.title}</h3>
          <p>{content.dataCollection.usageData.intro}</p>
          <ul>
            {content.dataCollection.usageData.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2>{content.dataUse.title}</h2>
          <ul>
            {content.dataUse.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2>{content.conversationsProcessing.title}</h2>
          <p>{content.conversationsProcessing.intro}</p>
          <ul>
            {content.conversationsProcessing.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2>{content.dataRetention.title}</h2>
          <p>{content.dataRetention.content}</p>
          
          <h2>{content.dataSecurity.title}</h2>
          <p>{content.dataSecurity.content}</p>
          
          <h2>{content.userRights.title}</h2>
          <p>{content.userRights.intro}</p>
          <ul>
            {content.userRights.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
          <h2>{content.policyChanges.title}</h2>
          <p>{content.policyChanges.content}</p>
          
          <h2>{content.contact.title}</h2>
          <p>{content.contact.intro}</p>
          <p>{content.contact.email}<br />{content.contact.address}</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
