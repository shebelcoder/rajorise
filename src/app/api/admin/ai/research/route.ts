import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`ai-research:${ip}`, { max: 5, windowSeconds: 300 });
  if (!limit.success) return NextResponse.json({ error: "Rate limited." }, { status: 429 });

  const { topic } = await req.json();
  if (!topic) return NextResponse.json({ error: "Topic required." }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      title: `${topic} — Research Report`,
      content: `This is a placeholder research report about "${topic}" for the Gedo region of Somalia. To generate real AI-powered research, add the ANTHROPIC_API_KEY environment variable.\n\nTopic: ${topic}\nRegion: Gedo, Somalia\nGenerated: ${new Date().toLocaleDateString()}`,
      category: "research",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6-20260327",
        max_tokens: 3000,
        system: `You are a research writer for RajoRise, a humanitarian platform operating in Gedo region, Somalia. Write detailed, informative articles about topics relevant to the community. Focus on practical, actionable information. Consider local context: farming seasons (Gu Apr-Jun, Deyr Oct-Dec), livestock, drought, water access, education challenges. Write in clear, professional English. Format: include a compelling title, then the full article content (600-1000 words).`,
        messages: [
          {
            role: "user",
            content: `Write a detailed research article about: "${topic}"\n\nThis article will be published on the RajoRise platform for donors and community members. Make it informative, well-structured, and relevant to Somalia's Gedo region.\n\nRespond as JSON: { "title": "...", "content": "...", "category": "farming|agriculture|seasonal|health|education|infrastructure|community" }`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI research API error:", response.status, errText);
      return NextResponse.json({ error: `AI research failed (${response.status}). Check ANTHROPIC_API_KEY.` }, { status: 500 });
    }

    const result = await response.json();
    const text = result.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        title: parsed.title || `${topic} — Research`,
        content: parsed.content || text,
        category: parsed.category || "research",
      });
    }

    return NextResponse.json({ title: `${topic}`, content: text, category: "research" });
  } catch (error) {
    console.error("AI research error:", error);
    return NextResponse.json({ error: "Research generation failed." }, { status: 500 });
  }
}
