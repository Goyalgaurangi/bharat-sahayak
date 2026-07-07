// Server-only helper for calling Lovable AI Gateway.
const BASE = "https://ai.gateway.lovable.dev/v1";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;
};

export async function callAI(opts: {
  model?: string;
  messages: ChatMessage[];
  json?: boolean;
  temperature?: number;
}): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const body: Record<string, unknown> = {
    model: opts.model ?? "google/gemini-2.5-flash",
    messages: opts.messages,
  };
  if (opts.json) body.response_format = { type: "json_object" };
  if (opts.temperature != null) body.temperature = opts.temperature;

  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`AI Gateway ${res.status}: ${txt}`);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content ?? "";
}

export function extractJSON<T = unknown>(s: string): T {
  const cleaned = s
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const m = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]) as T;
    throw new Error("Failed to parse AI JSON: " + s.slice(0, 200));
  }
}
