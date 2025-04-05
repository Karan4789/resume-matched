import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ResumeAnalysisDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  // First try to get analysis from location state (from dashboard/MyResumes)
  let analysisData = location.state?.analysis;

  // If not in state, try to find it in dashboard data
  if (!analysisData && dashboardData?.recent_submissions) {
    const submission = dashboardData.recent_submissions.find((sub, index) => {
      const generatedId = btoa(
        `${sub.job_description}-${sub.created_at}`
      ).slice(0, 12);
      return generatedId === id;
    });

    if (submission) {
      analysisData = {
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
      };
    }
  }

  if (!analysisData) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Analysis not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/candidate-dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {analysisData.jobTitle}
          </h1>
          <p className="text-muted-foreground mt-2">Detailed Resume Analysis</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Overall Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Match Score</span>
                  <span>{analysisData.matchPercentage}%</span>
                </div>
                <Progress
                  value={analysisData.matchPercentage}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ATS Score</span>
                  <span>{analysisData.atsScore}%</span>
                </div>
                <Progress value={analysisData.atsScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Section Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Section Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(analysisData.sections).map(([section, score]) => (
                <div key={section} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{section}</span>
                    <span>{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Matched Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Missing Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Density */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Density</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(analysisData.keywordDensity).map(
                  ([keyword, count]) => (
                    <div
                      key={keyword}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{keyword}</span>
                      <span className="text-sm font-medium">
                        {count} mentions
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysisData.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">{index + 1}</span>
                  </div>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalysisDetail;
