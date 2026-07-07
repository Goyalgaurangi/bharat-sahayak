import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchIndiaNews, type NewsItem } from "@/lib/ai.functions";
import { useLang } from "@/lib/i18n";
import { ChakraIcon } from "./ChakraIcon";

export function News() {
  const { s } = useLang();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const run = useServerFn(fetchIndiaNews);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const list = await run();
        if (alive) setItems(list);
      } catch { /* ignore */ } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => { alive = false; clearInterval(t); };
  }, [run]);

  const ticker = items.slice(0, 8);

  return (
    <section id="news" className="scroll-mt-20 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-4">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-navy">
            {s("newsTitle")} <span className="text-saffron">•</span> India News
          </h2>
          <p className="text-navy/70 mt-2">{s("newsDesc")}</p>
        </div>

        {/* Ticker */}
        <div className="relative overflow-hidden rounded-full border border-navy/10 bg-white shadow-sm py-2">
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-3 bg-tricolor text-white font-bold text-xs">
            <ChakraIcon spin size={16} className="text-white" />
            LIVE
          </div>
          <div className="flex whitespace-nowrap animate-marquee gap-8 pl-24">
            {[...ticker, ...ticker].map((n, i) => (
              <a key={i} href={n.link} target="_blank" rel="noreferrer" className="text-sm text-navy hover:text-saffron-deep">
                • {n.title}
              </a>
            ))}
          </div>
        </div>

        {loading && <div className="text-center text-navy/60 mt-6">{s("loading")}</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {items.map((n, i) => (
            <a key={i} href={n.link} target="_blank" rel="noreferrer" className="card-elevate rounded-2xl p-4 block relative overflow-hidden">
              <div className="absolute top-0 left-0 h-1 w-full bg-tricolor" />
              <div className="text-xs text-navy/50 uppercase tracking-wide font-bold mt-1">
                {n.source ?? "India"}
              </div>
              <div className="mt-1 font-semibold text-navy leading-snug line-clamp-3">{n.title}</div>
              <div className="mt-2 text-xs text-saffron-deep inline-flex items-center gap-1">
                Read <ChakraIcon size={12} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
