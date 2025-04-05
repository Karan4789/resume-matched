
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
  Settings,
  User,
  Users,
  Briefcase,
  MessageSquare,
  Home,
  LogOut,
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
          <h2 className="text-xl font-semibold text-brand">ResumeMatch AI</h2>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={location.pathname.includes('dashboard') ? "bg-accent" : ""}
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
                    <Users className="w-5 h-5" />
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={location.pathname === '/profile' ? "bg-accent" : ""}
                  onClick={() => navigate('/profile')}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={location.pathname === '/settings' ? "bg-accent" : ""}
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
