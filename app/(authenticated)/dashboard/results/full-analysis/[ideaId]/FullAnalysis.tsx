"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
// import { getFullAnalysis } from "@/lib/api";
import { IdeaValidationResult } from "@/app/actions/getIdeaWithBasicResults";
import { getFullIdeaAnalysisAI } from "@/app/actions/ai-actions/newIdeaAnalysisFull";
interface FullIdeaAnalysis {
  idea: StartupIdea;
  competitors: any[]
  marketData: any | null
  failureCases: any[]
  successCases: any[]
  regulatoryItems: any[]
  marketTrends: any[]
  fundingSources: any[]
  risks: any[]
  aiInsights: any[]
  strategicRecommendations: any[]
  customerSegments: any[]
  benchmarks: any[]
  detailedReports: any[]
}
import {
  ArrowLeft,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Factory,
  LineChart,
  Shield,
  Target,
  Users,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { StartupIdea } from "@/app/actions/fullIdeaAnalysis";
import { getSingleIdeaResult } from "@/app/actions/ai-actions/ideaAnalysisCreationAndResults";
import LoadingIcon from "@/components/icons/loading-icon";

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-rose-600";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-emerald-50";
  if (score >= 60) return "bg-amber-50";
  return "bg-rose-50";
};

function formatCurrency(value?: number | null) {
  if (value == null) return "N/A";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function formatPercent(value?: number | null) {
  if (value == null) return "N/A";
  return `${value.toFixed(1)}%`;
}

export function FullAnalysisPage({
  ideaId,
}: {
  ideaId: string
}) {
  // const ideaId = params.ideaId;


  const {
    data: analysis,
    isLoading,
    isError,
  } = useQuery<FullIdeaAnalysis>({
    queryKey: ["full-analysis", ideaId],
    queryFn: () => {
      // let currentAnalysis = getFullAnalysis(ideaId)

      return getFullIdeaAnalysisAI(ideaId);
    },
    enabled: !!ideaId,
  });

  console.log({ analysis })

  const { data: summaryResult } = useQuery<IdeaValidationResult>({
    queryKey: ["idea-result", ideaId],
    queryFn: () => getSingleIdeaResult(ideaId),
    // queryFn: () => getSingleIdeaResultsForCurrentUser(ideaId),
    enabled: !!ideaId,
  });

  const primaryBenchmark = useMemo(() => {
    if (!analysis?.benchmarks?.length) return null;
    return analysis.benchmarks[0];
  }, [analysis]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Link
              href="/dashboard/results"
              className="inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Results</span>
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            Full AI Analysis
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed mt-2">
            Deep dive into market context, competitors, risks, funding landscape and strategic recommendations tailored for your idea in the Pakistani healthcare ecosystem.
          </p>
        </div>
      </div>


      {isLoading && (
        <Card className="border-0   ">
          <CardContent className="p-8 ">
          <section className="flex items-center gap-4 justify-center">
              <Brain className="h-6 w-6 animate-pulse text-primary" />
              <span className="text-lg font-semibold text-foreground">Our AI co-pilot is preparing your full analysis...</span>
             
          </section>
          <div className=" w-fit mx-auto">
             <LoadingIcon/>
          </div>
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-rose-50 to-red-50 border-l-4 border-rose-600">
          <CardContent className="p-8 flex items-center gap-4">
            <AlertTriangle className="h-6 w-6 text-rose-600 flex-shrink-0" />
            <span className="text-lg font-semibold text-foreground">Could not load full analysis. Please try again later.</span>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <>
          {/* Hero Overview */}
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <CardContent className="p-0">
              <div className="p-8 md:p-12 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="space-y-4 max-w-2xl flex-1">
                  <div className="inline-flex items-center gap-2.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold backdrop-blur-sm border border-white/20">
                    <Brain className="h-4 w-4" />
                    <span>AI-powered deep analysis</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                    {analysis.idea?.title}
                  </h2>
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {analysis.idea?.category && (
                      <Badge className="bg-white/20 text-white border-white/40 font-bold hover:bg-white/30 transition-colors">
                        <Building2 className="mr-1.5 h-3 w-3" />
                        {analysis.idea.category}
                      </Badge>
                    )}
                    {analysis.idea?.stage && (
                      <Badge className="bg-white/20 text-white border-white/40 font-bold hover:bg-white/30 transition-colors">
                        <Target className="mr-1.5 h-3 w-3" />
                        {analysis.idea.stage}
                      </Badge>
                    )}
                    <Badge className="bg-white/20 text-white border-white/40 font-bold hover:bg-white/30 transition-colors">
                      <BarChart3 className="mr-1.5 h-3 w-3" />
                      Market & risk insights
                    </Badge>
                  </div>
                </div>

                {analysis.marketData && (
                  <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Est. market size</p>
                      <p className="text-3xl font-black">
                        {formatCurrency(analysis.marketData.market_size_usd)}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">Growth rate</p>
                      <p className="text-3xl font-black text-emerald-300">
                        {formatPercent(analysis.marketData.market_growth_rate_percent)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* First row: Market + Benchmarks */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Market insights */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader className="pb-6 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <LineChart className="h-5 w-5 text-primary" />
                  </div>
                  Market & opportunity
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  High-level view of market size, gaps and trends for your focus area.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {analysis.marketData ? (
                  <>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 text-center hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Market size (est.)</p>
                        <p className="text-2xl font-bold mt-3 text-foreground">
                          {formatCurrency(analysis.marketData.market_size_usd)}
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 text-center hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Growth rate</p>
                        <p className="text-2xl font-bold mt-3 text-emerald-600">
                          {formatPercent(analysis.marketData.market_growth_rate_percent)}
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 text-center hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Opportunity score</p>
                        <p className="text-2xl font-bold mt-3 text-purple-600">
                          {analysis.marketData.opportunity_score ?? "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {analysis.marketData.market_gaps && analysis.marketData.market_gaps.length > 0 && (
                        <div className="space-y-3">
                          <p className="font-bold text-sm flex items-center gap-2.5 text-foreground">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Target className="h-4 w-4 text-primary" />
                            </div>
                            Key market gaps
                          </p>
                          <ul className="space-y-2">
                            {analysis.marketData.market_gaps.map((gap: any, i: number) => (
                              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
                                <span>{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.marketData.market_trends && analysis.marketData.market_trends.length > 0 && (
                        <div className="space-y-3">
                          <p className="font-bold text-sm flex items-center gap-2.5 text-foreground">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <LineChart className="h-4 w-4 text-primary" />
                            </div>
                            Notable trends
                          </p>
                          <ul className="space-y-2">
                            {analysis.marketData.market_trends.map((trend: any, i: number) => (
                              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                <span className="text-primary font-bold flex-shrink-0 mt-0.5">•</span>
                                <span>{trend}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm italic p-4 rounded-lg bg-slate-50">
                    No market data available yet for this category.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Benchmarks */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  Startup benchmarks
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  Typical metrics for similar-stage startups in this space.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pt-6">
                {primaryBenchmark ? (
                  <div className="space-y-3">
                    {analysis.benchmarks.map((b: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-foreground text-sm">{b.metric_name}</span>
                        </div>
                        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span className="font-medium">Median:</span>
                            <span className="font-semibold text-foreground">{b.median_value ?? "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Best in class:</span>
                            <span className="font-semibold text-foreground">{b.best_in_class_value ?? "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic p-4 bg-slate-50 rounded-lg text-sm">
                    No benchmark data yet for this category/stage.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Second row: Competitors + Regulatory & Risks */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Competitors */}
            <Card className="border-0 shadow-lg lg:col-span-2">
              <CardHeader className="pb-6 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Factory className="h-5 w-5 text-primary" />
                  </div>
                  Competitive landscape
                </CardTitle>
                <CardDescription className="mt-1 text-sm">
                  How similar solutions are positioned and where you can differentiate.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4 pt-6">
                {analysis.competitors.length === 0 && (
                  <p className="text-muted-foreground text-sm italic col-span-full p-4 bg-slate-50 rounded-lg">
                    No competitor records yet. This will grow as we enrich the knowledge base.
                  </p>
                )}
                {analysis.competitors.map((c: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm flex items-center gap-2 text-foreground">
                          <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                          {c.competitor_name}
                        </p>
                        {c.market_position && (
                          <p className="text-xs text-muted-foreground mt-1.5">{c.market_position}</p>
                        )}
                      </div>
                      {c.funding_raised != null && (
                        <Badge variant="outline" className="text-xs font-bold whitespace-nowrap flex-shrink-0">
                          💰 {formatCurrency(c.funding_raised)}
                        </Badge>
                      )}
                    </div>
                    {c.competitor_description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.competitor_description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      {c.strengths && c.strengths.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-emerald-200/50">
                          <p className="font-bold mb-2 flex items-center gap-1.5 text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Strengths
                          </p>
                          <ul className="space-y-1 text-muted-foreground">
                            {c.strengths.map((s: any, idx: number) => (
                              <li key={idx} className="flex gap-1">
                                <span className="text-emerald-600 flex-shrink-0">✓</span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {c.weaknesses && c.weaknesses.length > 0 && (
                        <div className="p-3 rounded-xl bg-white border border-amber-200/50">
                          <p className="font-bold mb-2 flex items-center gap-1.5 text-amber-700">
                            <AlertTriangle className="h-3 w-3" />
                            Gaps
                          </p>
                          <ul className="space-y-1 text-muted-foreground">
                            {c.weaknesses.map((w: any, idx: number) => (
                              <li key={idx} className="flex gap-1">
                                <span className="text-amber-600 flex-shrink-0">⚠</span>
                                <span>{w}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Regulatory & risks */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6 border-b border-slate-200/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    Regulatory focus
                  </CardTitle>
                  <p className="text-xs font-semibold text-muted-foreground mt-1">(Pakistan)</p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm pt-6">
                  {analysis.regulatoryItems.length === 0 && (
                    <p className="text-muted-foreground text-sm italic p-4 bg-slate-50 rounded-lg">
                      No regulatory items yet. As we enrich the library, you will see more concrete checklists here.
                    </p>
                  )}
                  {analysis.regulatoryItems.map((r: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-blue-50 border border-blue-200/50">
                      <p className="font-bold text-sm flex items-center gap-2 text-foreground">
                        <Shield className="h-4 w-4 text-blue-600" />
                        {r.requirement_name}
                      </p>
                      {r.requirement_description && (
                        <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed">
                          {r.requirement_description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground font-medium">
                        {r.approval_body && <span>Body: <span className="text-foreground">{r.approval_body}</span></span>}
                        {r.severity_level && <span>Impact: <span className="text-foreground">{r.severity_level}</span></span>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6 border-b border-slate-200/50">
                  <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-rose-600" />
                    </div>
                    Key risks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm pt-6">
                  {analysis.risks.length === 0 && (
                    <p className="text-muted-foreground text-sm italic p-4 bg-slate-50 rounded-lg">
                      No explicit risk records yet. Initial defaults will appear as your idea is processed.
                    </p>
                  )}
                  {analysis.risks.map((r: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-rose-50 border border-rose-200/50 flex gap-3 items-start">
                      <AlertTriangle className="h-4 w-4 mt-0.5 text-rose-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{r.risk_name}</p>
                        {r.risk_description && (
                          <p className="text-xs text-muted-foreground mt-2">{r.risk_description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground font-medium">
                          {r.risk_type && <span className="uppercase tracking-widest text-foreground">{r.risk_type}</span>}
                          {r.probability_percent != null && (
                            <span>Prob: <span className="text-foreground">{formatPercent(r.probability_percent)}</span></span>
                          )}
                          {r.impact_level && <span>Impact: <span className="text-foreground">{r.impact_level}</span></span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Third row: Funding, AI insights, case studies */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Funding */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  Funding landscape
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pt-6">
                {analysis.fundingSources.length === 0 && (
                  <p className="text-muted-foreground text-sm italic p-4 bg-slate-50 rounded-lg">
                    We are still building the funding map for this space.
                  </p>
                )}
                {analysis.fundingSources.map((f: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/50">
                    <p className="font-bold text-sm flex items-center gap-2 text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      {f.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                      {f.funder_type && <span className="font-medium bg-white/60 px-2 py-1 rounded">{f.funder_type}</span>}
                      {f.category_focus && f.category_focus.length > 0 && (
                        <span className="font-medium">Focus: {f.category_focus.join(", ")}</span>
                      )}
                      {f.stage_focus && f.stage_focus.length > 0 && (
                        <span className="font-medium">Stages: {f.stage_focus.join(", ")}</span>
                      )}
                    </div>
                    {(f.typical_check_size_min != null || f.typical_check_size_max != null) && (
                      <p className="text-xs text-muted-foreground mt-3 font-medium">
                        Typical cheque: <span className="text-foreground">{formatCurrency(f.typical_check_size_min)} - {formatCurrency(f.typical_check_size_max)}</span>
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI insights */}
            <Card className="border-0 shadow-lg lg:col-span-1">
              <CardHeader className="pb-6 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  AI insights & recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className=" gap-6 text-sm pt-6">
                <div className="space-y-3">
                  {/* <p className="font-bold text-sm flex items-center gap-2.5 text-foreground">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    Model insights
                  </p>
                  {analysis.aiInsights.length === 0 && (
                    <p className="text-muted-foreground text-sm italic p-4 bg-slate-50 rounded-lg">
                      No explicit AI insights yet. These will appear as the engine is enriched.
                    </p>
                  )} */}
                  {/* {analysis.aiInsights.map((insight: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/60">
                      <p className="font-medium mb-1">{insight.insight_content}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{insight.insight_type}</span>
                        <span>• {insight.insight_category}</span>
                        {insight.priority_level && <span>• Priority: {insight.priority_level}</span>}
                      </div>
                    </div>
                  ))} */}
                  {analysis.aiInsights[0] && (
                    <div className="rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 to-pink-50 p-5 space-y-4">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <TrendingUp className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Growth Rate</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {analysis.aiInsights[0].growth_rate}
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <BarChart3 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Market Size</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {analysis.aiInsights[0].market_size}
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <Target className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Target Potential</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {analysis.aiInsights[0].target_potential}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}

                </div>

                <div className="space-y-3">
                  <p className="font-bold text-sm flex items-center gap-2.5 text-foreground">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    Strategic next steps
                  </p>
                  {analysis.strategicRecommendations.length === 0 && (
                    <p className="text-muted-foreground text-sm italic p-4 bg-slate-50 rounded-lg">
                      No specific recommendations yet – they will appear as we enrich this module.
                    </p>
                  )}
                  {analysis.strategicRecommendations.map((rec: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/50">
                      <p className="font-bold text-sm text-foreground mb-2">{rec.recommendation_content}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground font-medium">
                        <span className="bg-white/60 px-2 py-1 rounded text-foreground">{rec.recommendation_type}</span>
                        {rec.expected_impact_on_score != null && (
                          <span className="text-emerald-600">• Impact: +{rec.expected_impact_on_score}</span>
                        )}
                        {rec.implementation_difficulty && (
                          <span>• Difficulty: {rec.implementation_difficulty}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fourth row: Case studies & customer segments */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  Case studies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm pt-6">
                {analysis.failureCases.length === 0 && analysis.successCases.length === 0 && (
                  <p className="text-muted-foreground text-sm italic p-4 bg-slate-50 rounded-lg">
                    As the library grows, you will see real examples of similar startups that failed or succeeded and why.
                  </p>
                )}
                {analysis.failureCases.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      What tends to go wrong
                    </p>
                    {analysis.failureCases.map((f: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-rose-50 border border-rose-200/50">
                        <p className="font-bold text-sm text-foreground mb-1">{f.startup_name}</p>
                        <p className="text-xs text-muted-foreground mb-3 font-medium">
                          Primary reason: <span className="text-foreground">{f.primary_failure_reason}</span>
                        </p>
                        {f.lessons_learned && (
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {f.lessons_learned.map((l: any, idx: number) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-rose-600 flex-shrink-0">•</span>
                                <span>{l}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {analysis.successCases.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Patterns from success stories
                    </p>
                    {analysis.successCases.map((s: any, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/50">
                        <p className="font-bold text-sm text-foreground mb-1">{s.startup_name}</p>
                        {s.exit_type && (
                          <p className="text-xs text-muted-foreground mb-3 font-medium">
                            Outcome: <span className="text-foreground">{s.exit_type}</span>
                            {s.exit_valuation
                              ? ` (${formatCurrency(s.exit_valuation)})`
                              : ""}
                          </p>
                        )}
                        {s.success_factors && (
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {s.success_factors.map((fct: any, idx: number) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-emerald-600 flex-shrink-0">✓</span>
                                <span>{fct}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  Customer segments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm pt-6">
                {analysis.customerSegments.length === 0 && (
                  <p className="text-muted-foreground text-sm italic p-4 bg-slate-50 rounded-lg">
                    Initial default segments will be created automatically; over time you can refine them.
                  </p>
                )}
                {analysis.customerSegments.map((seg: any, i: number) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="font-bold text-foreground">{seg.segment_name}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2 font-medium">
                      {seg.segment_size_estimate != null && (
                        <span className="bg-white px-2 py-1 rounded">Size: ~{seg.segment_size_estimate}</span>
                      )}
                      {seg.willingness_to_pay != null && (
                        <span className="bg-white px-2 py-1 rounded">WTP: ${seg.willingness_to_pay}</span>
                      )}
                    </div>
                    {seg.pain_points && (
                      <ul className="text-xs text-muted-foreground space-y-1 mt-3">
                        {seg.pain_points.map((p: any, idx: number) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-primary font-bold flex-shrink-0">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* High level report card */}
          {analysis.detailedReports && analysis.detailedReports.length > 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
              <CardHeader className="pb-0 border-b border-slate-200/50">
                <CardTitle className="text-xl font-bold flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  Executive summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm ">
                {analysis.detailedReports[0]?.executive_summary && (
                  <p className="text-muted-foreground leading-relaxed">
                    {analysis.detailedReports[0].executive_summary}
                  </p>
                )}
                {analysis.detailedReports[0]?.recommendations &&
                  analysis.detailedReports[0].recommendations.length > 0 && (
                    <ul className="text-muted-foreground space-y-2">
                      {analysis.detailedReports[0].recommendations.map((rec: any, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary font-bold flex-shrink-0">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  )}

              </CardContent>
            </Card>
          )}
        </>
      )}





      {summaryResult && (
        <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
          <CardHeader className="pb-6 border-b border-slate-200/50">
            <CardTitle className="text-xl flex items-center gap-2.5 font-bold">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              High-level validation snapshot
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              A quick summary of the scores, market view and risks generated for this idea.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-2 flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Idea</p>
                <p className="text-lg font-bold text-foreground">{summaryResult.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span className="font-medium">{summaryResult.category}</span>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <Badge variant="secondary" className="bg-slate-200/50 text-slate-700 border-0 text-xs font-medium">
                    {(summaryResult.status === "processed" || summaryResult.status === "completed") ? "✓ Completed analysis" : "Analyzing"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-medium">
                  Submitted: <span className="text-slate-600">{summaryResult.submittedAt}</span>
                  {summaryResult.completedAt && (
                    <>
                      <span className="mx-2">•</span>
                      Completed: <span className="text-slate-600">{summaryResult.completedAt}</span>
                    </>
                  )}
                </p>
              </div>

              {summaryResult.overallScore != null && (
                <div className="flex items-center gap-4 md:flex-col md:items-end md:justify-start">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl font-bold text-center shadow-md transition-transform hover:scale-105 ${getScoreBg(
                      summaryResult.overallScore,
                    )}`}
                  >
                    <span
                      className={`text-4xl font-black ${getScoreColor(
                        summaryResult.overallScore,
                      )}`}
                    >
                      {summaryResult.overallScore}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground max-w-[180px]">
                    <p className="font-semibold text-foreground text-sm">Overall validation score</p>
                    <p className="mt-1 leading-relaxed">
                      Higher scores indicate stronger fit on market, feasibility and innovation.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {summaryResult.scores && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Market", value: summaryResult.scores.market, icon: TrendingUp },
                  { label: "Competition", value: summaryResult.scores.competition, icon: Users },
                  { label: "Feasibility", value: summaryResult.scores.feasibility, icon: Target },
                  { label: "Innovation", value: summaryResult.scores.innovation, icon: Star },
                ].map((score, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col items-center gap-2.5 hover:shadow-md transition-shadow">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-transform hover:scale-110 ${getScoreBg(score.value)}`}>
                      <score.icon className={`h-5 w-5 ${getScoreColor(score.value)}`} />
                    </div>
                    <p
                      className={`text-2xl font-bold ${getScoreColor(
                        score.value,
                      )}`}
                    >
                      {score.value}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">{score.label}</p>
                  </div>
                ))}
              </div>
            )}

            {summaryResult.marketAnalysis && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Market size</p>
                  <p className="font-bold text-lg mt-2 text-foreground">{summaryResult.marketAnalysis.marketSize}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Growth rate</p>
                  <p className="font-bold text-lg mt-2 text-emerald-600">{summaryResult.marketAnalysis.growthRate}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center hover:shadow-md transition-shadow">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Target potential</p>
                  <p className="font-bold text-lg mt-2 text-foreground">{summaryResult.marketAnalysis.targetPotential}</p>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {summaryResult.recommendations && summaryResult.recommendations.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                  <p className="font-bold text-sm mb-3 text-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    Top AI recommendations
                  </p>
                  <ul className="space-y-2">
                    {summaryResult.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summaryResult.risks && summaryResult.risks.length > 0 && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200/50">
                  <p className="font-bold text-sm mb-3 text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    Highlighted risks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {summaryResult.risks.slice(0, 3).map((risk, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700"
                      >
                        <AlertTriangle
                          className={`h-3 w-3 ${risk.level === "high"
                            ? "text-rose-600"
                            : "text-amber-600"
                            }`}
                        />
                        {risk.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {
        analysis && summaryResult && (
          <div className="pt-4 border-t w-fit mx-auto border-slate-200/50">
            <Button asChild variant="outline" size="sm" className="font-bold bg-transparent">
              <a href="#top">↑ Back to top</a>
            </Button>
          </div>
        )
      }
    </div>
  );
}
