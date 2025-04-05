
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  FileText,
  Briefcase,
  MessageSquare,
  Home,
  LogOut,
  Upload,
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHR = user?.role === 'hr';
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <div className="px-4 py-6">
          <div className="flex items-center">
            <div className="mr-2 rounded-md bg-blue-600 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                <path d="M12 13v8"></path>
                <path d="M12 3v3"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-blue-600">SkillSync</h2>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={location.pathname.includes('dashboard') && !location.pathname.includes('/job-matches') && !location.pathname.includes('/resumes') && !location.pathname.includes('/feedback') ? "bg-accent" : ""}
                  onClick={() => navigate(isHR ? '/hr-dashboard' : '/candidate-dashboard')}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isHR ? (
          <SidebarGroup>
            <SidebarGroupLabel>HR Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={location.pathname === '/hr-dashboard/candidates' ? "bg-accent" : ""}
                    onClick={() => navigate('/hr-dashboard/candidates')}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Candidates</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={location.pathname === '/hr-dashboard/job-postings' ? "bg-accent" : ""}
                    onClick={() => navigate('/hr-dashboard/job-postings')}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Job Postings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={location.pathname === '/hr-dashboard/analytics' ? "bg-accent" : ""}
                    onClick={() => navigate('/hr-dashboard/analytics')}
                  >
                    <BarChart className="w-5 h-5" />
                    <span>Analytics</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Job Search</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={location.pathname === '/candidate-dashboard/resumes' ? "bg-accent" : ""}
                    onClick={() => navigate('/candidate-dashboard/resumes')}
                  >
                    <FileText className="w-5 h-5" />
                    <span>My Resumes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={location.pathname === '/candidate-dashboard/job-matches' ? "bg-accent" : ""}
                    onClick={() => navigate('/candidate-dashboard/job-matches')}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Job Matches</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={location.pathname === '/candidate-dashboard/feedback' ? "bg-accent" : ""}
                    onClick={() => navigate('/candidate-dashboard/feedback')}
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Resume Feedback</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={location.pathname === '/candidate-dashboard/upload' ? "bg-accent" : ""}
                    onClick={() => navigate('/candidate-dashboard/upload')}
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload Resume</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default Sidebar;
