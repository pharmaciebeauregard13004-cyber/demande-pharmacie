import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const webhook = process.env.MAKE_WEBHOOK_URL;
  if (!webhook) {
    return new NextResponse("MAKE_WEBHOOK_URL missing", { status: 500 });
  }

  const body = await req.json();

  const r = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!r.ok) {
    const t = await r.text().catch(() => "");
    return new NextResponse(t || `Make webhook error (${r.status})`, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
