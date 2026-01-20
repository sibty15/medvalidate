// Types copied from launchly-gateway React app
// Kept identical so pages/components can be reused.

// User types
export interface User {
	id: string;
	email: string;
	fullName?: string;
	avatarUrl?: string;
	createdAt: string;
}

// Auth types
export interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials extends LoginCredentials {
	fullName: string;
	confirmPassword: string;
}

// Idea Submission types
export interface StartupIdea {
	id: string;
	userId: string;
	title: string;
	description: string;
	problemStatement: string;
	targetAudience: string;
	uniqueValueProposition: string;
	category: StartupCategory;
	stage: StartupStage;
	teamSize?: number;
	fundingNeeded?: number;
	createdAt: string;
	updatedAt: string;
	status: IdeaStatus;
}

export type StartupCategory =
	| "mental-health"
	| "telemedicine"
	| "health-monitoring"
	| "fitness-wellness"
	| "medical-devices"
	| "healthcare-ai"
	| "pharma-tech"
	| "health-insurance"
	| "elder-care"
	| "other";

export type StartupStage =
	| "idea"
	| "prototype"
	| "mvp"
	| "early-traction"
	| "growth";

export type IdeaStatus =
	| "draft"
	| "submitted"
	| "analyzing"
	| "completed";

// Validation Results types
export interface MarketAnalysis {
	score: number;
	marketSize: string;
	growthRate: string;
	targetMarketPakistan: string;
	insights: string[];
}

export interface CompetitorAnalysis {
	score: number;
	competitors: Competitor[];
	marketGap: string;
	differentiation: string;
}

export interface Competitor {
	name: string;
	description: string;
	strengthVsWeakness: string;
}

export interface FeasibilityScore {
	technical: number;
	financial: number;
	regulatory: number;
	overall: number;
	breakdown: FeasibilityBreakdown[];
}

export interface FeasibilityBreakdown {
	category: string;
	score: number;
	notes: string;
}

export interface Risk {
	type: "high" | "medium" | "low";
	title: string;
	description: string;
	mitigation: string;
}

// Dashboard types
export interface DashboardStats {
	totalIdeas: number;
	completedValidations: number;
	averageScore: number;
	pendingAnalysis: number;
}

// Contact Form types
export interface ContactMessage {
	name: string;
	email: string;
	subject: string;
	message: string;
}

// Navigation types
export interface NavItem {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
	badge?: string;
}
