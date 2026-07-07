import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLang } from "@/lib/i18n";
import { aiAnalyzeImage, type ComplaintAnalysis, type FormAnalysis } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { ChakraIcon } from "./ChakraIcon";

type Mode = "complaint" | "form";

const urgencyColor: Record<string, string> = {
  Low: "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  High: "bg-red-100 text-red-800 border-red-300",
};

async function fileToDataUrl(f: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(f);
  });
}

export function ComplaintUpload() {
  const { lang, s } = useLang();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState<ComplaintAnalysis | null>(null);
  const [form, setForm] = useState<FormAnalysis | null>(null);
  const [openField, setOpenField] = useState<number | null>(0);
  const [filedId, setFiledId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const analyze = useServerFn(aiAnalyzeImage);

  const onFile = async (f: File) => {
    setErr(null);
    setComplaint(null);
    setForm(null);
    setFiledId(null);
    const url = await fileToDataUrl(f);
    setDataUrl(url);
    setShowModal(true);
  };

  const pick = async (m: Mode) => {
    if (!dataUrl) return;
    setMode(m);
    setShowModal(false);
    setLoading(true);
    try {
      const r = await analyze({ data: { imageDataUrl: dataUrl, mode: m } });
      if (m === "complaint") setComplaint(r as ComplaintAnalysis);
      else setForm(r as FormAnalysis);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const submitComplaint = async () => {
    if (!complaint) return;
    const cid = "SB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    try {
      const { error } = await supabase.from("complaints").insert({
        complaint_id: cid,
        issue_type: complaint.issue_type_en,
        category: complaint.category,
        urgency: complaint.urgency,
        department: complaint.department_en,
        description_en: complaint.description_en,
        description_hi: complaint.description_hi,
        image_url: dataUrl?.slice(0, 500_000) ?? null, // cap size
      });
      if (error) throw new Error(error.message);
      setFiledId(cid);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save");
    }
  };

  const pickL = <T,>(en: T, hi: T) => (lang === "en" ? en : hi);

  return (
    <section id="complaint" className="scroll-mt-20 py-14">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-6">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-navy">{s("complaintTitle")}</h2>
          <p className="text-navy/70 mt-2">{s("complaintDesc")}</p>
        </div>

        <div className="card-elevate rounded-2xl p-6 text-center">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          {!dataUrl && (
            <button onClick={() => inputRef.current?.click()} className="btn-saffron px-6 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2">
              📸 {s("uploadPhoto")}
            </button>
          )}
          {dataUrl && (
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <img src={dataUrl} alt="upload" className="rounded-xl border border-navy/10 max-h-80 w-full object-cover" />
              <div>
                {loading && (
                  <div className="flex items-center gap-2 text-navy/70">
                    <ChakraIcon spin className="text-saffron" /> {s("analyzing")}
                  </div>
                )}

                {complaint && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs uppercase font-bold text-navy/60">{s("category")}</div>
                      <div className="font-semibold text-navy capitalize">{complaint.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-xs uppercase font-bold text-navy/60">{s("urgency")}</div>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full border font-bold text-xs ${urgencyColor[complaint.urgency]}`}>
                          {complaint.urgency} / {complaint.urgency_hi}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold text-navy/60">{s("department")}</div>
                      <div className="text-sm text-navy">{pickL(complaint.department_en, complaint.department_hi)}</div>
                      <div className="text-xs text-navy/60">{lang === "en" ? complaint.department_hi : complaint.department_en}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase font-bold text-navy/60">
                        {lang === "en" ? "Issue" : "समस्या"}
                      </div>
                      <div className="text-sm text-navy font-medium">
                        {pickL(complaint.issue_type_en, complaint.issue_type_hi)}
                      </div>
                    </div>
                    <div className="rounded-lg bg-cream border border-navy/10 p-3">
                      <div className="text-sm text-navy">{pickL(complaint.description_en, complaint.description_hi)}</div>
                      <div className="text-xs text-navy/60 mt-1">{lang === "en" ? complaint.description_hi : complaint.description_en}</div>
                    </div>
                    {!filedId ? (
                      <button onClick={submitComplaint} className="btn-green px-5 py-3 rounded-xl font-semibold w-full">
                        {s("submitComplaint")}
                      </button>
                    ) : (
                      <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
                        <div className="text-2xl">✅</div>
                        <div className="font-bold text-green-800">{s("complaintFiled")}</div>
                        <div className="text-xs text-green-700 mt-1">{s("complaintId")}: <b>{filedId}</b></div>
                      </div>
                    )}
                  </div>
                )}

                {form && (
                  <div>
                    <h4 className="font-bold text-navy">{pickL(form.form_name_en, form.form_name_hi)}</h4>
                    <div className="text-xs text-navy/60 mb-3">{lang === "en" ? form.form_name_hi : form.form_name_en}</div>
                    <div className="text-sm font-semibold text-navy mb-2">{s("fields")}</div>
                    <div className="space-y-2 max-h-96 overflow-auto pr-1">
                      {form.fields.map((f, i) => {
                        const open = openField === i;
                        return (
                          <div key={i} className="rounded-lg border border-navy/10 bg-white">
                            <button
                              onClick={() => setOpenField(open ? null : i)}
                              className="w-full text-left px-3 py-2 flex items-center justify-between gap-2"
                            >
                              <span className="font-semibold text-navy text-sm">
                                {pickL(f.label_en, f.label_hi)}
                                <span className="block text-[11px] text-navy/60 font-normal">{lang === "en" ? f.label_hi : f.label_en}</span>
                              </span>
                              <ChakraIcon size={16} className={`text-saffron transition-transform ${open ? "rotate-90" : ""}`} />
                            </button>
                            {open && (
                              <div className="px-3 pb-3 text-xs space-y-1 animate-float-up">
                                <div className="text-navy">{pickL(f.explanation_en, f.explanation_hi)}</div>
                                <div className="text-navy/60">{lang === "en" ? f.explanation_hi : f.explanation_en}</div>
                                <div className="rounded bg-cream px-2 py-1 text-navy/80">
                                  <b>{lang === "en" ? "Example:" : "उदा:"}</b> {pickL(f.example_en, f.example_hi)}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {err && <div className="rounded bg-red-50 border border-red-200 p-2 text-red-700 text-sm mt-3">{err}</div>}

                <button
                  onClick={() => {
                    setDataUrl(null);
                    setComplaint(null);
                    setForm(null);
                    setFiledId(null);
                    setMode(null);
                    setErr(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="mt-4 text-sm text-navy/70 underline"
                >
                  {lang === "en" ? "Upload another" : "दूसरा अपलोड करें"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-float-up">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-display font-extrabold text-xl text-navy text-center">
              {s("whatHelp")}
            </h3>
            <div className="grid gap-3 mt-5">
              <button
                onClick={() => pick("complaint")}
                className="rounded-xl border-2 border-saffron/40 hover:border-saffron hover:bg-saffron/10 p-4 text-left flex items-center gap-3 transition"
              >
                <div className="text-3xl">🚧</div>
                <div>
                  <div className="font-bold text-navy">{s("optReport")}</div>
                  <div className="text-xs text-navy/70">{s("optReportDesc")}</div>
                </div>
              </button>
              <button
                onClick={() => pick("form")}
                className="rounded-xl border-2 border-india-green/40 hover:border-india-green hover:bg-india-green/10 p-4 text-left flex items-center gap-3 transition"
              >
                <div className="text-3xl">📝</div>
                <div>
                  <div className="font-bold text-navy">{s("optForm")}</div>
                  <div className="text-xs text-navy/70">{s("optFormDesc")}</div>
                </div>
              </button>
            </div>
            <button onClick={() => { setShowModal(false); setDataUrl(null); }} className="mt-4 w-full text-sm text-navy/60">
              {lang === "en" ? "Cancel" : "रद्द करें"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
