
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import Button from '@/components/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z.string()
    .min(1, { message: 'Senha é obrigatória' })
});

export type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormFieldsProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  authError: string | null;
  isSubmitting: boolean;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({ 
  onSubmit, 
  authError, 
  isSubmitting 
}) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: "onChange"
  });
  
  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
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
    </>
  );
};

export default LoginFormFields;
