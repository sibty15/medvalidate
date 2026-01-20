// ---------- CORE ----------
export interface StartupIdea {
  id: string
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
  team_size: string
  funding_needed: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  fully_analyzed: boolean
}

// ---------- COMPETITORS ----------
export interface CompetitorAnalysis {
  id: string
  idea_id: string
  competitor_name: string
  competitor_description: string
  market_position: string
  funding_raised: number
  status: string
  strengths: string[]              // 🔥 parsed
  weaknesses: string[]             // 🔥 parsed
  market_share_estimated: number
  created_at: string
}

// ---------- MARKET DATA ----------
export interface MarketData {
  id: string
  category: string
  market_size_usd: number
  market_growth_rate_percent: number
  market_gaps: string[]            // 🔥 parsed
  market_trends: string[]          // 🔥 parsed
  opportunity_score: number
  last_updated: string
}

// ---------- FAILURE CASES ----------
export interface FailureCase {
  id: string
  idea_id: string | null
  startup_name: string
  category: string
  primary_failure_reason: string
  secondary_failure_reasons: string[] // 🔥 parsed
  lessons_learned: string[]           // 🔥 parsed
  preventive_measures: string[]       // 🔥 parsed
}

// ---------- SUCCESS CASES ----------
export interface SuccessCase {
  id: string
  idea_id: string | null
  startup_name: string
  category: string
  exit_type: string
  exit_valuation: number
  success_factors: string[]        // 🔥 parsed
  lessons_learned: string[]        // 🔥 parsed
}

// ---------- REGULATORY ----------
export interface RegulatoryItem {
  id: string
  category: string
  jurisdiction: string
  requirement_name: string
  requirement_description: string
  approval_body: string
  severity_level: 'low' | 'medium' | 'high' | 'critical'
  updated_at: string
}

// ---------- MARKET TRENDS ----------
export interface MarketTrend {
  id: string
  category: string
  trend_name: string
  trend_description: string
  relevance_score: number
  trend_status: 'emerging' | 'growing' | 'stable' | 'declining'
}

// ---------- FUNDING ----------
export interface FundingSource {
  id: string
  name: string
  funder_type: string
  category_focus: string[]         // 🔥 parsed
  stage_focus: string[]            // 🔥 parsed
  typical_check_size_min: number
  typical_check_size_max: number
}

// ---------- RISKS ----------
export interface RiskProfile {
  id: string
  idea_id: string
  risk_type: 'market' | 'regulatory' | 'technical' | 'financial'
  risk_name: string
  risk_description: string
  probability_percent: number
  impact_level: 'low' | 'medium' | 'high'
  mitigation_strategies: string[]  // 🔥 parsed
}

// ---------- AI INSIGHTS ----------
export interface AIInsight {
  id: string
  idea_id: string
  market_size: string
  growth_rate: string
  target_potential: string
}

// ---------- STRATEGY ----------
export interface StrategicRecommendation {
  id: string
  idea_id: string
  recommendation_type: string
  recommendation_content: string
  priority_level: 'low' | 'medium' | 'high'
  expected_impact_on_score: number
  implementation_difficulty: 'low' | 'medium' | 'high'
}

// ---------- CUSTOMER SEGMENTS ----------
export interface CustomerSegment {
  id: string
  idea_id: string
  segment_name: string
  segment_size_estimate: number
  willingness_to_pay: number
  pain_points: string[]            // 🔥 parsed
}

// ---------- BENCHMARKS ----------
export interface Benchmark {
  id: string
  category: string
  stage: string
  metric_name: string
  median_value: number
  best_in_class_value: number
}

// ---------- DETAILED REPORTS ----------
export interface DetailedReport {
  id: string
  idea_id: string
  executive_summary: string
  market_analysis: { summary: string }       // 🔥 parsed JSON object
  competitive_analysis: { summary: string }  // 🔥 parsed JSON object
  customer_analysis: { summary: string }     // 🔥 parsed JSON object
  risk_assessment: { summary: string }       // 🔥 parsed JSON object
  recommendations: string[]                  // 🔥 parsed
  generated_at: string
}
