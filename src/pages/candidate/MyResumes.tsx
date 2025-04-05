
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, ArrowUpRight, Trash2, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { resumeAnalyses } from '@/services/mockData';

const MyResumes = () => {
  const [analyses, setAnalyses] = useState(resumeAnalyses);

  const handleDelete = (id: string) => {
    setAnalyses(analyses.filter(analysis => analysis.id !== id));
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
                      Uploaded on {new Date(analysis.analysisDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">{analysis.matchPercentage}%</span>
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
                    <Progress value={analysis.matchPercentage} className="bg-gray-200 h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>ATS Score</span>
                      <span>{analysis.atsScore}%</span>
                    </div>
                    <Progress value={analysis.atsScore} className="bg-gray-200 h-2" />
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Skills Overview</h4>
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
                <Button variant="ghost" size="sm" onClick={() => handleDelete(analysis.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="outline" size="sm" asChild>
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
      </div>
    </DashboardLayout>
  );
};

export default MyResumes;
