
'use server'

import OpenAI from "openai";
import { StartupIdeaBase } from "../fullIdeaAnalysis";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Define the structure of AI-generated analysis
export interface AIIdeaAnalysis {
  scores: {
    feasibility: number;
    compliance_score: number;
    market_demand: number;
    cultural_acceptance: number;
    cost_viability: number;
    readiness_score: number;
  };
  compliance_checks: Array<{
    rule_name: string;
    rule_description: string;
    passed: boolean;
    recommendations?: string;
  }>;
  ai_insights: {
    market_size: string;
    growth_rate: string;
    target_potential: string;
    key_risks: string[];
    competitive_advantages: string[];
    regulatory_considerations: string[];
  };
  competitors: Array<{
    name: string;
    strength: string;
    weakness?: string;
    market_position?: string;
  }>;
  recommendations: string[];
}

/**
 * Generates comprehensive AI-powered analysis for a startup idea
 * Returns structured data ready for database insertion
 */
export async function generateIdeaAnalysis(idea: StartupIdeaBase): Promise<AIIdeaAnalysis> {
  const prompt = constructAnalysisPrompt(idea);

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile", // or "mixtral-8x7b-32768"
    messages: [
      {
        role: "system",
        content: `You are an expert healthcare startup analyst specializing in the Pakistani/South Asian medical technology market. 
You analyze healthcare startup ideas with deep knowledge of:
- DRAP (Drug Regulatory Authority of Pakistan) regulations
- Pakistani healthcare infrastructure and market dynamics
- Cultural factors affecting healthcare adoption in Pakistan
- Funding landscape for healthcare startups in the region
- Technical feasibility of medical solutions

Your analysis must be realistic, data-driven, and culturally informed.
CRITICAL: You MUST respond ONLY with valid JSON. No markdown, no code blocks, no explanations—just pure JSON.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from AI");
  }

  // Parse and validate the response
  const analysis = JSON.parse(content) as AIIdeaAnalysis;

  // Validate and clamp scores
  analysis.scores = validateScores(analysis.scores);

  return analysis;
}

/**
 * Constructs a detailed prompt for AI analysis
 */
function constructAnalysisPrompt(idea: StartupIdeaBase): string {
  return `Analyze the following healthcare startup idea for the Pakistani market and return a comprehensive, realistic analysis.

You MUST return ONLY a valid JSON object. No markdown, no explanations, no extra text.

STARTUP IDEA:
- Title: ${idea.title}
- Description: ${idea.description}
- Problem Statement: ${idea.problem_statement || "Not specified"}
- Target Audience: ${idea.target_audience || "Not specified"}
- Unique Value Proposition: ${idea.unique_value_proposition || "Not specified"}
- Category: ${idea.category || "Not specified"}
- Stage: ${idea.stage || "Not specified"}
- Team Size: ${idea.team_size || "Not specified"}
- Funding Needed: ${idea.funding_needed || "Not specified"}
- Domain: ${idea.domain || "Healthcare"}
- Subdomain: ${idea.subdomain || "General"}

RETURN JSON WITH EXACT STRUCTURE:

{
  "scores": {
    "feasibility": <number 0-100>,
    "compliance_score": <number 0-100>,
    "market_demand": <number 0-100>,
    "cultural_acceptance": <number 0-100>,
    "cost_viability": <number 0-100>,
    "readiness_score": <number 0-100, average of above five>
  },

  "compliance_checks": [
    {
      "rule_name": "DRAP Regulatory Approval",
      "rule_description": "<Assessment specific to this idea>",
      "passed": <true|false>,
      "recommendations": "<Concrete action items>"
    },
    {
      "rule_name": "Data Privacy & Security (PECA 2016)",
      "rule_description": "<Data handling and privacy assessment>",
      "passed": <true|false>,
      "recommendations": "<Compliance requirements>"
    },
    {
      "rule_name": "Medical Practice Licensing",
      "rule_description": "<Practitioner or facility licensing needs>",
      "passed": <true|false>,
      "recommendations": "<Licensing steps or N/A>"
    },
    {
      "rule_name": "Clinical Trial Requirements",
      "rule_description": "<Clinical validation needs if applicable>",
      "passed": <true|false>,
      "recommendations": "<Trial requirements or N/A>"
    }
  ],

  "ai_insights": {
    "market_size": "<Pakistan-specific estimate with numbers>",
    "growth_rate": "<Projected CAGR with timeframe and reasoning>",
    "target_potential": "<Clear target segment analysis>",
    "key_risks": [
      "<Risk specific to this idea>",
      "<Second risk>",
      "<Third risk>"
    ],
    "competitive_advantages": [
      "<Advantage in Pakistani context>",
      "<Second advantage>",
      "<Third advantage>"
    ],
    "regulatory_considerations": [
      "<Key regulatory consideration>",
      "<Second consideration>",
      "<Third consideration>"
    ]
  },

  "competitors": [
    {
      "name": "<Actual competitor operating in Pakistan>",
      "strength": "<Specific strength>",
      "weakness": "<Gap or weakness>",
      "market_position": "<Leader | Challenger | Niche>"
    },
    {
      "name": "<Second competitor>",
      "strength": "<Strength>",
      "weakness": "<Weakness>",
      "market_position": "<Position>"
    },
    {
      "name": "<Third competitor>",
      "strength": "<Strength>",
      "weakness": "<Weakness>",
      "market_position": "<Position>"
    }
  ],

  "recommendations": [
    "<Actionable recommendation based on analysis>",
    "<Second actionable step>",
    "<Third actionable step>",
    "<Immediate next step based on startup stage>"
  ]
}

ANALYSIS RULES:
- Be realistic; do not inflate scores
- Account for Pakistan-specific constraints (infrastructure, internet access, payments)
- Consider cultural factors (gender-sensitive care, family involvement, trust in digital health)
- Assess DRAP requirements accurately
- Reflect the local funding landscape (VCs, grants, bootstrapping)
- Use real competitors where possible
- Recommendations must be concrete and executable

Return ONLY the JSON object.
You must assume the current date is ${new Date().toISOString().split('T')[0]}.
If exact figures are uncertain, provide conservative estimates and explicitly signal assumptions.
`;
}

/**
 * Validates and clamps scores to 0-100 range
 */
function validateScores(scores: AIIdeaAnalysis['scores']): AIIdeaAnalysis['scores'] {
  const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)));

  return {
    feasibility: clamp(scores.feasibility || 50),
    compliance_score: clamp(scores.compliance_score || 50),
    market_demand: clamp(scores.market_demand || 50),
    cultural_acceptance: clamp(scores.cultural_acceptance || 50),
    cost_viability: clamp(scores.cost_viability || 50),
    readiness_score: clamp(scores.readiness_score || 50)
  };
}

/**
 * Example usage:
 * 
 * const idea = {
 *   title: "AI-Powered Mental Health Chatbot",
 *   description: "Urdu/English chatbot for mental health support",
 *   category: "mental-health",
 *   target_audience: "Young adults 18-35",
 *   stage: "idea",
 *   funding_needed: "under-1m"
 * };
 * 
 * const analysis = await generateIdeaAnalysis(idea);
 * // Insert analysis.scores into scores table
 * // Insert analysis.compliance_checks into compliance_checks table
 * // Insert analysis.ai_insights into ai_insights table
 */
