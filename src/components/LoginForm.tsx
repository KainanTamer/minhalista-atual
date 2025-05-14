
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from './Button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Facebook, Apple, AlertCircle } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z.string()
    .min(1, { message: 'Senha é obrigatória' })
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: "onChange"
  });
  
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

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
    } catch (err: any) {
      console.error(`Erro ao entrar com ${provider}:`, err);
      toast({
        title: `Erro ao entrar com ${provider}`,
        description: err.message || `Não foi possível entrar com ${provider}. Tente novamente.`,
        variant: "destructive"
      });
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
        <div className="flex flex-col gap-4 mb-4">
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2"
            onClick={() => handleSocialLogin('google')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
              />
            </svg>
            Continuar com Google
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2"
            onClick={() => handleSocialLogin('facebook')}
          >
            <Facebook size={18} />
            Continuar com Facebook
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex justify-center items-center gap-2"
            onClick={() => handleSocialLogin('apple')}
          >
            <Apple size={18} />
            Continuar com Apple
          </Button>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-input"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>
        
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      type="email" 
                      autoComplete="email"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha <span className="text-destructive">*</span></FormLabel>
                    <a 
                      href="/forgot-password" 
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password"
                      autoComplete="current-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
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
