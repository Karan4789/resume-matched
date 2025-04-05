
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToDashboard = () => {
    if (user?.role === 'candidate') {
      navigate('/candidate-dashboard');
    } else if (user?.role === 'hr') {
      navigate('/hr-dashboard');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-semibold text-brand">ResumeMatch AI</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Button onClick={navigateToDashboard} variant="ghost">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="ghost">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <div className="flex items-center sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pt-10">
                <div className="flex flex-col space-y-4">
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          navigateToDashboard();
                          setIsMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full">Log In</Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="default" className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
