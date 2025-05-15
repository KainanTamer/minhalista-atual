
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/toast';
import { supabase } from '@/integrations/supabase/client';
import SocialLoginButtons from './auth/SocialLoginButtons';
import LoginFormFields, { LoginFormValues } from './auth/LoginFormFields';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo de volta ao Minha Agenda.",
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setAuthError(err.message || 'Ocorreu um erro ao fazer login. Por favor, tente novamente.');
      toast({
        title: "Erro no login",
        description: err.message || 'Credenciais inválidas. Por favor, tente novamente.',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Entrar</CardTitle>
        <CardDescription className="text-center">
          Acesse sua conta para gerenciar sua agenda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SocialLoginButtons />
        
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-input"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>
        
        <LoginFormFields 
          onSubmit={handleSubmit}
          authError={authError}
          isSubmitting={isSubmitting}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <a 
            onClick={() => navigate('/signup')} 
            className="text-primary cursor-pointer hover:underline"
          >
            Cadastre-se
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
