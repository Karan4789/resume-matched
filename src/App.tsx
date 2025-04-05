
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Candidate pages
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import ResumeUpload from "./pages/candidate/ResumeUpload";
import ResumeDetail from "./pages/candidate/ResumeDetail";
import MyResumes from "./pages/candidate/MyResumes";
import JobMatches from "./pages/candidate/JobMatches";
import ResumeFeedback from "./pages/candidate/ResumeFeedback";

// HR pages
import HRDashboard from "./pages/hr/HRDashboard";
import CandidateDetail from "./pages/hr/CandidateDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Redirect login to home since we removed authentication */}
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />

            {/* Candidate routes - no longer protected */}
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate-dashboard/resumes" element={<MyResumes />} />
            <Route path="/candidate-dashboard/upload" element={<ResumeUpload />} />
            <Route path="/candidate-dashboard/resume/:id" element={<ResumeDetail />} />
            <Route path="/candidate-dashboard/job-matches" element={<JobMatches />} />
            <Route path="/candidate-dashboard/feedback" element={<ResumeFeedback />} />

            {/* HR routes - no longer protected */}
            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route path="/hr-dashboard/candidates" element={<HRDashboard />} />
            <Route path="/hr-dashboard/candidate/:id" element={<CandidateDetail />} />
            <Route path="/hr-dashboard/job-postings" element={<HRDashboard />} />
            <Route path="/hr-dashboard/job-posting/:id" element={<HRDashboard />} />
            <Route path="/hr-dashboard/analytics" element={<HRDashboard />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
