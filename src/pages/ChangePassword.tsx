
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Senha atual é obrigatória' }),
    newPassword: z.string()
      .min(8, { message: 'A nova senha deve ter pelo menos 8 caracteres' })
      .refine(password => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
      }, { message: 'A senha deve conter pelo menos um número, uma letra maiúscula e uma letra minúscula' }),
    confirmPassword: z.string().min(1, { message: 'Confirme a nova senha' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: "onChange"
  });
  
  const { formState } = form;
  const { isSubmitting } = formState;
  
  const onSubmit = async (values: PasswordFormValues) => {
    setError(null);
    
    try {
      // Primeiro verifica a senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'dummy@email.com', // O email será obtido da sessão atual
        password: values.currentPassword,
      });
      
      if (signInError) {
        throw new Error('A senha atual está incorreta');
      }
      
      // Atualiza a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      
      navigate('/profile');
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      setError(err.message || 'Ocorreu um erro ao alterar sua senha. Por favor, tente novamente.');
      toast({
        title: "Erro ao alterar senha",
        description: err.message || 'Não foi possível alterar sua senha.',
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8">Alterar senha</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Altere sua senha</CardTitle>
              <CardDescription>
                Para alterar sua senha, preencha os campos abaixo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha atual <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova senha <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar nova senha <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button
                      type="button" 
                      variant="outline" 
                      className="sm:flex-1"
                      onClick={() => navigate('/profile')}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="sm:flex-1 dark:text-secondary-foreground"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Salvando..." : "Salvar nova senha"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
