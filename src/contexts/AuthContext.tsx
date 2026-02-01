import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'billing' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const mockUsers: Record<UserRole, User> = {
  admin: {
    id: '1',
    name: 'Dr. Adaeze Okonkwo',
    email: 'admin@lifecare.ng',
    role: 'admin',
  },
  doctor: {
    id: '2',
    name: 'Dr. Chukwuemeka Nwosu',
    email: 'doctor@lifecare.ng',
    role: 'doctor',
  },
  nurse: {
    id: '3',
    name: 'Nurse Fatima Ibrahim',
    email: 'nurse@lifecare.ng',
    role: 'nurse',
  },
  billing: {
    id: '4',
    name: 'Grace Adeyemi',
    email: 'billing@lifecare.ng',
    role: 'billing',
  },
  patient: {
    id: '5',
    name: 'Oluwaseun Bakare',
    email: 'patient@example.com',
    role: 'patient',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
