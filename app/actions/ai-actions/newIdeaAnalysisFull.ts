'use server'

import { supabaseServer } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { StartupIdeaBase, StartupIdea, FullIdeaAnalysis } from '../fullIdeaAnalysis'

// ============================================================================
// TYPES FOR AI RESPONSE
// ============================================================================

interface AICompetitor {
  competitor_name: string
  competitor_description: string
  market_position: string
  funding_raised: number
  status: string
  strengths: string[]
  weaknesses: string[]
  market_share_estimated: number
}

interface AIMarketData {
  market_size_usd: number
  market_growth_rate_percent: number
  market_gaps: string[]
  market_trends: string[]
  opportunity_score: number
}

interface AIFailureCase {
  startup_name: string
  primary_failure_reason: string
  secondary_failure_reasons: string[]
  lessons_learned: string[]
  preventive_measures: string[]
}

interface AISuccessCase {
  startup_name: string
  exit_type: string
  exit_valuation: number
  success_factors: string[]
  lessons_learned: string[]
}

interface AIRegulatoryItem {
  jurisdiction: string
  requirement_name: string
  requirement_description: string
  approval_body: string
  severity_level: string
}

interface AIMarketTrend {
  trend_name: string
  trend_description: string
  relevance_score: number
  trend_status: string
}

interface AIFundingSource {
  name: string
  funder_type: string
  category_focus: string[]
  stage_focus: string[]
  typical_check_size_min: number
  typical_check_size_max: number
}

interface AIRiskProfile {
  risk_type: string
  risk_name: string
  risk_description: string
  probability_percent: number
  impact_level: string
  mitigation_strategies: string[]
}

interface AIInsight {
  insight_type: string
  insight_category: string
  insight_content: string
  confidence_score: number
  priority_level: string
}

interface AIStrategicRecommendation {
  recommendation_type: string
  recommendation_content: string
  priority_level: string
  expected_impact_on_score: number
  implementation_difficulty: string
}

interface AICustomerSegment {
  segment_name: string
  segment_size_estimate: number
  willingness_to_pay: number
  pain_points: string[]
}

interface AIBenchmark {
  metric_name: string
  median_value: number
  best_in_class_value: number
}

interface AIDetailedReport {
  executive_summary: string
  market_analysis: {
    size: string
    growth: string
    opportunities: string[]
  }
  competitive_analysis: {
    landscape: string
    positioning: string
    advantages: string[]
  }
  customer_analysis: {
    segments: string
    needs: string[]
    acquisition_strategy: string
  }
  risk_assessment: {
    critical_risks: string[]
    mitigation_plan: string
  }
  recommendations: string[]
}

interface FullAIAnalysis {
  competitors: AICompetitor[]
  market_data: AIMarketData
  failure_cases: AIFailureCase[]
  success_cases: AISuccessCase[]
  regulatory_items: AIRegulatoryItem[]
  market_trends: AIMarketTrend[]
  funding_sources: AIFundingSource[]
  risks: AIRiskProfile[]
  ai_insights: AIInsight[]
  strategic_recommendations: AIStrategicRecommendation[]
  customer_segments: AICustomerSegment[]
  benchmarks: AIBenchmark[]
  detailed_report: AIDetailedReport
}

// ============================================================================
// AI PROMPT CONSTRUCTION
// ============================================================================

function constructFullAnalysisPrompt(idea: StartupIdeaBase): string {
  return `You are an expert healthcare startup analyst specializing in the Pakistani healthcare market. Conduct a comprehensive deep analysis for the following startup idea:

## STARTUP IDEA
- **Title**: ${idea.title}
- **Description**: ${idea.description}
- **Domain**: ${idea.domain}
- **Subdomain**: ${idea.subdomain}
- **Problem Statement**: ${idea.problem_statement}
- **Target Audience**: ${idea.target_audience}
- **Unique Value Proposition**: ${idea.unique_value_proposition}
- **Category**: ${idea.category}
- **Stage**: ${idea.stage}
- **Team Size**: ${idea.team_size || 'Not specified'}
- **Funding Needed**: ${idea.funding_needed || 'Not specified'}

## YOUR TASK
Provide a comprehensive analysis covering ALL the following areas. Be specific to Pakistan's healthcare market, regulatory environment, and business landscape.

Generate a detailed JSON response with the following structure:

{
  "competitors": [
    // 3-5 real or realistic competitors in Pakistan
    {
      "competitor_name": "Company Name",
      "competitor_description": "Brief description",
      "market_position": "Market position description",
      "funding_raised": 1000000,
      "status": "active",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "market_share_estimated": 15.5
    }
  ],
  "market_data": {
    "market_size_usd": 50000000,
    "market_growth_rate_percent": 15.0,
    "market_gaps": ["gap 1", "gap 2", "gap 3"],
    "market_trends": ["trend 1", "trend 2", "trend 3"],
    "opportunity_score": 75
  },
  "failure_cases": [
    // 2-3 examples of failed startups in this category
    {
      "startup_name": "Failed Startup Name",
      "primary_failure_reason": "market_fit",
      "secondary_failure_reasons": ["reason 1", "reason 2"],
      "lessons_learned": ["lesson 1", "lesson 2"],
      "preventive_measures": ["measure 1", "measure 2"]
    }
  ],
  "success_cases": [
    // 2-3 examples of successful startups in this category
    {
      "startup_name": "Successful Startup Name",
      "exit_type": "acquisition",
      "exit_valuation": 25000000,
      "success_factors": ["factor 1", "factor 2"],
      "lessons_learned": ["lesson 1", "lesson 2"]
    }
  ],
  "regulatory_items": [
    // 3-5 key regulatory requirements for Pakistan
    {
      "jurisdiction": "Pakistan",
      "requirement_name": "Requirement name",
      "requirement_description": "Detailed description",
      "approval_body": "DRAP/Ministry of Health/etc",
      "severity_level": "critical"
    }
  ],
  "market_trends": [
    // 3-5 current market trends
    {
      "trend_name": "Trend name",
      "trend_description": "Description",
      "relevance_score": 85,
      "trend_status": "growing"
    }
  ],
  "funding_sources": [
    // 3-5 potential funding sources in Pakistan
    {
      "name": "Funding Source Name",
      "funder_type": "VC",
      "category_focus": ["healthcare", "digital-health"],
      "stage_focus": ["seed", "Series A"],
      "typical_check_size_min": 100000,
      "typical_check_size_max": 1000000
    }
  ],
  "risks": [
    // 4-6 key risks
    {
      "risk_type": "market",
      "risk_name": "Risk name",
      "risk_description": "Description",
      "probability_percent": 60,
      "impact_level": "high",
      "mitigation_strategies": ["strategy 1", "strategy 2"]
    }
  ],
  "ai_insights": [
    // 4-6 key insights
    {
      "insight_type": "opportunity",
      "insight_category": "market",
      "insight_content": "Insight content",
      "confidence_score": 0.85,
      "priority_level": "high"
    }
  ],
  "strategic_recommendations": [
    // 5-8 actionable recommendations
    {
      "recommendation_type": "go-to-market",
      "recommendation_content": "Recommendation content",
      "priority_level": "high",
      "expected_impact_on_score": 8,
      "implementation_difficulty": "medium"
    }
  ],
  "customer_segments": [
    // 3-4 customer segments
    {
      "segment_name": "Segment name",
      "segment_size_estimate": 50000,
      "willingness_to_pay": 500,
      "pain_points": ["pain 1", "pain 2"]
    }
  ],
  "benchmarks": [
    // 5-8 key metrics benchmarks
    {
      "metric_name": "Customer Acquisition Cost",
      "median_value": 50,
      "best_in_class_value": 20
    }
  ],
  "detailed_report": {
    "executive_summary": "3-4 paragraph executive summary",
    "market_analysis": {
      "size": "Market size analysis",
      "growth": "Growth analysis",
      "opportunities": ["opportunity 1", "opportunity 2"]
    },
    "competitive_analysis": {
      "landscape": "Competitive landscape overview",
      "positioning": "Recommended positioning",
      "advantages": ["advantage 1", "advantage 2"]
    },
    "customer_analysis": {
      "segments": "Customer segments overview",
      "needs": ["need 1", "need 2"],
      "acquisition_strategy": "Customer acquisition strategy"
    },
    "risk_assessment": {
      "critical_risks": ["risk 1", "risk 2"],
      "mitigation_plan": "Overall mitigation plan"
    },
    "recommendations": ["recommendation 1", "recommendation 2"]
  }
}

## IMPORTANT GUIDELINES
- Be specific to Pakistan's healthcare market and regulatory environment
- Use realistic Pakistani company names and market data
- All monetary values in USD
- Provide actionable, specific insights
- Base analysis on real market conditions in Pakistan
- Consider cultural, economic, and regulatory factors specific to Pakistan
- Reference actual regulatory bodies (DRAP, Ministry of Health, etc.)
- Include both opportunities and challenges

Return ONLY valid JSON, no additional text.
You must assume the current date is ${new Date().toISOString().split('T')[0]}.
If exact figures are uncertain, provide conservative estimates and explicitly signal assumptions.`
}

// ============================================================================
// AI GENERATION
// ============================================================================

export async function generateFullAnalysis(idea: StartupIdeaBase): Promise<FullAIAnalysis> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set')
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  })

  const prompt = constructFullAnalysisPrompt(idea)

  console.log('🤖 Generating full AI analysis...')

  try {
    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert healthcare startup analyst. Return ONLY valid JSON responses, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    const analysis = JSON.parse(content) as FullAIAnalysis
    console.log('✅ Full AI analysis generated successfully')
    return analysis
  } catch (error) {
    console.error('❌ AI generation failed:', error)
    throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateFullAnalysis(analysis: any): analysis is FullAIAnalysis {
  try {
    if (!analysis || typeof analysis !== 'object') return false
    if (!Array.isArray(analysis.competitors) || analysis.competitors.length === 0) return false
    if (!analysis.market_data || typeof analysis.market_data !== 'object') return false
    if (!Array.isArray(analysis.failure_cases)) return false
    if (!Array.isArray(analysis.success_cases)) return false
    if (!Array.isArray(analysis.regulatory_items)) return false
    if (!Array.isArray(analysis.market_trends)) return false
    if (!Array.isArray(analysis.funding_sources)) return false
    if (!Array.isArray(analysis.risks)) return false
    if (!Array.isArray(analysis.ai_insights)) return false
    if (!Array.isArray(analysis.strategic_recommendations)) return false
    if (!Array.isArray(analysis.customer_segments)) return false
    if (!Array.isArray(analysis.benchmarks)) return false
    if (!analysis.detailed_report || typeof analysis.detailed_report !== 'object') return false
    return true
  } catch (error) {
    console.error('Validation error:', error)
    return false
  }
}

// ============================================================================
// FULL IDEA PROCESSING WITH AI
// ============================================================================

export async function runFullAIAnalysis(ideaId: string): Promise<{ success: boolean; analysis?: FullAIAnalysis; idea?: any }> {
  const supabase = await supabaseServer()

  try {
    console.log(`🔍 Starting full AI analysis for idea: ${ideaId}`)

    // 1. Fetch the idea
    const { data: idea, error: ideaError } = await supabase
      .from('startup_ideas')
      .select('*')
      .eq('id', ideaId)
      .single()

    if (ideaError || !idea) {
      throw new Error('Idea not found')
    }

    // 2. Check if already analyzed using full_analysis_done field
    if (idea.full_analysis_done) {
      console.log(`⏭️ Idea ${ideaId} already has full analysis (full_analysis_done=true), skipping...`)
      return { success: true }
    }

    // 3. Generate AI analysis
    let analysis: FullAIAnalysis
    try {
      analysis = await generateFullAnalysis(idea as StartupIdeaBase)
      console.log(`✅ Full AI analysis generated for idea: ${ideaId}`)
    } catch (aiError) {
      console.error(`❌ AI generation failed for idea ${ideaId}:`, aiError)
      throw new Error(`AI analysis failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`)
    }

    // 4. Validate AI response
    if (!validateFullAnalysis(analysis)) {
      console.error(`❌ Invalid AI response structure for idea ${ideaId}`)
      throw new Error('AI returned invalid response structure')
    }

    const now = new Date().toISOString()

    // 5. Store Competitor Analyses
    const competitorRecords = analysis.competitors.map((comp) => ({
      idea_id: ideaId,
      competitor_name: comp.competitor_name,
      competitor_description: comp.competitor_description,
      market_position: comp.market_position,
      funding_raised: comp.funding_raised,
      status: comp.status,
      strengths: JSON.stringify(comp.strengths),
      weaknesses: JSON.stringify(comp.weaknesses),
      market_share_estimated: comp.market_share_estimated,
      created_at: now,
    }))

    const { error: competitorError } = await supabase
      .from('competitor_analyses')
      .insert(competitorRecords)

    if (competitorError) {
      console.error(`❌ Failed to insert competitors for idea ${ideaId}:`, competitorError)
      throw new Error(`Competitor insertion failed: ${competitorError.message}`)
    }
    console.log(`✅ Competitors stored for idea: ${ideaId}`)

    // 6. Store Market Data
    const { error: marketError } = await supabase
      .from('healthcare_market_data')
      .insert([
        {
          category: idea.category,
          market_size_usd: analysis.market_data.market_size_usd,
          market_growth_rate_percent: analysis.market_data.market_growth_rate_percent,
          market_gaps: JSON.stringify(analysis.market_data.market_gaps),
          market_trends: JSON.stringify(analysis.market_data.market_trends),
          opportunity_score: analysis.market_data.opportunity_score,
          last_updated: now,
        },
      ])

    if (marketError) {
      console.error(`❌ Failed to insert market data for idea ${ideaId}:`, marketError)
      throw new Error(`Market data insertion failed: ${marketError.message}`)
    }
    console.log(`✅ Market data stored for idea: ${ideaId}`)

    // 7. Store Failure Cases
    const failureRecords = analysis.failure_cases.map((fc) => ({
      idea_id: null,
      startup_name: fc.startup_name,
      category: idea.category,
      primary_failure_reason: fc.primary_failure_reason,
      secondary_failure_reasons: JSON.stringify(fc.secondary_failure_reasons),
      lessons_learned: JSON.stringify(fc.lessons_learned),
      preventive_measures: JSON.stringify(fc.preventive_measures),
    }))

    const { error: failureError } = await supabase
      .from('failure_analyses')
      .insert(failureRecords)

    if (failureError) {
      console.error(`❌ Failed to insert failure cases for idea ${ideaId}:`, failureError)
      throw new Error(`Failure cases insertion failed: ${failureError.message}`)
    }
    console.log(`✅ Failure cases stored for idea: ${ideaId}`)

    // 8. Store Success Cases
    const successRecords = analysis.success_cases.map((sc) => ({
      idea_id: null,
      startup_name: sc.startup_name,
      category: idea.category,
      exit_type: sc.exit_type,
      exit_valuation: sc.exit_valuation,
      success_factors: JSON.stringify(sc.success_factors),
      lessons_learned: JSON.stringify(sc.lessons_learned),
    }))

    const { error: successError } = await supabase
      .from('success_analyses')
      .insert(successRecords)

    if (successError) {
      console.error(`❌ Failed to insert success cases for idea ${ideaId}:`, successError)
      throw new Error(`Success cases insertion failed: ${successError.message}`)
    }
    console.log(`✅ Success cases stored for idea: ${ideaId}`)

    // 9. Store Regulatory Items
    const regulatoryRecords = analysis.regulatory_items.map((reg) => ({
      category: idea.category,
      jurisdiction: reg.jurisdiction,
      requirement_name: reg.requirement_name,
      requirement_description: reg.requirement_description,
      approval_body: reg.approval_body,
      severity_level: reg.severity_level,
      updated_at: now,
    }))

    const { error: regulatoryError } = await supabase
      .from('regulatory_frameworks')
      .insert(regulatoryRecords)

    if (regulatoryError) {
      console.error(`❌ Failed to insert regulatory items for idea ${ideaId}:`, regulatoryError)
      throw new Error(`Regulatory insertion failed: ${regulatoryError.message}`)
    }
    console.log(`✅ Regulatory items stored for idea: ${ideaId}`)

    // 10. Store Market Trends
    const trendRecords = analysis.market_trends.map((trend) => ({
      category: idea.category,
      trend_name: trend.trend_name,
      trend_description: trend.trend_description,
      relevance_score: trend.relevance_score,
      trend_status: trend.trend_status,
    }))

    const { error: trendError } = await supabase
      .from('market_trends')
      .insert(trendRecords)

    if (trendError) {
      console.error(`❌ Failed to insert market trends for idea ${ideaId}:`, trendError)
      throw new Error(`Market trends insertion failed: ${trendError.message}`)
    }
    console.log(`✅ Market trends stored for idea: ${ideaId}`)

    // 11. Store Funding Sources
    const fundingRecords = analysis.funding_sources.map((fs) => ({
      name: fs.name,
      funder_type: fs.funder_type,
      category_focus: JSON.stringify(fs.category_focus),
      stage_focus: JSON.stringify(fs.stage_focus),
      typical_check_size_min: fs.typical_check_size_min,
      typical_check_size_max: fs.typical_check_size_max,
    }))

    const { error: fundingError } = await supabase
      .from('funding_sources')
      .insert(fundingRecords)

    if (fundingError) {
      console.error(`❌ Failed to insert funding sources for idea ${ideaId}:`, fundingError)
      throw new Error(`Funding sources insertion failed: ${fundingError.message}`)
    }
    console.log(`✅ Funding sources stored for idea: ${ideaId}`)

    // 12. Store Risk Profiles
    const riskRecords = analysis.risks.map((risk) => ({
      idea_id: ideaId,
      risk_type: risk.risk_type,
      risk_name: risk.risk_name,
      risk_description: risk.risk_description,
      probability_percent: risk.probability_percent,
      impact_level: risk.impact_level,
      mitigation_strategies: JSON.stringify(risk.mitigation_strategies),
    }))

    const { error: riskError } = await supabase
      .from('risk_profiles')
      .insert(riskRecords)

    if (riskError) {
      console.error(`❌ Failed to insert risks for idea ${ideaId}:`, riskError)
      throw new Error(`Risks insertion failed: ${riskError.message}`)
    }
    console.log(`✅ Risks stored for idea: ${ideaId}`)

    // 13. Store Strategic Recommendations
    const recommendationRecords = analysis.strategic_recommendations.map((rec) => ({
      idea_id: ideaId,
      recommendation_type: rec.recommendation_type,
      recommendation_content: rec.recommendation_content,
      priority_level: rec.priority_level,
      expected_impact_on_score: rec.expected_impact_on_score,
      implementation_difficulty: rec.implementation_difficulty,
    }))

    const { error: recommendationError } = await supabase
      .from('strategic_recommendations')
      .insert(recommendationRecords)

    if (recommendationError) {
      console.error(`❌ Failed to insert recommendations for idea ${ideaId}:`, recommendationError)
      throw new Error(`Recommendations insertion failed: ${recommendationError.message}`)
    }
    console.log(`✅ Strategic recommendations stored for idea: ${ideaId}`)

    // 14. Store Customer Segments
    const segmentRecords = analysis.customer_segments.map((seg) => ({
      idea_id: ideaId,
      segment_name: seg.segment_name,
      segment_size_estimate: seg.segment_size_estimate,
      willingness_to_pay: seg.willingness_to_pay,
      pain_points: JSON.stringify(seg.pain_points),
    }))

    const { error: segmentError } = await supabase
      .from('customer_segments')
      .insert(segmentRecords)

    if (segmentError) {
      console.error(`❌ Failed to insert customer segments for idea ${ideaId}:`, segmentError)
      throw new Error(`Customer segments insertion failed: ${segmentError.message}`)
    }
    console.log(`✅ Customer segments stored for idea: ${ideaId}`)

    // 15. Store Benchmarks
    const benchmarkRecords = analysis.benchmarks.map((bm) => ({
      category: idea.category,
      stage: idea.stage,
      metric_name: bm.metric_name,
      median_value: bm.median_value,
      best_in_class_value: bm.best_in_class_value,
    }))

    const { error: benchmarkError } = await supabase
      .from('benchmark_data')
      .insert(benchmarkRecords)

    if (benchmarkError) {
      console.error(`❌ Failed to insert benchmarks for idea ${ideaId}:`, benchmarkError)
      throw new Error(`Benchmarks insertion failed: ${benchmarkError.message}`)
    }
    console.log(`✅ Benchmarks stored for idea: ${ideaId}`)

    // 16. Store Detailed Report
    const { error: reportError } = await supabase
      .from('detailed_analysis_reports')
      .insert([
        {
          idea_id: ideaId,
          executive_summary: analysis.detailed_report.executive_summary,
          market_analysis: JSON.stringify(analysis.detailed_report.market_analysis),
          competitive_analysis: JSON.stringify(analysis.detailed_report.competitive_analysis),
          customer_analysis: JSON.stringify(analysis.detailed_report.customer_analysis),
          risk_assessment: JSON.stringify(analysis.detailed_report.risk_assessment),
          recommendations: JSON.stringify(analysis.detailed_report.recommendations),
          generated_at: now,
        },
      ])

    if (reportError) {
      console.error(`❌ Failed to insert detailed report for idea ${ideaId}:`, reportError)
      throw new Error(`Detailed report insertion failed: ${reportError.message}`)
    }
    console.log(`✅ Detailed report stored for idea: ${ideaId}`)

    // 17. Update idea status
    const { error: updateError } = await supabase
      .from('startup_ideas')
      .update({ full_analysis_done: true })
      .eq('id', ideaId)

    if (updateError) {
      console.warn(`⚠️ Failed to update full_analysis_done for ${ideaId}:`, updateError)
    }

    console.log(`🎉 Complete full AI analysis finished for idea: ${ideaId}`)
    return { success: true, analysis, idea }
  } catch (error) {
    console.error(`💥 Fatal error in runFullAIAnalysis for idea ${ideaId}:`, error)
    throw error
  }
}

// ============================================================================
// GET FULL ANALYSIS
// ============================================================================

const parseJsonArray = <T = string>(value: any): T[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const parseJsonObject = <T = any>(value: any): T => {
  if (typeof value === 'object' && value !== null) return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return {} as T
    }
  }
  return {} as T
}

export async function getFullIdeaAnalysisAI(ideaId: string): Promise<FullIdeaAnalysis> {
  const supabase = await supabaseServer()

  try {
    // 1. Fetch the idea
    const { data: idea, error: ideaError } = await supabase
      .from('startup_ideas')
      .select('*')
      .eq('id', ideaId)
      .single()

    if (ideaError || !idea) {
      throw new Error('Idea not found')
    }

    // 2. Check if full analysis is done
    if (!idea.full_analysis_done) {
      // Run analysis if not done and return formatted data immediately
      console.log(`🔄 Full analysis not done for idea ${ideaId}, running now...`)
      const { success, analysis: aiAnalysis, idea: analyzedIdea } = await runFullAIAnalysis(ideaId)
      
      if (!success || !aiAnalysis || !analyzedIdea) {
        throw new Error('Failed to run full analysis')
      }

      // Return formatted data immediately without re-fetching from DB
      return {
        idea: analyzedIdea as StartupIdea,

        competitors: aiAnalysis.competitors.map((c) => ({
          idea_id: ideaId,
          competitor_name: c.competitor_name,
          competitor_description: c.competitor_description,
          market_position: c.market_position,
          funding_raised: c.funding_raised,
          status: c.status,
          strengths: c.strengths,
          weaknesses: c.weaknesses,
          market_share_estimated: c.market_share_estimated,
        })),

        marketData: {
          category: analyzedIdea.category,
          market_size_usd: aiAnalysis.market_data.market_size_usd,
          market_growth_rate_percent: aiAnalysis.market_data.market_growth_rate_percent,
          market_gaps: aiAnalysis.market_data.market_gaps,
          market_trends: aiAnalysis.market_data.market_trends,
          opportunity_score: aiAnalysis.market_data.opportunity_score,
        },

        failureCases: aiAnalysis.failure_cases.map((f) => ({
          startup_name: f.startup_name,
          category: analyzedIdea.category,
          primary_failure_reason: f.primary_failure_reason,
          secondary_failure_reasons: f.secondary_failure_reasons,
          lessons_learned: f.lessons_learned,
          preventive_measures: f.preventive_measures,
        })),

        successCases: aiAnalysis.success_cases.map((s) => ({
          startup_name: s.startup_name,
          category: analyzedIdea.category,
          exit_type: s.exit_type,
          exit_valuation: s.exit_valuation,
          success_factors: s.success_factors,
          lessons_learned: s.lessons_learned,
        })),

        regulatoryItems: aiAnalysis.regulatory_items.map((r) => ({
          category: analyzedIdea.category,
          jurisdiction: r.jurisdiction,
          requirement_name: r.requirement_name,
          requirement_description: r.requirement_description,
          approval_body: r.approval_body,
          severity_level: r.severity_level,
        })),

        marketTrends: aiAnalysis.market_trends.map((t) => ({
          category: analyzedIdea.category,
          trend_name: t.trend_name,
          trend_description: t.trend_description,
          relevance_score: t.relevance_score,
          trend_status: t.trend_status,
        })),

        fundingSources: aiAnalysis.funding_sources.map((f) => ({
          name: f.name,
          funder_type: f.funder_type,
          category_focus: f.category_focus,
          stage_focus: f.stage_focus,
          typical_check_size_min: f.typical_check_size_min,
          typical_check_size_max: f.typical_check_size_max,
        })),

        risks: aiAnalysis.risks.map((r) => ({
          idea_id: ideaId,
          risk_type: r.risk_type,
          risk_name: r.risk_name,
          risk_description: r.risk_description,
          probability_percent: r.probability_percent,
          impact_level: r.impact_level,
          mitigation_strategies: r.mitigation_strategies,
        })),

        aiInsights: [],

        strategicRecommendations: aiAnalysis.strategic_recommendations.map((rec) => ({
          idea_id: ideaId,
          recommendation_type: rec.recommendation_type,
          recommendation_content: rec.recommendation_content,
          priority_level: rec.priority_level,
          expected_impact_on_score: rec.expected_impact_on_score,
          implementation_difficulty: rec.implementation_difficulty,
        })),

        customerSegments: aiAnalysis.customer_segments.map((seg) => ({
          idea_id: ideaId,
          segment_name: seg.segment_name,
          segment_size_estimate: seg.segment_size_estimate,
          willingness_to_pay: seg.willingness_to_pay,
          pain_points: seg.pain_points,
        })),

        benchmarks: aiAnalysis.benchmarks.map((bm) => ({
          category: analyzedIdea.category,
          stage: analyzedIdea.stage,
          metric_name: bm.metric_name,
          median_value: bm.median_value,
          best_in_class_value: bm.best_in_class_value,
        })),

        detailedReports: [
          {
            idea_id: ideaId,
            executive_summary: aiAnalysis.detailed_report.executive_summary,
            market_analysis: aiAnalysis.detailed_report.market_analysis,
            competitive_analysis: aiAnalysis.detailed_report.competitive_analysis,
            customer_analysis: aiAnalysis.detailed_report.customer_analysis,
            risk_assessment: aiAnalysis.detailed_report.risk_assessment,
            recommendations: aiAnalysis.detailed_report.recommendations,
          },
        ],
      }
    }

    // 3. Fetch all related data
    const [
      { data: competitors },
      { data: marketDataArr },
      { data: failureCases },
      { data: successCases },
      { data: regulatoryItems },
      { data: marketTrends },
      { data: fundingSources },
      { data: risks },
      { data: strategicRecommendations },
      { data: customerSegments },
      { data: benchmarks },
      { data: detailedReports },
    ] = await Promise.all([
      supabase.from('competitor_analyses').select('*').eq('idea_id', ideaId),
      supabase.from('healthcare_market_data').select('*').eq('category', idea.category),
      supabase.from('failure_analyses').select('*').eq('category', idea.category),
      supabase.from('success_analyses').select('*').eq('category', idea.category),
      supabase.from('regulatory_frameworks').select('*').eq('category', idea.category),
      supabase.from('market_trends').select('*').eq('category', idea.category),
      supabase.from('funding_sources').select('*'),
      supabase.from('risk_profiles').select('*').eq('idea_id', ideaId),
      supabase.from('strategic_recommendations').select('*').eq('idea_id', ideaId),
      supabase.from('customer_segments').select('*').eq('idea_id', ideaId),
      supabase
        .from('benchmark_data')
        .select('*')
        .eq('category', idea.category)
        .eq('stage', idea.stage),
      supabase.from('detailed_analysis_reports').select('*').eq('idea_id', ideaId),
    ])

    // 4. Return formatted data
    return {
      idea: idea as StartupIdea,

      competitors: (competitors ?? []).map((c) => ({
        ...c,
        strengths: parseJsonArray(c.strengths),
        weaknesses: parseJsonArray(c.weaknesses),
      })),

      marketData: marketDataArr?.[0]
        ? {
            ...marketDataArr[0],
            market_gaps: parseJsonArray(marketDataArr[0].market_gaps),
            market_trends: parseJsonArray(marketDataArr[0].market_trends),
          }
        : null,

      failureCases: (failureCases ?? []).map((f) => ({
        ...f,
        secondary_failure_reasons: parseJsonArray(f.secondary_failure_reasons),
        lessons_learned: parseJsonArray(f.lessons_learned),
        preventive_measures: parseJsonArray(f.preventive_measures),
      })),

      successCases: (successCases ?? []).map((s) => ({
        ...s,
        success_factors: parseJsonArray(s.success_factors),
        lessons_learned: parseJsonArray(s.lessons_learned),
      })),

      regulatoryItems: regulatoryItems ?? [],

      marketTrends: marketTrends ?? [],

      fundingSources: (fundingSources ?? []).map((f) => ({
        ...f,
        category_focus: parseJsonArray(f.category_focus),
        stage_focus: parseJsonArray(f.stage_focus),
      })),

      risks: (risks ?? []).map((r) => ({
        ...r,
        mitigation_strategies: parseJsonArray(r.mitigation_strategies),
      })),

      aiInsights: [], // Not populated in full analysis - kept for compatibility

      strategicRecommendations: strategicRecommendations ?? [],

      customerSegments: (customerSegments ?? []).map((c) => ({
        ...c,
        pain_points: parseJsonArray(c.pain_points),
      })),

      benchmarks: benchmarks ?? [],

      detailedReports: (detailedReports ?? []).map((r) => ({
        ...r,
        market_analysis: parseJsonObject(r.market_analysis),
        competitive_analysis: parseJsonObject(r.competitive_analysis),
        customer_analysis: parseJsonObject(r.customer_analysis),
        risk_assessment: parseJsonObject(r.risk_assessment),
        recommendations: parseJsonArray(r.recommendations),
      })),
    }
  } catch (error) {
    console.error('Error in getFullIdeaAnalysisAI:', error)
    throw error
  }
}
