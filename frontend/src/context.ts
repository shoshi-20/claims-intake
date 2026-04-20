import {createContext} from 'react';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthContextType {
  token: string;
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: '',
  currentUser: null,
  login: async () => {},
  logout: () => {},
  setToken: () => {},
});
