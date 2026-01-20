import { NextRequest, NextResponse } from 'next/server'
import { generateIdeaAnalysis } from '@/app/actions/ai-actions/generateIdeaAnalysisAI'
import { StartupIdeaBase } from '@/app/actions/fullIdeaAnalysis'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: title and description' 
        },
        { status: 400 }
      )
    }

    // Construct startup idea object
    const ideaData: StartupIdeaBase = {
      title: body.title,
      description: body.description,
      problem_statement: body.problem_statement || body.problemStatement,
      target_audience: body.target_audience || body.targetAudience,
      unique_value_proposition: body.unique_value_proposition || body.uniqueValueProposition,
      category: body.category,
      stage: body.stage,
      team_size: body.team_size || body.teamSize,
      funding_needed: body.funding_needed || body.fundingNeeded,
      domain: body.domain || 'Healthcare',
      subdomain: body.subdomain || body.category,
      user_id: 'test-user', // Not needed for analysis, just for type compatibility
    }

    console.log('🧪 Testing AI analysis for idea:', ideaData.title)

    // Generate AI analysis
    const startTime = Date.now()
    const analysis = await generateIdeaAnalysis(ideaData)
    const duration = Date.now() - startTime

    console.log(`✅ Analysis completed in ${duration}ms`)

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: analysis,
        metadata: {
          processingTime: `${duration}ms`,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error in testIdeaGen API:', error)

    // Handle different error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to show API documentation
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/testIdeaGen',
    method: 'POST',
    description: 'Test endpoint for AI-powered startup idea analysis',
    usage: {
      url: '/api/testIdeaGen',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        title: 'string (required)',
        description: 'string (required)',
        problem_statement: 'string (optional)',
        target_audience: 'string (optional)',
        unique_value_proposition: 'string (optional)',
        category: 'string (optional)',
        stage: 'string (optional)',
        team_size: 'string (optional)',
        funding_needed: 'string (optional)',
        domain: 'string (optional, default: Healthcare)',
        subdomain: 'string (optional)',
      },
    },
    example: {
      request: {
        title: 'AI-Powered Mental Health Chatbot',
        description: 'An AI chatbot providing 24/7 mental health support in Urdu and English for Pakistani students',
        problem_statement: 'Limited access to affordable mental health support in Pakistan',
        target_audience: 'University students aged 18-25',
        unique_value_proposition: 'Culturally-aware, anonymous, and affordable mental health support',
        category: 'mental-health',
        stage: 'idea',
        team_size: '2-5',
        funding_needed: 'under-1m',
        domain: 'Healthcare',
        subdomain: 'mental-health',
      },
      response: {
        success: true,
        data: {
          scores: '{ feasibility, compliance_score, market_demand, ... }',
          compliance_checks: '[{ rule_name, passed, ... }]',
          ai_insights: '{ market_size, growth_rate, ... }',
          competitors: '[{ name, strength, ... }]',
          recommendations: '[string, string, ...]',
        },
      },
    },
  })
}
