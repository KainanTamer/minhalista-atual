
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Music, Search, MoreVertical, Trash2 } from 'lucide-react';
import { useSubscription } from '@/contexts/subscription';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRepertoire, RepertoireItem } from '@/hooks/useRepertoire';
import { Skeleton } from '@/components/ui/skeleton';
import RepertoireDialog from '@/components/dialogs/RepertoireDialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const RepertoireTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [repertoireDialogOpen, setRepertoireDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<RepertoireItem | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { repertoire, isLoading, deleteRepertoireItem, refetch } = useRepertoire();
  const { subscriptionStatus } = useSubscription();
  const { toast } = useToast();

  const handleAddMusic = () => {
    setEditItem(null);
    setRepertoireDialogOpen(true);
  };

  const handleEditMusic = (item: RepertoireItem) => {
    setEditItem(item);
    setRepertoireDialogOpen(true);
  };

  const handleDeleteMusic = async (id: string) => {
    try {
      await deleteRepertoireItem(id);
      toast({
        title: "Música removida",
        description: "A música foi removida do seu repertório."
      });
    } catch (error) {
      console.error('Erro ao excluir música:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a música. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleClearAll = () => {
    setConfirmDialogOpen(true);
  };

  const confirmClearAll = async () => {
    try {
      // Delete each repertoire item one by one
      for (const item of repertoire) {
        await deleteRepertoireItem(item.id);
      }
      toast({
        title: "Repertório limpo",
        description: "Todas as músicas foram removidas com sucesso."
      });
    } catch (error) {
      console.error("Erro ao limpar repertório:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar limpar o repertório.",
        variant: "destructive"
      });
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  // Filter repertoire based on search
  const filteredRepertoire = repertoire.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    (item.artist && item.artist.toLowerCase().includes(search.toLowerCase())) ||
    (item.genre && item.genre.toLowerCase().includes(search.toLowerCase()))
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
            <CardDescription>Gerencie seu repertório musical</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddMusic}
              className="group hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <PlusCircle className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
              Nova música
            </Button>
            {repertoire.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="group hover:bg-destructive/20 hover:text-destructive transition-colors"
              >
                <Trash2 className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
                Limpar tudo
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar músicas..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-background/50"
            />
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          ) : filteredRepertoire.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-background/30 rounded-lg">
              {search ? "Nenhuma música encontrada para essa busca." : "Seu repertório está vazio. Adicione suas músicas!"}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Artista</TableHead>
                    <TableHead className="hidden md:table-cell">Gênero</TableHead>
                    <TableHead className="hidden md:table-cell">Tom</TableHead>
                    <TableHead className="hidden md:table-cell">BPM</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepertoire.map((song) => (
                    <TableRow 
                      key={song.id} 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleEditMusic(song)}
                    >
                      <TableCell className="font-medium">{song.title}</TableCell>
                      <TableCell>{song.artist || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {song.genre ? (
                          <Badge variant="outline" className="bg-background/50">{song.genre}</Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{song.key || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">{song.bpm || '-'}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Opções</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditMusic(song);
                            }}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMusic(song.id);
                              }}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <RepertoireDialog 
        open={repertoireDialogOpen} 
        onOpenChange={setRepertoireDialogOpen}
        editItem={editItem}
        onSave={() => {
          setEditItem(null);
          refetch();
        }}
      />

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar repertório?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todas as músicas serão removidas permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAll} className="bg-destructive hover:bg-destructive/90">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RepertoireTab;
