
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AuthError,
  AuthResponse,
  Session,
  User,
} from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  signUp: (credentials: { email: string; password: string; options?: { data?: Record<string, any> } }) => Promise<AuthResponse>;
  signOut: () => Promise<{ error: Error | null }>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => ({ data: { user: null, session: null }, error: null as unknown as AuthError }),
  signUp: async () => ({ data: { user: null, session: null }, error: null as unknown as AuthError }),
  signOut: async () => ({ error: null }),
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
      
        // Fixed: Properly handle the session data response
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!currentSession) {
          setUser(null);
          setSession(null);
          return;
        }

        setUser(currentSession.user);
        setSession(currentSession);
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

  const signIn = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword(credentials);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: { email: string; password: string; options?: { data?: Record<string, any> } }): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { email, password, options } = credentials;
      const response = await supabase.auth.signUp({
        email,
        password,
        options
      });
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
      // Fixed: Use getSession instead of getUser to get both user and session
      const { data } = await supabase.auth.getSession();
  
      if (data.session) {
        setUser(data.session.user);
        setSession(data.session);
      }
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
