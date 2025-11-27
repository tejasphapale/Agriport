import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    homeTitle: "🌱 Agri Transport System",
    homeDescription: "Welcome! Manage agriculture transport records efficiently, track crops, and streamline farmer deliveries with ease.",
    goTransport: "🚜 Go to Transport Page →",
    manageTransport: "🚛 Manage Transport",
    manageDesc: "Add, view, and filter transport records for farmers easily.",
    reports: "📊 Reports & Insights",
    reportsDesc: "Generate daily, weekly, monthly, and yearly transport reports.",
    saveSecure: "💾 Save & Secure Data",
    saveSecureDesc: "All records are stored safely and can be accessed anytime.",
    aboutTitle: "About Agri Transport System",
    aboutDesc: "This system simplifies agriculture logistics management. Farmers and transport managers can easily track crop shipments, manage crates, and get instant insights about deliveries.",
    explore: "🌐 Explore More",
    exploreDesc: "Discover our related project AgriHydrox, designed to manage agricultural workflows and support farmers with digital solutions.",
    visit: "🔗 Visit AgriHydrox",
    selectLanguage: "🌍 Select Language"
  },

  mr: {
    homeTitle: "🌱 कृषी परिवहन प्रणाली",
    homeDescription: "स्वागत आहे! कृषी वाहतूक नोंदी कार्यक्षमतेने व्यवस्थापित करा, पिकांचा मागोवा ठेवा आणि शेतकरी वितरण सुलभ करा.",
    goTransport: "🚜 वाहतूक पृष्ठावर जा →",
    manageTransport: "🚛 वाहतूक व्यवस्थापित करा",
    manageDesc: "शेतकऱ्यांच्या नोंदी सहजपणे जोडा, पाहा आणि फिल्टर करा.",
    reports: "📊 अहवाल आणि विश्लेषण",
    reportsDesc: "दैनिक, साप्ताहिक, मासिक आणि वार्षिक अहवाल तयार करा.",
    saveSecure: "💾 सुरक्षित डेटा संचयित करा",
    saveSecureDesc: "सर्व नोंदी सुरक्षितपणे संग्रहित केल्या जातात आणि केव्हाही प्रवेशयोग्य असतात.",
    aboutTitle: "कृषी परिवहन प्रणालीबद्दल",
    aboutDesc: "ही प्रणाली कृषी वाहतूक व्यवस्थापन सुलभ करते. शेतकरी आणि वाहतूक व्यवस्थापक पिकांच्या वाहतुकीचा मागोवा घेऊ शकतात आणि कार्यक्षमता वाढवू शकतात.",
    explore: "🌐 आणखी शोधा",
    exploreDesc: "आमचा संबंधित प्रकल्प AgriHydrox शोधा, जो कृषी व्यवस्थापनासाठी डिजिटल उपाय प्रदान करतो.",
    visit: "🔗 AgriHydrox पहा",
    selectLanguage: "🌍 भाषा निवडा"
  }
};

const i18n = createI18n({
  locale: localStorage.getItem('language') || 'en',
  fallbackLocale: 'en',
  messages
});

export default i18n;
