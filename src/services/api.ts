import { API_BASE_URL } from "@/config";

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

interface DashboardStats {
  recent_submissions: {
    job_description: string;
    analysis_result: {
      match_score: number;
      ats_score: number;
      matched_skills: string[];
      missing_skills: string[];
    };
    created_at: string;
  }[];
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
    const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to analyze resume");
    }

    return result;
  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch("http://localhost:5000/api/dashboard/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return response.json();
};
