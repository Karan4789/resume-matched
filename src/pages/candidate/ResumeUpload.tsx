import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobDescriptions } from "@/services/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { analyzeResume } from "@/services/api";

const ResumeUpload = () => {
  const [selectedJob, setSelectedJob] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploading(true);

      // Simulate file upload delay
      setTimeout(() => {
        setUploading(false);
        toast({
          title: "Upload successful",
          description: `${selectedFile.name} has been uploaded.`,
        });
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedJob) {
        toast({
          title: "Missing job selection",
          description: "Please select a job position to continue.",
          variant: "destructive",
        });
        return;
      }

      const job = jobDescriptions.find((j) => j.id === selectedJob);
      if (!job) {
        throw new Error("Selected job not found");
      }

      setAnalyzing(true);

      const resumeContent =
        activeTab === "paste" ? resumeText : await readFileAsText(file);
      if (!resumeContent) {
        throw new Error("No resume content provided");
      }

      const result = await analyzeResume({
        job_description: `${job.title}\n\n${
          job.description
        }\n\nRequired Skills:\n${job.skills.join(", ")}`,
        resume_text: resumeContent,
      });

      // Show success notification
      toast({
        title: "Analysis Complete!",
        description: `Match Score: ${result.match_score}% | ATS Score: ${result.ats_score}%`,
        variant: "default",
      });

      // Navigate to results page with analysis data
      navigate(`/candidate-dashboard/resume/analysis`, {
        state: {
          analysis: {
            jobId: selectedJob,
            jobTitle: job.title,
            analysisDate: new Date().toISOString(),
            resumeText: resumeContent,
            extracted_skills: result.extracted_skills,
            required_skills: result.required_skills,
            matched_skills: result.matched_skills,
            missing_skills: result.missing_skills,
            match_score: result.match_score,
            ats_score: result.ats_score,
            feedback: result.feedback,
          },
        },
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description:
          error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // Utility function to read file content
  const readFileAsText = async (file: File | null): Promise<string> => {
    if (!file) return "";
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
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
                Our AI will compare your resume against the job requirements and
                provide personalized feedback.
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
                    {jobDescriptions.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title} - {job.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedJob && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Job Description</h3>
                  <p className="text-sm mb-3">
                    {
                      jobDescriptions.find((j) => j.id === selectedJob)
                        ?.description
                    }
                  </p>
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      Required Skills:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {jobDescriptions
                        .find((j) => j.id === selectedJob)
                        ?.skills.slice(0, 6)
                        .map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold"
                          >
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
                              document.getElementById("resume-upload")?.click()
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
