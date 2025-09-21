import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations = {
  ar: {
    // Navigation
    "nav.about": "نبذة عني",
    "nav.skills": "المهارات",
    "nav.projects": "المشاريع",
    "nav.experience": "الخبرات",
    "nav.contact": "تواصل معي",

    // Hero
    "hero.greeting": "مرحباً، أنا",
    "hero.name": "شيماء الرفاعي",
    "hero.title": "مصممة واجهات وتجربة المستخدم ومطورة تطبيقات",
    "hero.description":
      "أحول الأفكار إلى تجارب رقمية رهيــبة باستخدام أحدث التقنيات والتصاميم المبتكرة",
    "hero.cta.portfolio": "شوف مشاريعي",
    "hero.cta.contact": "تواصل معي",
    "hero.scrollIndicator": "مرر للاستكشاف",

    // About
    "about.title": "نبذة عني",
    "about.subtitle":
      "شغوفة بالتكنولوجيا والتصميم، أسعى لخلق تجارب رقمية استثنائية",
    "about.description":
      "هلا والله !\n أنا شيماء، مصممة واجهات وتجربة المستخدم ومطورة تطبيقات من السعودية.\nأحب أمزج شغفي بالتقنية مع عشقي للفن والتصميم عشان أطلع بتجارب رقمية جميلة وسهلة على المستخدم.\nأستمتع أحيي أفكاري بالبرمجة، ومؤمنة إن التعلم المستمر هو سر النجاح.\nدايم أبحث عن تحديات جديدة تحافظ على إبداعي وحماسي.",
    "about.experience": "سنوات من الخبرة",
    "about.projects": "مشروع مكتمل",
    "about.clients": "عميل راضٍ",
    "about.awards": "جائزة حصلت عليها",

    // Skills
    "skills.title": "المهارات والخبرات",
    "skills.subtitle":
      "مجموعة شاملة من الأدوات لبناء تطبيقات الويب الحديثة والقابلة للتطوير",
    "skills.Applications&Web": "تطوير التطبيقات والمواقع",
    "skills.tools": "الأدوات والتقنيات",
    "skills.soft": "المهارات الشخصية",
    "skills.technologies": "التقنيات",

    // Projects
    "projects.title": "مشاريعي",
    "projects.subtitle":
      "اشتغلت على تطبيقات في مجال الصحة النفسية والذهنية 🧘🏻‍♀️، وتطبيقات للمطاعم والتوصيل 🍴🚚، بالإضافة لمواقع خاصة بالشركات. كل مشروع كان فرصة أتعلم منها وأطور مهاراتي أكثر.",
    "projects.view": "عرض المشروع",
    "projects.code": "الكود المصدري",
    "projects.more": "مشاريع اكثر",
    
    // Experience
    "experience.title": "الخبرة المهنية",
    "experience.subtitle": "رحلتي العملية في تطوير واجهات وتجربة المستخدم",
    "experience.work.1.title": "متدربة تطوير React Native",
    "experience.work.1.company": "First City",
    "experience.work.1.location": "مكة",
    "experience.work.1.period": "يوليو 2023 – أغسطس 2023",
    "experience.work.1.type": "تدريب",
    "experience.work.1.description.1": "تصميم مكونات واجهة المستخدم باستخدام Figma وReact Native CLI",
    "experience.work.1.description.2": "التعاون مع مطوري الواجهة الخلفية لدمج واجهات API",
    "experience.work.1.description.3": "المشاركة في جلسات اختبار المستخدم لجمع الملاحظات وتحسين التصميمات",
    "experience.work.2.title": "مصممة UI/UX",
    "experience.work.2.company": "RobinFood",
    "experience.work.2.location": "مكة",
    "experience.work.2.period": "ديسمبر 2024 – مايو 2025",
    "experience.work.2.type": "دوام كامل",
    "experience.work.2.description.1": "ترجمة متطلبات الأعمال والمستخدمين إلى تصاميم واجهة نظيفة وتركز على المستخدم",
    "experience.work.2.description.2": "تصميم wireframes ونماذج أولية عالية الدقة للصفحة الرئيسية، تطبيق العميل، وتطبيق السائق باستخدام Figma",
    "experience.work.2.description.3": "إجراء اختبارات قابلية الاستخدام وتنفيذ تحسينات لتسهيل سير العمل وأداء الواجهة",
    "experience.work.3.title": "مهندسة برمجيات (تركيز UI/UX)",
    "experience.work.3.company": "Rakaya",
    "experience.work.3.location": "مكة",
    "experience.work.3.period": "يناير 2025 – الحاضر",
    "experience.work.3.type": "دوام كامل",
    "experience.work.3.description.1": "التعاون مع أصحاب المصلحة لجمع وتحليل متطلبات UI لتطبيقين جوال وموقعين",
    "experience.work.3.description.2": "تصميم تدفقات المستخدم، wireframes، ونماذج أولية تفاعلية باستخدام Figma",
    "experience.work.3.description.3": "الحفاظ على تناسق التصميم عبر المنصات ودعم فرق الواجهة الأمامية في التنفيذ",
    "experience.work.3.description.4": "إجراء اختبارات قابلية الاستخدام وتطبيق النتائج لتحسين سهولة الاستخدام، الوصول، وجودة التصميم",

    // Education
    "education.title": "التعليم",
    "education.school.1.degree": "بكالوريوس علوم الحاسب - نظم المعلومات (GPA: 3.48 من 4)",
    "education.school.1.school": "جامعة أم القرى، مكة",
    "education.school.1.period": "أغسطس 2020 – مايو 2024",
    "education.school.1.project": "مشروع التخرج: تطبيق ذكي للزراعة باستخدام الذكاء الاصطناعي",
    "education.school.1.description.1": "تطوير نظام يركز على لوحات بيانات سهلة الاستخدام",
    "education.school.1.description.2": "تصميم واجهات البيانات باستخدام Figma",
    "education.school.1.description.3": "دمج ملاحظات المستخدم في التكرارات التصميمية",

    // Certifications
    "certifications.title": "الرخص والشهادات",
    "certifications.1": "شهادة Google UX Design (قيد الإنجاز)",
    "certifications.2": "Getting Started with AI using IBM Watson – 2022",
    "certifications.3": "Building AI Powered Chatbots Without Programming – 2022",
    "certifications.4": "Introduction to Artificial Intelligence (AI) – 2022",

    // Honors
    "honors.title": "الجوائز والتكريم",
    "honors.1": "المركز الأول كأفضل ملصق علمي – 2024، جامعة أم القرى",
    "honors.2": "المركز الثاني كأفضل مشروع تخرج – 2024، جامعة أم القرى",

    // Contact
    "contact.title": "تواصل معي",
    "contact.subtitle":
      "مستعدة لبدء مشروعك القادم؟ دعنا نبتكر شيئاً رائعاً معاً ونحول أفكارك إلى واقع.",
    "contact.lets": "لنتواصل",
    "contact.description":
      "متحمسة أسمع عن أفكارك 👩🏻‍💻✨ \nسواء تبغى نتعاون في مشروع جديد أو مجرد دردشة لطيفة عن التقنية – لا تتردد، تواصل معي!",
    "contact.email": "البريد الإلكتروني",
    "contact.phone": "الهاتف",
    "contact.location": "الموقع",
    "contact.follow": "تابع رحلتي",

    // Footer
    "footer.description":
      "مطورة ومصممة واجهات مستخدم شغوفة بإنشاء تجارب رقمية مذهلة ومبتكرة.",
    "footer.quick": "روابط سريعة",
    "footer.services": "الخدمات",
    "footer.services.ui": "تصميم واجهات المستخدم",
    "footer.services.mobile": "تطوير التطبيقات",
    "footer.services.consulting": "استشارات تقنية",
    "footer.social": "وسائل التواصل",
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.made": "صُنع بـ",
    "footer.love": "في مكة المكرمة، السعودية",
  },
  en: {
    // Navigation
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.contact": "Contact",

    // Hero
    "hero.greeting": "Hello, I'm",
    "hero.name": "Shaimaa Al-Rifay",
    "hero.title": "UI/UX Designer & App Developer",
    "hero.description":
      "I transform ideas into stunning digital experiences using cutting-edge technologies and innovative designs",
    "hero.cta.portfolio": "See My Work",
    "hero.cta.contact": "Get In Touch",
    "hero.scrollIndicator": "Scroll to explore",

    // About
    "about.title": "About Me",
    "about.subtitle":
      "Passionate about technology and design, I strive to create exceptional digital experiences",
    "about.description":
      "Hey there! \nI`m Shaimaa, a UI/UX designer from Saudi Arabia.\nI love mixing my passion for tech with my love for art and design to create digital experiences that are fun, beautiful, and easy to use.\nI enjoy bringing my ideas to life through coding, and I truly believe continuous learning is the secret to success.\n I`m always on the lookout for new challenges that keep my creativity and excitement alive.",
    "about.experience": "Years of Experience",
    "about.projects": "Completed Projects",
    "about.clients": "Happy Clients",
    "about.awards": "Awards Won",

    // Skills
    "skills.title": "Skills & Expertise",
    "skills.subtitle":
      "I’ve worked on a variety of projects that bring together creativity and technology – from apps for storytelling and mental health, to solutions for companies and restaurants. Each project was a chance to learn and grow my skills.",
    "skills.Applications&Web":
      "Applications and web Development",
    "skills.tools": "Tools & Technologies",
    "skills.soft": "Soft Skills",
    "skills.technologies": "Technologies I Work With",

    // Projects
    "projects.title": "My Projects",
    "projects.subtitle":
      "I’ve worked on mental health and wellness apps 🧘🏻‍♀️, restaurant and delivery applications 🍴🚚, as well as custom websites for companies. Each project gave me the chance to learn and sharpen my skills even more.",
    "projects.view": "View Project",
    "projects.code": "Source Code",
    "projects.more": "More Projects",

    // Experience
    "experience.title": "Professional Experience",
    "experience.subtitle": "My journey in UI/UX design and front-end development",
    "experience.work.1.title": "React Native Developer Internship Trainee",
    "experience.work.1.company": "First City",
    "experience.work.1.location": "Makkah",
    "experience.work.1.period": "Jul 2023 – Aug 2023",
    "experience.work.1.type": "Internship",
    "experience.work.1.description.1": "Designed UI components using Figma and React Native CLI",
    "experience.work.1.description.2": "Collaborated with backend developers to integrate API-driven UI",
    "experience.work.1.description.3": "Participated in regular user testing sessions to gather feedback and refine designs",
    "experience.work.2.title": "UI/UX Designer",
    "experience.work.2.company": "RobinFood",
    "experience.work.2.location": "Makkah",
    "experience.work.2.period": "Dec 2024 – May 2025",
    "experience.work.2.type": "Full-time",
    "experience.work.2.description.1": "Translated business and user requirements into clean, user-centered interface designs",
    "experience.work.2.description.2": "Designed wireframes and high-fidelity prototypes for landing page, customer app, and driver app using Figma",
    "experience.work.2.description.3": "Conducted usability testing and implemented improvements to optimize user flow and interface performance",
    "experience.work.3.title": "Software Engineer (UI/UX Focus)",
    "experience.work.3.company": "Rakaya",
    "experience.work.3.location": "Makkah",
    "experience.work.3.period": "Jan 2025 – Present",
    "experience.work.3.type": "Full-time",
    "experience.work.3.description.1": "Collaborated with stakeholders to gather and analyze UI requirements for two mobile applications—including Awwab—and two websites",
    "experience.work.3.description.2": "Designed user flows, wireframes, and interactive prototypes using Figma",
    "experience.work.3.description.3": "Maintained design consistency across different platforms and supported frontend teams with design implementation",
    "experience.work.3.description.4": "Conducted usability testing and applied insights to improve usability, accessibility, and overall design quality",

    // Education
    "education.title": "Education",
    "education.school.1.degree": "Bachelor of Science (B.S.) - Information Systems (GPA: 3.48/4)",
    "education.school.1.school": "Umm Al-Qura University, Makkah",
    "education.school.1.period": "Aug 2020 – May 2024",
    "education.school.1.project": "Graduation Project: AI-based application for smart agriculture",
    "education.school.1.description.1": "Developed a system focused on user-friendly dashboards",
    "education.school.1.description.2": "Designed UI for data visualization using Figma",
    "education.school.1.description.3": "Integrated user feedback into design iterations",

    // Certifications
    "certifications.title": "Licenses & Certifications",
    "certifications.1": "Google UX Design Certificate (In Progress)",
    "certifications.2": "Getting Started with AI using IBM Watson – 2022",
    "certifications.3": "Building AI Powered Chatbots Without Programming – 2022",
    "certifications.4": "Introduction to Artificial Intelligence (AI) – 2022",

    // Honors
    "honors.title": "Honors & Awards",
    "honors.1": "1st place winner as best scientific poster – 2024, Umm Al-Qura University",
    "honors.2": "2nd place winner as best graduation project – 2024, Umm Al-Qura University",


    // Contact
    "contact.title": "Get In Touch",
    "contact.subtitle":
      "Ready to start your next project? Let's create something amazing together and turn your ideas into reality.",
    "contact.lets": "Let's Connect",
    "contact.description":
      "Excited to hear your ideas 👩🏻‍💻✨ \nWhether you’d like to collaborate on a new project or just have a friendly chat about tech – don’t hesitate, reach out!",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.follow": "Follow My Journey",

    // Footer
    "footer.description":
      "UI/UX designer and Application developer passionate about creating stunning and innovative digital experiences.",
    "footer.quick": "Quick Links",
    "footer.services": "Services",
    "footer.services.ui": "UI Design",
    "footer.services.mobile": "App Development",
    "footer.services.consulting": "Technical Consulting",
    "footer.social": "Social Media",
    "footer.rights": "All rights reserved",
    "footer.made": "Made with",
    "footer.love": "in Riyadh, Saudi Arabia",
  },
};

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguage] = useState<Language>("ar");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)["ar"]
      ] || key
    );
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, dir }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider",
    );
  }
  return context;
}