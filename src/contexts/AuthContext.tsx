
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Define user types
export type UserRole = 'candidate' | 'hr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Mock login function (in a real app, this would call an API)
  const login = async (email: string, password: string) => {
    // Simulate API call
    try {
      // For demo purposes, we'll use mock users
      if (email === 'candidate@example.com' && password === 'password') {
        const user = {
          id: '1',
          name: 'John Candidate',
          email: 'candidate@example.com',
          role: 'candidate' as UserRole
        };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${user.name}!`,
        });
      } else if (email === 'hr@example.com' && password === 'password') {
        const user = {
          id: '2',
          name: 'Jane HR',
          email: 'hr@example.com',
          role: 'hr' as UserRole
        };
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      // Simulate API call
      const user = { id: Math.random().toString(), name, email, role };
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
