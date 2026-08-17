import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import apiClient from '../lib/api-client';

export interface UserIdentity {
  id: string;
  username: string;
  fullName: string;
  type: number;
  jenis?: number;
}

interface AuthState {
  user: UserIdentity | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string, admin?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserIdentity | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      apiClient
        .get('/auth/user')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = useCallback(
    async (username: string, password: string, admin?: boolean) => {
      const res = await apiClient.post('/auth/login', {
        username,
        password,
        admin,
      });
      const newToken = res.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);

      const userRes = await apiClient.get('/auth/user');
      setUser(userRes.data);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
