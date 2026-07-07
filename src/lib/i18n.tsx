import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, { en: string; hi: string }>;

export const t: Dict = {
  appName: { en: "Smart Bharat", hi: "स्मार्ट भारत" },
  tagline: { en: "Your AI Civic Companion", hi: "आपका एआई नागरिक साथी" },
  navHome: { en: "Home", hi: "मुख्य पृष्ठ" },
  navChat: { en: "AI Navigator", hi: "एआई नेविगेटर" },
  navSchemes: { en: "Schemes", hi: "योजनाएँ" },
  navComplaint: { en: "Report Issue", hi: "शिकायत" },
  navVoice: { en: "Voice Copilot", hi: "आवाज़ सहायक" },
  navNews: { en: "India News", hi: "भारत समाचार" },
  toggleLang: { en: "हिन्दी", hi: "English" },
  heroSub: {
    en: "Government schemes, licenses, complaints & forms — explained in your language.",
    hi: "सरकारी योजनाएँ, लाइसेंस, शिकायतें और फ़ॉर्म — आपकी भाषा में।",
  },
  ctaStart: { en: "Get Started", hi: "शुरू करें" },
  ctaAskAI: { en: "Ask AI", hi: "एआई से पूछें" },
  statSchemes: { en: "Schemes Discovered", hi: "योजनाएँ खोजी" },
  statComplaints: { en: "Complaints Resolved", hi: "शिकायतें सुलझीं" },
  statUsers: { en: "Citizens Helped", hi: "नागरिकों की मदद" },
  quickActions: { en: "Quick Actions", hi: "त्वरित कार्य" },
  qaLicense: { en: "Driving Licence", hi: "ड्राइविंग लाइसेंस" },
  qaAadhaar: { en: "Aadhaar Update", hi: "आधार अपडेट" },
  qaPmKisan: { en: "PM Kisan Yojana", hi: "पीएम किसान योजना" },
  qaPension: { en: "Senior Pension", hi: "वृद्धावस्था पेंशन" },
  chatTitle: { en: "AI Navigator", hi: "एआई नेविगेटर" },
  chatDesc: {
    en: "Type any citizen need — get a full roadmap.",
    hi: "कोई भी नागरिक ज़रूरत लिखें — पूरा रोडमैप पाएँ।",
  },
  chatPlaceholder: {
    en: "e.g. I want a driving license",
    hi: "उदा. मुझे ड्राइविंग लाइसेंस चाहिए",
  },
  send: { en: "Send", hi: "भेजें" },
  thinking: { en: "Thinking...", hi: "सोच रहा है..." },
  steps: { en: "Step-by-Step Process", hi: "चरण-दर-चरण प्रक्रिया" },
  documents: { en: "Required Documents", hi: "आवश्यक दस्तावेज़" },
  fees: { en: "Estimated Fees", hi: "अनुमानित शुल्क" },
  time: { en: "Processing Time", hi: "प्रक्रिया समय" },
  office: { en: "Nearest Office", hi: "निकटतम कार्यालय" },
  mistakes: { en: "Common Mistakes to Avoid", hi: "बचने योग्य गलतियाँ" },
  roadmap: { en: "Your Personalized Roadmap", hi: "आपका व्यक्तिगत रोडमैप" },
  today: { en: "Today", hi: "आज" },
  tomorrow: { en: "Tomorrow", hi: "कल" },
  nextWeek: { en: "Next Week", hi: "अगले सप्ताह" },
  completion: { en: "Est. Completion", hi: "अनुमानित पूर्णता" },
  schemesTitle: { en: "Life Event Assistant", hi: "जीवन घटना सहायक" },
  schemesDesc: {
    en: "Pick your profile — get personalized government schemes.",
    hi: "अपनी प्रोफ़ाइल चुनें — व्यक्तिगत सरकारी योजनाएँ पाएँ।",
  },
  student: { en: "Student", hi: "छात्र" },
  jobSeeker: { en: "Job Seeker", hi: "नौकरी तलाशक" },
  farmer: { en: "Farmer", hi: "किसान" },
  senior: { en: "Senior Citizen", hi: "वरिष्ठ नागरिक" },
  woman: { en: "Woman Entrepreneur", hi: "महिला उद्यमी" },
  benefit: { en: "Benefit", hi: "लाभ" },
  eligibility: { en: "Eligibility", hi: "पात्रता" },
  apply: { en: "Apply", hi: "आवेदन करें" },
  loading: { en: "Loading...", hi: "लोड हो रहा है..." },
  loadSchemes: { en: "Load Schemes", hi: "योजनाएँ लोड करें" },
  complaintTitle: { en: "Smart Upload", hi: "स्मार्ट अपलोड" },
  complaintDesc: {
    en: "Upload a photo — AI detects issue and files complaint.",
    hi: "फ़ोटो अपलोड करें — एआई समस्या पहचानकर शिकायत दर्ज करता है।",
  },
  uploadPhoto: { en: "Upload Photo", hi: "फ़ोटो अपलोड करें" },
  analyzing: { en: "Analyzing image with AI...", hi: "एआई से छवि विश्लेषण..." },
  whatHelp: { en: "What do you want help with?", hi: "आपको किसमें मदद चाहिए?" },
  optReport: { en: "Report a Complaint", hi: "शिकायत दर्ज करें" },
  optReportDesc: { en: "Pothole, streetlight, garbage etc.", hi: "गड्ढा, स्ट्रीटलाइट, कचरा आदि।" },
  optForm: { en: "Understand a Form", hi: "फ़ॉर्म समझें" },
  optFormDesc: { en: "AI explains each field in simple terms.", hi: "एआई हर फ़ील्ड सरल भाषा में समझाता है।" },
  urgency: { en: "Urgency", hi: "प्राथमिकता" },
  low: { en: "Low", hi: "कम" },
  medium: { en: "Medium", hi: "मध्यम" },
  high: { en: "High", hi: "उच्च" },
  department: { en: "Department", hi: "विभाग" },
  category: { en: "Category", hi: "श्रेणी" },
  submitComplaint: { en: "Submit Complaint", hi: "शिकायत दर्ज करें" },
  complaintFiled: { en: "Complaint Filed!", hi: "शिकायत दर्ज हो गई!" },
  complaintId: { en: "Complaint ID", hi: "शिकायत आईडी" },
  voiceTitle: { en: "Village Voice Copilot", hi: "ग्राम आवाज़ सहायक" },
  voiceDesc: {
    en: "Speak your question — hear the answer.",
    hi: "अपना सवाल बोलें — जवाब सुनें।",
  },
  tapToSpeak: { en: "Tap to Speak", hi: "बोलने के लिए दबाएँ" },
  listening: { en: "Listening...", hi: "सुन रहा है..." },
  speak: { en: "Speak Answer", hi: "उत्तर सुनें" },
  newsTitle: { en: "Bharat Samachar", hi: "भारत समाचार" },
  newsDesc: { en: "Latest India headlines, auto-refreshing.", hi: "ताज़ा भारत समाचार, स्वतः-अपडेट।" },
  fields: { en: "Form Fields Explained", hi: "फ़ॉर्म फ़ील्ड समझाए गए" },
  footer: { en: "Made with ❤ for Bharat", hi: "भारत के लिए ❤ से बनाया गया" },

  // Visit Predictor
  navVisit: { en: "Visit Predictor", hi: "भेंट भविष्यवक्ता" },
  visitTitle: { en: "Office Visit Predictor", hi: "कार्यालय भेंट भविष्यवक्ता" },
  visitDesc: {
    en: "AI-powered pre-visit planner — know crowd, wait time & best hours.",
    hi: "एआई-संचालित पूर्व-भेंट योजना — भीड़, प्रतीक्षा समय और सर्वोत्तम घंटे जानें।",
  },
  officeType: { en: "Office Type", hi: "कार्यालय का प्रकार" },
  officeLocation: { en: "Location (City / Area)", hi: "स्थान (शहर / क्षेत्र)" },
  predict: { en: "Predict My Visit", hi: "मेरी भेंट की भविष्यवाणी करें" },
  predicting: { en: "AI predicting...", hi: "एआई भविष्यवाणी कर रहा है..." },
  crowdLevel: { en: "Crowd Level", hi: "भीड़ स्तर" },
  bestTime: { en: "Best Time to Visit", hi: "जाने का सर्वोत्तम समय" },
  waitTime: { en: "Estimated Wait", hi: "अनुमानित प्रतीक्षा" },
  minutes: { en: "min", hi: "मिनट" },
  docsChecklist: { en: "Documents Checklist", hi: "दस्तावेज़ सूची" },
  heatmap: { en: "Weekly Crowd Heatmap", hi: "साप्ताहिक भीड़ हीटमैप" },
  aiEstimate: { en: "AI Estimate — plan accordingly", hi: "एआई अनुमान — तदनुसार योजना बनाएँ" },
  planMyVisit: { en: "Plan My Visit", hi: "मेरी भेंट की योजना बनाएँ" },
  selectOffice: { en: "Select an office type", hi: "कार्यालय प्रकार चुनें" },
  officeRTO: { en: "RTO (Transport Office)", hi: "आरटीओ (परिवहन कार्यालय)" },
  officePassport: { en: "Passport Seva Kendra", hi: "पासपोर्ट सेवा केंद्र" },
  officeMunicipal: { en: "Municipal Office", hi: "नगरपालिका कार्यालय" },
  officeAadhaar: { en: "Aadhaar Enrolment Center", hi: "आधार नामांकन केंद्र" },
  officeTahsil: { en: "Tahsil / Revenue Office", hi: "तहसील / राजस्व कार्यालय" },
  officeGST: { en: "GST Bhavan", hi: "जीएसटी भवन" },
  officeEPFO: { en: "EPFO Regional Office", hi: "ईपीएफओ क्षेत्रीय कार्यालय" },
  officePolice: { en: "Police Station", hi: "पुलिस थाना" },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; s: (k: keyof typeof t) => string; }>({
  lang: "en",
  setLang: () => {},
  s: (k) => t[k]?.en ?? String(k),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("sb-lang") as Lang | null) : null;
    if (saved === "en" || saved === "hi") setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("sb-lang", l);
  };
  const s = (k: keyof typeof t) => (t[k] ? t[k][lang] : String(k));
  return <LangCtx.Provider value={{ lang, setLang, s }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

/** Render an English + Hindi stacked label (Hindi always visible smaller). */
export function Bilingual({ en, hi, className = "" }: { en: string; hi: string; className?: string }) {
  return (
    <span className={className}>
      <span className="block">{en}</span>
      <span className="block text-[0.85em] opacity-80 font-medium">{hi}</span>
    </span>
  );
}
