'use server'

import { supabaseServer } from '@/lib/supabase/server'
import { StartupIdeaBase, StartupIdea } from '../fullIdeaAnalysis'
import { generateIdeaAnalysis, AIIdeaAnalysis } from "./generateIdeaAnalysisAI";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

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

export interface IdeaCreationResponse {
  success: boolean
  idea?: StartupIdea
  error?: string
  analysisStatus: 'completed' | 'pending' | 'failed'
}

// ============================================================================
// IDEA CREATION & ANALYSIS
// ============================================================================

/**
 * Creates a new startup idea and runs AI analysis
 * @param idea - The startup idea data
 * @returns IdeaCreationResponse with success status and idea/error details
 */
export async function createIdeaWithAnalysis(
  idea: StartupIdeaBase
): Promise<IdeaCreationResponse> {
  const supabase = await supabaseServer()

  try {
    // 1. Validate user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'User not authenticated',
        analysisStatus: 'pending',
      }
    }

    // 2. Insert startup idea into database
    const { data: newIdea, error: ideaError } = await supabase
      .from('startup_ideas')
      .insert([
        {
          ...idea,
          user_id: user.id,
          submitted_at: new Date().toISOString(),
          status: 'pending',
          fully_analyzed: false,
        },
      ])
      .select()
      .single()

    if (ideaError || !newIdea) {
      console.error('Failed to create idea:', ideaError)
      return {
        success: false,
        error: `Failed to create idea: ${ideaError?.message || 'Unknown error'}`,
        analysisStatus: 'failed',
      }
    }

    // 3. Run AI analysis synchronously (wait for completion)
    // If analysis fails, delete the idea and return error
    try {
      console.log(`🔄 Running AI analysis for idea ${newIdea.id}...`)
      await runAIAnalysis(newIdea.id, idea)
      
      return {
        success: true,
        idea: newIdea as StartupIdea,
        analysisStatus: 'completed',
      }
    } catch (analysisError) {
      console.error(`❌ Analysis failed for idea ${newIdea.id}, rolling back...`, analysisError)
      
      // Rollback: Delete the idea since analysis failed
      await supabase
        .from('startup_ideas')
        .delete()
        .eq('id', newIdea.id)
      
      return {
        success: false,
        error: `AI analysis failed: ${analysisError instanceof Error ? analysisError.message : 'Unknown error'}. Please try again.`,
        analysisStatus: 'failed',
      }
    }
  } catch (error) {
    console.error('Unexpected error in createIdeaWithAnalysis:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred',
      analysisStatus: 'failed',
    }
  }
}

/**
 * Runs AI analysis for a startup idea and stores results in database
 * @param ideaId - The ID of the idea to analyze
 * @param ideaData - The startup idea data
 * @returns true if successful, throws error if failed
 */
async function runAIAnalysis(ideaId: string, ideaData: StartupIdeaBase): Promise<boolean> {
  const supabase = await supabaseServer()

  try {
    console.log(`🤖 Starting AI analysis for idea: ${ideaId}`)

    // 1. Check if already analyzed
    const { data: existingScore } = await supabase
      .from('scores')
      .select('id')
      .eq('idea_id', ideaId)
      .maybeSingle()

    if (existingScore) {
      console.log(`⏭️ Idea ${ideaId} already analyzed, skipping...`)
      return true
    }

    // 2. Generate AI analysis
    let analysis: AIIdeaAnalysis
    try {
      analysis = await generateIdeaAnalysis(ideaData)
      console.log(`✅ AI analysis generated for idea: ${ideaId}`)
    } catch (aiError) {
      console.error(`❌ AI generation failed for idea ${ideaId}:`, aiError)
      throw new Error(`AI analysis failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`)
    }

    // 3. Validate AI response structure
    if (!validateAIResponse(analysis)) {
      console.error(`❌ Invalid AI response structure for idea ${ideaId}`)
      throw new Error('AI returned invalid response structure')
    }

    // 4. Store Scores in database
    const { error: scoreError } = await supabase
      .from('scores')
      .insert([
        {
          idea_id: ideaId,
          feasibility: analysis.scores.feasibility,
          compliance_score: analysis.scores.compliance_score,
          market_demand: analysis.scores.market_demand,
          cultural_acceptance: analysis.scores.cultural_acceptance,
          cost_viability: analysis.scores.cost_viability,
          readiness_score: analysis.scores.readiness_score,
          calculated_at: new Date().toISOString(),
        },
      ])

    if (scoreError) {
      console.error(`❌ Failed to insert scores for idea ${ideaId}:`, scoreError)
      throw new Error(`Score insertion failed: ${scoreError.message}`)
    }
    console.log(`📊 Scores stored for idea: ${ideaId}`)

    // 5. Store Compliance Checks in database
    const complianceRecords = analysis.compliance_checks.map((check) => ({
      idea_id: ideaId,
      rule_name: check.rule_name,
      rule_description: check.rule_description,
      passed: check.passed,
      checked_at: new Date().toISOString(),
    }))

    const { error: complianceError } = await supabase
      .from('compliance_checks')
      .insert(complianceRecords)

    if (complianceError) {
      console.error(`❌ Failed to insert compliance checks for idea ${ideaId}:`, complianceError)
      throw new Error(`Compliance insertion failed: ${complianceError.message}`)
    }
    console.log(`✅ Compliance checks stored for idea: ${ideaId}`)

    // 6. Store AI Insights in database
    const { error: insightsError } = await supabase
      .from('ai_insights')
      .insert([
        {
          idea_id: ideaId,
          market_size: analysis.ai_insights.market_size,
          growth_rate: analysis.ai_insights.growth_rate,
          target_potential: analysis.ai_insights.target_potential,
          key_risks: JSON.stringify(analysis.ai_insights.key_risks),
          competitive_advantages: JSON.stringify(analysis.ai_insights.competitive_advantages),
          regulatory_considerations: JSON.stringify(analysis.ai_insights.regulatory_considerations),
          competitors: JSON.stringify(analysis.competitors),
          recommendations: JSON.stringify(analysis.recommendations),
        },
      ])

    if (insightsError) {
      console.error(`❌ Failed to insert AI insights for idea ${ideaId}:`, insightsError)
      throw new Error(`Insights insertion failed: ${insightsError.message}`)
    }
    console.log(`🎯 AI insights stored for idea: ${ideaId}`)

    // 7. Update idea status to analyzed
    const { error: updateError } = await supabase
      .from('startup_ideas')
      .update({ 
        fully_analyzed: true,
        status: 'processed',
      })
      .eq('id', ideaId)

    if (updateError) {
      console.warn(`⚠️ Failed to update idea status for ${ideaId}:`, updateError)
      // Don't throw - analysis is complete even if status update fails
    }

    console.log(`🎉 Complete AI analysis finished for idea: ${ideaId}`)
    return true
  } catch (error) {
    console.error(`💥 Fatal error in runAIAnalysis for idea ${ideaId}:`, error)
    // Store error state in database for user visibility
    try {
      await supabase
        .from('startup_ideas')
        .update({ status: 'pending' })
        .eq('id', ideaId)
    } catch (updateError) {
      console.error('Failed to update error status:', updateError)
    }
    throw error // Re-throw to propagate failure
  }
}

/**
 * Reanalyzes an existing startup idea
 * @param ideaId - The ID of the idea to reanalyze
 * @returns IdeaCreationResponse with success status
 */
export async function reanalyzeIdea(ideaId: string): Promise<IdeaCreationResponse> {
  const supabase = await supabaseServer()

  try {
    // 1. Validate user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'User not authenticated',
        analysisStatus: 'failed',
      }
    }

    // 2. Fetch the existing idea
    const { data: existingIdea, error: fetchError } = await supabase
      .from('startup_ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingIdea) {
      return {
        success: false,
        error: 'Idea not found or access denied',
        analysisStatus: 'failed',
      }
    }

    // 3. Delete existing analysis data to start fresh
    await supabase.from('scores').delete().eq('idea_id', ideaId)
    await supabase.from('compliance_checks').delete().eq('idea_id', ideaId)
    await supabase.from('ai_insights').delete().eq('idea_id', ideaId)

    // 4. Update idea status to pending
    await supabase
      .from('startup_ideas')
      .update({ status: 'pending', fully_analyzed: false })
      .eq('id', ideaId)

    // 5. Run AI analysis
    try {
      console.log(`🔄 Reanalyzing idea ${ideaId}...`)
      await runAIAnalysis(ideaId, existingIdea as StartupIdeaBase)

      return {
        success: true,
        idea: existingIdea as StartupIdea,
        analysisStatus: 'completed',
      }
    } catch (analysisError) {
      console.error(`❌ Reanalysis failed for idea ${ideaId}:`, analysisError)

      // Update status to failed
      await supabase
        .from('startup_ideas')
        .update({ status: 'analysis_failed' })
        .eq('id', ideaId)

      return {
        success: false,
        error: `AI analysis failed: ${analysisError instanceof Error ? analysisError.message : 'Unknown error'}. Please try again.`,
        analysisStatus: 'failed',
      }
    }
  } catch (error) {
    console.error('Unexpected error in reanalyzeIdea:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unexpected error occurred',
      analysisStatus: 'failed',
    }
  }
}

/**
 * Validates the AI response structure
 * @param analysis - The AI analysis response
 * @returns true if valid, false otherwise
 */
function validateAIResponse(analysis: any): analysis is AIIdeaAnalysis {
  try {
    // Check scores exist and are numbers
    if (!analysis.scores || typeof analysis.scores !== 'object') return false
    if (typeof analysis.scores.feasibility !== 'number') return false
    if (typeof analysis.scores.market_demand !== 'number') return false
    if (typeof analysis.scores.readiness_score !== 'number') return false

    // Check compliance_checks is an array
    if (!Array.isArray(analysis.compliance_checks)) return false
    if (analysis.compliance_checks.length === 0) return false

    // Check ai_insights exists
    if (!analysis.ai_insights || typeof analysis.ai_insights !== 'object') return false
    if (!analysis.ai_insights.market_size) return false
    if (!analysis.ai_insights.growth_rate) return false

    // Check competitors is an array
    if (!Array.isArray(analysis.competitors)) return false

    // Check recommendations is an array
    if (!Array.isArray(analysis.recommendations)) return false

    return true
  } catch (error) {
    console.error('Validation error:', error)
    return false
  }
}

// ============================================================================
// FETCH RESULTS FROM DATABASE
// ============================================================================

/**
 * Fetches all idea validation results for the current user
 * @returns Array of IdeaValidationResult
 */
export async function getAllUserIdeaResults(): Promise<IdeaValidationResult[]> {
  const supabase = await supabaseServer()

  try {
    // 1. Validate user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // 2. Fetch all user's ideas
    const { data: ideas, error: ideasError } = await supabase
      .from('startup_ideas')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })

    if (ideasError) {
      throw new Error(`Failed to fetch ideas: ${ideasError.message}`)
    }

    if (!ideas || ideas.length === 0) {
      return []
    }

    // 3. Process each idea and fetch related data
    const results: IdeaValidationResult[] = []

    for (const idea of ideas) {
      const result = await processIdeaResult(supabase, idea)
      results.push(result)
    }

    return results
  } catch (error) {
    console.error('Error in getAllUserIdeaResults:', error)
    throw error
  }
}

/**
 * Fetches a single idea validation result for the current user
 * @param ideaId - The ID of the idea to fetch
 * @returns IdeaValidationResult
 */
export async function getSingleIdeaResult(ideaId: string): Promise<IdeaValidationResult> {
  const supabase = await supabaseServer()

  try {
    // 1. Validate user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    // 2. Fetch the specific idea
    const { data: idea, error: ideaError } = await supabase
      .from('startup_ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single()

    if (ideaError || !idea) {
      throw new Error(`Idea not found: ${ideaError?.message || 'Unknown error'}`)
    }

    // 3. Process and return the result
    return await processIdeaResult(supabase, idea)
  } catch (error) {
    console.error('Error in getSingleIdeaResult:', error)
    throw error
  }
}

/**
 * Processes a single idea and fetches all related data from database
 * @param supabase - Supabase client
 * @param idea - The startup idea record
 * @returns IdeaValidationResult
 */
async function processIdeaResult(supabase: any, idea: any): Promise<IdeaValidationResult> {
  // 1. Fetch scores
  const { data: score } = await supabase
    .from('scores')
    .select('*')
    .eq('idea_id', idea.id)
    .maybeSingle()

  const hasScore = !!score
  const status: IdeaStatusLabel = hasScore ? 'processed' : 'pending'
  const completedAt = hasScore ? score.calculated_at : null
  const overallScore = hasScore ? score.readiness_score : null

  // 2. Transform scores for UI
  let scores: IdeaScores | null = null
  if (hasScore) {
    scores = {
      market: score.market_demand,
      competition: score.compliance_score,
      feasibility: score.feasibility,
      innovation: score.readiness_score,
    }
  }

  // 3. Fetch AI insights
  const { data: analysis } = await supabase
    .from('ai_insights')
    .select('*')
    .eq('idea_id', idea.id)
    .maybeSingle()

  // 4. Parse market analysis
  let marketAnalysis: MarketAnalysis | null = null
  if (analysis) {
    marketAnalysis = {
      marketSize: analysis.market_size || 'Not available',
      growthRate: analysis.growth_rate || 'Not available',
      targetPotential: analysis.target_potential || 'Not available',
    }
  }

  // 5. Parse competitors from JSONB
  let competitors: Competitor[] | null = null
  if (analysis?.competitors) {
    try {
      const competitorsData = typeof analysis.competitors === 'string' 
        ? JSON.parse(analysis.competitors) 
        : analysis.competitors

      if (Array.isArray(competitorsData) && competitorsData.length > 0) {
        competitors = competitorsData.map((comp: any) => ({
          name: comp.name || 'Unknown Competitor',
          strength: comp.strength || comp.market_position || 'Market presence',
        }))
      }
    } catch (error) {
      console.error(`Failed to parse competitors for idea ${idea.id}:`, error)
    }
  }

  // 6. Parse recommendations from JSONB
  let recommendations: string[] | null = null
  if (analysis?.recommendations) {
    try {
      const recsData = typeof analysis.recommendations === 'string'
        ? JSON.parse(analysis.recommendations)
        : analysis.recommendations

      if (Array.isArray(recsData) && recsData.length > 0) {
        recommendations = recsData
      }
    } catch (error) {
      console.error(`Failed to parse recommendations for idea ${idea.id}:`, error)
    }
  }

  // 7. Fetch compliance checks and transform to risks
  const { data: checks } = await supabase
    .from('compliance_checks')
    .select('*')
    .eq('idea_id', idea.id)

  const risks: Risk[] =
    checks?.map((check: any) => ({
      level: check.passed ? 'low' as const : 'high' as const,
      title: check.rule_name,
      description: check.rule_description,
    })) || []

  // 8. Return complete result
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
    recommendations,
    risks: risks.length > 0 ? risks : null,
  }
}
