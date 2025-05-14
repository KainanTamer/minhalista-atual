
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Interface para as músicas no setlist
interface Song {
  id: string;
  title: string;
  artist: string;
  notes: string;
  key?: string;
  duration?: string;
}

interface Setlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  created_at: string;
}

const RepertoireTab: React.FC = () => {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [currentSetlist, setCurrentSetlist] = useState<Setlist | null>(null);
  const [isCreatingSetlist, setIsCreatingSetlist] = useState(false);
  const [isEditingSetlist, setIsEditingSetlist] = useState(false);
  const [isCreatingSong, setIsCreatingSong] = useState(false);
  const [newSetlistName, setNewSetlistName] = useState('');
  const [newSetlistDescription, setNewSetlistDescription] = useState('');
  const [newSong, setNewSong] = useState<Omit<Song, 'id'>>({ 
    title: '', 
    artist: '', 
    notes: '',
    key: '',
    duration: ''
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar setlists do localStorage (ou DB no futuro)
  useEffect(() => {
    if (user) {
      const loadSetlists = async () => {
        // Em uma aplicação real, isso viria da API
        const storedSetlists = localStorage.getItem(`setlists-${user.id}`);
        if (storedSetlists) {
          try {
            const parsedSetlists = JSON.parse(storedSetlists);
            setSetlists(parsedSetlists);
            if (parsedSetlists.length > 0) {
              setCurrentSetlist(parsedSetlists[0]);
            }
          } catch (e) {
            console.error('Erro ao carregar setlists:', e);
          }
        }
      };
      
      loadSetlists();
    }
  }, [user]);

  // Salvar setlists no localStorage (ou DB no futuro)
  const saveSetlists = (updatedSetlists: Setlist[]) => {
    if (user) {
      localStorage.setItem(`setlists-${user.id}`, JSON.stringify(updatedSetlists));
      setSetlists(updatedSetlists);
    }
  };

  const handleCreateSetlist = () => {
    if (!newSetlistName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, dê um nome ao setlist.",
        variant: "destructive",
      });
      return;
    }

    const newSetlist: Setlist = {
      id: crypto.randomUUID(),
      name: newSetlistName,
      description: newSetlistDescription,
      songs: [],
      created_at: new Date().toISOString()
    };

    const updatedSetlists = [...setlists, newSetlist];
    saveSetlists(updatedSetlists);
    setCurrentSetlist(newSetlist);
    setIsCreatingSetlist(false);
    setNewSetlistName('');
    setNewSetlistDescription('');
    
    toast({
      title: "Setlist criado",
      description: `O setlist "${newSetlistName}" foi criado com sucesso.`
    });
  };

  const handleUpdateSetlist = () => {
    if (!currentSetlist || !newSetlistName.trim()) return;
    
    const updatedSetlist = {
      ...currentSetlist,
      name: newSetlistName,
      description: newSetlistDescription
    };
    
    const updatedSetlists = setlists.map(sl => 
      sl.id === currentSetlist.id ? updatedSetlist : sl
    );
    
    saveSetlists(updatedSetlists);
    setCurrentSetlist(updatedSetlist);
    setIsEditingSetlist(false);
    
    toast({
      title: "Setlist atualizado",
      description: `O setlist foi atualizado com sucesso.`
    });
  };

  const handleDeleteSetlist = (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este setlist?')) {
      return;
    }
    
    const updatedSetlists = setlists.filter(sl => sl.id !== id);
    saveSetlists(updatedSetlists);
    
    // Se o setlist atual foi excluído, selecione outro
    if (currentSetlist?.id === id) {
      setCurrentSetlist(updatedSetlists.length > 0 ? updatedSetlists[0] : null);
    }
    
    toast({
      title: "Setlist excluído",
      description: `O setlist foi excluído com sucesso.`
    });
  };

  const handleAddSong = () => {
    if (!currentSetlist) return;
    if (!newSong.title.trim() || !newSong.artist.trim()) {
      toast({
        title: "Erro",
        description: "Título e artista são obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    const song: Song = {
      id: crypto.randomUUID(),
      ...newSong
    };
    
    const updatedSetlist = {
      ...currentSetlist,
      songs: [...currentSetlist.songs, song]
    };
    
    const updatedSetlists = setlists.map(sl => 
      sl.id === currentSetlist.id ? updatedSetlist : sl
    );
    
    saveSetlists(updatedSetlists);
    setCurrentSetlist(updatedSetlist);
    setIsCreatingSong(false);
    setNewSong({ title: '', artist: '', notes: '', key: '', duration: '' });
    
    toast({
      title: "Música adicionada",
      description: `"${song.title}" foi adicionada ao setlist.`
    });
  };

  const handleRemoveSong = (songId: string) => {
    if (!currentSetlist) return;
    
    const updatedSongs = currentSetlist.songs.filter(song => song.id !== songId);
    const updatedSetlist = {
      ...currentSetlist,
      songs: updatedSongs
    };
    
    const updatedSetlists = setlists.map(sl => 
      sl.id === currentSetlist.id ? updatedSetlist : sl
    );
    
    saveSetlists(updatedSetlists);
    setCurrentSetlist(updatedSetlist);
  };

  const startEditSetlist = () => {
    if (!currentSetlist) return;
    setNewSetlistName(currentSetlist.name);
    setNewSetlistDescription(currentSetlist.description);
    setIsEditingSetlist(true);
  };

  const renderSetlistList = () => (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Meus Setlists</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreatingSetlist(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Setlist
        </Button>
      </div>
      
      {setlists.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Music className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-2">Nenhum setlist criado ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {setlists.map(setlist => (
            <Card 
              key={setlist.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${currentSetlist?.id === setlist.id ? 'border-primary' : ''}`}
              onClick={() => setCurrentSetlist(setlist)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{setlist.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {setlist.songs.length} música{setlist.songs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSetlist(setlist.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderSetlistCreationForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Novo Setlist</CardTitle>
        <CardDescription>Crie um novo setlist para organizar suas músicas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input 
              placeholder="Nome do setlist"
              value={newSetlistName}
              onChange={(e) => setNewSetlistName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <Textarea 
              placeholder="Descrição ou observações"
              value={newSetlistDescription}
              onChange={(e) => setNewSetlistDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCreatingSetlist(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateSetlist}>
              Criar Setlist
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSetlistEditForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Editar Setlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input 
              placeholder="Nome do setlist"
              value={newSetlistName}
              onChange={(e) => setNewSetlistName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <Textarea 
              placeholder="Descrição ou observações"
              value={newSetlistDescription}
              onChange={(e) => setNewSetlistDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditingSetlist(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateSetlist}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSongForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Música</CardTitle>
        <CardDescription>Adicione uma nova música ao setlist</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input 
                placeholder="Título da música"
                value={newSong.title}
                onChange={(e) => setNewSong({...newSong, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Artista</label>
              <Input 
                placeholder="Nome do artista"
                value={newSong.artist}
                onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tom (opcional)</label>
              <Input 
                placeholder="Ex: Dó Maior, Am"
                value={newSong.key || ''}
                onChange={(e) => setNewSong({...newSong, key: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Duração (opcional)</label>
              <Input 
                placeholder="Ex: 3:45"
                value={newSong.duration || ''}
                onChange={(e) => setNewSong({...newSong, duration: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações (opcional)</label>
            <Textarea 
              placeholder="Observações ou dicas para tocar a música"
              value={newSong.notes}
              onChange={(e) => setNewSong({...newSong, notes: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCreatingSong(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddSong}>
              Adicionar Música
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentSetlist = () => {
    if (!currentSetlist) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Music className="mx-auto h-12 w-12 opacity-50" />
          <p className="mt-2">Selecione um setlist ou crie um novo</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{currentSetlist.name}</h3>
            {currentSetlist.description && (
              <p className="text-sm text-muted-foreground mt-1">{currentSetlist.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={startEditSetlist}
            >
              Editar
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsCreatingSong(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Música
            </Button>
          </div>
        </div>
        
        {currentSetlist.songs.length === 0 ? (
          <div className="text-center p-8 border rounded-md bg-muted/30">
            <Music className="mx-auto h-8 w-8 opacity-50" />
            <p className="mt-2">Este setlist ainda não tem músicas</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsCreatingSong(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Música
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {currentSetlist.songs.map((song, index) => (
              <Card key={song.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="flex items-baseline">
                        <span className="text-sm text-muted-foreground mr-2">{index + 1}.</span>
                        <h4 className="font-medium">{song.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                      
                      <div className="flex gap-4 mt-2">
                        {song.key && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900">
                            Tom: {song.key}
                          </span>
                        )}
                        {song.duration && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900">
                            {song.duration}
                          </span>
                        )}
                      </div>
                      
                      {song.notes && (
                        <p className="text-sm mt-2 italic">{song.notes}</p>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0" 
                      onClick={() => handleRemoveSong(song.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Meu Repertório</h2>
      
      <Tabs defaultValue="setlists">
        <TabsList>
          <TabsTrigger value="setlists">Setlists</TabsTrigger>
          <TabsTrigger value="all-songs" disabled>Todas as Músicas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="setlists" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              {isCreatingSetlist ? renderSetlistCreationForm() : renderSetlistList()}
            </div>
            
            <div className="md:col-span-2">
              {isEditingSetlist 
                ? renderSetlistEditForm() 
                : isCreatingSong 
                  ? renderSongForm() 
                  : renderCurrentSetlist()
              }
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="all-songs">
          <div className="text-center py-8 text-muted-foreground">
            Funcionalidade em desenvolvimento
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RepertoireTab;
