import { NextRequest, NextResponse } from 'next/server'
import { runFullAIAnalysis, getFullIdeaAnalysisAI } from '@/app/actions/ai-actions/newIdeaAnalysisFull'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, action = 'run' } = body

    if (!ideaId) {
      return NextResponse.json(
        { error: 'Missing ideaId in request body' },
        { status: 400 }
      )
    }

    console.log(`📡 API Request: ${action} full analysis for idea: ${ideaId}`)

    if (action === 'run') {
      // Run the full AI analysis
      const result = await runFullAIAnalysis(ideaId)
      
      return NextResponse.json({
        success: result,
        message: result 
          ? 'Full AI analysis completed successfully' 
          : 'Full AI analysis failed or was skipped',
        ideaId,
      })
    } else if (action === 'get') {
      // Get the full analysis data
      const analysisData = await getFullIdeaAnalysisAI(ideaId)
      
      return NextResponse.json({
        success: true,
        message: 'Full analysis data retrieved successfully',
        ideaId,
        data: analysisData,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "run" or "get"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('❌ API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Full analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Full Analysis Test API',
    usage: {
      endpoint: '/api/test-full-analysis',
      method: 'POST',
      body: {
        ideaId: 'string (required)',
        action: '"run" | "get" (optional, default: "run")',
      },
      actions: {
        run: 'Generate and store full AI analysis for the idea',
        get: 'Retrieve full analysis data (will generate if not exists)',
      },
      example: {
        run: {
          ideaId: 'your-idea-id-here',
          action: 'run',
        },
        get: {
          ideaId: 'your-idea-id-here',
          action: 'get',
        },
      },
    },
  })
}
