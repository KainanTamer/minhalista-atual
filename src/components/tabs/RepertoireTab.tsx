
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Music, Search, Filter, List, Grid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSubscription } from '@/contexts/subscription';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRepertoire } from '@/hooks/useRepertoire';
import RepertoireDialog from '@/components/dialogs/RepertoireDialog';
import { Skeleton } from '@/components/ui/skeleton';

const RepertoireTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { subscriptionStatus } = useSubscription();
  const { repertoire, isLoading } = useRepertoire();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';

  const handleAddRepertoire = () => {
    setDialogOpen(true);
  };

  const filteredRepertoire = repertoire.filter(
    item => item.title.toLowerCase().includes(search.toLowerCase()) || 
           item.artist?.toLowerCase().includes(search.toLowerCase() || '')
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
            onClick={handleAddRepertoire}
            className="group hover:bg-primary/20 hover:text-primary transition-colors"
          >
            <PlusCircle className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
            Novo repertório
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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-background/50">
                  <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-32 mt-2" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex gap-2 flex-wrap">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRepertoire.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-background/30 rounded-lg">
              {search ? "Nenhuma música encontrada para essa busca." : "Seu repertório está vazio. Adicione suas músicas!"}
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
                      {music.genre && <Badge variant="outline" className="bg-background/50">{music.genre}</Badge>}
                      {music.key && <Badge variant="outline" className="bg-background/50">Tom: {music.key}</Badge>}
                      {music.bpm && <Badge variant="outline" className="bg-background/50">{music.bpm} BPM</Badge>}
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
                    {music.genre && <Badge variant="outline" className="bg-background/50">{music.genre}</Badge>}
                    {music.key && <Badge variant="outline" className="bg-background/50">Tom: {music.key}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <RepertoireDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};

export default RepertoireTab;
