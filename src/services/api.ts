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
