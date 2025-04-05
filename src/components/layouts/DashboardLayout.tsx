
import { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from '@/components/navigation/Sidebar';
import DashboardHeader from '@/components/navigation/DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-grow">
          <DashboardHeader />
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
