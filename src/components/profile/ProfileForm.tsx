
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres' }),
  profileType: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      profileType: user?.user_metadata?.profile_type || 'músico',
    },
    mode: "onBlur"
  });
  
  const { formState } = form;
  const { isSubmitting, isDirty, isValid } = formState;

  React.useEffect(() => {
    // Atualizar formulário quando os dados do usuário mudarem
    if (user) {
      form.reset({
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        profileType: user.user_metadata?.profile_type || 'músico',
      });
    }
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          profile_type: values.profileType
        }
      });
      
      if (error) throw error;
      
      // Recarregar dados do usuário após atualização
      await refreshUser();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      toast({
        title: "Erro ao atualizar perfil",
        description: err.message || "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            value={user?.email || ''}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            O email não pode ser alterado
          </p>
        </div>
        
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
        
        {isDirty && (
          <Alert>
            <AlertDescription>
              Você tem alterações não salvas. Clique em "Salvar alterações" para aplicá-las.
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting || !isDirty || !isValid}
        >
          {isSubmitting ? 
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 
            "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
