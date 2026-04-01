import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * Auto-generate stories from platform data + AI.
 * Types:
 * 1. AUTO — milestone stories from DB (student progress, fundraising milestones)
 * 2. AI — farming/agriculture/seasonal news via Claude API
 */

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80); }

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`admin-story-gen:${ip}`, { max: 5, windowSeconds: 300 });
  if (!limit.success) return NextResponse.json({ error: "Rate limited." }, { status: 429 });

  const { type } = await req.json();
  const created: string[] = [];

  try {
    if (type === "auto" || type === "both") {
      // Generate milestone stories from data
      const [fundedCases, completedCases, topStudents] = await Promise.all([
        prisma.report.findMany({
          where: { raisedAmount: { gt: 0 }, status: { in: ["APPROVED", "FUNDING"] } },
          orderBy: { raisedAmount: "desc" },
          take: 3,
          select: { id: true, title: true, raisedAmount: true, goalAmount: true, region: true },
        }),
        prisma.report.findMany({
          where: { status: "COMPLETED" },
          orderBy: { completedAt: "desc" },
          take: 3,
          select: { id: true, title: true, raisedAmount: true, region: true },
        }),
        prisma.student.findMany({
          where: { status: "APPROVED", raisedAmount: { gt: 0 } },
          orderBy: { raisedAmount: "desc" },
          take: 3,
          select: { id: true, name: true, raisedAmount: true, goalAmount: true, region: true },
        }),
      ]);

      for (const c of fundedCases) {
        const raised = Number(c.raisedAmount);
        const goal = Number(c.goalAmount);
        const pct = goal > 0 ? Math.round((raised / goal) * 100) : 0;
        if (pct > 0) {
          const slug = `progress-${slugify(c.title)}-${Date.now().toString(36)}`;
          await prisma.story.create({
            data: {
              slug,
              title: `${c.title} — ${pct}% Funded`,
              content: `The case "${c.title}" in ${c.region} region has reached ${pct}% of its $${goal.toLocaleString()} goal, with $${raised.toLocaleString()} raised so far. Every donation brings this community closer to the help they need.`,
              summary: `${pct}% funded — $${raised.toLocaleString()} of $${goal.toLocaleString()} raised`,
              source: "AUTO",
              category: "milestone",
              region: c.region,
              relatedType: "case",
              relatedId: c.id,
              status: "PENDING",
            },
          });
          created.push(`Milestone: ${c.title} (${pct}%)`);
        }
      }

      for (const s of topStudents) {
        const raised = Number(s.raisedAmount);
        if (raised > 0) {
          const slug = `student-progress-${slugify(s.name)}-${Date.now().toString(36)}`;
          await prisma.story.create({
            data: {
              slug,
              title: `${s.name}'s Education Journey — $${raised} Raised`,
              content: `${s.name} in ${s.region} region has received $${raised} in sponsorship support. This funding is helping cover school fees, supplies, and educational materials. Every dollar invested in education creates lasting change.`,
              summary: `$${raised} raised for ${s.name}'s education`,
              source: "AUTO",
              category: "milestone",
              region: s.region,
              relatedType: "student",
              relatedId: s.id,
              status: "PENDING",
            },
          });
          created.push(`Student milestone: ${s.name}`);
        }
      }
    }

    if (type === "ai" || type === "both") {
      // Generate AI farming/seasonal stories
      const month = new Date().getMonth();
      const seasonData = {
        season: month >= 3 && month <= 5 ? "Gu (main rainy season)" : month >= 9 && month <= 11 ? "Deyr (short rainy season)" : month >= 0 && month <= 2 ? "Jilaal (dry season)" : "Hagaa (dry season)",
        month: new Date().toLocaleDateString("en", { month: "long", year: "numeric" }),
      };

      if (process.env.ANTHROPIC_API_KEY) {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-6-20260327",
            max_tokens: 2000,
            system: `You write practical farming and agriculture news for communities in Somalia's Gedo region. Current season: ${seasonData.season}. Month: ${seasonData.month}. Write in simple, clear English that can be translated to Somali. Focus on actionable advice.`,
            messages: [
              { role: "user", content: `Generate 2 short news articles as JSON array. Each article: { "title": "...", "content": "... (200-400 words)", "category": "farming|agriculture|seasonal" }. Topics: 1) Current seasonal farming advice for Gedo region 2) Practical tip about livestock, irrigation, or crop management relevant to this season.` },
            ],
          }),
        });

        if (response.ok) {
          const aiResult = await response.json();
          const text = aiResult.content?.[0]?.text || "";
          const jsonMatch = text.match(/\[[\s\S]*\]/);

          if (jsonMatch) {
            const articles = JSON.parse(jsonMatch[0]);
            for (const article of articles) {
              const slug = `ai-${slugify(article.title)}-${Date.now().toString(36)}`;
              await prisma.story.create({
                data: {
                  slug,
                  title: article.title,
                  content: article.content,
                  summary: article.content.slice(0, 200),
                  source: "AI",
                  category: article.category || "farming",
                  region: "Gedo",
                  status: "PENDING",
                },
              });
              created.push(`AI: ${article.title}`);
            }
          }
        }
      } else {
        // Fallback: generate rule-based seasonal story
        const slug = `seasonal-update-${Date.now().toString(36)}`;
        await prisma.story.create({
          data: {
            slug,
            title: `${seasonData.season} Update — ${seasonData.month}`,
            content: `As ${seasonData.month} begins in Gedo region, the ${seasonData.season} brings both challenges and opportunities for local communities. Farmers should prepare their land and check irrigation systems. Livestock owners should ensure water access points are maintained. RajoRise continues to monitor conditions and support communities across the region.`,
            summary: `Seasonal update for Gedo region — ${seasonData.season}`,
            source: "AI",
            category: "seasonal",
            region: "Gedo",
            status: "PENDING",
          },
        });
        created.push(`Seasonal: ${seasonData.season} update`);
      }
    }

    return NextResponse.json({ success: true, created });
  } catch (error) {
    console.error("Story generation error:", error);
    return NextResponse.json({ error: "Generation failed." }, { status: 500 });
  }
}
