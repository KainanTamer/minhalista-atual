
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Music, Search, UserPlus, Instagram, Facebook, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

const NetworkTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Get current user profile
  const { data: currentProfile } = useQuery({
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
      return data;
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
      return data || [];
    }
  });

  const handleConnect = (musicianId: string) => {
    // In a full implementation, this would create a connection in the database
    toast({
      title: "Solicitação enviada!",
      description: "O músico receberá sua solicitação de conexão."
    });
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
      
      {currentProfile?.social_links && Object.keys(currentProfile.social_links).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minhas redes sociais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {currentProfile.social_links.instagram && (
                <a 
                  href={currentProfile.social_links.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md hover:bg-accent transition-colors"
                >
                  <Instagram size={18} />
                  <span>Instagram</span>
                </a>
              )}
              {currentProfile.social_links.facebook && (
                <a 
                  href={currentProfile.social_links.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md hover:bg-accent transition-colors"
                >
                  <Facebook size={18} />
                  <span>Facebook</span>
                </a>
              )}
              {currentProfile.social_links.youtube && (
                <a 
                  href={currentProfile.social_links.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-md hover:bg-accent transition-colors"
                >
                  <Youtube size={18} />
                  <span>Youtube</span>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
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
    </div>
  );
};

export default NetworkTab;
