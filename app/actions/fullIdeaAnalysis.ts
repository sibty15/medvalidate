'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { CompetitorAnalysis, CustomerSegment, DetailedReport, FailureCase, FundingSource, RiskProfile,   SuccessCase } from './TYPES_FULLANALYSIS'

// ---------------------------
// Types
// ---------------------------
export type IdeaStatus = 'pending' | 'processed'

export interface StartupIdeaBase {
  id?: string
  user_id: string
  title: string
  description: string
  domain: string
  subdomain: string
  problem_statement: string
  target_audience: string
  unique_value_proposition: string
  category: string
  stage: string
  team_size?: string
  funding_needed?: string
  status?: IdeaStatus
  submitted_at?: string
}

export interface StartupIdea extends StartupIdeaBase {
  id: string
  submitted_at: string
}



// ---------------------------
// Compute demo scores
// ---------------------------


// ---------------------------
// Full Idea Processing
// ---------------------------
export async function fullIdeaProcessing(ideaId: string) {
  const supabase = await supabaseServer()

  // Fetch the idea
  const { data: idea, error } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('id', ideaId)
    .single()

  if (error || !idea) throw new Error('Idea not found')

  // ---------------------------
  // 3️⃣ Competitor Analysis
  // ---------------------------
  const categoryTitle = (idea.category || 'General Healthtech').replace('-', ' ').replace(/\b\w/g, (l: any) => l.toUpperCase())
  try {

    await supabase.from('competitor_analyses').upsert([
      {
        idea_id: idea.id,
        competitor_name: `${categoryTitle} Platform Alpha`,
        competitor_description: `Established ${categoryTitle.toLowerCase()} startup operating in major cities.`,
        market_position: 'Early mover with regional presence',
        funding_raised: 2000000,
        status: 'active',
        strengths: JSON.stringify(['Strong clinical network', 'Brand recognition']),
        weaknesses: JSON.stringify(['Limited coverage in rural areas', 'High pricing for SMEs']),
        market_share_estimated: 12.5,
        created_at: new Date().toISOString(),
      },
      {
        idea_id: idea.id,
        competitor_name: `${categoryTitle} App Beta`,
        competitor_description: `Mobile-first ${categoryTitle.toLowerCase()} solution targeting youth.`,
        market_position: 'Popular among early adopters',
        funding_raised: 750000,
        status: 'active',
        strengths: JSON.stringify(['Great user experience', 'Aggressive social media marketing']),
        weaknesses: JSON.stringify(['Unclear monetization', 'Limited clinical validation']),
        market_share_estimated: 5,
        created_at: new Date().toISOString(),
      },
    ])

    // ---------------------------
    // 4️⃣ Market Data
    // ---------------------------
    await supabase.from('healthcare_market_data').upsert([
      {
        category: idea.category,
        market_size_usd: 50000000,
        market_growth_rate_percent: 15,
        market_gaps: JSON.stringify(['Localized solutions', 'Affordable access in tier-2 cities']),
        market_trends: JSON.stringify(['Increased digital adoption', 'Growing investor interest in healthtech']),
        opportunity_score: 82,
        last_updated: new Date().toISOString(),
      },
    ])

    // ---------------------------
    // 5️⃣ Failure & Success Cases
    // ---------------------------
    await supabase.from('failure_analyses').upsert([
      {
        idea_id: null,
        startup_name: `${categoryTitle} Pilot 2018`,
        category: idea.category,
        primary_failure_reason: 'market_fit',
        secondary_failure_reasons: JSON.stringify(['Low user engagement', 'Insufficient localization']),
        lessons_learned: JSON.stringify(['Validate with small cohorts first', 'Invest in local partnerships early']),
        preventive_measures: JSON.stringify(['Run structured pilots', 'Co-design with clinicians and patients']),
      },
    ])

    await supabase.from('success_analyses').upsert([
      {
        idea_id: null,
        startup_name: `${categoryTitle} Success Story`,
        category: idea.category,
        exit_type: 'acquisition',
        exit_valuation: 25000000,
        success_factors: JSON.stringify(['Strong clinical backing', 'Regulatory compliance from day one']),
        lessons_learned: JSON.stringify(['Build trust with providers', 'Align business model with payer incentives']),
      },
    ])

    // ---------------------------
    // 6️⃣ Regulatory Frameworks
    // ---------------------------
    await supabase.from('regulatory_frameworks').upsert([
      {
        category: idea.category,
        jurisdiction: 'Pakistan',
        requirement_name: 'Data protection and patient consent',
        requirement_description: 'Ensure explicit consent for storing and processing patient data.',
        approval_body: 'Local health authority / notifiable bodies',
        severity_level: 'high',
        updated_at: new Date().toISOString(),
      },
      {
        category: idea.category,
        jurisdiction: 'Pakistan',
        requirement_name: 'Clinical validation and safety',
        requirement_description: 'Demonstrate clinical safety and efficacy for core workflows.',
        approval_body: 'Relevant medical boards / DRAP (if applicable)',
        severity_level: 'critical',
        updated_at: new Date().toISOString(),
      },
    ])

    // ---------------------------
    // 7️⃣ Market Trends
    // ---------------------------
    await supabase.from('market_trends').upsert([
      {
        category: idea.category,
        trend_name: 'Telehealth normalization',
        trend_description: 'Patients are increasingly comfortable with remote consultations.',
        relevance_score: 88,
        trend_status: 'growing',
      },
      {
        category: idea.category,
        trend_name: 'AI-assisted triage',
        trend_description: 'Early-stage AI tools supporting clinicians with decision-making.',
        relevance_score: 80,
        trend_status: 'emerging',
      },
    ])

    // ---------------------------
    // 8️⃣ Funding Sources
    // ---------------------------
    await supabase.from('funding_sources').upsert([
      {
        name: 'Pakistan HealthTech Angels',
        funder_type: 'Angel Network',
        category_focus: JSON.stringify(['healthcare-ai', 'telemedicine', 'mental-health']),
        stage_focus: JSON.stringify(['pre-seed', 'seed']),
        typical_check_size_min: 50000,
        typical_check_size_max: 250000,
      },
      {
        name: 'Regional Impact Fund',
        funder_type: 'VC',
        category_focus: JSON.stringify(['health-monitoring', 'elder-care']),
        stage_focus: JSON.stringify(['seed', 'Series A']),
        typical_check_size_min: 250000,
        typical_check_size_max: 2000000,
      },
    ])

    // ---------------------------
    // 9️⃣ Risk Profiles
    // ---------------------------
    await supabase.from('risk_profiles').upsert([
      {
        idea_id: idea.id,
        risk_type: 'market',
        risk_name: 'Limited adoption by clinicians',
        risk_description: 'Healthcare providers may be slow to adopt new digital workflows.',
        probability_percent: 60,
        impact_level: 'high',
        mitigation_strategies: JSON.stringify(['Co-design with early clinical champions', 'Provide training and support']),
      },
      {
        idea_id: idea.id,
        risk_type: 'regulatory',
        risk_name: 'Unclear regulatory pathway',
        risk_description: 'Regulation for digital health and AI is still evolving.',
        probability_percent: 50,
        impact_level: 'high',
        mitigation_strategies: JSON.stringify(['Engage legal counsel early', 'Limit high-risk claims in early versions']),
      },
    ])

    // ---------------------------
    // 10️⃣ AI Insights
    // ---------------------------
    await supabase.from('ai_insights').upsert([
      {
        idea_id: idea.id,
        insight_type: 'opportunity',
        insight_category: 'market',
        insight_content: `Growing unmet demand for ${categoryTitle.toLowerCase()} solutions.`,
        confidence_score: 0.78,
        priority_level: 'high',
        generated_at: new Date().toISOString(),
      },
      {
        idea_id: idea.id,
        insight_type: 'risk',
        insight_category: 'competition',
        insight_content: 'Several regional players are exploring similar offerings; differentiation will matter.',
        confidence_score: 0.72,
        priority_level: 'medium',
        generated_at: new Date().toISOString(),
      },
    ])

    // ---------------------------
    // 11️⃣ Strategic Recommendations
    // ---------------------------
    await supabase.from('strategic_recommendations').upsert([
      {
        idea_id: idea.id,
        recommendation_type: 'go-to-market',
        recommendation_content: 'Start with a focused pilot in 1–2 hospitals or universities before broad launch.',
        priority_level: 'high',
        expected_impact_on_score: 8,
        implementation_difficulty: 'medium',
      },
      {
        idea_id: idea.id,
        recommendation_type: 'product',
        recommendation_content: 'Prioritize a narrow feature set that solves one critical workflow extremely well.',
        priority_level: 'medium',
        expected_impact_on_score: 6,
        implementation_difficulty: 'low',
      },
    ])

    // ---------------------------
    // 12️⃣ Customer Segments
    // ---------------------------
    await supabase.from('customer_segments').upsert([
      {
        idea_id: idea.id,
        segment_name: 'Urban private clinics',
        segment_size_estimate: 500,
        willingness_to_pay: 50,
        pain_points: JSON.stringify(['High patient load', 'Manual record-keeping']),
      },
      {
        idea_id: idea.id,
        segment_name: 'University students',
        segment_size_estimate: 2000,
        willingness_to_pay: 10,
        pain_points: JSON.stringify(['Limited access to affordable mental health support']),
      },
    ])

    // ---------------------------
    // 13️⃣ Benchmark Data
    // ---------------------------
    await supabase.from('benchmark_data').upsert([
      {
        category: idea.category,
        stage: idea.stage,
        metric_name: 'runway_months',
        median_value: 12,
        best_in_class_value: 24,
      },
      {
        category: idea.category,
        stage: idea.stage,
        metric_name: 'customer_acquisition_cost_usd',
        median_value: 15,
        best_in_class_value: 5,
      },
    ])

    // ---------------------------
    // 14️⃣ Detailed Analysis Report
    // ---------------------------
    await supabase.from('detailed_analysis_reports').upsert([
      {
        idea_id: idea.id,
        executive_summary: `High-level analysis of ${categoryTitle} idea at stage ${idea.stage}`,
        market_analysis: JSON.stringify({ summary: 'Growing demand for digital healthcare in Pakistan.' }),
        competitive_analysis: JSON.stringify({ summary: 'Small but growing regional competitors.' }),
        customer_analysis: JSON.stringify({ summary: 'Target segments are cost-sensitive but value convenience.' }),
        risk_assessment: JSON.stringify({ summary: 'Regulatory ambiguity and slow provider adoption are risks.' }),
        recommendations: JSON.stringify(['Validate with pilots before scaling', 'Invest in regulatory and clinical partnerships early']),
        generated_at: new Date().toISOString(),
      },
    ])

    return idea

  } catch (error) {
    console.error('Error during full idea processing:', error)
    throw new Error('Error during full idea processing')
  }


}




export interface FullIdeaAnalysis {
  idea: StartupIdea
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

export async function getFullIdeaAnalysis(ideaId: string): Promise<FullIdeaAnalysis> {
  const supabase = await supabaseServer()

  // Load idea first
  let { data: idea, error: ideaError } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('id', ideaId)
    .single()

  if (ideaError || !idea) {
    throw new Error('Idea not found')
  }

  // Only run heavy processing if not fully analyzed
  if (!idea.full_analysis_done) {
    try {
      await fullIdeaProcessing(ideaId)
      
      // Mark as fully analyzed
      await supabase
        .from('startup_ideas')
        .update({ full_analysis_done: true })
        .eq('id', ideaId)
    }
    catch (err) {
      console.error('Error during full idea processing:', err);
      throw new Error('Error during full idea processing')
    }

    // Re-fetch to get updated full_analysis_done flag (and any other changes)
    const refetch = await supabase
      .from('startup_ideas')
      .select('*')
      .eq('id', ideaId)
      .single()

    if (refetch.error || !refetch.data) {
      throw new Error('Idea not found after processing')
    }
    idea = refetch.data
  }

  // Fetch related deep-analysis data
  const [
    { data: competitors },
    { data: marketDataArr },
    { data: failureCases },
    { data: successCases },
    { data: regulatoryItems },
    { data: marketTrends },
    { data: fundingSources },
    { data: risks },
    { data: aiInsights },
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
    supabase.from('ai_insights').select('*').eq('idea_id', ideaId),
    supabase.from('strategic_recommendations').select('*').eq('idea_id', ideaId),
    supabase.from('customer_segments').select('*').eq('idea_id', ideaId),
    supabase
      .from('benchmark_data')
      .select('*')
      .eq('category', idea.category)
      .eq('stage', idea.stage),
    supabase.from('detailed_analysis_reports').select('*').eq('idea_id', ideaId),
  ])

  console.log({
    idea: idea as StartupIdea,
    competitors: competitors || [],
    marketData: marketDataArr?.[0] || null,
    failureCases: failureCases || [],
    successCases: successCases || [],
    regulatoryItems: regulatoryItems || [],
    marketTrends: marketTrends || [],
    fundingSources: fundingSources || [],
    risks: risks || [],
    aiInsights: aiInsights || [],
    strategicRecommendations: strategicRecommendations || [],
    customerSegments: customerSegments || [],
    benchmarks: benchmarks || [],
    detailedReports: detailedReports || [],
  })

  return {
  idea: idea as StartupIdea,

  competitors: (competitors ?? []).map(c => ({
    ...c,
    strengths: parseJsonArray(c.strengths),
    weaknesses: parseJsonArray(c.weaknesses),
  })) as CompetitorAnalysis[],

  marketData: marketDataArr?.[0]
    ? {
        ...marketDataArr[0],
        market_gaps: parseJsonArray(marketDataArr[0].market_gaps),
        market_trends: parseJsonArray(marketDataArr[0].market_trends),
      }
    : null,

  failureCases: (failureCases ?? []).map(f => ({
    ...f,
    secondary_failure_reasons: parseJsonArray(f.secondary_failure_reasons),
    lessons_learned: parseJsonArray(f.lessons_learned),
    preventive_measures: parseJsonArray(f.preventive_measures),
  })) as FailureCase[],

  successCases: (successCases ?? []).map(s => ({
    ...s,
    success_factors: parseJsonArray(s.success_factors),
    lessons_learned: parseJsonArray(s.lessons_learned),
  })) as SuccessCase[],

  regulatoryItems: regulatoryItems ?? [],

  marketTrends: marketTrends ?? [],

  fundingSources: (fundingSources ?? []).map(f => ({
    ...f,
    category_focus: parseJsonArray(f.category_focus),
    stage_focus: parseJsonArray(f.stage_focus),
  })) as FundingSource[],
  
  risks: (risks ?? []).map(r => ({
    ...r,
    mitigation_strategies: parseJsonArray(r.mitigation_strategies),
  })) as RiskProfile[],

  aiInsights: aiInsights ?? [],

  strategicRecommendations: strategicRecommendations ?? [],

  customerSegments: (customerSegments ?? []).map(c => ({
    ...c,
    pain_points: parseJsonArray(c.pain_points),
  })) as CustomerSegment[],

  benchmarks: benchmarks ?? [],

  detailedReports: (detailedReports ?? []).map(r => ({
    ...r,
    market_analysis: parseJsonObject(r.market_analysis),
    competitive_analysis: parseJsonObject(r.competitive_analysis),
    customer_analysis: parseJsonObject(r.customer_analysis),
    risk_assessment: parseJsonObject(r.risk_assessment),
    recommendations: parseJsonArray(r.recommendations),
  })) as DetailedReport[],
}

}


const parseJsonArray = <T = string>(value: any): T[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
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
