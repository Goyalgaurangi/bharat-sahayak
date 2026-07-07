import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { ChakraIcon } from "./ChakraIcon";

const slogans = ["सत्यमेव जयते", "जय हिंद", "जय भारत माता"];

const stats = [
  { key: "statSchemes" as const, value: 1240, emoji: "📜" },
  { key: "statComplaints" as const, value: 587, emoji: "✅" },
  { key: "statUsers" as const, value: 12300, emoji: "🙏" },
];

const chips = [
  { key: "qaLicense" as const, target: "#navigator", query: "I want a driving license" },
  { key: "qaAadhaar" as const, target: "#navigator", query: "How to update my Aadhaar address" },
  { key: "qaPmKisan" as const, target: "#navigator", query: "How to apply for PM Kisan Yojana" },
  {
    key: "qaPension" as const,
    target: "#navigator",
    query: "How to apply for senior citizen pension",
  },
];

function useCountUp(target: number, duration = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function Stat({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  const n = useCountUp(value);
  return (
    <div className="card-elevate rounded-2xl p-4 flex items-center gap-3">
      <div className="text-3xl">{emoji}</div>
      <div>
        <div className="text-2xl font-extrabold text-navy">{n.toLocaleString("en-IN")}+</div>
        <div className="text-xs text-navy/70 font-medium">{label}</div>
      </div>
    </div>
  );
}

export function Hero({ onChipClick }: { onChipClick: (q: string) => void }) {
  const { s, lang } = useLang();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slogans.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="top" className="relative overflow-hidden bg-tricolor-radial chakra-watermark">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-14 md:pt-16 md:pb-20 relative">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-saffron/40 text-navy text-xs font-semibold">
            <ChakraIcon spin size={16} className="text-navy" />
            AI-Powered Civic Companion • भारत के लिए
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl leading-tight">
            <span className="text-tricolor">Smart Bharat</span>
            <span className="block text-2xl md:text-3xl mt-1 text-navy">स्मार्ट भारत</span>
          </h1>
          <div className="h-8 relative w-full">
            <div
              key={i}
              className="animate-float-up text-2xl md:text-3xl font-display font-extrabold text-tricolor"
            >
              {slogans[i]}
            </div>
          </div>
          <p className="max-w-2xl text-base md:text-lg text-navy/80">{s("heroSub")}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {chips.map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  onChipClick(c.query);
                  document.getElementById("navigator")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-full bg-white border border-navy/15 hover:border-saffron hover:bg-saffron/10 transition text-sm font-semibold text-navy inline-flex items-center gap-2"
              >
                <ChakraIcon size={14} className="text-saffron" />
                <span>
                  {s(c.key)}
                  <span className="block text-[10px] text-navy/60 font-normal">
                    {lang === "en" ? "Tap to ask AI" : "एआई से पूछें"}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-6">
            {stats.map((st) => (
              <Stat key={st.key} label={s(st.key)} value={st.value} emoji={st.emoji} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
