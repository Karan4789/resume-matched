import { useEffect, useState } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
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
  const location = useLocation();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Analysis data not found. Please try accessing from the dashboard.
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
        <div className="flex justify-between items-start">
          <div>
            <Link
              to="/candidate-dashboard"
              className="text-muted-foreground hover:text-foreground flex items-center mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              {analysis.jobTitle}
            </h1>
            <p className="text-muted-foreground">
              Analysis from{" "}
              {new Date(analysis.analysisDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Match Score */}
            <Card>
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
                <CardDescription>
                  Overall compatibility with the job
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">
                  {analysis.match_score}%
                </div>
                <Progress value={analysis.match_score} className="mt-2" />
              </CardContent>
            </Card>

            {/* ATS Score */}
            <Card>
              <CardHeader>
                <CardTitle>ATS Score</CardTitle>
                <CardDescription>Resume parsing compatibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">
                  {analysis.ats_score}%
                </div>
                <Progress value={analysis.ats_score} className="mt-2" />
              </CardContent>
            </Card>

            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Overview</CardTitle>
                <CardDescription>Required skills analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Matched:</span>
                    <span className="font-medium">
                      {analysis.matched_skills.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missing:</span>
                    <span className="font-medium">
                      {analysis.missing_skills.length}
                    </span>
                  </div>
                </div>
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

          {/* Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-muted-foreground">
                {analysis.feedback}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeDetail;
