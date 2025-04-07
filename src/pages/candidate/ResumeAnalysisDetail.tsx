import { useLocation, Navigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from "lucide-react";

const ResumeAnalysisDetail = () => {
  const location = useLocation();
  const analysis = location.state?.analysis;

  // Redirect if no analysis data
  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Analysis Data</AlertTitle>
            <AlertDescription>
              Please access this page through the dashboard or resume list.
            </AlertDescription>
          </Alert>
          <Button variant="outline" size="sm" asChild className="mt-4">
            <Link to="/candidate-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/candidate-dashboard"
              className="text-muted-foreground hover:text-foreground flex items-center mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Resume Analysis
            </h1>
            <p className="text-muted-foreground">
              Analysis for {analysis.jobTitle}
            </p>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Match Score</CardTitle>
              <CardDescription>Overall job compatibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {analysis.match_score}%
              </div>
              <Progress value={analysis.match_score} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ATS Score</CardTitle>
              <CardDescription>Resume readability score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {analysis.ats_score}%
              </div>
              <Progress value={analysis.ats_score} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Skills Analysis */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Matched Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.matched_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Personalized suggestions to improve your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <h3 className="text-base font-medium text-foreground mb-2">
                  Key Areas for Improvement
                </h3>
                <div className="space-y-2">
                  <p className="text-blue-800 whitespace-pre-line">
                    {analysis.feedback}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <h3 className="text-base font-medium text-foreground mb-2">
                  Skills Gap Analysis
                </h3>
                <div className="space-y-2">
                  <p>
                    • Found {analysis.matched_skills?.length || 0} matching
                    skills out of{" "}
                    {(analysis.matched_skills?.length || 0) +
                      (analysis.missing_skills?.length || 0)}{" "}
                    required skills
                  </p>
                  <p>
                    • Focus on acquiring these missing skills:{" "}
                    {analysis.missing_skills?.join(", ")}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <h3 className="text-base font-medium text-foreground mb-2">
                  ATS Optimization
                </h3>
                <div className="space-y-2">
                  <p>• Current ATS Score: {analysis.ats_score}%</p>
                  <p>
                    •{" "}
                    {analysis.ats_score >= 70
                      ? "Your resume is well-optimized for ATS systems"
                      : "Consider improving your resume format for better ATS compatibility"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalysisDetail;
