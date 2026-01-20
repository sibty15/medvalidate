// Users
export interface ApiUser {
    id: string;
    email: string;
    full_name: string;
    role: "user" | "admin";
    created_at: string;
    updated_at: string;
}
// Startup Ideas
export type IdeaStatus = "pending" | "processed";

export interface ApiStartupIdea {
    id: string;
    user_id: string;
    title: string;
    description: string;
    domain: string;
    subdomain: string;
    status: IdeaStatus;
    submitted_at: string;
    problem_statement?: string;
    target_audience?: string;
    unique_value_proposition?: string;
    category?: string;
    stage?: string;
    team_size?: string;
    funding_needed?: string;
}

export interface CreateIdeaInput {
    user_id: string;
    title: string;
    description: string;
    problem_statement: string;
    target_audience: string;
    unique_value_proposition: string;
    category: string;
    stage: string;
    team_size?: string;
    funding_needed?: string;
    domain: string ;
    subdomain: string;
}

export interface UpdateIdeaInput {
    title?: string;
    description?: string;
    domain?: string;
    subdomain?: string;
    status?: IdeaStatus;
}


// AI Analysis
export interface ApiAIAnalysis {
    id: string;
    idea_id: string;
    keywords: unknown;
    sentiment: string | null;
    confidence: number;
    domain: string;
    subdomain: string;
    processed_at: string;
}

export interface CreateAnalysisInput {
    idea_id: string;
    keywords: unknown;
    sentiment?: string | null;
    confidence: number;
    domain: string;
    subdomain: string;
}

 

// Compliance Checks
export interface ApiComplianceCheck {
    id: string;
    idea_id: string;
    rule_name: string;
    rule_description: string;
    passed: boolean;
    checked_at: string;
}

export interface CreateComplianceCheckInput {
    idea_id: string;
    rule_name: string;
    rule_description: string;
    passed: boolean;
}

 

// Scores
export interface ApiScore {
    id: string;
    idea_id: string;
    feasibility: number;
    compliance_score: number;
    market_demand: number;
    cultural_acceptance: number;
    cost_viability: number;
    readiness_score: number;
    calculated_at: string;
}

export interface CreateOrUpdateScoreInput {
    idea_id: string;
    feasibility: number;
    compliance_score: number;
    market_demand: number;
    cultural_acceptance: number;
    cost_viability: number;
    readiness_score: number;
}

// Reports
export interface ApiReport {
    id: string;
    idea_id: string;
    user_id: string;
    file_url: string;
    generated_at: string;
}

export interface CreateReportInput {
    idea_id: string;
    user_id: string;
    file_url: string;
}



//---------------------------------------------FULL IDEA  Validation results----------------------------------
export interface ApiResultScores {
    market: number;
    competition: number;
    feasibility: number;
    innovation: number;
}

export interface ApiResultMarketAnalysis {
    marketSize: string;
    growthRate: string;
    targetPotential: string;
}

export interface ApiResultRisk {
    level: "high" | "medium" | "low";
    title: string;
    description: string;
}

export interface ApiValidationResult {
    id: string;
    title: string;
    category: string;
    status: "completed" | "analyzing";
    submittedAt: string;
    completedAt: string | null;
    overallScore: number | null;
    scores: ApiResultScores | null;
    marketAnalysis: ApiResultMarketAnalysis | null;
    competitors: { name: string; strength: string }[] | null;
    recommendations: string[] | null;
    risks: ApiResultRisk[] | null;
}


// Full deep analysis
export interface ApiFullCompetitor {
    competitor_name: string;
    competitor_description?: string | null;
    market_position?: string | null;
    funding_raised?: number | null;
    status?: string | null;
    strengths?: string[] | null;
    weaknesses?: string[] | null;
}

export interface ApiFullMarketData {
    category: string;
    market_size_usd?: number | null;
    market_growth_rate_percent?: number | null;
    market_gaps?: string[] | null;
    market_trends?: string[] | null;
    opportunity_score?: number | null;
}

export interface ApiFullFailureCase {
    startup_name: string;
    category?: string | null;
    primary_failure_reason: string;
    secondary_failure_reasons?: string[] | null;
    lessons_learned?: string[] | null;
    preventive_measures?: string[] | null;
}

export interface ApiFullSuccessCase {
    startup_name: string;
    category?: string | null;
    exit_type?: string | null;
    exit_valuation?: number | null;
    success_factors?: string[] | null;
    lessons_learned?: string[] | null;
}

export interface ApiFullRegulatoryItem {
    requirement_name: string;
    requirement_description?: string | null;
    approval_body?: string | null;
    severity_level?: string | null;
}

export interface ApiFullMarketTrend {
    trend_name: string;
    trend_description?: string | null;
    relevance_score?: number | null;
    trend_status?: string | null;
}

export interface ApiFullFundingSource {
    name: string;
    funder_type?: string | null;
    category_focus?: string[] | null;
    stage_focus?: string[] | null;
    typical_check_size_min?: number | null;
    typical_check_size_max?: number | null;
}

export interface ApiFullRisk {
    risk_type: string;
    risk_name: string;
    risk_description?: string | null;
    probability_percent?: number | null;
    impact_level?: string | null;
    mitigation_strategies?: string[] | null;
}

export interface ApiFullAIInsight {
    insight_type: string;
    insight_category: string;
    insight_content: string;
    confidence_score?: number | null;
    priority_level?: string | null;
    generated_at: string;
}

export interface ApiFullStrategicRecommendation {
    recommendation_type: string;
    recommendation_content: string;
    priority_level?: string | null;
    expected_impact_on_score?: number | null;
    implementation_difficulty?: string | null;
}

export interface ApiFullCustomerSegment {
    segment_name: string;
    segment_size_estimate?: number | null;
    willingness_to_pay?: number | null;
    pain_points?: string[] | null;
}

export interface ApiFullBenchmark {
    metric_name: string;
    median_value?: number | null;
    best_in_class_value?: number | null;
}

export interface ApiFullDetailedReport {
    executive_summary?: string | null;
    market_analysis?: Record<string, unknown> | null;
    competitive_analysis?: Record<string, unknown> | null;
    customer_analysis?: Record<string, unknown> | null;
    risk_assessment?: Record<string, unknown> | null;
    recommendations?: string[] | null;
    generated_at: string;
}