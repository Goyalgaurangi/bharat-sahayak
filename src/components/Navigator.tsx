import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { aiNavigator, type NavigatorResult } from "@/lib/ai.functions";
import { ChakraIcon } from "./ChakraIcon";

export function Navigator({ presetQuery }: { presetQuery: string }) {
  const { lang, s } = useLang();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<NavigatorResult | null>(null);
  const [done, setDone] = useState<boolean[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const run = useServerFn(aiNavigator);

  useEffect(() => {
    if (presetQuery) setQ(presetQuery);
  }, [presetQuery]);

  const submit = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setErr(null);
    setRes(null);
    try {
      const r = await run({ data: { query: q, lang } });
      setRes(r);
      setDone(new Array(r.roadmap.length).fill(false));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const pick = <T,>(en: T, hi: T) => (lang === "en" ? en : hi);

  return (
    <section id="navigator" className="scroll-mt-20 py-14 chakra-watermark">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-6">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-navy">
            {s("chatTitle")} <span className="text-saffron">•</span>{" "}
            <span className="text-india-green">AI Navigator</span>
          </h2>
          <p className="text-navy/70 mt-2">{s("chatDesc")}</p>
        </div>
        <div className="card-elevate rounded-2xl p-4 flex gap-2 items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={s("chatPlaceholder")}
            className="flex-1 rounded-xl border border-navy/15 focus:border-saffron focus:ring-2 focus:ring-saffron/30 outline-none px-4 py-3 text-base"
          />
          <button
            onClick={submit}
            disabled={loading}
            className="btn-saffron px-5 py-3 rounded-xl font-semibold inline-flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <ChakraIcon spin size={18} className="text-white" />
                {s("thinking")}
              </>
            ) : (
              <>
                {s("send")}
                <ChakraIcon size={18} className="text-white" />
              </>
            )}
          </button>
        </div>

        {err && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm">{err}</div>}

        {res && (
          <div className="mt-6 grid md:grid-cols-2 gap-4 animate-float-up">
            <div className="card-elevate rounded-2xl p-5">
              <h3 className="font-bold text-navy text-xl mb-1">{pick(res.title_en, res.title_hi)}</h3>
              <div className="text-sm text-navy/60 mb-4">{lang === "en" ? res.title_hi : res.title_en}</div>

              <Section title={s("steps")} icon="📋">
                <ol className="space-y-2 list-none">
                  {res.steps.map((st, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-saffron text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-sm text-navy">{pick(st.en, st.hi)}</div>
                        <div className="text-xs text-navy/60">{lang === "en" ? st.hi : st.en}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section title={s("documents")} icon="📄">
                <ul className="grid grid-cols-1 gap-1.5">
                  {res.documents.map((d, i) => (
                    <li key={i} className="text-sm">
                      <div className="text-navy">✓ {pick(d.en, d.hi)}</div>
                      <div className="text-xs text-navy/60 ml-4">{lang === "en" ? d.hi : d.en}</div>
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <MiniStat label={s("fees")} value={pick(res.fees_en, res.fees_hi)} sub={lang === "en" ? res.fees_hi : res.fees_en} />
                <MiniStat label={s("time")} value={pick(res.time_en, res.time_hi)} sub={lang === "en" ? res.time_hi : res.time_en} />
              </div>
              <MiniStat className="mt-3" label={s("office")} value={pick(res.office_en, res.office_hi)} sub={lang === "en" ? res.office_hi : res.office_en} />

              <Section title={s("mistakes")} icon="⚠️" className="mt-4">
                <ul className="space-y-1">
                  {res.mistakes.map((m, i) => (
                    <li key={i} className="text-sm">
                      <div className="text-navy">• {pick(m.en, m.hi)}</div>
                      <div className="text-xs text-navy/60 ml-3">{lang === "en" ? m.hi : m.en}</div>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* Roadmap */}
            <div className="card-elevate rounded-2xl p-5 bg-tricolor-soft">
              <h3 className="font-bold text-navy text-xl mb-1 flex items-center gap-2">
                <ChakraIcon spin size={22} className="text-navy" />
                {s("roadmap")}
              </h3>
              <div className="text-sm text-navy/70 mb-4">
                {s("completion")}: <b>{res.estimated_days} {lang === "en" ? "days" : "दिन"}</b>
              </div>
              <ol className="relative border-l-2 border-saffron/50 ml-3 space-y-4">
                {res.roadmap.map((r, i) => (
                  <li key={i} className="ml-4">
                    <div className="absolute -left-[9px] mt-1">
                      <input
                        type="checkbox"
                        checked={done[i] ?? false}
                        onChange={(e) => setDone((d) => d.map((v, idx) => (idx === i ? e.target.checked : v)))}
                        className="w-4 h-4 accent-india-green"
                      />
                    </div>
                    <div className="pl-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-india-green-deep">
                        {pick(r.when_en, r.when_hi)}{" "}
                        <span className="text-navy/50 font-normal normal-case">/ {lang === "en" ? r.when_hi : r.when_en}</span>
                      </div>
                      <div className={`text-sm text-navy mt-0.5 ${done[i] ? "line-through opacity-60" : ""}`}>
                        {pick(r.task_en, r.task_hi)}
                      </div>
                      <div className="text-xs text-navy/60">{lang === "en" ? r.task_hi : r.task_en}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Section({ title, icon, children, className = "" }: { title: string; icon: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`mt-4 ${className}`}>
      <div className="text-sm font-bold text-navy mb-2 flex items-center gap-1.5">
        <span>{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function MiniStat({ label, value, sub, className = "" }: { label: string; value: string; sub: string; className?: string }) {
  return (
    <div className={`rounded-xl bg-white/70 border border-navy/10 p-3 ${className}`}>
      <div className="text-[10px] uppercase font-bold tracking-wide text-navy/60">{label}</div>
      <div className="text-sm font-semibold text-navy">{value}</div>
      <div className="text-[11px] text-navy/60">{sub}</div>
    </div>
  );
}
