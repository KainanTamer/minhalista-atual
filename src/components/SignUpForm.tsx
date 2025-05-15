
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';

const signupSchema = z.object({
  firstName: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres' }),
  email: z.string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z.string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .refine(password => {
      // Ao menos um número, uma letra maiúscula e uma letra minúscula
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    }, { message: 'Senha deve conter pelo menos um número, uma letra maiúscula e uma letra minúscula' }),
  profileType: z.string(),
  termsAccepted: z.boolean().refine(value => value === true, {
    message: 'Você precisa aceitar os termos de serviço',
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profileType: 'músico',
      termsAccepted: false,
    },
    mode: "onChange"
  });
  
  const { formState } = form;
  const { isSubmitting } = formState;
  
  const onSubmit = async (values: SignupFormValues) => {
    setAuthError(null);
    
    try {
      // Registrar usuário com Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            profile_type: values.profileType,
            full_name: `${values.firstName} ${values.lastName}`
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao Minha Agenda.",
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      setAuthError(err.message || 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
      toast({
        title: "Erro no cadastro",
        description: err.message || 'Não foi possível completar o cadastro. Por favor, tente novamente.',
        variant: "destructive"
      });
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          data: {
            profile_type: form.getValues('profileType') || 'músico'
          }
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
        <CardTitle className="text-2xl text-center">Cadastre-se</CardTitle>
        <CardDescription className="text-center">
          Crie sua conta para começar a gerenciar sua agenda
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="João" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
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
                  <FormLabel>Senha <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="••••••••" 
                      type="password"
                      autoComplete="new-password"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula e um número.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="profileType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de perfil <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <select 
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="músico">Músico</option>
                      <option value="banda">Banda</option>
                      <option value="produtor">Produtor</option>
                      <option value="empresário">Empresário</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Eu concordo com os{' '}
                      <a href="#" className="text-primary hover:underline font-medium">
                        Termos de Serviço
                      </a>{' '}
                      e{' '}
                      <a href="#" className="text-primary hover:underline font-medium">
                        Política de Privacidade
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full dark:text-secondary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <a 
            onClick={() => navigate('/login')} 
            className="text-primary cursor-pointer hover:underline"
          >
            Entrar
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
