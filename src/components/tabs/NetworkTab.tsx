
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, Users, Search, Mail, Phone, Link as LinkIcon, Instagram, 
  Twitter, Facebook, Youtube, Music, UserCircle, MapPin, Tag, 
  BrainCircuit, Sparkles, Clock, Calendar
} from 'lucide-react';
import { useSubscription } from '@/contexts/subscription';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNetworking } from '@/hooks/useNetworking';
import NetworkingDialog from '@/components/dialogs/NetworkingDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { SocialMediaLink } from '@/components/dialogs/networking/types';
import { useToast } from '@/hooks/use-toast';
import { getSocialIcon, getPlatformColor } from '@/components/dialogs/networking/SocialMediaIcons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

type ContactView = 'all' | 'musicians' | 'producers' | 'venues' | 'recommended';

const NetworkTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<ContactView>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | undefined>(undefined);
  const { subscriptionStatus } = useSubscription();
  const { contacts, isLoading, deleteContact } = useNetworking();
  const { toast } = useToast();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const handleAddContact = () => {
    setSelectedContactId(undefined);
    setDialogOpen(true);
  };

  const handleEditContact = (id: string) => {
    setSelectedContactId(id);
    setDialogOpen(true);
  };

  const handleClearAllContacts = () => {
    if (contacts.length > 0) {
      contacts.forEach(contact => {
        deleteContact(contact.id);
      });
      
      toast({
        title: "Contatos removidos",
        description: "Todos os contatos foram removidos da sua rede."
      });
    }
  };

  // Filter contacts based on search and active tab
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(search.toLowerCase()) || 
                         (contact.occupation && contact.occupation.toLowerCase().includes(search.toLowerCase())) ||
                         (contact.company && contact.company.toLowerCase().includes(search.toLowerCase())) ||
                         (contact.musical_genre && contact.musical_genre.some(genre => 
                           genre.toLowerCase().includes(search.toLowerCase())
                         )) ||
                         (contact.instrument && contact.instrument.some(instrument => 
                           instrument.toLowerCase().includes(search.toLowerCase())
                         ));
                         
    // Apply category filter if not showing all
    if (activeTab === 'musicians') {
      return matchesSearch && (
        contact.contact_type === 'músico' || 
        contact.contact_type === 'banda' ||
        (contact.occupation && ['baixista', 'vocalista', 'baterista', 'guitarrista'].some(
          role => contact.occupation?.toLowerCase().includes(role.toLowerCase())
        ))
      );
    } else if (activeTab === 'producers') {
      return matchesSearch && (
        contact.contact_type === 'produtor' || 
        (contact.occupation && contact.occupation.toLowerCase().includes('produtor'))
      );
    } else if (activeTab === 'venues') {
      return matchesSearch && (
        contact.contact_type === 'casa de shows' ||
        ['venue', 'casa', 'teatro', 'bar', 'local'].some(
          term => contact.company?.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else if (activeTab === 'recommended') {
      // Simple recommendation logic - contacts with similar genres or instruments
      const userGenres = contact.musical_genre || [];
      const userInstruments = contact.instrument || [];
      
      return matchesSearch && contacts.some(otherContact => 
        otherContact.id !== contact.id && (
          (otherContact.musical_genre && contact.musical_genre && 
           otherContact.musical_genre.some(genre => contact.musical_genre?.includes(genre))) ||
          (otherContact.instrument && contact.instrument &&
           otherContact.instrument.some(instrument => contact.instrument?.includes(instrument)))
        )
      );
    }
    
    return matchesSearch;
  });
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getContactTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'músico':
        return 'bg-blue-100 text-blue-800';
      case 'banda':
        return 'bg-purple-100 text-purple-800';
      case 'produtor':
        return 'bg-amber-100 text-amber-800';
      case 'dj':
        return 'bg-pink-100 text-pink-800';
      case 'casa de shows':
        return 'bg-green-100 text-green-800';
      case 'estúdio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getSimilarContacts = (contactId: string) => {
    const currentContact = contacts.find(c => c.id === contactId);
    if (!currentContact || !currentContact.musical_genre) return [];
    
    return contacts.filter(c => 
      c.id !== contactId && 
      c.musical_genre && 
      currentContact.musical_genre?.some(genre => c.musical_genre?.includes(genre))
    ).slice(0, 3);
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-md bg-card/90 backdrop-blur-sm border border-border/50 transition-all hover:shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
              Networking Artístico
            </CardTitle>
            <CardDescription>
              Conecte-se com artistas, produtores e venues
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  size="sm"
                  disabled={contacts.length === 0}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  Limpar tudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover todos os contatos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os contatos serão permanentemente removidos da sua rede.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAllContacts} className="bg-destructive text-destructive-foreground">
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddContact}
              className="group hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <PlusCircle className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
              Novo artista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar artistas, produtores..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-background/50"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ContactView)} 
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="musicians">Músicos</TabsTrigger>
                  <TabsTrigger value="producers">Produtores</TabsTrigger>
                  <TabsTrigger value="venues">Locais</TabsTrigger>
                  <TabsTrigger value="recommended" className="relative">
                    <span className="relative">
                      Recomendados
                      <span className="absolute -top-2 -right-2">
                        <Badge className="bg-primary text-[10px] h-4 w-4 p-0 flex items-center justify-center">
                          {isPro ? '✨' : '🔒'}
                        </Badge>
                      </span>
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex bg-muted rounded-md border overflow-hidden">
                <Button
                  variant="ghost" 
                  size="sm"
                  className={`rounded-none px-2 py-1 h-8 ${viewMode === 'grid' ? 'bg-background' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-2 py-1 h-8 ${viewMode === 'list' ? 'bg-background' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Empty state for 'recommended' tab if not Pro */}
          {activeTab === 'recommended' && !isPro && (
            <div className="text-center py-10 px-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-100 dark:border-purple-800/30">
              <div className="mb-3">
                <div className="bg-primary/10 p-3 rounded-full inline-block mb-2">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Recomendações Inteligentes</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Atualize para o plano Pro e descubra artistas compatíveis com seu perfil, 
                  baseado em gêneros musicais, instrumentos e localização.
                </p>
              </div>
              <Button variant="premium" className="mt-2 bg-gradient-to-r from-primary to-purple-600">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade para Pro
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className={`grid grid-cols-1 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4`}>
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-background/50 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24 mt-2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-background/30 rounded-lg">
              {search ? "Nenhum artista ou contato encontrado para essa busca." : "Sua rede está vazia. Adicione artistas e contatos!"}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className="bg-background/50 hover:bg-background/70 transition-all cursor-pointer overflow-hidden group"
                  onClick={() => handleEditContact(contact.id)}
                >
                  <div className="h-12 bg-gradient-to-r from-primary/20 to-indigo-500/20"></div>
                  <CardHeader className="pb-2 pt-3 relative">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-background absolute -top-6 left-3 group-hover:scale-105 transition-transform shadow-md">
                        {contact.artist_name && (
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.artist_name)}&background=random`} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-primary/60 to-indigo-600/60 text-white">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-12">
                        <CardTitle className="text-base">{contact.artist_name || contact.name}</CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          {contact.contact_type && (
                            <Badge 
                              variant="outline" 
                              className={`px-2 py-0 h-5 text-xs ${getContactTypeColor(contact.contact_type)}`}
                            >
                              {contact.contact_type}
                            </Badge>
                          )}
                          {contact.occupation && <CardDescription className="text-xs">{contact.occupation}</CardDescription>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-3 flex flex-col gap-3">
                    {/* Genres */}
                    {contact.musical_genre && contact.musical_genre.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                        {contact.musical_genre.slice(0, 3).map((genre, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs px-1.5 py-0"
                          >
                            {genre}
                          </Badge>
                        ))}
                        {contact.musical_genre.length > 3 && (
                          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs px-1.5 py-0">
                            +{contact.musical_genre.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Instruments */}
                    {contact.instrument && contact.instrument.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <Music className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                        {contact.instrument.slice(0, 3).map((inst, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs px-1.5 py-0"
                          >
                            {inst}
                          </Badge>
                        ))}
                        {contact.instrument.length > 3 && (
                          <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs px-1.5 py-0">
                            +{contact.instrument.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Company/Venue */}
                    {contact.company && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="line-clamp-1">{contact.company}</span>
                      </div>
                    )}
                    
                    {/* Contact info */}
                    <div className="space-y-1 text-sm">
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <a 
                            href={`mailto:${contact.email}`} 
                            className="hover:text-primary line-clamp-1" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                      
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <a 
                            href={`tel:${contact.phone}`} 
                            className="hover:text-primary" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            {contact.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Social media platforms */}
                    {contact.contact_social_media && contact.contact_social_media.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {contact.contact_social_media.slice(0, 4).map((social: SocialMediaLink, index: number) => (
                          <a 
                            key={index} 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 bg-gradient-to-r rounded-full hover:opacity-80 transition-all"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${getPlatformColorValue(social.platform)})`,
                            }}
                            title={social.platform}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {getSocialIcon(social.platform)}
                          </a>
                        ))}
                        
                        {contact.contact_social_media.length > 4 && (
                          <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800/50 text-xs">
                            +{contact.contact_social_media.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Similar artists - only show if in Pro mode */}
                    {isPro && activeTab === 'recommended' && getSimilarContacts(contact.id).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Similar a:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {getSimilarContacts(contact.id).map((similar) => (
                            <Badge key={similar.id} variant="outline" className="text-xs" onClick={(e) => {
                              e.stopPropagation();
                              handleEditContact(similar.id);
                            }}>
                              {similar.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-background cursor-pointer"
                  onClick={() => handleEditContact(contact.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{contact.artist_name || contact.name}</div>
                      {contact.contact_type && (
                        <Badge 
                          variant="outline" 
                          className={`ml-2 px-2 py-0 h-5 text-xs ${getContactTypeColor(contact.contact_type)}`}
                        >
                          {contact.contact_type}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground truncate">
                      {contact.occupation || contact.company || 'Sem detalhes adicionais'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    {contact.contact_social_media && contact.contact_social_media.slice(0, 3).map((social: SocialMediaLink, index: number) => (
                      <a 
                        key={index} 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-muted rounded-full transition-colors"
                        title={social.platform}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getSocialIcon(social.platform)}
                      </a>
                    ))}
                    
                    {contact.musical_genre && contact.musical_genre.length > 0 && (
                      <Badge variant="outline" className="ml-1">
                        {contact.musical_genre[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <NetworkingDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        contactId={selectedContactId} 
        onSave={() => {
          setSelectedContactId(undefined);
        }}
      />
    </div>
  );
};

// Helper function to get CSS color values for gradient
const getPlatformColorValue = (platform: string): string => {
  switch (platform.toLowerCase().replace(/\s/g, '')) {
    case 'instagram':
      return '#833AB4, #C13584, #E1306C';
    case 'youtube':
    case 'youtubemusic':
      return '#FF0000, #CC0000';
    case 'twitter':
    case 'x':
      return '#1DA1F2, #0C85D0';
    case 'facebook':
      return '#4267B2, #385898';
    case 'tiktok':
      return '#000000, #333333';
    case 'spotify':
      return '#1DB954, #1AA34A';
    case 'applemusic':
      return '#FA57C1, #FC3C44';
    case 'deezer':
      return '#7848FF, #4B1ECB';
    case 'soundcloud':
      return '#FF7700, #FF3300';
    case 'amazonmusic':
      return '#00A8E1, #0077B5';
    case 'tidal':
      return '#000000, #333333';
    default:
      return '#888888, #666666';
  }
};

export default NetworkTab;
