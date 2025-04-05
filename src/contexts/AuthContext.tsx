
import { createContext, useContext, useState, ReactNode } from 'react';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Setting default authenticated user without login requirement
  const [user] = useState<User>({
    id: '1',
    name: 'Default User',
    email: 'user@example.com',
    role: 'candidate'
  });
  
  // Always authenticated
  const [isAuthenticated] = useState(true);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated }}>
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
