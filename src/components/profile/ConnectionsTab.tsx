
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { followUser, unfollowUser, getFollowingProfiles } from '@/services/api';
import { ProfileWithMetadata } from '@/services/api/types';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';

const ConnectionsTab: React.FC = () => {
  const { user } = useAuth();
  const [following, setFollowing] = useState<ProfileWithMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFollowing = async () => {
      if (user) {
        setLoading(true);
        try {
          const followingProfiles = await getFollowingProfiles(user.id);
          setFollowing(followingProfiles);
        } catch (error) {
          console.error("Failed to fetch following:", error);
          toast({
            title: "Erro",
            description: "Falha ao carregar os usuários que você segue.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFollowing();
  }, [user]);

  const handleFollow = async (profileId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para seguir outros usuários.",
        variant: "destructive",
      });
      return;
    }

    try {
      await followUser(profileId);
      setFollowing(prevFollowing => [
        ...prevFollowing,
        {
          id: profileId,
          username: 'Novo Usuário', // You might want to fetch the username
          full_name: 'Nome Completo', // You might want to fetch the full name
          avatar_url: null,
          isFollowing: true,
        } as ProfileWithMetadata,
      ]);
      toast({
        title: "Seguindo",
        description: "Você está seguindo este perfil agora.",
      });
    } catch (error) {
      console.error("Failed to follow user:", error);
      toast({
        title: "Erro",
        description: "Falha ao seguir o usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleUnfollow = async (profileId: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para deixar de seguir outros usuários.",
        variant: "destructive",
      });
      return;
    }

    try {
      await unfollowUser(profileId);
      setFollowing(prevFollowing => prevFollowing.filter(profile => profile.id !== profileId));
      toast({
        title: "Deixou de seguir",
        description: "Você não está mais seguindo este perfil.",
      });
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      toast({
        title: "Erro",
        description: "Falha ao deixar de seguir o usuário. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const filteredFollowing = following.filter(profile =>
    profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
        <CardHeader>
          <CardTitle className="dark:text-[#E9ECEF]">Colaborações</CardTitle>
          <CardDescription className="dark:text-[#ADB5BD]">
            Gerencie as pessoas que você segue e que te seguem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Buscar por nome ou usuário"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="mt-4 space-y-4">
            {filteredFollowing.map(profile => (
              <li key={profile.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <Link to={`/profile/${profile.id}`}>
                    <Avatar>
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || profile.username || "Avatar"} />
                      <AvatarFallback>{profile.full_name?.charAt(0) || profile.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link to={`/profile/${profile.id}`}>
                      <p className="font-medium dark:text-[#E9ECEF]">{profile.full_name || 'Nome Desconhecido'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username || 'usuário'}</p>
                    </Link>
                  </div>
                </div>
                <div>
                  {profile.isFollowing ? (
                    <Button 
                      variant="outline"
                      onClick={() => handleUnfollow(profile.id)}
                      className="border-[#4361EE] text-[#4361EE] dark:border-[#BB86FC] dark:text-[#BB86FC]"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Seguindo
                    </Button>
                  ) : (
                    <Button onClick={() => handleFollow(profile.id)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Seguir
                    </Button>
                  )}
                </div>
              </li>
            ))}
            {filteredFollowing.length === 0 && (
              <li className="text-center py-2 dark:text-gray-400">Nenhum perfil encontrado.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionsTab;
