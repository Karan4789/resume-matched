
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

// Backend URL - adjust as needed
const API_URL = 'http://localhost:5000';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
}

const ResumeUpload = () => {
  const [selectedJob, setSelectedJob] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch jobs on component mount
  useState(() => {
    fetchJobs();
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/candidate/jobs`);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const jobsData = await response.json();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Failed to load jobs",
        description: "Could not load job listings. Please try again.",
        variant: "destructive",
      });
      // Fallback to some default jobs if API fails
      setJobs([
        {
          id: "1",
          title: "Frontend Developer",
          company: "Tech Solutions Inc.",
          description: "We're looking for a skilled Frontend Developer with experience in React, TypeScript and modern web development practices.",
          skills: ["React", "TypeScript", "HTML", "CSS", "JavaScript"]
        },
        {
          id: "2",
          title: "Full Stack Engineer",
          company: "WebTech Systems",
          description: "Full Stack Engineer position requiring expertise in both frontend and backend technologies.",
          skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploading(true);
      
      // Just set the file without mock delay
      setUploading(false);
      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been selected.`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedJob) {
      toast({
        title: "Missing job selection",
        description: "Please select a job position to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === 'upload' && !file) {
      toast({
        title: "Missing resume",
        description: "Please upload your resume to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === 'paste' && !resumeText) {
      toast({
        title: "Missing resume text",
        description: "Please paste your resume content to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setAnalyzing(true);
    
    try {
      // Create form data for the API
      const formData = new FormData();
      formData.append('job_id', selectedJob);
      
      if (activeTab === 'upload' && file) {
        formData.append('file', file);
      } else if (activeTab === 'paste') {
        formData.append('text', resumeText);
      }
      
      // Send to backend
      const response = await fetch(`${API_URL}/candidate/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const result = await response.json();
      
      // Navigate to results page after successful analysis
      navigate('/candidate-dashboard/resumes');
      
      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed successfully!",
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Resume</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume and select a job position for AI analysis.
          </p>
        </div>
        
        <Card className="max-w-3xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                Our AI will compare your resume against the job requirements and provide personalized feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="job">Select Job Position</Label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger id="job">
                    <SelectValue placeholder="Select a job position" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                      <SelectItem value="loading" disabled>Loading jobs...</SelectItem>
                    ) : (
                      jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} - {job.company}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedJob && jobs.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <p className="text-sm mb-3">
                    {jobs.find(j => j.id === selectedJob)?.description}
                  </p>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Required Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {jobs
                        .find(j => j.id === selectedJob)
                        ?.skills.map((skill, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Resume</Label>
                <Tabs 
                  value={activeTab} 
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload PDF</TabsTrigger>
                    <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="pt-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      {file ? (
                        <div className="flex items-center justify-center flex-col">
                          <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => setFile(null)}
                          >
                            Remove file
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground mb-2">
                            Drag and drop your resume, or click to browse
                          </p>
                          <Input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => 
                              document.getElementById('resume-upload')?.click()
                            }
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>Choose File</>
                            )}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            Supports PDF, DOC, DOCX, or TXT (max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="paste" className="pt-4">
                    <Textarea 
                      placeholder="Paste your resume content here..." 
                      className="min-h-[200px]"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={analyzing}>
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>Analyze Resume</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResumeUpload;
