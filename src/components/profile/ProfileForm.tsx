
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Instagram, Facebook, Youtube } from 'lucide-react';
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
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres' }),
  profileType: z.string(),
  city: z.string().optional(),
  state: z.string().optional(),
  bio: z.string().max(300, 'A biografia deve ter no máximo 300 caracteres').optional(),
  instagram: z.string().url('URL inválida').optional().or(z.literal('')),
  facebook: z.string().url('URL inválida').optional().or(z.literal('')),
  youtube: z.string().url('URL inválida').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileForm: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Fetch profile data including social links
  const [profileData, setProfileData] = useState<any>(null);
  
  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          setProfileData(data);
        } catch (err) {
          console.error('Erro ao carregar dados do perfil:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfileData();
  }, [user?.id]);
  
  const socialLinks: SocialLinks = profileData?.social_links || {};
  
  const defaultValues: ProfileFormValues = {
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    profileType: user?.user_metadata?.profile_type || 'músico',
    city: profileData?.city || '',
    state: profileData?.state || '',
    bio: profileData?.bio || '',
    instagram: socialLinks.instagram || '',
    facebook: socialLinks.facebook || '',
    youtube: socialLinks.youtube || '',
  };
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onBlur"
  });
  
  const { formState } = form;
  const { isSubmitting, isDirty, isValid } = formState;

  React.useEffect(() => {
    // Atualizar formulário quando os dados do usuário mudarem ou quando os dados do perfil forem carregados
    if (user && profileData) {
      form.reset({
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        profileType: user.user_metadata?.profile_type || 'músico',
        city: profileData?.city || '',
        state: profileData?.state || '',
        bio: profileData?.bio || '',
        instagram: profileData?.social_links?.instagram || '',
        facebook: profileData?.social_links?.facebook || '',
        youtube: profileData?.social_links?.youtube || '',
      });
    }
  }, [user, profileData, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      // Atualizar metadados do usuário
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          profile_type: values.profileType
        }
      });
      
      if (authError) throw authError;
      
      // Coletar os links sociais
      const social_links: SocialLinks = {
        instagram: values.instagram || undefined,
        facebook: values.facebook || undefined,
        youtube: values.youtube || undefined
      };
      
      // Limpar links vazios
      Object.keys(social_links).forEach(key => {
        if (!social_links[key]) {
          delete social_links[key];
        }
      });
      
      // Atualizar perfil no banco de dados
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: `${values.firstName} ${values.lastName}`,
          city: values.city,
          state: values.state,
          bio: values.bio,
          social_links
        })
        .eq('id', user?.id);
        
      if (profileError) throw profileError;
      
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

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="São Paulo" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} placeholder="SP" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografia</FormLabel>
              <FormControl>
                <textarea 
                  className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                  placeholder="Conte um pouco sobre você..."
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Breve descrição sobre você ou seu trabalho (máximo 300 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Redes sociais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Instagram size={18} />
                    Instagram
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ''} 
                      placeholder="https://instagram.com/seuusuario" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Facebook size={18} />
                    Facebook
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ''} 
                      placeholder="https://facebook.com/seuusuario" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Youtube size={18} />
                    Youtube
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      value={field.value || ''} 
                      placeholder="https://youtube.com/@seucanal" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
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
