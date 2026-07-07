import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useLang, type Lang } from "@/lib/i18n";
import { aiVoiceAnswer } from "@/lib/ai.functions";
import { ChakraIcon } from "./ChakraIcon";

// Minimal typing for Web Speech Recognition
type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

function getRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  const C = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return C ? new C() : null;
}

export function VoiceCopilot() {
  const { lang: uiLang, s } = useLang();
  const [voiceLang, setVoiceLang] = useState<Lang>(uiLang);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const ask = useServerFn(aiVoiceAnswer);

  useEffect(() => setVoiceLang(uiLang), [uiLang]);

  const start = () => {
    setErr(null);
    setAnswer("");
    setTranscript("");
    const rec = getRecognition();
    if (!rec) {
      setErr(
        uiLang === "en"
          ? "Speech recognition not supported in this browser."
          : "यह ब्राउज़र वॉइस पहचान का समर्थन नहीं करता।",
      );
      return;
    }
    rec.lang = voiceLang === "hi" ? "hi-IN" : "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e) => {
      const text = Array.from(e.results as unknown as Array<{ 0: { transcript: string } }>)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(text);
      submit(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const stop = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const submit = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const r = await ask({ data: { text, lang: voiceLang } });
      setAnswer(r.answer);
      speak(r.answer);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voiceLang === "hi" ? "hi-IN" : "en-IN";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  return (
    <section id="voice" className="scroll-mt-20 py-14 bg-tricolor-soft chakra-watermark">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display font-extrabold text-3xl md:text-4xl text-navy">
          {s("voiceTitle")}
        </h2>
        <p className="text-navy/70 mt-2">{s("voiceDesc")}</p>

        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setVoiceLang("hi")}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${voiceLang === "hi" ? "btn-green border-transparent" : "bg-white text-navy border-navy/15"}`}
          >
            🇮🇳 हिन्दी
          </button>
          <button
            onClick={() => setVoiceLang("en")}
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${voiceLang === "en" ? "btn-green border-transparent" : "bg-white text-navy border-navy/15"}`}
          >
            🇬🇧 English
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={listening ? stop : start}
            className={`w-32 h-32 rounded-full font-bold text-white shadow-2xl inline-flex items-center justify-center transition-all ${
              listening ? "bg-red-500 animate-pulse scale-110" : "btn-saffron"
            }`}
            aria-label="Microphone"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-5xl">🎤</span>
            </div>
          </button>
          <div className="text-navy font-semibold">
            {listening ? s("listening") : loading ? s("thinking") : s("tapToSpeak")}
          </div>
        </div>

        {transcript && (
          <div className="mt-6 card-elevate rounded-2xl p-4 text-left">
            <div className="text-xs uppercase font-bold text-saffron-deep">
              {voiceLang === "hi" ? "आपने कहा" : "You said"}
            </div>
            <div className="text-navy mt-1">{transcript}</div>
          </div>
        )}

        {answer && (
          <div className="mt-3 card-elevate rounded-2xl p-4 text-left animate-float-up">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase font-bold text-india-green-deep">
                {voiceLang === "hi" ? "स्मार्ट भारत" : "Smart Bharat"}
              </div>
              <button
                onClick={() => speak(answer)}
                className="text-xs inline-flex items-center gap-1 text-navy hover:text-saffron-deep"
              >
                🔊 {s("speak")}
              </button>
            </div>
            <div className="text-navy mt-1 whitespace-pre-wrap">{answer}</div>
          </div>
        )}
        {err && (
          <div className="mt-3 rounded bg-red-50 border border-red-200 p-2 text-red-700 text-sm">
            {err}
          </div>
        )}
      </div>
    </section>
  );
}
