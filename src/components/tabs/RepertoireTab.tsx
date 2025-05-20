
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Music, Search, Filter, List, Grid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSubscription } from '@/contexts/subscription';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data - will be replaced with API data later
const sampleRepertoire = [
  { id: '1', title: 'Garota de Ipanema', artist: 'Tom Jobim', genre: 'Bossa Nova', key: 'F', bpm: 120 },
  { id: '2', title: 'Águas de Março', artist: 'Elis Regina', genre: 'MPB', key: 'C', bpm: 110 },
  { id: '3', title: 'Aquarela', artist: 'Toquinho', genre: 'MPB', key: 'G', bpm: 95 },
  { id: '4', title: 'Chega de Saudade', artist: 'João Gilberto', genre: 'Bossa Nova', key: 'D', bpm: 128 },
  { id: '5', title: 'Evidências', artist: 'Chitãozinho e Xororó', genre: 'Sertanejo', key: 'E', bpm: 135 },
];

const RepertoireTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { subscriptionStatus } = useSubscription();
  const { toast } = useToast();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';

  const handleAddMusic = () => {
    // This will be implemented with the proper form/dialog
    toast({
      title: "Adicionar música",
      description: "Funcionalidade em desenvolvimento."
    });
  };

  const filteredRepertoire = sampleRepertoire.filter(
    item => item.title.toLowerCase().includes(search.toLowerCase()) || 
           item.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card className="shadow-md bg-card/90 backdrop-blur-sm border border-border/50 transition-all hover:shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <Music className="h-5 w-5 text-primary" />
              </div>
              Repertório
            </CardTitle>
            <CardDescription>
              Gerencie suas músicas e setlists
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddMusic}
            className="group hover:bg-primary/20 hover:text-primary transition-colors"
          >
            <PlusCircle className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
            Nova música
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar música ou artista..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-background/50"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" size="sm" className="text-xs">
                <Filter className="mr-1 h-3 w-3" />
                Filtros
              </Button>
              
              <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')} className="ml-auto">
                <TabsList className="h-8">
                  <TabsTrigger value="grid" className="h-7 w-7 p-0">
                    <Grid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="h-7 w-7 p-0">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {filteredRepertoire.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-background/30 rounded-lg">
              Nenhuma música encontrada.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRepertoire.map((music) => (
                <Card key={music.id} className="bg-background/50 hover:bg-background/70 transition-colors cursor-pointer">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">{music.title}</CardTitle>
                    <CardDescription>{music.artist}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="bg-background/50">{music.genre}</Badge>
                      <Badge variant="outline" className="bg-background/50">Tom: {music.key}</Badge>
                      <Badge variant="outline" className="bg-background/50">{music.bpm} BPM</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredRepertoire.map((music) => (
                <div 
                  key={music.id} 
                  className="flex items-center justify-between p-3 bg-background/50 rounded-md hover:bg-background/70 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-medium">{music.title}</div>
                    <div className="text-sm text-muted-foreground">{music.artist}</div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-background/50">{music.genre}</Badge>
                    <Badge variant="outline" className="bg-background/50">Tom: {music.key}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepertoireTab;
