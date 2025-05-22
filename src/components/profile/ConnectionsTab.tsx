
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, Music, Mic, Check, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getFollowing, getFollowers, followUser, unfollowUser } from '@/services/api/connections';
import { searchProfiles } from '@/services/api/profiles';

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  instrument: string[] | null;
  musical_genre: string[] | null;
  city: string | null;
  state: string | null;
  isFollowing?: boolean;
};

const ConnectionsTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Carregar dados de conexões do usuário
  useEffect(() => {
    const loadConnections = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          // Carregar quem o usuário segue
          const followingData = await getFollowing(user.id);
          const followingIds = followingData.map(item => item.following_id);
          setFollowing(followingIds);
          
          // Carregar seguidores do usuário
          const followersData = await getFollowers(user.id);
          const followerIds = followersData.map(item => item.follower_id);
          setFollowers(followerIds);
          
          // Carregar perfil do usuário para obter gêneros e instrumentos
          const { data: profileData } = await supabase
            .from('profiles')
            .select('musical_genre, instrument')
            .eq('id', user.id)
            .single();
            
          // Buscar sugestões baseadas em gêneros musicais semelhantes
          if (profileData?.musical_genre && profileData.musical_genre.length > 0) {
            // Consulta para encontrar perfis com gêneros musicais semelhantes
            const { data: genreSuggestions } = await supabase
              .from('profiles')
              .select('*')
              .not('id', 'eq', user.id)
              .limit(10);
              
            if (genreSuggestions) {
              // Filtrar sugestões e marcar quais o usuário já segue
              const filteredSuggestions = genreSuggestions
                .filter(profile => 
                  profile.musical_genre && 
                  profileData.musical_genre.some(genre => 
                    profile.musical_genre?.includes(genre)
                  )
                )
                .map(profile => ({
                  ...profile,
                  isFollowing: followingIds.includes(profile.id)
                }));
                
              setSuggestions(filteredSuggestions);
            }
          }
        } catch (err) {
          console.error('Erro ao carregar conexões:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadConnections();
  }, [user?.id]);

  // Função para seguir um usuário
  const handleFollow = async (profileId: string) => {
    if (!user) return;
    
    setActionLoading(profileId);
    try {
      await followUser(profileId);
      
      // Atualizar estado local
      setFollowing(prev => [...prev, profileId]);
      setSuggestions(prev => 
        prev.map(profile => 
          profile.id === profileId 
            ? { ...profile, isFollowing: true } 
            : profile
        )
      );
      
      toast({
        title: "Conexão adicionada",
        description: "Você começou a seguir este perfil.",
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    } catch (err) {
      console.error('Erro ao seguir usuário:', err);
      toast({
        title: "Erro ao conectar",
        description: "Ocorreu um erro ao tentar seguir este perfil.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Função para deixar de seguir um usuário
  const handleUnfollow = async (profileId: string) => {
    if (!user) return;
    
    setActionLoading(profileId);
    try {
      await unfollowUser(profileId);
      
      // Atualizar estado local
      setFollowing(prev => prev.filter(id => id !== profileId));
      setSuggestions(prev => 
        prev.map(profile => 
          profile.id === profileId 
            ? { ...profile, isFollowing: false } 
            : profile
        )
      );
      
      toast({
        title: "Conexão removida",
        description: "Você deixou de seguir este perfil.",
      });
    } catch (err) {
      console.error('Erro ao deixar de seguir usuário:', err);
      toast({
        title: "Erro ao desconectar",
        description: "Ocorreu um erro ao tentar deixar de seguir este perfil.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
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
    <div className="space-y-6">
      {/* Estatísticas de Conexões */}
      <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center dark:text-[#E9ECEF]">
            <Users className="mr-2 h-5 w-5" />
            Suas Conexões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{following.length}</p>
              <p className="text-muted-foreground">Seguindo</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold">{followers.length}</p>
              <p className="text-muted-foreground">Seguidores</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilidade para Colaborações */}
      <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-2 dark:text-[#E9ECEF]">Disponível para Colaborações?</h3>
              <p className="text-muted-foreground dark:text-[#ADB5BD]">
                Deixe outros músicos saberem que você está aberto a novos projetos
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Estou Disponível
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de Conexões */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold dark:text-[#E9ECEF] flex items-center">
          <Music className="mr-2 h-5 w-5" />
          Artistas com Interesses Semelhantes
        </h3>
        
        {suggestions.length === 0 ? (
          <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Complete seu perfil musical para descobrir artistas com interesses semelhantes.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map(profile => (
              <Card key={profile.id} className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-muted">
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'Usuário'} />
                      <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate dark:text-[#E9ECEF]">
                        {profile.full_name || 'Usuário'}
                      </h4>
                      {profile.city && profile.state && (
                        <p className="text-muted-foreground text-sm">
                          {profile.city}, {profile.state}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {profile.musical_genre?.slice(0, 3).map(genre => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {profile.instrument?.slice(0, 2).map(instrument => (
                          <Badge key={instrument} variant="outline" className="text-xs">
                            {instrument}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {profile.isFollowing ? (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleUnfollow(profile.id)}
                        disabled={actionLoading === profile.id}
                      >
                        {actionLoading === profile.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Seguindo
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleFollow(profile.id)}
                        disabled={actionLoading === profile.id}
                      >
                        {actionLoading === profile.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <UserPlus className="h-4 w-4 mr-2" />
                        )}
                        Seguir
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsTab;
