import { useLang } from "@/lib/i18n";
import { ChakraIcon } from "./ChakraIcon";

const links = [
  { href: "#navigator", key: "navChat" as const },
  { href: "#visit", key: "navVisit" as const },
  { href: "#schemes", key: "navSchemes" as const },
  { href: "#complaint", key: "navComplaint" as const },
  { href: "#voice", key: "navVoice" as const },
  { href: "#news", key: "navNews" as const },
];

export function Nav() {
  const { lang, setLang, s } = useLang();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-saffron/30">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-2 shrink-0">
          <ChakraIcon spin className="text-navy" size={32} />
          <div className="leading-tight">
            <div className="font-display font-extrabold text-lg text-tricolor">Smart Bharat</div>
            <div className="text-[10px] font-semibold text-navy/70 -mt-0.5">स्मार्ट भारत</div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-navy hover:bg-saffron/10 transition"
            >
              {s(l.key)}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full btn-saffron text-sm font-semibold"
          aria-label="Toggle language"
        >
          <span className="text-base">🇮🇳</span>
          <span>{s("toggleLang")}</span>
        </button>
      </div>
    </header>
  );
}
