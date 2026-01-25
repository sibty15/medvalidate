"use server"

import { supabaseServer } from "@/lib/supabase/server"
import { StartupIdeaBase, StartupIdea } from "./fullIdeaAnalysis"
import { generateIdeaAnalysis } from "./ai-actions/generateIdeaAnalysisAI"
import { createClient } from "@supabase/supabase-js"

// Create Idea
export async function createIdea(idea: StartupIdeaBase): Promise<StartupIdea> {
  const supabase = await supabaseServer()

  // Ensure the authenticated user has a row in the users table
  // (important for Google OAuth flows where callback provisioning may have failed).
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!userError && user) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (url && serviceKey) {
        const adminClient = createClient(url, serviceKey)

        const fullName =
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : typeof user.user_metadata?.fullName === "string"
            ? user.user_metadata.fullName
            : undefined

        const { error: upsertError } = await adminClient.from("users").upsert(
          {
            id: user.id,
            email: user.email,
            full_name: fullName ?? user.email ?? "Unknown",
          },
          { onConflict: "id" }
        )

        if (upsertError) {
          console.error(
            "Error upserting user into users table before idea creation:",
            upsertError,
          )
        }
      }
    }
  } catch (e) {
    console.error(
      "Unexpected error ensuring user exists in users table before idea creation:",
      e,
    )
  }

  const { data: newIdea, error } = await supabase
    .from("startup_ideas")
    .insert([{ ...idea, submitted_at: new Date().toISOString() }])
    .select()
    .single()

  if (error || !newIdea) throw new Error(error?.message)

  // Run full processing (scores, compliance, analysis)
  await normalIdeaProcessing(newIdea.id)

  return newIdea as StartupIdea
}

// List all ideas
export async function listIdeas(): Promise<StartupIdea[]> {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data as StartupIdea[]
}

// Get single idea
export async function getIdea(ideaId: string): Promise<StartupIdea> {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('id', ideaId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    throw new Error('Idea not found')
  }

  return data as StartupIdea
}




interface Score {
  feasibility: number
  compliance_score: number
  market_demand: number
  cultural_acceptance: number
  cost_viability: number
  readiness_score: number
}


function computeScores(idea: StartupIdeaBase): Score {
  let market_demand = 70
  let feasibility = 70
  let compliance_score = 70
  let cultural_acceptance = 70
  let cost_viability = 70

  const category = (idea.category || '').toLowerCase()
  const stage = (idea.stage || '').toLowerCase()
  const funding = (idea.funding_needed || '').toLowerCase()

  if (['mental-health', 'telemedicine', 'healthcare-ai'].includes(category)) market_demand += 10
  else if (['elder-care', 'health-monitoring'].includes(category)) market_demand += 5

  if (['mental-health', 'elder-care'].includes(category)) cultural_acceptance += 5

  if (['prototype', 'mvp'].includes(stage)) {
    feasibility += 5
    cost_viability += 5
  } else if (['early-traction', 'growth'].includes(stage)) {
    feasibility += 10
    cost_viability += 10
  }

  if (funding.includes('under-1m') || funding.includes('bootstrap')) cost_viability += 5
  else if (funding.includes('5m-20m') || funding.includes('20m+')) cost_viability -= 5

  const clamp = (x: number) => Math.max(0, Math.min(100, x))
  market_demand = clamp(market_demand)
  feasibility = clamp(feasibility)
  compliance_score = clamp(compliance_score)
  cultural_acceptance = clamp(cultural_acceptance)
  cost_viability = clamp(cost_viability)
  const readiness_score = clamp((market_demand + feasibility + compliance_score + cultural_acceptance + cost_viability) / 5)

  return { feasibility, compliance_score, market_demand, cultural_acceptance, cost_viability, readiness_score }
}

// Normal Idea Processing (LEGACY - uses fake analysis)
export async function normalIdeaProcessingLegacy(ideaId: string): Promise<void> {
  const supabase = await supabaseServer()

  // Load idea
  const { data: idea, error: ideaError } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('id', ideaId)
    .single()
  if (ideaError || !idea) throw new Error('Idea not found')

  // 1) Score (only if not already present)
  const { data: existingScore } = await supabase
    .from('scores')
    .select('id')
    .eq('idea_id', ideaId)
    .maybeSingle()

  if (!existingScore) {
    const scores = computeScores(idea as StartupIdeaBase)
    const { error: scoreError } = await supabase
      .from('scores')
      .insert([{ idea_id: ideaId, ...scores }])
    if (scoreError) throw new Error(scoreError.message)
  }

  // 2) Basic compliance checks (only if none exist)
  const { data: existingChecks, error: checksError } = await supabase
    .from('compliance_checks')
    .select('id')
    .eq('idea_id', ideaId)

  if (checksError) throw new Error(checksError.message)

  if (!existingChecks || existingChecks.length === 0) {
    const { error: insertChecksError } = await supabase
      .from('compliance_checks')
      .insert([
        {
          idea_id: ideaId,
          rule_name: 'Regulatory review (DRAP)',
          rule_description:
            'Assess whether the solution requires formal approval from DRAP or other regulators.',
          passed: false,
        },
        {
          idea_id: ideaId,
          rule_name: 'Data privacy & security',
          rule_description:
            'Review how sensitive health data is stored, processed, and shared.',
          passed: true,
        },
      ])
    if (insertChecksError) throw new Error(insertChecksError.message)
  }

  // 3) Basic AI analysis (only if none exists)
  // NOTE: ensure table name matches your Supabase schema (e.g. 'ai_insights' or 'ai_analyses')
  const { data: existingAnalysis } = await supabase
    .from('ai_insights')
    .select('id')
    .eq('idea_id', ideaId)
    .maybeSingle()

  if (!existingAnalysis) {
    const keywords: string[] = []

    if (idea.title) {
      keywords.push(
        ...(idea.title as string)
          .split(/\s+/)
          .slice(0, 5)
          .map((w) => w.toLowerCase()),
      )
    }
    if (idea.category) keywords.push((idea.category as string).toLowerCase())
    if (idea.stage) keywords.push((idea.stage as string).toLowerCase())

    const { error: analysisError } = await supabase
      .from('ai_insights')
      .insert([
        {
          idea_id: ideaId,
          // keywords,
          // sentiment: 'positive',
          // confidence: 0.8,
          // domain: idea.domain,
          // subdomain: idea.subdomain,
          "market_size": `Growing ${idea.category} market in Pakistan`,
          "growth_rate": `Emerging growth potential`,
          "target_potential": `Strong fit for ${idea.stage} stage startups`,
        },
      ])

    if (analysisError) throw new Error(analysisError.message)
  }
}

// AI-Powered Idea Processing (NEW)
export async function normalIdeaProcessing(ideaId: string): Promise<void> {
  const supabase = await supabaseServer()

  // Load idea
  const { data: idea, error: ideaError } = await supabase
    .from('startup_ideas')
    .select('*')
    .eq('id', ideaId)
    .single()
  if (ideaError || !idea) throw new Error('Idea not found')

  // Check if already analyzed
  const { data: existingScore } = await supabase
    .from('scores')
    .select('id')
    .eq('idea_id', ideaId)
    .maybeSingle()

  if (existingScore) {
    console.log(`Idea ${ideaId} already analyzed, skipping...`)
    return
  }

  try {
    // Generate AI analysis
    const analysis = await generateIdeaAnalysis(idea as StartupIdeaBase)

    // 1) Insert Scores
    const { error: scoreError } = await supabase
      .from('scores')
      .insert([{ idea_id: ideaId, ...analysis.scores }])
    if (scoreError) throw new Error(`Score insert failed: ${scoreError.message}`)

    // 2) Insert Compliance Checks
    const complianceRecords = analysis.compliance_checks.map(check => ({
      idea_id: ideaId,
      ...check
    }))
    const { error: complianceError } = await supabase
      .from('compliance_checks')
      .insert(complianceRecords)
    if (complianceError) throw new Error(`Compliance insert failed: ${complianceError.message}`)

    // 3) Insert AI Insights
    const { error: insightsError } = await supabase
      .from('ai_insights')
      .insert([{
        idea_id: ideaId,
        market_size: analysis.ai_insights.market_size,
        growth_rate: analysis.ai_insights.growth_rate,
        target_potential: analysis.ai_insights.target_potential,
        key_risks: analysis.ai_insights.key_risks,
        competitive_advantages: analysis.ai_insights.competitive_advantages,
        regulatory_considerations: analysis.ai_insights.regulatory_considerations,
        competitors: analysis.competitors, // Store as JSONB array
        recommendations: analysis.recommendations, // Store as JSONB array
      }])
    if (insightsError) throw new Error(`Insights insert failed: ${insightsError.message}`)

    console.log(`✅ AI analysis complete for idea ${ideaId}`)
  } catch (error) {
    console.error('AI analysis failed, falling back to legacy processing:', error)
    // Fallback to legacy processing if AI fails
    await normalIdeaProcessingLegacy(ideaId)
  }
}