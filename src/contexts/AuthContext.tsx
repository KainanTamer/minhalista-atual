import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AuthResponse,
  Session,
  SignInCredentials,
  SignUpCredentials,
  User,
} from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: Error | null }>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => ({ data: { user: null, session: null }, error: new Error('Not implemented') }),
  signUp: async () => ({ data: { user: null, session: null }, error: new Error('Not implemented') }),
  signOut: async () => ({ error: new Error('Not implemented') }),
  loading: true,
  refreshUser: async () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        setUser(null);
        setSession(null);
        return;
      }

      setUser(session.user);
      setSession(session);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for auth state changes
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        setSession(session || null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signIn = async (credentials: SignInCredentials): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword(credentials);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await supabase.auth.signUp(credentials);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const { data: { user: refreshedUser, session: refreshedSession }, error } = await supabase.auth.getUser();
  
      if (error) {
        console.error("Error refreshing user:", error);
        return;
      }
  
      setUser(refreshedUser);
      setSession(refreshedSession);
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      signIn, 
      signUp, 
      signOut, 
      loading, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext, AuthProvider, useAuth };
