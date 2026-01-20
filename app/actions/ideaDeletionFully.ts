'use server'

import { supabaseServer } from '@/lib/supabase/server'

/**
 * Fully deletes a startup idea and all related data with cascade deletion
 * Deletes from all tables with idea_id foreign key:
 * - ai_insights
 * - benchmark_data
 * - competitor_analyses
 * - compliance_checks
 * - customer_segments
 * - detailed_analysis_reports
 * - failure_analyses
 * - funding_sources
 * - healthcare_market_data
 * - market_trends
 * - regulatory_frameworks
 * - reports
 * - risk_profiles
 * - scores
 * - strategic_recommendations
 * - success_analyses
 * - startup_ideas (main table)
 */
export async function deleteIdeaFully(ideaId: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await supabaseServer()

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, message: 'Not authenticated' }
    }

    // Verify the idea belongs to the user before deletion
    const { data: idea, error: ideaError } = await supabase
      .from('startup_ideas')
      .select('id, user_id')
      .eq('id', ideaId)
      .single()

    if (ideaError || !idea) {
      return { success: false, message: 'Idea not found' }
    }

    if (idea.user_id !== user.id) {
      return { success: false, message: 'Unauthorized to delete this idea' }
    }

    // Delete related records explicitly (in case cascade is not set up)
    // Order matters: delete child records before parent

    // Delete AI insights
    const { error: aiInsightsError } = await supabase
      .from('ai_insights')
      .delete()
      .eq('idea_id', ideaId)

    if (aiInsightsError) {
      console.error('Error deleting AI insights:', aiInsightsError)
    }

    // Delete benchmark data
    const { error: benchmarkError } = await supabase
      .from('benchmark_data')
      .delete()
      .eq('idea_id', ideaId)

    if (benchmarkError) {
      console.error('Error deleting benchmark data:', benchmarkError)
    }

    // Delete competitor analyses
    const { error: competitorError } = await supabase
      .from('competitor_analyses')
      .delete()
      .eq('idea_id', ideaId)

    if (competitorError) {
      console.error('Error deleting competitor analyses:', competitorError)
    }

    // Delete compliance checks
    const { error: complianceError } = await supabase
      .from('compliance_checks')
      .delete()
      .eq('idea_id', ideaId)

    if (complianceError) {
      console.error('Error deleting compliance checks:', complianceError)
    }

    // Delete customer segments
    const { error: customerSegmentsError } = await supabase
      .from('customer_segments')
      .delete()
      .eq('idea_id', ideaId)

    if (customerSegmentsError) {
      console.error('Error deleting customer segments:', customerSegmentsError)
    }

    // Delete detailed analysis reports
    const { error: detailedAnalysisError } = await supabase
      .from('detailed_analysis_reports')
      .delete()
      .eq('idea_id', ideaId)

    if (detailedAnalysisError) {
      console.error('Error deleting detailed analysis reports:', detailedAnalysisError)
    }

    // Delete failure analyses
    const { error: failureAnalysesError } = await supabase
      .from('failure_analyses')
      .delete()
      .eq('idea_id', ideaId)

    if (failureAnalysesError) {
      console.error('Error deleting failure analyses:', failureAnalysesError)
    }

    // Delete funding sources
    const { error: fundingSourcesError } = await supabase
      .from('funding_sources')
      .delete()
      .eq('idea_id', ideaId)

    if (fundingSourcesError) {
      console.error('Error deleting funding sources:', fundingSourcesError)
    }

    // Delete healthcare market data
    const { error: marketDataError } = await supabase
      .from('healthcare_market_data')
      .delete()
      .eq('idea_id', ideaId)

    if (marketDataError) {
      console.error('Error deleting healthcare market data:', marketDataError)
    }

    // Delete market trends
    const { error: marketTrendsError } = await supabase
      .from('market_trends')
      .delete()
      .eq('idea_id', ideaId)

    if (marketTrendsError) {
      console.error('Error deleting market trends:', marketTrendsError)
    }

    // Delete regulatory frameworks
    const { error: regulatoryError } = await supabase
      .from('regulatory_frameworks')
      .delete()
      .eq('idea_id', ideaId)

    if (regulatoryError) {
      console.error('Error deleting regulatory frameworks:', regulatoryError)
    }

    // Delete reports
    const { error: reportsError } = await supabase
      .from('reports')
      .delete()
      .eq('idea_id', ideaId)

    if (reportsError) {
      console.error('Error deleting reports:', reportsError)
    }

    // Delete risk profiles
    const { error: riskProfilesError } = await supabase
      .from('risk_profiles')
      .delete()
      .eq('idea_id', ideaId)

    if (riskProfilesError) {
      console.error('Error deleting risk profiles:', riskProfilesError)
    }

    // Delete scores
    const { error: scoresError } = await supabase
      .from('scores')
      .delete()
      .eq('idea_id', ideaId)

    if (scoresError) {
      console.error('Error deleting scores:', scoresError)
    }

    // Delete strategic recommendations
    const { error: strategicRecommendationsError } = await supabase
      .from('strategic_recommendations')
      .delete()
      .eq('idea_id', ideaId)

    if (strategicRecommendationsError) {
      console.error('Error deleting strategic recommendations:', strategicRecommendationsError)
    }

    // Delete success analyses
    const { error: successAnalysesError } = await supabase
      .from('success_analyses')
      .delete()
      .eq('idea_id', ideaId)

    if (successAnalysesError) {
      console.error('Error deleting success analyses:', successAnalysesError)
    }

    // Finally, delete the main idea record
    const { error: deleteError } = await supabase
      .from('startup_ideas')
      .delete()
      .eq('id', ideaId)
      .eq('user_id', user.id) // Double-check user ownership

    if (deleteError) {
      return { success: false, message: `Failed to delete idea: ${deleteError.message}` }
    }

    return { success: true, message: 'Idea and all related data deleted successfully' }
  } catch (error) {
    console.error('Error in deleteIdeaFully:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred during deletion' 
    }
  }
}

/**
 * Deletes multiple ideas and all their related data
 */
export async function deleteIdeasBulk(ideaIds: string[]): Promise<{ 
  success: boolean
  message: string
  deletedCount: number
  failedIds: string[]
}> {
  try {
    const supabase = await supabaseServer()

    // Verify user authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, message: 'Not authenticated', deletedCount: 0, failedIds: ideaIds }
    }

    let deletedCount = 0
    const failedIds: string[] = []

    // Delete each idea sequentially to ensure proper cascade
    for (const ideaId of ideaIds) {
      const result = await deleteIdeaFully(ideaId)
      if (result.success) {
        deletedCount++
      } else {
        failedIds.push(ideaId)
      }
    }

    if (failedIds.length === 0) {
      return { 
        success: true, 
        message: `Successfully deleted ${deletedCount} idea(s)`, 
        deletedCount,
        failedIds: []
      }
    } else {
      return { 
        success: false, 
        message: `Deleted ${deletedCount} idea(s), failed to delete ${failedIds.length} idea(s)`, 
        deletedCount,
        failedIds
      }
    }
  } catch (error) {
    console.error('Error in deleteIdeasBulk:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred during bulk deletion',
      deletedCount: 0,
      failedIds: ideaIds
    }
  }
}
