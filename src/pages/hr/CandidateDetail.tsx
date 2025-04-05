
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, CheckCircle, XCircle, Download, ArrowLeft, 
  Mail, Phone, FileText, ThumbsUp, ThumbsDown, Star 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { resumeAnalyses, ResumeAnalysis } from '@/services/mockData';

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  
  useEffect(() => {
    // Get analysis from mock data
    const foundAnalysis = resumeAnalyses.find(a => a.id === id);
    
    if (foundAnalysis) {
      setAnalysis(foundAnalysis);
    }
  }, [id]);
  
  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Candidate analysis not found. Please try again or return to dashboard.
            </AlertDescription>
          </Alert>
          <Button variant="outline" size="sm" asChild>
            <Link to="/hr-dashboard">
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
        <div className="flex items-start justify-between">
          <div>
            <Link to="/hr-dashboard/candidates" className="text-muted-foreground hover:text-foreground flex items-center mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Candidates
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{analysis.candidateName}</h1>
            <p className="text-muted-foreground">
              Applied for {analysis.jobTitle} on {new Date(analysis.analysisDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          </div>
        </div>
        
        {/* Candidate Status and Scores */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Candidate Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.matchPercentage / 100)}`}
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold">
                    {analysis.matchPercentage}%
                  </span>
                </div>
              </div>
              
              <div>
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium">ATS Score</span>
                  <span className="text-sm">{analysis.atsScore}%</span>
                </div>
                <Progress value={analysis.atsScore} className="h-2" />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Assessment</h3>
                <div className="space-y-2">
                  {analysis.matchPercentage >= 80 ? (
                    <div className="flex items-center text-green-600">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Strong match for this role</span>
                    </div>
                  ) : analysis.matchPercentage >= 60 ? (
                    <div className="flex items-center text-amber-600">
                      <Star className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Potential match with training</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Not recommended for this role</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="secondary">Move to Interview</Button>
              <Button variant="outline">Reject</Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-medium">Matched Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.matchedSkills.map((skill, idx) => (
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
                  <div className="flex flex-wrap gap-1">
                    {analysis.requiredSkills.map((skill, idx) => (
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
                  <div className="flex flex-wrap gap-1">
                    {analysis.missingSkills.map((skill, idx) => (
                      <span key={idx} className="skill-badge skill-missing">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">AI Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.suggestions.slice(0, 3).map((suggestion, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-brand flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
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
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Resume Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Resume Content</CardTitle>
              <CardDescription>Original resume submitted by the candidate</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Full Resume
            </Button>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg whitespace-pre-line">
              {analysis.resumeText || 
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
        
        {/* Action Section */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button>Schedule Interview</Button>
            <Button variant="secondary">Request More Information</Button>
            <Button variant="outline">Send Assessment Test</Button>
            <Button variant="destructive">Reject Application</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDetail;
