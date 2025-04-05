
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resumeAnalyses } from '@/services/mockData';
import { BookOpen, Lightbulb, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ResumeFeedback = () => {
  // We'll use the first analysis from mock data for comprehensive feedback
  const analysis = resumeAnalyses[0];
  
  const feedbackSections = [
    {
      id: 'ats',
      title: 'ATS Optimization',
      icon: BookOpen,
      score: analysis.atsScore,
      description: 'How well your resume can be parsed by Applicant Tracking Systems',
      suggestions: [
        'Use standard section headings (e.g., "Experience" instead of "Career Journey")',
        'Avoid tables, columns, and graphics that ATS may not parse correctly',
        'Include keywords from the job description in your resume',
        'Use standard file formats like .docx or .pdf'
      ]
    },
    {
      id: 'skills',
      title: 'Skills Match',
      icon: CheckCircle,
      score: analysis.matchPercentage,
      description: 'Alignment between your skills and job requirements',
      matched: analysis.matchedSkills,
      missing: analysis.missingSkills,
    },
    {
      id: 'format',
      title: 'Resume Format & Structure',
      icon: Lightbulb,
      score: 78,
      description: 'Organization, readability and professional appearance',
      suggestions: [
        'Use bullet points to highlight accomplishments rather than paragraph format',
        'Ensure consistent formatting throughout (fonts, spacing, etc.)',
        'Keep your resume to 1-2 pages maximum',
        'Use reverse chronological order for work experience'
      ]
    },
    {
      id: 'content',
      title: 'Content Quality',
      icon: AlertTriangle,
      score: 65,
      description: 'Effectiveness of resume content in showcasing your qualifications',
      suggestions: [
        'Quantify achievements with metrics where possible',
        'Focus on accomplishments rather than just listing responsibilities',
        'Tailor your resume summary to match this specific job',
        'Remove outdated or irrelevant experience'
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Feedback</h1>
          <p className="text-muted-foreground mt-2">
            Detailed analysis and improvement suggestions for your resume
          </p>
        </div>

        <div className="grid gap-6">
          {feedbackSections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-full ${section.score >= 80 ? 'bg-green-100' : section.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
                      <section.icon className={`h-5 w-5 ${section.score >= 80 ? 'text-green-600' : section.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`text-2xl font-bold ${section.score >= 80 ? 'text-green-600' : section.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {section.score}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {section.id === 'skills' ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1.5 text-green-600" />
                        Matched Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {section.matched.map((skill, idx) => (
                          <span key={idx} className="skill-badge skill-matched">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <XCircle className="h-4 w-4 mr-1.5 text-red-600" />
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {section.missing.map((skill, idx) => (
                          <span key={idx} className="skill-badge skill-missing">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium mb-1">Recommendations:</p>
                      <ul className="text-sm space-y-2">
                        <li className="flex">
                          <ArrowRight className="h-4 w-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Add the missing skills to your resume if you have experience with them</span>
                        </li>
                        <li className="flex">
                          <ArrowRight className="h-4 w-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Highlight matched skills by listing them early in your resume</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Improvement Suggestions:</p>
                    <ul className="text-sm space-y-2">
                      {section.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex">
                          <ArrowRight className="h-4 w-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Personalized suggestions to improve your resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Resume Summary</h3>
              <p className="text-sm text-muted-foreground">
                Your current summary is too generic. Consider tailoring it specifically to highlight your experience with {analysis.matchedSkills.slice(0, 3).join(', ')} as these align well with the job requirements.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Experience Section</h3>
              <p className="text-sm text-muted-foreground">
                Quantify your achievements more effectively. For example, instead of "managed a team", specify "managed a team of 5 developers that delivered 3 major features ahead of schedule".
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-medium mb-2">Skills Presentation</h3>
              <p className="text-sm text-muted-foreground">
                Group your skills into categories (e.g., "Programming Languages", "Tools & Technologies") to improve readability and showcase your depth of knowledge in specific areas.
              </p>
            </div>
            
            <div className="pt-3">
              <Button variant="outline" className="w-full" asChild>
                <a href="/candidate-dashboard/upload">
                  Update My Resume
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResumeFeedback;
