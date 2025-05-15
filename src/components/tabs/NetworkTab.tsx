
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Facebook, Instagram, Music, Youtube } from 'lucide-react';

// Define the social profile structure
interface SocialProfile {
  user_id: string;
  instagram?: string;
  facebook?: string;
  spotify?: string;
  deezer?: string;
  youtube?: string;
}

const NetworkTab: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [socialProfile, setSocialProfile] = useState<SocialProfile>({
    user_id: user?.id || '',
    instagram: '',
    facebook: '',
    spotify: '',
    deezer: '',
    youtube: '',
  });

  // Fetch user's profile which contains social links
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data && data.social_links) {
          // Extract social links from the profile's social_links JSON field
          const socialLinks = data.social_links as Record<string, string>;
          
          setSocialProfile({
            user_id: user.id,
            instagram: socialLinks.instagram || '',
            facebook: socialLinks.facebook || '',
            spotify: socialLinks.spotify || '',
            deezer: socialLinks.deezer || '',
            youtube: socialLinks.youtube || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar seu perfil social.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveSocialProfile = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Create a social_links object from our socialProfile state
      const social_links = {
        instagram: socialProfile.instagram || null,
        facebook: socialProfile.facebook || null,
        spotify: socialProfile.spotify || null,
        deezer: socialProfile.deezer || null,
        youtube: socialProfile.youtube || null,
      };
      
      // Update the profiles table with the social_links field
      const { data, error } = await supabase
        .from('profiles')
        .update({
          social_links,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Perfil salvo',
        description: 'Suas redes sociais foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error saving social profile:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar seu perfil social.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasLinks = socialProfile.instagram || socialProfile.facebook || 
                  socialProfile.spotify || socialProfile.deezer || socialProfile.youtube;
                  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Redes Sociais</CardTitle>
          <CardDescription>
            Conecte seu perfil musical às suas redes sociais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram size={16} /> Instagram
            </Label>
            <Input
              id="instagram"
              name="instagram"
              placeholder="@seuusuario"
              value={socialProfile.instagram || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook size={16} /> Facebook
            </Label>
            <Input
              id="facebook"
              name="facebook"
              placeholder="@seuusuario"
              value={socialProfile.facebook || ''}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSocialProfile} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Redes Sociais'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-white">Plataformas de Streaming</CardTitle>
          <CardDescription>
            Conecte-se às plataformas onde sua música está disponível
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spotify" className="flex items-center gap-2">
              <Music size={16} /> Spotify
            </Label>
            <Input
              id="spotify"
              name="spotify"
              placeholder="URL do seu perfil no Spotify"
              value={socialProfile.spotify || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deezer" className="flex items-center gap-2">
              <Music size={16} /> Deezer
            </Label>
            <Input
              id="deezer"
              name="deezer"
              placeholder="URL do seu perfil no Deezer"
              value={socialProfile.deezer || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <Youtube size={16} /> YouTube
            </Label>
            <Input
              id="youtube"
              name="youtube"
              placeholder="URL do seu canal no YouTube"
              value={socialProfile.youtube || ''}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSocialProfile} disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Plataformas'}
          </Button>
        </CardFooter>
      </Card>
      
      {hasLinks && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="dark:text-white">Seu Perfil Social</CardTitle>
            <CardDescription>
              Confira como seus links estão configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {socialProfile.instagram && (
                <a 
                  href={`https://instagram.com/${socialProfile.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Instagram size={24} className="mb-2" />
                  <span className="text-sm font-medium dark:text-white">Instagram</span>
                </a>
              )}
              
              {socialProfile.facebook && (
                <a 
                  href={`https://facebook.com/${socialProfile.facebook.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Facebook size={24} className="mb-2" />
                  <span className="text-sm font-medium dark:text-white">Facebook</span>
                </a>
              )}
              
              {socialProfile.spotify && (
                <a 
                  href={socialProfile.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Music size={24} className="mb-2" />
                  <span className="text-sm font-medium dark:text-white">Spotify</span>
                </a>
              )}
              
              {socialProfile.deezer && (
                <a 
                  href={socialProfile.deezer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Music size={24} className="mb-2" />
                  <span className="text-sm font-medium dark:text-white">Deezer</span>
                </a>
              )}
              
              {socialProfile.youtube && (
                <a 
                  href={socialProfile.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Youtube size={24} className="mb-2" />
                  <span className="text-sm font-medium dark:text-white">YouTube</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NetworkTab;
