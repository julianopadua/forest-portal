import { NextResponse } from "next/server";

export const runtime = "edge";

type Payload = {
  message?: string;
  name?: string;
  email?: string;
  query?: string;
  hp?: string;
  locale?: string;
};

const lastByIp = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (body.hp) return NextResponse.json({ ok: true });

  const message = (body.message ?? "").trim();
  if (message.length < 3 || message.length > 4000) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  const ip = clientIp(req);
  const now = Date.now();
  const last = lastByIp.get(ip) ?? 0;
  if (now - last < RATE_LIMIT_MS) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  lastByIp.set(ip, now);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUGGEST_DATASET_TO || "contato@institutoforest.org";
  const from = process.env.SUGGEST_DATASET_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    console.error("[suggest-dataset] RESEND_API_KEY missing");
    return NextResponse.json({ error: "email_not_configured" }, { status: 500 });
  }

  const name = (body.name ?? "").trim().slice(0, 200);
  const email = (body.email ?? "").trim().slice(0, 200);
  const query = (body.query ?? "").trim().slice(0, 500);
  const isEn = body.locale === "en";

  const subject = isEn
    ? `[Forest] Dataset suggestion${query ? ` - search: "${query}"` : ""}`
    : `[Forest] Sugestão de dataset${query ? ` - busca: "${query}"` : ""}`;

  const html = isEn
    ? `
    <h2>New dataset suggestion</h2>
    ${query ? `<p><strong>Current search:</strong> ${escapeHtml(query)}</p>` : ""}
    ${name ? `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` : ""}
    ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
    <hr />
    <p style="color:#888;font-size:12px">IP: ${escapeHtml(ip)}</p>
  `
    : `
    <h2>Nova sugestão de dataset</h2>
    ${query ? `<p><strong>Busca atual:</strong> ${escapeHtml(query)}</p>` : ""}
    ${name ? `<p><strong>Nome:</strong> ${escapeHtml(name)}</p>` : ""}
    ${email ? `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>` : ""}
    <p><strong>Mensagem:</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(message)}</pre>
    <hr />
    <p style="color:#888;font-size:12px">IP: ${escapeHtml(ip)}</p>
  `;

  const text = isEn
    ? [
        query ? `Current search: ${query}` : null,
        name ? `Name: ${name}` : null,
        email ? `Email: ${email}` : null,
        "",
        "Message:",
        message,
        "",
        `IP: ${ip}`,
      ]
        .filter((l) => l !== null)
        .join("\n")
    : [
        query ? `Busca atual: ${query}` : null,
        name ? `Nome: ${name}` : null,
        email ? `E-mail: ${email}` : null,
        "",
        "Mensagem:",
        message,
        "",
        `IP: ${ip}`,
      ]
        .filter((l) => l !== null)
        .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Instituto Forest <${from}>`,
      to: [to],
      reply_to: email || undefined,
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[suggest-dataset] resend error", res.status, errText);
    return NextResponse.json({ error: "email_send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
