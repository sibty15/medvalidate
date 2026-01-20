'use server'

import { supabaseServer } from '@/lib/supabase/server'

export type IdeaStatusLabel = 'completed' | 'analyzing' | 'failed' | 'processed' | 'pending'

interface IdeaScores {
  market: number
  competition: number
  feasibility: number
  innovation: number
}

interface MarketAnalysis {
  marketSize: string
  growthRate: string
  targetPotential: string
}

interface Competitor {
  name: string
  strength: string
}

interface Risk {
  level: 'low' | 'high'
  title: string
  description: string
}

export interface IdeaValidationResult {
  id: string
  title: string
  category: string | null
  status: IdeaStatusLabel
  submittedAt: string
  completedAt: string | null
  overallScore: number | null
  scores?: IdeaScores | null
  marketAnalysis?: MarketAnalysis | null
  competitors?: Competitor[] | null
  recommendations?: string[] | null
  risks?: Risk[] | null
}

export async function getCurrentUserIdeaResults(): Promise<IdeaValidationResult[]> {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const { data: ideas, error: ideasError } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })

  if (ideasError || !ideas) {
    throw new Error(ideasError?.message || 'Failed to load ideas')
  }

  const results: IdeaValidationResult[] = []

  for (const idea of ideas) {
    const { data: score, error: scoreError } = await supabase
      .from('scores')
      .select('*')
      .eq('idea_id', idea.id)
      .maybeSingle()

    if (scoreError && scoreError.code !== 'PGRST116') {
      throw new Error(scoreError.message)
    }

    const hasScore = !!score
    const status: IdeaStatusLabel = hasScore ? 'completed' : 'analyzing'
    const completedAt = hasScore ? score.calculated_at : null
    const overallScore = hasScore ? score.readiness_score : null

    let scores: IdeaScores | null = null
    if (hasScore) {
      scores = {
        market: score.market_demand,
        competition: score.compliance_score,
        feasibility: score.feasibility,
        innovation: score.readiness_score,
      }
    }
    //--------------------------------------later we use ai insights table for market analysis----------------
    const { data: analysis } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('idea_id', idea.id)
      .maybeSingle()

    let marketAnalysis: MarketAnalysis | null = null
    if (analysis) {


      marketAnalysis = {
        marketSize: analysis.market_size,
        growthRate: analysis.growth_rate,
        targetPotential: analysis.target_potential,
      }
    }

    const { data: checks, error: checksError } = await supabase
      .from('compliance_checks')
      .select('*')
      .eq('idea_id', idea.id)

    if (checksError) {
      throw new Error(checksError.message)
    }

    const risks: Risk[] =
      checks?.map((check) => ({
        level: check.passed ? 'low' : 'high',
        title: check.rule_name,
        description: check.rule_description,
      })) || []

    // Get AI-generated competitors from ai_insights (or fallback to generic ones)
    let competitors: Competitor[] | null = null
    if (analysis && analysis.competitors && Array.isArray(analysis.competitors)) {
      // Use AI-generated competitors
      competitors = analysis.competitors.map((comp: any) => ({
        name: comp.name || 'Unknown Competitor',
        strength: comp.strength || comp.market_position || 'Market presence',
      }))
    } else if (idea.category) {
      // Fallback: generate generic competitors if AI didn't provide them
      const baseName = (idea.category as string)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
      competitors = [
        { name: `${baseName} App A`, strength: 'Strong local adoption' },
        { name: `${baseName} Platform B`, strength: 'Backed by large hospital network' },
      ]
    }

    // Get AI-generated recommendations from ai_insights (or fallback to score-based ones)
    const recommendations: string[] = []
    if (analysis && analysis.recommendations && Array.isArray(analysis.recommendations)) {
      // Use AI-generated recommendations
      recommendations.push(...analysis.recommendations)
    } else if (status === 'completed' && overallScore !== null) {
      // Fallback: generate score-based recommendations if AI didn't provide them
      if (overallScore >= 80) {
        recommendations.push('Consider preparing for pilot deployments with key healthcare partners.')
      } else if (overallScore >= 60) {
        recommendations.push('Focus on tightening regulatory compliance and refining your MVP.')
      } else {
        recommendations.push('Revisit core assumptions and strengthen the business model before scaling.')
      }
      if (idea.stage) {
        recommendations.push(`Next step: validate your ${idea.stage} with 5–10 target customers.`)
      }
    }

    results.push({
      id: idea.id,
      title: idea.title,
      category: idea.category,
      status,
      submittedAt: idea.submitted_at,
      completedAt,
      overallScore,
      scores,
      marketAnalysis,
      competitors,
      recommendations: recommendations.length ? recommendations : null,
      risks: risks.length ? risks : null,
    })
  }

  return results
}


export async function getSingleIdeaResultsForCurrentUser(ideaId: string): Promise<IdeaValidationResult> {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const { data: idea, error: ideaError } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('id', ideaId)
    .eq('user_id', user.id)
    .single()

  if (ideaError || !idea) {
    throw new Error(ideaError?.message || 'Idea not found')
  }

  const { data: score, error: scoreError } = await supabase
    .from('scores')
    .select('*')
    .eq('idea_id', idea.id)
    .maybeSingle()

  if (scoreError && scoreError.code !== 'PGRST116') {
    throw new Error(scoreError.message)
  }

  const hasScore = !!score
  const status: IdeaStatusLabel = hasScore ? 'completed' : 'analyzing'
  const completedAt = hasScore ? score.calculated_at : null
  const overallScore = hasScore ? score.readiness_score : null

  let scores: IdeaScores | null = null
  if (hasScore) {
    scores = {
      market: score.market_demand,
      competition: score.compliance_score,
      feasibility: score.feasibility,
      innovation: score.readiness_score,
    }
  }

  const { data: analysis } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('idea_id', idea.id)
    .maybeSingle()

  let marketAnalysis: MarketAnalysis | null = null
  if (analysis) {


    marketAnalysis = {
      marketSize: analysis.market_size,
      growthRate: analysis.growth_rate,
      targetPotential: analysis.target_potential,
    }
  }

  const { data: checks, error: checksError } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('idea_id', idea.id)

  if (checksError) {
    throw new Error(checksError.message)
  }

  const risks: Risk[] =
    checks?.map((check) => ({
      level: check.passed ? 'low' : 'high',
      title: check.rule_name,
      description: check.rule_description,
    })) || []

  // Get AI-generated competitors from ai_insights (or fallback to generic ones)
  let competitors: Competitor[] | null = null
  if (analysis && analysis.competitors && Array.isArray(analysis.competitors)) {
    // Use AI-generated competitors
    competitors = analysis.competitors.map((comp: any) => ({
      name: comp.name || 'Unknown Competitor',
      strength: comp.strength || comp.market_position || 'Market presence',
    }))
  } else if (idea.category) {
    // Fallback: generate generic competitors if AI didn't provide them
    const baseName = (idea.category as string)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
    competitors = [
      { name: `${baseName} App A`, strength: 'Strong local adoption' },
      { name: `${baseName} Platform B`, strength: 'Backed by large hospital network' },
    ]
  }

  // Get AI-generated recommendations from ai_insights (or fallback to score-based ones)
  const recommendations: string[] = []
  if (analysis && analysis.recommendations && Array.isArray(analysis.recommendations)) {
    // Use AI-generated recommendations
    recommendations.push(...analysis.recommendations)
  } else if (status === 'completed' && overallScore !== null) {
    // Fallback: generate score-based recommendations if AI didn't provide them
    if (overallScore >= 80) {
      recommendations.push('Consider preparing for pilot deployments with key healthcare partners.')
    } else if (overallScore >= 60) {
      recommendations.push('Focus on tightening regulatory compliance and refining your MVP.')
    } else {
      recommendations.push('Revisit core assumptions and strengthen the business model before scaling.')
    }
    if (idea.stage) {
      recommendations.push(`Next step: validate your ${idea.stage} with 5–10 target customers.`)
    }
  }

  return {
    id: idea.id,
    title: idea.title,
    category: idea.category,
    status,
    submittedAt: idea.submitted_at,
    completedAt,
    overallScore,
    scores,
    marketAnalysis,
    competitors,
    recommendations: recommendations.length ? recommendations : null,
    risks: risks.length ? risks : null,
  }
}