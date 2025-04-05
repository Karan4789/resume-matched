
import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  
  // Setting default authenticated user without login requirement
  const [user] = useState<User>({
    id: '1',
    name: 'Default User',
    email: 'user@example.com',
    role: 'candidate'
  });
  
  // Always authenticated
  const [isAuthenticated] = useState(true);
  
  // Mock login function that returns a Promise
  const login = async (email: string, password: string) => {
    // Since we're removing auth, this is just a stub function
    // that successfully resolves immediately
    return Promise.resolve();
  };
  
  // Mock register function that returns a Promise
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // Since we're removing auth, this is just a stub function
    // that successfully resolves immediately
    return Promise.resolve();
  };
  
  // Mock logout function
  const logout = () => {
    // Since we're removing auth, this is just a stub function
    // Instead of actually logging out, let's just redirect to home
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
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
