import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * AI Intelligence Engine
 *
 * Architecture:
 * 1. Reads platform data from DB (donations, cases, users, regions)
 * 2. Builds a context snapshot
 * 3. Sends to Claude API for analysis
 * 4. Returns structured insights
 *
 * The AI never acts autonomously — it only provides recommendations.
 */

async function gatherPlatformData() {
  const [
    totalDonations,
    donationCount,
    totalUsers,
    totalDonors,
    totalJournalists,
    totalCases,
    casesByStatus,
    casesByRegion,
    recentDonations,
    recentCases,
    topFundedCases,
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "CONFIRMED" } }),
    prisma.donation.count({ where: { status: "CONFIRMED" } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "DONOR" } }),
    prisma.user.count({ where: { role: "JOURNALIST" } }),
    prisma.report.count(),
    prisma.report.groupBy({ by: ["status"], _count: true }),
    prisma.report.groupBy({ by: ["region"], _count: true, orderBy: { _count: { region: "desc" } } }),
    prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { amount: true, createdAt: true, report: { select: { title: true, region: true } } },
    }),
    prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { title: true, status: true, region: true, district: true, goalAmount: true, raisedAmount: true, createdAt: true },
    }),
    prisma.report.findMany({
      where: { status: { in: ["APPROVED", "FUNDING", "COMPLETED"] } },
      orderBy: { raisedAmount: "desc" },
      take: 5,
      select: { title: true, goalAmount: true, raisedAmount: true, region: true, status: true },
    }),
  ]);

  return {
    overview: {
      totalRaised: Number(totalDonations._sum.amount || 0),
      donationCount,
      totalUsers,
      totalDonors,
      totalJournalists,
      totalCases,
    },
    casesByStatus: casesByStatus.map((s) => ({ status: s.status, count: s._count })),
    casesByRegion: casesByRegion.map((r) => ({ region: r.region, count: r._count })),
    recentDonations: recentDonations.map((d) => ({
      amount: Number(d.amount),
      date: d.createdAt.toISOString().split("T")[0],
      case: d.report?.title || "General",
      region: d.report?.region || "Unknown",
    })),
    recentCases: recentCases.map((c) => ({
      title: c.title,
      status: c.status,
      region: c.region,
      district: c.district,
      goal: Number(c.goalAmount),
      raised: Number(c.raisedAmount),
      created: c.createdAt.toISOString().split("T")[0],
    })),
    topFundedCases: topFundedCases.map((c) => ({
      title: c.title,
      goal: Number(c.goalAmount),
      raised: Number(c.raisedAmount),
      region: c.region,
      status: c.status,
    })),
    context: {
      currentDate: new Date().toISOString().split("T")[0],
      platform: "RajoRise — Humanitarian donation platform for Somalia",
      activeRegion: "Gedo",
      currency: "USD",
      seasonalNote: "Somalia has two rainy seasons: Gu (Apr-Jun) and Deyr (Oct-Dec). Dry seasons: Jilaal (Jan-Mar), Hagaa (Jul-Sep).",
    },
  };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = getClientIp(req.headers);
  const limit = rateLimit(`admin-ai:${ip}`, { max: 10, windowSeconds: 300 });
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limited. Try again in a few minutes." }, { status: 429 });
  }

  const { prompt } = await req.json();
  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt required." }, { status: 400 });
  }

  try {
    const data = await gatherPlatformData();

    // If no Claude API key, use rule-based analysis
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(generateRuleBasedInsights(data, prompt));
    }

    // Call Claude API
    const systemPrompt = `You are the AI intelligence engine for RajoRise, a humanitarian donation platform operating in Somalia (currently piloting in Gedo region).

Your role is to analyze platform data and provide strategic insights to the admin team. You are a business strategist, operations advisor, and field analyst.

IMPORTANT RULES:
- Be specific and data-driven. Use actual numbers from the data.
- Consider seasonal factors (Somalia's rainy/dry seasons).
- Think about agriculture, livestock, and community needs.
- Recommend concrete, actionable steps.
- Never make things up — only analyze what the data shows.
- Format your response as JSON with these exact keys: summary, insights, risks, opportunities, actions
- Each key (except summary) should be an array of strings.
- summary should be a single string paragraph.

Current platform data:
${JSON.stringify(data, null, 2)}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          { role: "user", content: prompt },
        ],
        system: systemPrompt,
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", await response.text());
      return NextResponse.json(generateRuleBasedInsights(data, prompt));
    }

    const aiResult = await response.json();
    const text = aiResult.content?.[0]?.text || "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({
        summary: parsed.summary || "Analysis complete.",
        insights: parsed.insights || [],
        risks: parsed.risks || [],
        opportunities: parsed.opportunities || [],
        actions: parsed.actions || [],
      });
    }

    return NextResponse.json(generateRuleBasedInsights(data, prompt));
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json({ error: "AI analysis failed." }, { status: 500 });
  }
}

/**
 * Rule-based fallback when Claude API key is not configured.
 * Generates insights from raw data patterns.
 */
function generateRuleBasedInsights(
  data: Awaited<ReturnType<typeof gatherPlatformData>>,
  prompt: string
) {
  const { overview, casesByStatus, casesByRegion, topFundedCases, context } = data;
  const insights: string[] = [];
  const risks: string[] = [];
  const opportunities: string[] = [];
  const actions: string[] = [];

  // Overview insights
  if (overview.totalRaised > 0) {
    const avgDonation = overview.donationCount > 0 ? Math.round(overview.totalRaised / overview.donationCount) : 0;
    insights.push(`Platform has raised $${overview.totalRaised.toLocaleString()} from ${overview.donationCount} donations (avg $${avgDonation}).`);
  } else {
    insights.push("No donations recorded yet. Platform is in pre-launch or early stage.");
    actions.push("Run a test donation to verify the Stripe integration works end-to-end.");
  }

  insights.push(`${overview.totalUsers} users registered: ${overview.totalDonors} donors, ${overview.totalJournalists} journalists.`);
  insights.push(`${overview.totalCases} total cases across the platform.`);

  // Case status analysis
  const pendingCount = casesByStatus.find((s) => s.status === "PENDING")?.count || 0;
  const draftCount = casesByStatus.find((s) => s.status === "DRAFT")?.count || 0;
  if (pendingCount > 3) {
    risks.push(`${pendingCount} cases pending review — delays reduce donor trust. Review within 24h.`);
    actions.push(`Prioritize reviewing the ${pendingCount} pending cases immediately.`);
  }
  if (draftCount > 5) {
    insights.push(`${draftCount} draft cases suggest journalists may need support completing reports.`);
    actions.push("Reach out to journalists with incomplete drafts to offer assistance.");
  }

  // Region analysis
  if (casesByRegion.length > 0) {
    const topRegion = casesByRegion[0];
    insights.push(`${topRegion.region} has the most cases (${topRegion.count}). This is your most active coverage area.`);
  }

  // Journalist coverage
  if (overview.totalJournalists === 0) {
    risks.push("No journalists registered. Content pipeline is blocked.");
    actions.push("Recruit and onboard at least 2-3 field journalists in Gedo region.");
  } else if (overview.totalJournalists < 3) {
    risks.push(`Only ${overview.totalJournalists} journalist(s) — single point of failure for content.`);
    actions.push("Recruit additional journalists to ensure consistent coverage.");
  }

  // Donor analysis
  if (overview.totalDonors === 0) {
    opportunities.push("No donors registered yet — launch marketing campaign to attract initial donors.");
    actions.push("Share platform link on social media and diaspora community groups.");
  }

  // Seasonal awareness
  const month = new Date().getMonth();
  if (month >= 3 && month <= 5) {
    insights.push("Gu rainy season (Apr-Jun) is active — flooding risk in low-lying areas.");
    opportunities.push("Prepare emergency relief cases for potential flood-affected communities.");
    actions.push("Alert journalists in Gedo to document any flood impacts for rapid case creation.");
  } else if (month >= 9 && month <= 11) {
    insights.push("Deyr rainy season (Oct-Dec) is approaching — prepare for agricultural support needs.");
    opportunities.push("Launch seed distribution program to support farmers.");
  } else if (month >= 0 && month <= 2) {
    insights.push("Jilaal dry season (Jan-Mar) — water scarcity is a primary concern.");
    opportunities.push("Focus on water delivery projects during dry season.");
    actions.push("Prioritize water-related cases and increase water project visibility.");
  } else {
    insights.push("Hagaa dry season (Jul-Sep) — livestock and water needs are high.");
    opportunities.push("Consider livestock support programs and water trucking.");
  }

  // Top funded cases
  if (topFundedCases.length > 0) {
    const topCase = topFundedCases[0];
    if (topCase.raised > 0) {
      insights.push(`Top funded case: "${topCase.title}" ($${topCase.raised.toLocaleString()} of $${topCase.goal.toLocaleString()}).`);
    }
  }

  // Expansion opportunities
  opportunities.push("Current operations are limited to Gedo. Bay and Jubbada Hoose regions are natural expansion targets.");
  if (overview.totalRaised > 1000) {
    actions.push("Consider piloting in Bay region (Baidoa) — closest major city to Gedo with significant need.");
  }

  return {
    summary: `RajoRise platform analysis as of ${context.currentDate}. Currently operating in ${context.activeRegion} region with ${overview.totalCases} cases, ${overview.totalDonors} donors, and $${overview.totalRaised.toLocaleString()} raised. ${prompt.toLowerCase().includes("expand") ? "Expansion analysis included below." : "See detailed breakdown below."}`,
    insights,
    risks,
    opportunities,
    actions,
  };
}
