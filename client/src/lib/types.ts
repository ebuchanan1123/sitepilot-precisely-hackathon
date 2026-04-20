export interface Candidate {
  id: string;
  title: string;
  description: string;
  score: number;
  assessment: 'High signal' | 'Moderate signal' | 'Needs review';
  dataSignal: string;
}

export interface AnalysisRequest {
  prompt: string;
  context?: string;
  candidates: string[];
}

export interface AnalysisResponse {
  score: number;
  confidence: number;
  status: 'High' | 'Medium' | 'Low';
  analyzedContext: string;
  recommendedCandidateId: string | null;
  summary: string;
  insights: string[];
  candidates: Candidate[];
}
