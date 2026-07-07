import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLang, type Lang } from "@/lib/i18n";
import { aiVisitPredictor, type VisitPrediction } from "@/lib/ai.functions";
import { ChakraIcon } from "./ChakraIcon";
import { Clock, Users, FileCheck, MapPin, Sparkles, CalendarClock } from "lucide-react";

const OFFICES: { key: string; en: string; hi: string; emoji: string }[] = [
  { key: "rto", en: "RTO (Transport Office)", hi: "आरटीओ (परिवहन कार्यालय)", emoji: "🚗" },
  { key: "passport", en: "Passport Seva Kendra", hi: "पासपोर्ट सेवा केंद्र", emoji: "🛂" },
  { key: "municipal", en: "Municipal Office", hi: "नगरपालिका कार्यालय", emoji: "🏛️" },
  { key: "aadhaar", en: "Aadhaar Enrolment Center", hi: "आधार नामांकन केंद्र", emoji: "🆔" },
  { key: "tahsil", en: "Tahsil / Revenue Office", hi: "तहसील / राजस्व कार्यालय", emoji: "📜" },
  { key: "gst", en: "GST Bhavan", hi: "जीएसटी भवन", emoji: "🧾" },
  { key: "epfo", en: "EPFO Regional Office", hi: "ईपीएफओ क्षेत्रीय कार्यालय", emoji: "💼" },
  { key: "police", en: "Police Station", hi: "पुलिस थाना", emoji: "🚔" },
];

function pick<T>(lang: Lang, en: T, hi: T) {
  return lang === "en" ? en : hi;
}

function crowdColor(level: string) {
  if (level === "Low") return { bg: "bg-india-green", text: "text-white", ring: "ring-india-green" };
  if (level === "High") return { bg: "bg-destructive", text: "text-white", ring: "ring-destructive" };
  return { bg: "bg-saffron", text: "text-white", ring: "ring-saffron" };
}

function HeatCell({ v }: { v: number }) {
  const colors = [
    "bg-india-green/70",
    "bg-saffron/50",
    "bg-saffron/85",
    "bg-destructive/85",
  ];
  const label = ["◔", "◑", "◕", "●"];
  return (
    <div
      className={`aspect-square rounded-md ${colors[Math.max(0, Math.min(3, v))]} flex items-center justify-center text-white text-xs font-bold shadow-inner`}
      title={`crowd ${v}`}
    >
      {label[Math.max(0, Math.min(3, v))]}
    </div>
  );
}

export function VisitPredictor() {
  const { lang, s } = useLang();
  const [office, setOffice] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<VisitPrediction | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<boolean[]>([]);
  const run = useServerFn(aiVisitPredictor);

  const submit = async () => {
    if (!office || !location.trim()) return;
    setLoading(true);
    setErr(null);
    setRes(null);
    try {
      const chosen = OFFICES.find((o) => o.key === office);
      const officeType = chosen ? `${chosen.en} / ${chosen.hi}` : office;
      const r = await run({ data: { officeType, location, lang } });
      setRes(r);
      setDone(new Array(r.documents.length).fill(false));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const c = res ? crowdColor(res.crowd_level) : null;

  return (
    <section id="visit" className="scroll-mt-20 py-16 chakra-watermark">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy text-white text-xs font-bold shadow-lg">
            <CalendarClock size={14} /> NEW • {lang === "en" ? "AI Feature" : "एआई सुविधा"}
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl mt-3 text-shimmer">
            {s("visitTitle")}
          </h2>
          <p className="text-navy/80 mt-2 font-medium">{s("visitDesc")}</p>
        </div>

        <div className="card-elevate rounded-3xl p-5 md:p-6 bg-tricolor-soft">
          <div className="grid md:grid-cols-[1.2fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wide">{s("officeType")}</label>
              <select
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                className="w-full mt-1 rounded-xl border-2 border-saffron/40 bg-white focus:border-saffron focus:ring-2 focus:ring-saffron/30 outline-none px-4 py-3 text-navy font-semibold"
              >
                <option value="">— {s("selectOffice")} —</option>
                {OFFICES.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.emoji} {pick(lang, o.en, o.hi)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wide">{s("officeLocation")}</label>
              <div className="relative mt-1">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-india-green" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder={lang === "en" ? "e.g. Pune, Andheri Mumbai" : "उदा. पुणे, अंधेरी मुंबई"}
                  className="w-full rounded-xl border-2 border-india-green/40 focus:border-india-green focus:ring-2 focus:ring-india-green/30 outline-none pl-10 pr-4 py-3 font-semibold text-navy"
                />
              </div>
            </div>
            <button
              onClick={submit}
              disabled={loading || !office || !location.trim()}
              className="btn-saffron px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 disabled:opacity-60 h-[50px]"
            >
              {loading ? (
                <>
                  <ChakraIcon spin size={18} className="text-white" />
                  {s("predicting")}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {s("predict")}
                </>
              )}
            </button>
          </div>
          {err && <div className="mt-3 rounded-xl bg-red-50 border border-red-300 p-3 text-red-700 text-sm">{err}</div>}
        </div>

        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3 text-navy">
            <ChakraIcon spin size={64} className="text-saffron" />
            <div className="font-bold">{s("predicting")}</div>
          </div>
        )}

        {res && c && (
          <div className="mt-8 grid md:grid-cols-3 gap-4 animate-float-up">
            {/* Crowd gauge */}
            <div className="card-elevate rounded-2xl p-5 card-glow-saffron">
              <div className="flex items-center gap-2 text-navy font-bold">
                <Users size={18} className="text-saffron-deep" />
                {s("crowdLevel")}
              </div>
              <div className="mt-3">
                <div className={`inline-flex px-3 py-1 rounded-full ${c.bg} ${c.text} text-sm font-black shadow-md`}>
                  {pick(lang, res.crowd_level, res.crowd_level_hi)}
                </div>
              </div>
              <div className="mt-4 h-4 rounded-full bg-navy/10 overflow-hidden ring-1 ring-navy/10">
                <div
                  className={`h-full ${c.bg} transition-all duration-700`}
                  style={{ width: `${res.crowd_percent}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-navy/70 font-semibold">{res.crowd_percent}% capacity</div>
              <div className="mt-3 text-xs text-navy/70">
                {pick(lang, res.office_en, res.office_hi)}
              </div>
            </div>

            {/* Wait time */}
            <div className="card-elevate rounded-2xl p-5 card-glow-green">
              <div className="flex items-center gap-2 text-navy font-bold">
                <Clock size={18} className="text-india-green-deep" />
                {s("waitTime")}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="text-5xl font-black text-india-green-deep">{res.wait_minutes}</div>
                <div className="font-bold text-navy/70">{s("minutes")}</div>
              </div>
              <div className="mt-3 relative w-24 h-24 mx-auto">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none" className="text-india-green/15" />
                  <circle
                    cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (Math.min(res.wait_minutes, 180) / 180) * 264}
                    strokeLinecap="round"
                    className="text-india-green transition-all duration-700"
                  />
                </svg>
                <Clock className="absolute inset-0 m-auto text-india-green-deep" size={30} />
              </div>
            </div>

            {/* Best time */}
            <div className="card-elevate rounded-2xl p-5 bg-navy-panel text-white">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={18} className="text-saffron" />
                {s("bestTime")}
              </div>
              <div className="mt-3 text-lg font-black text-saffron">
                {pick(lang, res.best_time_en, res.best_time_hi)}
              </div>
              <div className="mt-1 text-xs text-white/70">
                {lang === "en" ? res.best_time_hi : res.best_time_en}
              </div>
              <div className="mt-4 text-xs text-white/80 border-l-2 border-saffron pl-2 italic">
                💡 {pick(lang, res.tips_en, res.tips_hi)}
              </div>
            </div>

            {/* Documents */}
            <div className="card-elevate rounded-2xl p-5 md:col-span-2">
              <div className="flex items-center gap-2 text-navy font-bold mb-3">
                <FileCheck size={18} className="text-saffron-deep" />
                {s("docsChecklist")}
              </div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {res.documents.map((d, i) => (
                  <li key={i}>
                    <label className="flex items-start gap-2 p-2 rounded-lg hover:bg-saffron/10 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={done[i] ?? false}
                        onChange={(e) => setDone((arr) => arr.map((v, idx) => (idx === i ? e.target.checked : v)))}
                        className="mt-0.5 w-4 h-4 accent-india-green"
                      />
                      <div>
                        <div className={`text-sm font-semibold text-navy ${done[i] ? "line-through opacity-60" : ""}`}>
                          {pick(lang, d.en, d.hi)}
                        </div>
                        <div className="text-[11px] text-navy/60">{lang === "en" ? d.hi : d.en}</div>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Heatmap */}
            <div className="card-elevate rounded-2xl p-5">
              <div className="flex items-center gap-2 text-navy font-bold mb-3">
                <CalendarClock size={18} className="text-navy" />
                {s("heatmap")}
              </div>
              <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1.5 items-center text-[10px] font-bold text-navy/70">
                <div />
                {(lang === "en" ? res.slots_en : res.slots_hi).map((sl) => (
                  <div key={sl} className="text-center">{sl}</div>
                ))}
                {res.heatmap.map((row, di) => (
                  <div key={`row-${di}`} className="contents">
                    <div className="pr-1 text-right">
                      {(lang === "en" ? res.days_en : res.days_hi)[di]}
                    </div>
                    {row.map((v, si) => (
                      <HeatCell key={`${di}-${si}`} v={v} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2 text-[10px] text-navy/70 items-center">
                <span className="inline-block w-3 h-3 rounded bg-india-green/70" />Low
                <span className="inline-block w-3 h-3 rounded bg-saffron/85 ml-2" />Med
                <span className="inline-block w-3 h-3 rounded bg-destructive/85 ml-2" />High
              </div>
            </div>

            <div className="md:col-span-3 text-center text-xs text-navy/60 italic">
              🤖 {s("aiEstimate")}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
