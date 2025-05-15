
import React, { useRef, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Upload, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  onAvatarUpdate: (url: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, onAvatarUpdate }) => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Também atualizar na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // Atualizar estado local e recarregar dados do usuário
      onAvatarUpdate(publicUrl);
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

  return (
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
  );
};

export default ProfileAvatar;
