import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { aiSchemes, type Scheme } from "@/lib/ai.functions";
import { ChakraIcon } from "./ChakraIcon";

const profiles = [
  { id: "student", key: "student" as const, emoji: "🎓" },
  { id: "jobseeker", key: "jobSeeker" as const, emoji: "💼" },
  { id: "farmer", key: "farmer" as const, emoji: "🌾" },
  { id: "senior", key: "senior" as const, emoji: "👴" },
  { id: "woman", key: "woman" as const, emoji: "👩‍💼" },
] as const;

export function Schemes() {
  const { lang, s } = useLang();
  const [profile, setProfile] = useState<(typeof profiles)[number]["id"]>("student");
  const [items, setItems] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const run = useServerFn(aiSchemes);

  const load = async (p: typeof profile) => {
    setProfile(p);
    setLoading(true);
    setErr(null);
    setItems([]);
    try {
      const list = await run({ data: { profile: p } });
      setItems(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="schemes" className="scroll-mt-20 py-14 bg-tricolor-soft chakra-watermark">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-6">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-navy">
            {s("schemesTitle")}
          </h2>
          <p className="text-navy/70 mt-2">{s("schemesDesc")}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => load(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition border ${
                profile === p.id
                  ? "btn-green border-transparent"
                  : "bg-white text-navy border-navy/15 hover:border-india-green"
              }`}
            >
              <span>{p.emoji}</span>
              <span className="text-left leading-tight">
                <span className="block">{s(p.key)}</span>
              </span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center text-navy/70 flex items-center justify-center gap-2 py-8">
            <ChakraIcon spin className="text-saffron" />
            {s("loading")}
          </div>
        )}
        {err && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {err}
          </div>
        )}

        {items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-float-up">
            {items.map((it, i) => (
              <div
                key={i}
                className="card-elevate rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-1 bg-tricolor rounded-bl-2xl" />
                <div className="text-3xl">{it.emoji}</div>
                <h3 className="font-bold text-navy leading-tight">
                  {lang === "en" ? it.name_en : it.name_hi}
                  <span className="block text-xs text-navy/60 font-medium mt-0.5">
                    {lang === "en" ? it.name_hi : it.name_en}
                  </span>
                </h3>
                <div className="text-xs">
                  <div className="font-semibold text-india-green-deep">{s("benefit")}</div>
                  <div className="text-navy/80">
                    {lang === "en" ? it.benefit_en : it.benefit_hi}
                  </div>
                  <div className="text-navy/50">
                    {lang === "en" ? it.benefit_hi : it.benefit_en}
                  </div>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-saffron-deep">{s("eligibility")}</div>
                  <div className="text-navy/80">
                    {lang === "en" ? it.eligibility_en : it.eligibility_hi}
                  </div>
                  <div className="text-navy/50">
                    {lang === "en" ? it.eligibility_hi : it.eligibility_en}
                  </div>
                </div>
                <a
                  href={it.apply_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 btn-green rounded-lg px-3 py-2 text-sm font-semibold"
                >
                  {s("apply")}
                  <ChakraIcon size={16} className="text-white" />
                </a>
              </div>
            ))}
          </div>
        )}
        {!loading && items.length === 0 && !err && (
          <div className="text-center py-8">
            <button
              onClick={() => load(profile)}
              className="btn-saffron px-6 py-3 rounded-xl font-semibold"
            >
              {s("loadSchemes")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
