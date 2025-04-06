import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDashboardStats, deleteResume } from "@/services/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, ArrowUpRight, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const MyResumes = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  // Convert recent submissions to analyses format with consistent IDs
  const analyses =
    dashboardData?.recent_submissions.map((submission) => {
      // Generate consistent ID using base64 of job description and date
      const id = btoa(
        `${submission.job_description}-${submission.created_at}`
      ).slice(0, 12);

      return {
        id,
        jobTitle: submission.job_description.split("\n")[0],
        matchPercentage: submission.analysis_result.match_score,
        atsScore: submission.analysis_result.ats_score,
        matchedSkills: submission.analysis_result.matched_skills,
        missingSkills: submission.analysis_result.missing_skills,
        analysisDate: submission.created_at,
        // Include full analysis for state transfer
        fullAnalysis: {
          jobTitle: submission.job_description.split("\n")[0],
          matchPercentage: submission.analysis_result.match_score,
          atsScore: submission.analysis_result.ats_score,
          matchedSkills: submission.analysis_result.matched_skills,
          missingSkills: submission.analysis_result.missing_skills,
          requiredSkills: submission.analysis_result.required_skills,
          suggestions: [submission.analysis_result.feedback],
          sections: {
            experience: Math.round(submission.analysis_result.match_score),
            education: Math.round(submission.analysis_result.ats_score),
            skills: Math.round(
              (submission.analysis_result.matched_skills.length /
                (submission.analysis_result.matched_skills.length +
                  submission.analysis_result.missing_skills.length)) *
                100
            ),
            formatting: submission.analysis_result.ats_score,
          },
          keywordDensity: submission.analysis_result.extracted_skills.reduce(
            (acc: any, skill: string) => {
              acc[skill] = (acc[skill] || 0) + 1;
              return acc;
            },
            {}
          ),
        },
      };
    }) ?? [];

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      // Show success toast or message
    } catch (error) {
      // Show error toast or message
      console.error("Failed to delete resume:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your resume submissions
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/candidate-dashboard/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Resume
            </Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="resume-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-blue-600" />
                      {analysis.jobTitle}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Uploaded on{" "}
                      {new Date(analysis.analysisDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {analysis.matchPercentage}%
                    </span>
                    <p className="text-xs text-muted-foreground">Match Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Match Score</span>
                      <span>{analysis.matchPercentage}%</span>
                    </div>
                    <Progress
                      value={analysis.matchPercentage}
                      className="bg-gray-200 h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ATS Score</span>
                      <span>{analysis.atsScore}%</span>
                    </div>
                    <Progress
                      value={analysis.atsScore}
                      className="bg-gray-200 h-2"
                    />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Skills Overview
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.matchedSkills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="skill-badge skill-matched">
                          {skill}
                        </span>
                      ))}
                      {analysis.missingSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-badge skill-missing">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(analysis.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to={`/candidate-dashboard/resume/${analysis.id}`}
                    state={{ analysis: analysis.fullAnalysis }}
                  >
                    <span className="flex items-center">
                      View Detailed Analysis
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading resumes...
            </div>
          )}

          {!isLoading && analyses.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No resumes uploaded yet. Upload your first resume to get started.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyResumes;
