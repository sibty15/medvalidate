"use server";

 
// import { syncUser as syncUserAction, getUsers as getUsersAction, getUser as getUserAction } from "@/app/actions/user-actions";
// import { getCurrentUserIdeaResults, getSingleIdeaResultsForCurrentUser} from "@/app/actions/getIdeaWithBasicResults";
import { getOrCreateReport } from "@/app/actions/report/reportActions";
// import {createIdea as createIdeaAction} from "@/app/actions/ideaCreationandBasicAnalysis";
import {getFullIdeaAnalysis} from "@/app/actions/fullIdeaAnalysis";
import { CreateIdeaInput, ApiFullCompetitor, ApiFullMarketData, ApiFullFailureCase, ApiFullSuccessCase, ApiFullRegulatoryItem, ApiFullMarketTrend, ApiFullFundingSource, ApiFullRisk, ApiFullAIInsight, ApiFullStrategicRecommendation, ApiFullCustomerSegment, ApiFullBenchmark, ApiFullDetailedReport } from "./apiTypes";
import { createIdeaWithAnalysis, getAllUserIdeaResults, getSingleIdeaResult } from "@/app/actions/ai-actions/ideaAnalysisCreationAndResults";


//--------------------------------------------------WILL BE USED IN RESULTS PAGE TO SHOW IDEAS WITH BASIC RESULTS--------------------------------------------------//
export async function getCurrentUserIdeasResults() {
    // return await getCurrentUserIdeaResults();
    return await getAllUserIdeaResults();
}

export async function getSingleIdeaBaiscResults(ideaId: string) {
    // return await getSingleIdeaResultsForCurrentUser(ideaId);
    return await getSingleIdeaResult(ideaId);
}
//--------------------------------------------------WILL BE USED IN REPORT BUTTON CLICK IN RESULTS PAGE TO GET OR CREATE REPORT--------------------------------------------------//
export async function getOrCreateIdeaReportPDF(ideaId: string) {
    return await getOrCreateReport(ideaId);
}


//--------------------------------------------------WILL BE USED IN IDEA PAGE CREATE IDEA FORM TO CREATE NEW IDEA--------------------------------------------------//
 
export async function createIdea(data: CreateIdeaInput) {
	//domain subdomain to be added in action

    // return await createIdeaAction(data);
    return await createIdeaWithAnalysis(data);
}
 

export interface ApiFullIdeaAnalysis {
    idea_id: string;
    idea_title: string;
    category?: string | null;
    stage?: string | null;
    competitors: ApiFullCompetitor[];
    market: ApiFullMarketData | null;
    failures: ApiFullFailureCase[];
    successes: ApiFullSuccessCase[];
    regulatory: ApiFullRegulatoryItem[];
    trends: ApiFullMarketTrend[];
    funding_sources: ApiFullFundingSource[];
    risks: ApiFullRisk[];
    ai_insights: ApiFullAIInsight[];
    strategic_recommendations: ApiFullStrategicRecommendation[];
    customer_segments: ApiFullCustomerSegment[];
    benchmarks: ApiFullBenchmark[];
    detailed_report: ApiFullDetailedReport | null;
}

//--------------------------------------------------WILL BE USED IN VIEW FULL ANALYSIS / IDEAID PAGE TO GET FULL ANALYSIS--------------------------------------------------//

export async function getFullAnalysis(ideaId: string) {
    
    return await getFullIdeaAnalysis(ideaId);
}

