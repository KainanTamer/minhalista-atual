
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Search, Facebook, Instagram, Youtube, Music, Link } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getFollowing, getFollowers, followUser, unfollowUser, searchProfiles, Profile, getProfile, updateProfile } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

interface SocialLink {
  platform: string;
  url: string;
}

const NetworkTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ platform: 'instagram', url: '' });
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Query para seguidores e seguindo
  const { data: following = [], refetch: refetchFollowing } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: () => getFollowing(user?.id || ''),
    enabled: !!user,
  });

  const { data: followers = [], refetch: refetchFollowers } = useQuery({
    queryKey: ['followers', user?.id],
    queryFn: () => getFollowers(user?.id || ''),
    enabled: !!user,
  });

  // Query para perfil do usuário
  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(user?.id || ''),
    enabled: !!user,
    onSuccess: (data) => {
      if (data?.social_links) {
        const links = [];
        for (const [platform, url] of Object.entries(data.social_links || {})) {
          if (url) {
            links.push({ platform, url: url as string });
          }
        }
        setSocialLinks(links);
      }
    },
  });

  // Função de busca
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchProfiles(searchQuery);
      // Filtra o próprio usuário dos resultados
      setSearchResults(results.filter(profile => profile.id !== user?.id));
    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível completar a busca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Seguir/deixar de seguir usuário
  const handleFollowToggle = async (profileId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await unfollowUser(profileId);
        toast({
          title: "Deixou de seguir",
          description: "Você deixou de seguir este músico."
        });
      } else {
        await followUser(profileId);
        toast({
          title: "Seguindo",
          description: "Você está seguindo este músico agora."
        });
      }
      refetchFollowing();
      refetchFollowers();
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
      toast({
        title: "Erro",
        description: "Não foi possível completar a ação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Verifica se está seguindo um perfil
  const isFollowingProfile = (profileId: string) => {
    return following.some(f => f.following_id === profileId);
  };

  // Adicionar link de rede social
  const addSocialLink = () => {
    if (!newSocialLink.url.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive",
      });
      return;
    }

    const updatedLinks = [...socialLinks, { ...newSocialLink }];
    setSocialLinks(updatedLinks);
    setNewSocialLink({ platform: 'instagram', url: '' });
  };

  // Remover link de rede social
  const removeSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  // Salvar links sociais no perfil
  const saveSocialLinks = async () => {
    if (!user) return;

    const socialObj: Record<string, string> = {};
    socialLinks.forEach(link => {
      socialObj[link.platform] = link.url;
    });

    try {
      await updateProfile(user.id, {
        social_links: socialObj
      });
      
      setIsEditingSocials(false);
      refetchProfile();
      
      toast({
        title: "Links salvos",
        description: "Seus links de redes sociais foram atualizados com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar links:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os links. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Renderizar ícones de redes sociais
  const getSocialIcon = (platform: string) => {
    switch(platform) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'spotify':
        return <Music className="h-4 w-4" />;
      default:
        return <Link className="h-4 w-4" />;
    }
  };

  // Rendering profiles
  const renderProfile = (profile: any) => {
    const isFollowed = isFollowingProfile(profile.id);
    
    return (
      <Card key={profile.id} className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{profile.full_name || 'Usuário'}</h4>
              {profile.username && (
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.instrument && profile.instrument.map((instrument: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                    {instrument}
                  </span>
                ))}
              </div>
            </div>
            
            <Button
              variant={isFollowed ? "outline" : "default"}
              size="sm"
              onClick={() => handleFollowToggle(profile.id, isFollowed)}
            >
              {isFollowed ? 'Seguindo' : 'Seguir'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSocialLinksForm = () => (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Suas Redes Sociais</h3>
        
        {socialLinks.length > 0 ? (
          <div className="space-y-2">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-secondary/10">
                <div className="flex items-center gap-2 flex-1">
                  {getSocialIcon(link.platform)}
                  <span className="flex-1 truncate">{link.url}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-7 w-7 p-0" 
                  onClick={() => removeSocialLink(index)}
                >
                  <User className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Ainda não há links de redes sociais. Adicione seu primeiro link.
          </p>
        )}
        
        <div className="flex gap-2">
          <select
            className="flex h-9 rounded-md border bg-background px-3 py-1 text-sm shadow-sm"
            value={newSocialLink.platform}
            onChange={(e) => setNewSocialLink({...newSocialLink, platform: e.target.value})}
          >
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="spotify">Spotify</option>
            <option value="website">Website</option>
            <option value="other">Outro</option>
          </select>
          <div className="flex-1">
            <Input
              placeholder="URL"
              value={newSocialLink.url}
              onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
            />
          </div>
          <Button onClick={addSocialLink}>Adicionar</Button>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsEditingSocials(false)}>Cancelar</Button>
          <Button onClick={saveSocialLinks}>Salvar Links</Button>
        </div>
      </div>
    </>
  );

  const renderSocialLinks = () => {
    if (socialLinks.length === 0) {
      return (
        <div className="text-center p-6">
          <p className="text-sm text-muted-foreground">
            Você ainda não adicionou links de redes sociais.
          </p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => setIsEditingSocials(true)}
          >
            Adicionar Links
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Suas Redes Sociais</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditingSocials(true)}
          >
            Editar Links
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 gap-3 border rounded-lg hover:bg-secondary/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {getSocialIcon(link.platform)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium capitalize">{link.platform}</p>
                <p className="text-sm text-muted-foreground truncate">{link.url}</p>
              </div>
            </a>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Networking</h2>
      
      <Tabs defaultValue="profiles">
        <TabsList>
          <TabsTrigger value="profiles">Perfis</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Buscar músicos</CardTitle>
              <CardDescription>Encontre outros músicos para seguir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome ou nome de usuário"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              {searchQuery && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Resultados da busca</h3>
                  
                  {isSearching ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">Nenhum resultado encontrado</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map(profile => renderProfile(profile))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Seguindo</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {following.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {following.length === 0 ? (
                  <div className="text-center py-4">
                    <User className="mx-auto h-10 w-10 text-muted-foreground opacity-20" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Você ainda não está seguindo ninguém
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {following.map(follow => renderProfile(follow.profiles))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Seguidores</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {followers.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {followers.length === 0 ? (
                  <div className="text-center py-4">
                    <User className="mx-auto h-10 w-10 text-muted-foreground opacity-20" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Você ainda não tem seguidores
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {followers.map(follow => renderProfile(follow.profiles))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="mt-6">
          <Card>
            <CardContent className="p-6">
              {isEditingSocials ? renderSocialLinksForm() : renderSocialLinks()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkTab;
