import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callAI, extractJSON } from "./ai-gateway.server";

// -------- Chat Navigator --------
const NavigatorInput = z.object({ query: z.string().min(2), lang: z.enum(["en", "hi"]) });

export type NavigatorResult = {
  title_en: string;
  title_hi: string;
  steps: { en: string; hi: string }[];
  documents: { en: string; hi: string }[];
  fees_en: string;
  fees_hi: string;
  time_en: string;
  time_hi: string;
  office_en: string;
  office_hi: string;
  mistakes: { en: string; hi: string }[];
  roadmap: { when_en: string; when_hi: string; task_en: string; task_hi: string }[];
  estimated_days: number;
};

export const aiNavigator = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NavigatorInput.parse(d))
  .handler(async ({ data }): Promise<NavigatorResult> => {
    const sys = `You are Smart Bharat, an AI civic assistant for Indian citizens.
For any citizen need, respond ONLY with valid JSON (no markdown fences) matching this schema:
{
  "title_en": string, "title_hi": string,
  "steps": [{"en": string, "hi": string}, ...] (5-8 steps),
  "documents": [{"en": string, "hi": string}, ...] (3-6 docs),
  "fees_en": string, "fees_hi": string,
  "time_en": string, "time_hi": string,
  "office_en": string (mock nearest office name+city),
  "office_hi": string,
  "mistakes": [{"en": string, "hi": string}, ...] (3-4 items),
  "roadmap": [
    {"when_en": "Today", "when_hi": "आज", "task_en": "...", "task_hi": "..."},
    {"when_en": "Tomorrow", "when_hi": "कल", "task_en": "...", "task_hi": "..."},
    {"when_en": "This Week", "when_hi": "इस सप्ताह", "task_en": "...", "task_hi": "..."},
    {"when_en": "Next Week", "when_hi": "अगले सप्ताह", "task_en": "...", "task_hi": "..."}
  ],
  "estimated_days": number
}
Use real Indian government process facts. Hindi must be in Devanagari script.`;
    const out = await callAI({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: data.query },
      ],
      json: true,
    });
    return extractJSON<NavigatorResult>(out);
  });

// -------- Schemes --------
const SchemesInput = z.object({
  profile: z.enum(["student", "jobseeker", "farmer", "senior", "woman"]),
});
export type Scheme = {
  name_en: string;
  name_hi: string;
  benefit_en: string;
  benefit_hi: string;
  eligibility_en: string;
  eligibility_hi: string;
  apply_url: string;
  emoji: string;
};

export const aiSchemes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SchemesInput.parse(d))
  .handler(async ({ data }): Promise<Scheme[]> => {
    const sys = `You are Smart Bharat. Return ONLY valid JSON array (no markdown) of 8-12 real Indian government schemes relevant to the given profile.
Each: { "name_en", "name_hi" (Devanagari), "benefit_en", "benefit_hi", "eligibility_en", "eligibility_hi", "apply_url" (real gov.in URL if possible), "emoji" }.
Keep each field concise (under 20 words).`;
    const out = await callAI({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: `Profile: ${data.profile}. Give me 10 schemes as JSON array.` },
      ],
      json: true,
    });
    const parsed = extractJSON<Scheme[] | { schemes: Scheme[] }>(out);
    return Array.isArray(parsed) ? parsed : parsed.schemes;
  });

// -------- Image Analysis --------
const ImageAnalysisInput = z.object({
  imageDataUrl: z.string().min(20),
  mode: z.enum(["complaint", "form"]),
});
export type ComplaintAnalysis = {
  issue_type_en: string;
  issue_type_hi: string;
  category: string;
  urgency: "Low" | "Medium" | "High";
  urgency_hi: string;
  department_en: string;
  department_hi: string;
  description_en: string;
  description_hi: string;
};
export type FormAnalysis = {
  form_name_en: string;
  form_name_hi: string;
  fields: {
    label_en: string;
    label_hi: string;
    explanation_en: string;
    explanation_hi: string;
    example_en: string;
    example_hi: string;
  }[];
};

export const aiAnalyzeImage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ImageAnalysisInput.parse(d))
  .handler(async ({ data }): Promise<ComplaintAnalysis | FormAnalysis> => {
    if (data.mode === "complaint") {
      const sys = `You are a civic complaint analyzer for India. Look at the image and return ONLY JSON:
{"issue_type_en", "issue_type_hi" (Devanagari), "category" (one of: pothole, streetlight, garbage, water, sewage, traffic, other), "urgency" ("Low"|"Medium"|"High"), "urgency_hi", "department_en" (Indian civic dept name), "department_hi", "description_en" (formal 2-sentence complaint text), "description_hi"}.`;
      const out = await callAI({
        messages: [
          { role: "system", content: sys },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this civic issue photo and produce a complaint." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        json: true,
      });
      return extractJSON<ComplaintAnalysis>(out);
    } else {
      const sys = `You are a form-explaining assistant for Indian government forms. Look at the form image and return ONLY JSON:
{"form_name_en", "form_name_hi", "fields": [{"label_en","label_hi","explanation_en" (simple, what to enter and why),"explanation_hi","example_en" (a sample value),"example_hi"}, ...]}.
Cover 5-10 key fields. Hindi in Devanagari.`;
      const out = await callAI({
        messages: [
          { role: "system", content: sys },
          {
            role: "user",
            content: [
              { type: "text", text: "Explain each field of this form in simple terms." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        json: true,
      });
      return extractJSON<FormAnalysis>(out);
    }
  });

// -------- Voice Q&A --------
const VoiceInput = z.object({ text: z.string().min(2), lang: z.enum(["en", "hi"]) });
export const aiVoiceAnswer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => VoiceInput.parse(d))
  .handler(async ({ data }): Promise<{ answer: string }> => {
    const sys =
      data.lang === "hi"
        ? "आप स्मार्ट भारत हैं — भारतीय नागरिकों के लिए एक सरल एआई सहायक। संक्षिप्त, स्पष्ट देवनागरी हिंदी में उत्तर दें। अधिकतम 4-5 वाक्य। तकनीकी शब्द कम रखें।"
        : "You are Smart Bharat, a simple AI civic assistant for Indian citizens. Answer clearly in 4-5 sentences max. Avoid jargon.";
    const out = await callAI({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: data.text },
      ],
      temperature: 0.6,
    });
    return { answer: out.trim() };
  });

// -------- News --------
export type NewsItem = { title: string; title_hi?: string; link: string; source?: string; pubDate?: string };
export const fetchIndiaNews = createServerFn({ method: "GET" }).handler(async (): Promise<NewsItem[]> => {
  // Google News RSS -> JSON via public rss2json (no key required for low volume)
  const url =
    "https://api.rss2json.com/v1/api.json?rss_url=" +
    encodeURIComponent("https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en");
  try {
    const res = await fetch(url, { headers: { "User-Agent": "SmartBharat/1.0" } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as {
      items?: { title: string; link: string; pubDate: string; author?: string }[];
    };
    return (data.items ?? []).slice(0, 12).map((it) => ({
      title: it.title,
      link: it.link,
      pubDate: it.pubDate,
      source: it.author,
    }));
  } catch {
    // graceful fallback
    return [
      { title: "PM launches new digital India initiative", link: "https://pib.gov.in" },
      { title: "Union Budget highlights schemes for farmers", link: "https://pib.gov.in" },
      { title: "ISRO announces next lunar mission", link: "https://isro.gov.in" },
      { title: "Aadhaar update deadline extended", link: "https://uidai.gov.in" },
      { title: "PM Kisan 16th installment released", link: "https://pmkisan.gov.in" },
    ];
  }
});
