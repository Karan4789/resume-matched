import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ResumeAnalysisRequest {
  job_description: string;
  resume_text: string;
}

export interface ResumeAnalysisResponse {
  extracted_skills: string[];
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  match_score: number;
  ats_score: number;
  feedback: string;
}

export interface AnalysisResult {
  extracted_skills: string[];
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  match_score: number;
  ats_score: number;
  feedback: string;
}

export interface Submission {
  job_description: string;
  analysis_result: AnalysisResult;
  created_at: string;
}

export interface DashboardStats {
  recent_submissions: Submission[];
  stats: {
    avg_match_score: number;
    avg_ats_score: number;
    total_submissions: number;
    common_missing_skills: { skill: string; count: number }[];
  };
}

export const analyzeResume = async (
  data: ResumeAnalysisRequest
): Promise<ResumeAnalysisResponse> => {
  try {
    const response = await api.post<ResumeAnalysisResponse>(
      "/analyze-resume",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<DashboardStats>("/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};
