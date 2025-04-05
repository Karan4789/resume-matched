import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/api";
import { useAnalysis } from "@/contexts/AnalysisContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarChart,
  FileText,
  BookOpen,
  ArrowDown,
  ArrowUp,
  Upload,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { resumeAnalyses } from "@/services/mockData";

const CandidateDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const stats = {
    submissions: dashboardData?.stats.total_submissions ?? 0,
    avgMatch: dashboardData?.stats.avg_match_score ?? 0,
    avgATS: dashboardData?.stats.avg_ats_score ?? 0,
    missingSkills: dashboardData?.stats.common_missing_skills.length ?? 0,
  };

  // Convert recent submissions to analyses format
  const recentAnalyses =
    dashboardData?.recent_submissions.map((submission) => ({
      id: crypto.randomUUID(),
      jobTitle: submission.job_description.split("\n")[0],
      matchPercentage: submission.analysis_result.match_score,
      atsScore: submission.analysis_result.ats_score,
      matchedSkills: submission.analysis_result.matched_skills,
      missingSkills: submission.analysis_result.missing_skills,
      analysisDate: submission.created_at,
    })) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Candidate Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your resume performance and get personalized
              recommendations.
            </p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/candidate-dashboard/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Resume
            </Link>
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resume Submissions
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submissions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.submissions > 0
                  ? "+1 from last week"
                  : "No submissions yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Match Score
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgMatch}%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stats.avgMatch > 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    10% increase
                  </>
                ) : (
                  "Upload resume to see match score"
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average ATS Score
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgATS}%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stats.avgATS > 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    5% increase
                  </>
                ) : (
                  "Upload resume to see ATS score"
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Missing Skills
              </CardTitle>
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.missingSkills}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {stats.missingSkills > 0 ? (
                  <>
                    <ArrowDown className="h-3 w-3 text-green-500 mr-1" />3 fewer
                    than before
                  </>
                ) : (
                  "Upload resume to see missing skills"
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent submissions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Resume Submissions</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/candidate-dashboard/resumes">View all</Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {recentAnalyses.map((analysis) => (
              <Card key={analysis.id} className="resume-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{analysis.jobTitle}</CardTitle>
                    <span className="text-lg font-bold">
                      {analysis.matchPercentage}%
                    </span>
                  </div>
                  <CardDescription>
                    {new Date(analysis.analysisDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Match Score</span>
                        <span>{analysis.matchPercentage}%</span>
                      </div>
                      <Progress
                        value={analysis.matchPercentage}
                        className="bg-gray-200 h-2"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>ATS Score</span>
                        <span>{analysis.atsScore}%</span>
                      </div>
                      <Progress
                        value={analysis.atsScore}
                        className="bg-gray-200 h-2"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">
                      Skills Overview
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysis.matchedSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-badge skill-matched">
                          {skill}
                        </span>
                      ))}
                      {analysis.missingSkills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="skill-badge skill-missing">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to={`/candidate-dashboard/resume/${analysis.id}`}>
                      <span className="flex items-center">
                        View Detailed Analysis
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Recommended Improvements
            </h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {recentAnalyses
                    .flatMap((a) => a.suggestions)
                    .slice(0, 5)
                    .map((suggestion, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-3 w-3 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
