
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Music, Mic, Check, Plus, X, DragHandleDots2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Esquema de validação para o formulário de perfil musical
const musicProfileSchema = z.object({
  spotify: z.string().url('URL inválida').optional().or(z.literal('')),
  youtube: z.string().url('URL inválida').optional().or(z.literal('')),
  instagram: z.string().url('URL inválida').optional().or(z.literal('')),
  soundcloud: z.string().url('URL inválida').optional().or(z.literal('')),
});

type MusicProfileFormValues = z.infer<typeof musicProfileSchema>;

const MusicProfileForm: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [newInstrument, setNewInstrument] = useState('');

  // Inicializar o formulário com o react-hook-form
  const form = useForm<MusicProfileFormValues>({
    resolver: zodResolver(musicProfileSchema),
    defaultValues: {
      spotify: '',
      youtube: '',
      instagram: '',
      soundcloud: '',
    },
    mode: "onBlur"
  });

  // Carregar os dados do perfil do usuário
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          // Configurar os gêneros e instrumentos
          if (data.musical_genre) {
            setGenres(data.musical_genre);
          }
          
          if (data.instrument) {
            setInstruments(data.instrument);
          }
          
          // Configurar os links sociais
          const socialLinks = data.social_links || {};
          form.reset({
            spotify: socialLinks.spotify || '',
            youtube: socialLinks.youtube || '',
            instagram: socialLinks.instagram || '',
            soundcloud: socialLinks.soundcloud || '',
          });
        } catch (err) {
          console.error('Erro ao carregar dados do perfil:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfileData();
  }, [user?.id, form]);

  // Função para adicionar um novo gênero musical
  const addGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre]);
      setNewGenre('');
      updateGenresInDatabase([...genres, newGenre]);
    }
  };

  // Função para remover um gênero musical
  const removeGenre = (genreToRemove: string) => {
    const updatedGenres = genres.filter(genre => genre !== genreToRemove);
    setGenres(updatedGenres);
    updateGenresInDatabase(updatedGenres);
  };

  // Função para adicionar um novo instrumento
  const addInstrument = () => {
    if (newInstrument && !instruments.includes(newInstrument)) {
      setInstruments([...instruments, newInstrument]);
      setNewInstrument('');
      updateInstrumentsInDatabase([...instruments, newInstrument]);
    }
  };

  // Função para remover um instrumento
  const removeInstrument = (instrumentToRemove: string) => {
    const updatedInstruments = instruments.filter(instrument => instrument !== instrumentToRemove);
    setInstruments(updatedInstruments);
    updateInstrumentsInDatabase(updatedInstruments);
  };

  // Atualizar gêneros no banco de dados
  const updateGenresInDatabase = async (updatedGenres: string[]) => {
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ musical_genre: updatedGenres })
          .eq('id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Gêneros atualizados",
          description: "Seus gêneros musicais foram atualizados com sucesso.",
        });
      } catch (err) {
        console.error('Erro ao atualizar gêneros:', err);
        toast({
          title: "Erro ao atualizar gêneros",
          description: "Ocorreu um erro ao atualizar seus gêneros musicais.",
          variant: "destructive"
        });
      }
    }
  };

  // Atualizar instrumentos no banco de dados
  const updateInstrumentsInDatabase = async (updatedInstruments: string[]) => {
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ instrument: updatedInstruments })
          .eq('id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Instrumentos atualizados",
          description: "Seus instrumentos foram atualizados com sucesso.",
        });
      } catch (err) {
        console.error('Erro ao atualizar instrumentos:', err);
        toast({
          title: "Erro ao atualizar instrumentos",
          description: "Ocorreu um erro ao atualizar seus instrumentos.",
          variant: "destructive"
        });
      }
    }
  };

  // Função para enviar o formulário de links sociais
  const onSubmit = async (values: MusicProfileFormValues) => {
    if (user?.id) {
      setSaving(true);
      try {
        // Filtrar links vazios
        const socialLinks: Record<string, string> = {};
        Object.entries(values).forEach(([key, value]) => {
          if (value) {
            socialLinks[key] = value;
          }
        });
        
        // Atualizar links sociais no banco de dados
        const { error } = await supabase
          .from('profiles')
          .update({ social_links: socialLinks })
          .eq('id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Links atualizados",
          description: "Seus links de plataformas foram atualizados com sucesso.",
          icon: <Check className="h-4 w-4 text-green-500" />
        });
      } catch (err) {
        console.error('Erro ao atualizar links sociais:', err);
        toast({
          title: "Erro ao atualizar links",
          description: "Ocorreu um erro ao atualizar seus links de plataformas.",
          variant: "destructive"
        });
      } finally {
        setSaving(false);
      }
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
      {/* Seção de Gêneros Musicais */}
      <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center dark:text-[#E9ECEF]">
            <Music className="mr-2 h-5 w-5" />
            Gêneros Musicais
          </CardTitle>
          <CardDescription className="dark:text-[#ADB5BD]">
            Adicione os gêneros musicais que você toca ou produz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map(genre => (
              <Badge 
                key={genre} 
                variant="secondary"
                className="flex items-center gap-1 pl-3 pr-2 py-1.5"
              >
                {genre}
                <button 
                  onClick={() => removeGenre(genre)}
                  className="ml-1 text-xs rounded-full hover:bg-muted p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar gênero musical"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGenre()}
            />
            <Button onClick={addGenre} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Instrumentos */}
      <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
        <CardHeader>
          <CardTitle className="flex items-center dark:text-[#E9ECEF]">
            <Mic className="mr-2 h-5 w-5" />
            Instrumentos
          </CardTitle>
          <CardDescription className="dark:text-[#ADB5BD]">
            Adicione os instrumentos que você toca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {instruments.map(instrument => (
              <Badge 
                key={instrument} 
                variant="secondary"
                className="flex items-center gap-1 pl-3 pr-2 py-1.5"
              >
                {instrument}
                <button 
                  onClick={() => removeInstrument(instrument)}
                  className="ml-1 text-xs rounded-full hover:bg-muted p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar instrumento"
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addInstrument()}
            />
            <Button onClick={addInstrument} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Links de Plataformas */}
      <Card className="shadow-card-light dark:shadow-card-dark border-[#E9ECEF] dark:border-[#333333] theme-transition">
        <CardHeader>
          <CardTitle className="dark:text-[#E9ECEF]">Links de Plataformas</CardTitle>
          <CardDescription className="dark:text-[#ADB5BD]">
            Adicione links para suas plataformas de música e redes sociais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="spotify"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="text-green-500 font-bold">Spotify</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://open.spotify.com/artist/..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtube"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="text-red-500 font-bold">YouTube</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://youtube.com/@seucanal" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="text-purple-500 font-bold">Instagram</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://instagram.com/seuusuario" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soundcloud"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="text-orange-500 font-bold">SoundCloud</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://soundcloud.com/seuusuario" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={saving || !form.formState.isDirty}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  "Salvar Links"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicProfileForm;
