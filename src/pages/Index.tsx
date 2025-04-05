import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, BarChart2, Users } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                SkillSync: AI-Powered Resume Optimization
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Match your skills to job requirements and get personalized
                feedback to land your dream job.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-muted rounded-lg shadow-lg p-6">
              <div className="border border-border rounded-md p-4 mb-4 bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Resume Match Analysis</h3>
                  <span className="text-green-600 font-bold">85%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full gradient-bg rounded-full w-[85%]"></div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="text-xs text-green-700">Matched</p>
                    <p className="font-medium">10 Skills</p>
                  </div>
                  <div className="bg-amber-50 p-2 rounded text-center">
                    <p className="text-xs text-amber-700">Required</p>
                    <p className="font-medium">3 Skills</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded text-center">
                    <p className="text-xs text-red-700">Missing</p>
                    <p className="font-medium">2 Skills</p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-md p-4 bg-card">
                <h3 className="font-medium mb-3">Personalized Suggestions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-brand mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Add TypeScript to your skills section
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-brand mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Highlight your experience with React hooks
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-brand mr-2 flex-shrink-0" />
                    <span className="text-sm">
                      Include metrics from your previous projects
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How SkillSync Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform helps job seekers optimize their resumes
              and helps HR professionals find the best candidates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Resume</h3>
              <p className="text-muted-foreground">
                Upload your resume and select the job position you're applying
                for. Our system accepts PDF and text formats.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your resume against the job description to
                identify skill matches, gaps, and ATS compatibility.
              </p>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Feedback</h3>
              <p className="text-muted-foreground">
                Receive personalized suggestions to improve your resume and
                increase your chances of landing an interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For HR Professionals Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">For HR Professionals</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Save time screening candidates and identify the best matches for
                your job openings with our AI-powered platform.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span>
                    Quickly identify candidates with the highest skill match
                    rates
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span>
                    Access detailed analysis of each candidate's strengths and
                    weaknesses
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-brand flex items-center justify-center mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span>
                    Manage multiple job postings and candidates in one dashboard
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/register">
                  <Button>Create HR Account</Button>
                </Link>
              </div>
            </div>
            <div className="bg-muted rounded-lg shadow-lg p-6">
              <div className="bg-card rounded-md p-4 mb-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Candidate Overview</h3>
                  <span className="text-muted-foreground text-sm">
                    15 candidates
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">John Smith</p>
                      <span className="badge bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        85% Match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Frontend Developer
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Sarah Johnson</p>
                      <span className="badge bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        78% Match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Frontend Developer
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Michael Brown</p>
                      <span className="badge bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                        65% Match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Frontend Developer
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-md p-4 border border-border">
                <h3 className="font-medium mb-3">Skill Distribution</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-sm font-medium">React.js</p>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full gradient-bg rounded-full w-[90%]"></div>
                    </div>
                    <p className="text-xs text-right mt-1">90%</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-sm font-medium">JavaScript</p>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full gradient-bg rounded-full w-[95%]"></div>
                    </div>
                    <p className="text-xs text-right mt-1">95%</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-sm font-medium">TypeScript</p>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full gradient-bg rounded-full w-[65%]"></div>
                    </div>
                    <p className="text-xs text-right mt-1">65%</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="text-sm font-medium">Redux</p>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full gradient-bg rounded-full w-[50%]"></div>
                    </div>
                    <p className="text-xs text-right mt-1">50%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how our platform has helped job seekers and HR professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <p className="italic text-muted-foreground mb-4">
                "After using SkillSync to optimize my resume, I got three
                interviews in one week after months of silence. The skill gap
                analysis was eye-opening!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-brand flex items-center justify-center mr-3">
                  <span className="text-white font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">James Davis</p>
                  <p className="text-sm text-muted-foreground">
                    Software Engineer
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6">
              <p className="italic text-muted-foreground mb-4">
                "As an HR manager, this platform has cut our initial screening
                time in half. The match percentages are remarkably accurate and
                help us focus on the most promising candidates."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-brand flex items-center justify-center mr-3">
                  <span className="text-white font-medium">MR</span>
                </div>
                <div>
                  <p className="font-medium">Maria Rodriguez</p>
                  <p className="text-sm text-muted-foreground">HR Director</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6">
              <p className="italic text-muted-foreground mb-4">
                "The personalized suggestions helped me highlight skills I
                didn't know were valuable. I landed my dream job at a tech
                company within a month of using SkillSync."
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-brand flex items-center justify-center mr-3">
                  <span className="text-white font-medium">KL</span>
                </div>
                <div>
                  <p className="font-medium">Kevin Lee</p>
                  <p className="text-sm text-muted-foreground">Data Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-brand rounded-xl p-8 md:p-12 shadow-lg text-white">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Boost Your Job Search?
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Join thousands of job seekers who have improved their chances of
                landing their dream job with SkillSync.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
