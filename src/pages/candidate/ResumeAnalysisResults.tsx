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
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Share2,
  Download,
} from "lucide-react";

const ResumeAnalysisResults = () => {
  const location = useLocation();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return <Navigate to="/candidate-dashboard" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Resume Analysis Results</h1>
            <p className="text-muted-foreground">
              Analysis for {analysis.jobTitle} -{" "}
              {new Date(analysis.analysisDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Overall Scores */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
                <CardDescription>
                  Overall compatibility with the job requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-600 transition-all"
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 40 * (1 - analysis.match_score / 100)
                        }`}
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {analysis.match_score}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ATS Score</CardTitle>
                <CardDescription>
                  Resume readability by ATS systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-center">
                    {analysis.ats_score}%
                  </div>
                  <Progress value={analysis.ats_score} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Higher scores indicate better chances of passing ATS
                    screening
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 whitespace-pre-line">
                  {analysis.feedback}
                </p>
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
                  {analysis.matched_skills.map((skill, idx) => (
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
                  {analysis.missing_skills.map((skill, idx) => (
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

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>
                Comprehensive review of your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Key Findings</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    • Overall Match Score: {analysis.match_score}% match with
                    job requirements
                  </p>
                  <p>
                    • ATS Compatibility: {analysis.ats_score}% -{" "}
                    {analysis.ats_score >= 70 ? "Good" : "Needs Improvement"}
                  </p>
                  <p>
                    • Matched Skills: {analysis.matched_skills.length} of{" "}
                    {analysis.matched_skills.length +
                      analysis.missing_skills.length}{" "}
                    required skills
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Recommendations</h3>
                <div className="text-sm text-muted-foreground space-y-2 whitespace-pre-line">
                  {analysis.feedback}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalysisResults;
