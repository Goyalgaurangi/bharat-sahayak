import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LanguageProvider, useLang } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Navigator } from "@/components/Navigator";
import { Schemes } from "@/components/Schemes";
import { ComplaintUpload } from "@/components/ComplaintUpload";
import { VoiceCopilot } from "@/components/VoiceCopilot";
import { VisitPredictor } from "@/components/VisitPredictor";
import { News } from "@/components/News";
import { ChakraIcon } from "@/components/ChakraIcon";

export const Route = createFileRoute("/")({
  component: Index,
});

function Footer() {
  const { s } = useLang();
  return (
    <footer className="mt-8">
      <div className="h-3 bg-tricolor" />
      <div className="bg-navy text-white/90 py-8 chakra-watermark">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 justify-center">
            <ChakraIcon spin className="text-white" size={28} aria-hidden="true" />
            <div className="font-display font-black text-xl">Smart Bharat / स्मार्ट भारत</div>
          </div>
          <p className="mt-2 text-sm text-white/70">{s("footer")}</p>
          <p className="text-xs text-white/50 mt-1">Satyameva Jayate · सत्यमेव जयते</p>
        </div>
      </div>
    </footer>
  );
}

function Shell() {
  const [preset, setPreset] = useState("");
  // Assuming your i18n hook exposes the current language state (e.g., 'en' or 'hi')
  const { currentLang } = useLang();

  useEffect(() => {
    if (currentLang) {
      document.documentElement.lang = currentLang;
    }
  }, [currentLang]);
  return (
    <div className="min-h-screen font-sans">
      {/* Structural Headers/Nav elements go inside <nav> or <header> within your <Nav /> component */}
      <Nav />

      <main id="main-content">
        <Hero onChipClick={setPreset} />
        <Navigator presetQuery={preset} />
        <VisitPredictor />
        <Schemes />
        <ComplaintUpload />
        <VoiceCopilot />
        <News />
      </main>
      <Footer />
    </div>
  );
}

function Index() {
  return (
    <LanguageProvider>
      <Shell />
    </LanguageProvider>
  );
}
