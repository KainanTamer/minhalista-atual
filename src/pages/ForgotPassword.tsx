
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/Button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' })
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });
  
  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha."
      });
    } catch (err: any) {
      console.error('Erro ao solicitar redefinição de senha:', err);
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      toast({
        title: "Erro",
        description: err.message || 'Não foi possível enviar o email de redefinição de senha.',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center mb-8 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o login
          </Link>
          
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Recuperar senha</CardTitle>
              <CardDescription className="text-center">
                Digite seu email para receber um link de redefinição de senha
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <Alert className="bg-primary/10 border-primary/20">
                  <Check className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    Se houver uma conta associada a este email, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada e spam.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
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
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                      </Button>
                    </form>
                  </Form>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Lembrou sua senha?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Voltar para o login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
