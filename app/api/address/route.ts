import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const apiKey = process.env.GETADDRESS_API_KEY;

  if (!query || !apiKey) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const res = await fetch(
      `https://api.getaddress.io/autocomplete/${encodeURIComponent(query)}?api-key=${apiKey}&all=true`,
      {
        cache: "no-store",
        headers: {
          "Referer": "https://marchbloomlaw.com",
          "Origin": "https://marchbloomlaw.com",
        },
      }
    );
    const data = await res.json();
    console.log("[address API] raw response:", JSON.stringify(data).slice(0, 300));
    return NextResponse.json({ suggestions: data.suggestions ?? [] });
  } catch (err) {
    console.error("[address API] error:", err);
    return NextResponse.json({ suggestions: [] });
  }
}