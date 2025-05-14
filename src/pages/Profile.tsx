
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import Button from '@/components/Button';
import Header from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
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
import { Loader2, Upload, User } from 'lucide-react';

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  lastName: z.string().min(2, { message: 'O sobrenome deve ter pelo menos 2 caracteres' }),
  profileType: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  useEffect(() => {
    // Atualizar formulário quando os dados do usuário mudarem
    if (user) {
      form.reset({
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        profileType: user.user_metadata?.profile_type || 'músico',
      });
      setAvatarUrl(user.user_metadata?.avatar_url || null);
    }
  }, [user, form]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo e tamanho do arquivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const validTypes = ['jpg', 'jpeg', 'png', 'gif'];
    
    if (!fileExtension || !validTypes.includes(fileExtension)) {
      toast({
        title: "Formato de arquivo inválido",
        description: "Por favor, selecione uma imagem (JPG, JPEG, PNG ou GIF).",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter menos de 2MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingAvatar(true);
      
      // Upload do arquivo para o Storage do Supabase
      const userId = user?.id;
      const filePath = `avatars/${userId}/${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      
      // Obter URL pública
      const { data: urlData } = await supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Atualizar metadata do usuário
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) throw updateError;
      
      // Atualizar estado local e recarregar dados do usuário
      setAvatarUrl(publicUrl);
      await refreshUser();
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso."
      });
      
    } catch (err: any) {
      console.error('Erro ao atualizar avatar:', err);
      toast({
        title: "Erro ao atualizar foto",
        description: err.message || "Ocorreu um erro ao atualizar sua foto de perfil.",
        variant: "destructive"
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Seu perfil</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Foto de perfil</CardTitle>
                <CardDescription>
                  Adicione uma foto para personalizar seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="relative cursor-pointer" onClick={handleAvatarClick}>
                  <Avatar className="h-32 w-32 border-2 border-border">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Foto de perfil" />
                    ) : (
                      <AvatarFallback className="text-4xl bg-muted">
                        <User size={64} className="text-muted-foreground" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors">
                    {uploadingAvatar ? (
                      <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 text-primary-foreground" />
                    )}
                  </div>
                  
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkmode">Modo escuro</Label>
                  <Switch 
                    id="darkmode" 
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate('/change-password')}
                >
                  Alterar senha
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
