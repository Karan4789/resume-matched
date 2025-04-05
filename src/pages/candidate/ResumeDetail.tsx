import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const ResumeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const analysis = dashboardData?.recent_submissions.find((submission) => {
    // Generate consistent ID for comparison
    const submissionId = crypto.randomUUID({
      job: submission.job_description,
      date: submission.created_at,
    });
    return submissionId === id;
  });

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Resume analysis not found. Please try again or return to
              dashboard.
            </AlertDescription>
          </Alert>
          <Button variant="outline" size="sm" asChild>
            <Link to="/candidate-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Transform the data for display
  const analysisData = {
    jobTitle: analysis.job_description.split("\n")[0],
    match_score: analysis.analysis_result.match_score,
    ats_score: analysis.analysis_result.ats_score,
    matched_skills: analysis.analysis_result.matched_skills,
    missing_skills: analysis.analysis_result.missing_skills,
    required_skills: analysis.analysis_result.required_skills,
    feedback: analysis.analysis_result.feedback,
    analysisDate: analysis.created_at,
    resumeText: analysis.resume_text,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link
              to="/candidate-dashboard/resumes"
              className="text-muted-foreground hover:text-foreground flex items-center mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Resumes
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {analysisData.jobTitle}
            </h1>
            <p className="text-muted-foreground">
              Resume analysis from{" "}
              {new Date(analysisData.analysisDate).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Score Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-32 mb-4">
                <div className="relative h-32 w-32 flex items-center justify-center">
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
                      className="text-brand"
                      strokeWidth="10"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 40 * (1 - analysisData.match_score / 100)
                      }`}
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      style={{
                        transition: "stroke-dashoffset 0.8s ease-in-out",
                      }}
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">
                    {analysisData.match_score}%
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>ATS Compatibility</span>
                  <span>{analysisData.ats_score}%</span>
                </div>
                <Progress
                  value={analysisData.ats_score}
                  className={`h-2 ${
                    analysisData.ats_score >= 70
                      ? "bg-green-200"
                      : "bg-amber-200"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Skills Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium">Matched Skills</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Skills found on your resume that match the job requirements
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysisData.matched_skills.map((skill, idx) => (
                      <span key={idx} className="skill-badge skill-matched">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
                    <h3 className="font-medium">Required Skills</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Essential skills for this role that should be highlighted
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysisData.required_skills.map((skill, idx) => (
                      <span key={idx} className="skill-badge skill-required">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="flex items-center mb-2">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <h3 className="font-medium">Missing Skills</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Skills mentioned in the job description but not found in
                    your resume
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysisData.missing_skills.map((skill, idx) => (
                      <span key={idx} className="skill-badge skill-missing">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for recommendations and resume */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="resume">Your Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
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
                    <div>
                      <p>{analysisData.feedback}</p>
                      <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                        <span className="font-medium block mb-1">Example:</span>
                        <span className="text-muted-foreground">
                          "Developed responsive web interfaces using React.js
                          and TypeScript, implementing complex state management
                          with Redux for a healthcare dashboard used by over
                          5,000 medical professionals."
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Submitted Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg whitespace-pre-line">
                  {analysisData.resumeText ||
                    `Frontend developer with 2 years of experience in React.js, JavaScript, HTML, CSS, and Git. 
                  
Worked on responsive web design projects and implemented user interfaces. Experience with component libraries and cross-browser compatibility. Strong problem-solving skills and team collaboration.

EDUCATION
- Bachelor of Science in Computer Science, University of Technology

SKILLS
- Programming Languages: JavaScript, HTML, CSS
- Frameworks/Libraries: React.js
- Tools: Git, VS Code
- Other: Responsive Design, Cross-browser Testing

WORK EXPERIENCE
Frontend Developer | WebTech Solutions | Jan 2023 - Present
- Developed responsive user interfaces using React.js and CSS
- Collaborated with designers to implement pixel-perfect designs
- Participated in code reviews and implemented feedback
- Fixed cross-browser compatibility issues

Junior Developer | TechStart Inc. | Jun 2022 - Dec 2022
- Assisted in building website components using HTML and CSS
- Gained experience with version control using Git
- Participated in daily stand-up meetings and sprint planning`}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ResumeDetail;
