
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Music, Search, UserPlus, Instagram, Facebook, Youtube, Plus, X, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

// Define a estrutura para links sociais
interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  spotify?: string;
  deezer?: string;
  [key: string]: string | undefined;
}

// Define os tipos de links sociais disponíveis
interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  placeholder: string;
}

// Define a interface do perfil
interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  instrument: string[] | null;
  musical_genre: string[] | null;
  social_links: SocialLinks | null;
}

const NetworkTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState<string>('');
  const [socialUrl, setSocialUrl] = useState<string>('');
  const { toast } = useToast();

  const socialPlatforms: SocialPlatform[] = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: <Instagram size={18} />,
      placeholder: 'https://instagram.com/seu.perfil'
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: <Facebook size={18} />,
      placeholder: 'https://facebook.com/seu.perfil'
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: <Youtube size={18} />,
      placeholder: 'https://youtube.com/c/seu.canal'
    },
    { 
      id: 'spotify', 
      name: 'Spotify', 
      icon: <Music size={18} />,
      placeholder: 'https://open.spotify.com/artist/seu-id'
    },
    { 
      id: 'deezer', 
      name: 'Deezer', 
      icon: <Music size={18} />,
      placeholder: 'https://www.deezer.com/artist/seu-id'
    }
  ];

  // Get current user profile
  const { data: currentProfile, refetch: refetchProfile } = useQuery({
    queryKey: ['current-profile'],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    }
  });

  // Get other musician profiles
  const { data: musicians = [], isLoading } = useQuery({
    queryKey: ['musicians', searchTerm],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);
      
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.limit(10);
      
      if (error) throw error;
      return (data || []) as Profile[];
    }
  });

  const handleConnect = (musicianId: string) => {
    // In a full implementation, this would create a connection in the database
    toast({
      title: "Solicitação enviada!",
      description: "O músico receberá sua solicitação de conexão."
    });
  };

  const handleAddSocialLink = async () => {
    if (!socialPlatform || !socialUrl || !socialUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const socialLinks = {
        ...(currentProfile?.social_links || {}),
        [socialPlatform]: socialUrl
      };

      const { error } = await supabase
        .from('profiles')
        .update({ social_links: socialLinks })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Link adicionado!",
        description: `Seu perfil em ${socialPlatforms.find(p => p.id === socialPlatform)?.name} foi atualizado.`
      });

      setSocialDialogOpen(false);
      setSocialPlatform('');
      setSocialUrl('');
      refetchProfile();
    } catch (error: any) {
      console.error('Erro ao adicionar link social:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível adicionar o link social.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveSocialLink = async (platform: string) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const socialLinks = { ...(currentProfile?.social_links || {}) };
      delete socialLinks[platform];

      const { error } = await supabase
        .from('profiles')
        .update({ social_links: socialLinks })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Link removido!",
        description: `Seu perfil em ${
          socialPlatforms.find(p => p.id === platform)?.name
        } foi removido.`
      });

      refetchProfile();
    } catch (error: any) {
      console.error('Erro ao remover link social:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover o link social.",
        variant: "destructive"
      });
    }
  };

  const getIconForPlatform = (platform: string) => {
    const socialPlatform = socialPlatforms.find(p => p.id === platform);
    return socialPlatform?.icon || <ExternalLink size={18} />;
  };

  const getPlatformName = (platform: string) => {
    const socialPlatform = socialPlatforms.find(p => p.id === platform);
    return socialPlatform?.name || platform;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Networking</h2>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Buscar músicos por nome ou cidade..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Minhas redes sociais</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSocialDialogOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Plus size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          {currentProfile?.social_links && Object.keys(currentProfile.social_links).length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {Object.entries(currentProfile.social_links).map(([platform, url]) => (
                <div key={platform} className="relative group">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md hover:bg-accent transition-colors"
                  >
                    {getIconForPlatform(platform)}
                    <span>{getPlatformName(platform)}</span>
                  </a>
                  <button 
                    onClick={() => handleRemoveSocialLink(platform)}
                    className="absolute -top-2 -right-2 bg-background border border-border rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remover ${platform}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Music className="mx-auto h-10 w-10 opacity-50" />
              <p className="mt-2">Adicione suas redes sociais e plataformas de streaming</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSocialDialogOpen(true)}
                className="mt-3"
              >
                <Plus size={16} className="mr-2" />
                Adicionar plataforma
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Músicos em destaque</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 animate-pulse bg-muted rounded"></div>
              ))}
            </div>
          ) : musicians.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">Nenhum músico encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {musicians.map((musician) => (
                <div key={musician.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={musician.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {musician.full_name?.[0]?.toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{musician.full_name || 'Músico'}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {musician.instrument?.slice(0, 2).map((inst: string) => (
                          <Badge variant="outline" key={inst}>{inst}</Badge>
                        ))}
                        {musician.musical_genre?.slice(0, 1).map((genre: string) => (
                          <Badge variant="secondary" key={genre}>{genre}</Badge>
                        ))}
                        {musician.city && <Badge variant="outline">{musician.city}</Badge>}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleConnect(musician.id)}>
                    <UserPlus size={16} className="mr-2" />
                    Conectar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar rede social</DialogTitle>
            <DialogDescription>
              Adicione suas redes sociais ou plataformas de streaming para que outros músicos possam te encontrar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma</Label>
              <Select value={socialPlatform} onValueChange={setSocialPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {socialPlatforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        {platform.icon}
                        <span>{platform.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url" 
                value={socialUrl} 
                onChange={(e) => setSocialUrl(e.target.value)} 
                placeholder={socialPlatform ? 
                  socialPlatforms.find(p => p.id === socialPlatform)?.placeholder : 
                  "https://..."
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSocialDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddSocialLink}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkTab;
