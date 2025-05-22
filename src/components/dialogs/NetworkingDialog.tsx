
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNetworking } from '@/hooks/useNetworking';
import { PlusCircle, Trash2, Link as LinkIcon, Instagram, Youtube, Music, DollarSign, Mic, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface SocialMediaLink {
  platform: string;
  url: string;
}

interface NetworkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  contactId?: string;
}

const NetworkingDialog: React.FC<NetworkingDialogProps> = ({ open, onOpenChange, onSave, contactId }) => {
  const { addContact, updateContact, getContact } = useNetworking();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'social' | 'music'>('personal');
  
  // Novos campos para músicos
  const [contactType, setContactType] = useState<string>('músico');
  const [instruments, setInstruments] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [newInstrument, setNewInstrument] = useState('');
  const [newGenre, setNewGenre] = useState('');
  
  // Estado para as redes sociais específicas
  const [socialMedia, setSocialMedia] = useState({
    instagram: { enabled: false, url: '' },
    facebook: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' },
    tiktok: { enabled: false, url: '' }
  });
  
  // Estado para plataformas de streaming
  const [streamingPlatforms, setStreamingPlatforms] = useState({
    spotify: { enabled: false, url: '' },
    deezer: { enabled: false, url: '' },
    appleMusic: { enabled: false, url: '' },
    soundcloud: { enabled: false, url: '' },
    amazonMusic: { enabled: false, url: '' }
  });
  
  useEffect(() => {
    const loadContact = async () => {
      if (contactId) {
        const contact = await getContact(contactId);
        if (contact) {
          setName(contact.name || '');
          setEmail(contact.email || '');
          setPhone(contact.phone || '');
          setOccupation(contact.occupation || '');
          setCompany(contact.company || '');
          setNotes(contact.notes || '');
          
          // Carregar campos específicos para músicos
          setContactType(contact.contact_type || 'músico');
          setInstruments(contact.instrument || []);
          setGenres(contact.musical_genre || []);
          
          // Inicializar redes sociais com valores existentes
          const socialMediaTemp = { ...socialMedia };
          const streamingTemp = { ...streamingPlatforms };
          
          if (contact.contact_social_media && contact.contact_social_media.length > 0) {
            setSocialLinks(contact.contact_social_media || []);
            
            // Preencher informações de redes sociais específicas
            contact.contact_social_media.forEach((social: SocialMediaLink) => {
              const platform = social.platform.toLowerCase();
              if (platform === 'instagram' || platform === 'facebook' || platform === 'youtube' || platform === 'tiktok') {
                socialMediaTemp[platform as keyof typeof socialMediaTemp] = {
                  enabled: true,
                  url: social.url
                };
              }
              else if (platform === 'spotify' || platform === 'deezer' || platform === 'applemusic' || platform === 'soundcloud' || platform === 'amazonmusic') {
                const key = platform === 'applemusic' ? 'appleMusic' : 
                           platform === 'amazonmusic' ? 'amazonMusic' : platform;
                streamingTemp[key as keyof typeof streamingTemp] = {
                  enabled: true,
                  url: social.url
                };
              }
            });
            
            setSocialMedia(socialMediaTemp);
            setStreamingPlatforms(streamingTemp);
          }
          
          setIsEditing(true);
        }
      } else {
        resetForm();
        setIsEditing(false);
      }
    };
    
    if (open) {
      loadContact();
    }
  }, [contactId, open, getContact]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Preparar links de redes sociais combinando as específicas e as genéricas
    const allSocialLinks: SocialMediaLink[] = [];
    
    // Adicionar redes sociais especificas
    Object.entries(socialMedia).forEach(([platform, data]) => {
      if (data.enabled && data.url) {
        allSocialLinks.push({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          url: data.url
        });
      }
    });
    
    // Adicionar plataformas de streaming
    Object.entries(streamingPlatforms).forEach(([platform, data]) => {
      if (data.enabled && data.url) {
        const platformName = platform === 'appleMusic' ? 'AppleMusic' : 
                             platform === 'amazonMusic' ? 'AmazonMusic' : 
                             platform.charAt(0).toUpperCase() + platform.slice(1);
        allSocialLinks.push({
          platform: platformName,
          url: data.url
        });
      }
    });
    
    // Adicionar outros links personalizados
    socialLinks.forEach(link => {
      const platform = link.platform.toLowerCase();
      if (!['instagram', 'facebook', 'youtube', 'tiktok', 'spotify', 'deezer', 'applemusic', 'soundcloud', 'amazonmusic'].includes(platform)) {
        allSocialLinks.push(link);
      }
    });
    
    const contactData = {
      name,
      email,
      phone,
      occupation,
      company,
      notes,
      contact_social_media: allSocialLinks,
      // Campos específicos para músicos
      contact_type: contactType,
      musical_genre: genres,
      instrument: instruments
    };
    
    try {
      if (isEditing && contactId) {
        await updateContact(contactId, contactData);
      } else {
        await addContact(contactData);
      }
      
      if (onSave) onSave();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setOccupation('');
    setCompany('');
    setNotes('');
    setSocialLinks([]);
    setNewPlatform('');
    setNewUrl('');
    setContactType('músico');
    setInstruments([]);
    setGenres([]);
    setNewInstrument('');
    setNewGenre('');
    setSocialMedia({
      instagram: { enabled: false, url: '' },
      facebook: { enabled: false, url: '' },
      youtube: { enabled: false, url: '' },
      tiktok: { enabled: false, url: '' }
    });
    setStreamingPlatforms({
      spotify: { enabled: false, url: '' },
      deezer: { enabled: false, url: '' },
      appleMusic: { enabled: false, url: '' },
      soundcloud: { enabled: false, url: '' },
      amazonMusic: { enabled: false, url: '' }
    });
    setActiveTab('personal');
  };
  
  const addSocialLink = () => {
    if (newPlatform && newUrl) {
      setSocialLinks([...socialLinks, { platform: newPlatform, url: newUrl }]);
      setNewPlatform('');
      setNewUrl('');
    }
  };
  
  const addInstrument = () => {
    if (newInstrument && !instruments.includes(newInstrument)) {
      setInstruments([...instruments, newInstrument]);
      setNewInstrument('');
    }
  };
  
  const removeInstrument = (instrument: string) => {
    setInstruments(instruments.filter(i => i !== instrument));
  };
  
  const addGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre]);
      setNewGenre('');
    }
  };
  
  const removeGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };
  
  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'spotify':
      case 'apple music':
      case 'applemusic':
      case 'deezer':
      case 'soundcloud':  
      case 'amazonmusic':
      case 'amazon music':
        return <Music className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };
  
  const handleSocialMediaChange = (platform: keyof typeof socialMedia, field: 'enabled' | 'url', value: boolean | string) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };
  
  const handleStreamingChange = (platform: keyof typeof streamingPlatforms, field: 'enabled' | 'url', value: boolean | string) => {
    setStreamingPlatforms(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };
  
  // Sugestões para campos de formulário
  const platformsDB = [
    'Spotify', 
    'Apple Music', 
    'YouTube Music', 
    'Amazon Music', 
    'Tidal', 
    'Deezer', 
    'SoundCloud'
  ];
  
  const socialNetworksDB = [
    'Instagram',
    'YouTube',
    'TikTok',
    'Facebook',
    'Twitter',
    'LinkedIn',
    'Bandcamp'
  ];
  
  const musicInstrumentsDB = [
    'Violão', 'Guitarra', 'Baixo', 'Bateria', 'Teclado', 'Piano', 'Violino',
    'Saxofone', 'Flauta', 'Trompete', 'Violoncelo', 'Percussão', 'Voz'
  ];
  
  const musicGenresDB = [
    'Rock', 'Pop', 'Jazz', 'Blues', 'Samba', 'MPB', 'Funk', 'Sertanejo',
    'Eletrônica', 'Hip Hop', 'R&B', 'Reggae', 'Metal', 'Forró', 'Clássica'
  ];
  
  const contactTypesDB = [
    'Músico', 'Banda', 'Produtor', 'DJ', 'Casa de Shows', 'Estúdio', 'Empresário',
    'Técnico de Som', 'Luthier', 'Loja de Instrumentos'
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Contato' : 'Adicionar Novo Contato'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do contato em sua rede.' 
              : 'Adicione um novo contato à sua rede de networking.'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs
          defaultValue="personal"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'personal' | 'social' | 'music')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="personal">Informações</TabsTrigger>
            <TabsTrigger value="music">Música</TabsTrigger>
            <TabsTrigger value="social">Redes</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'personal' && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-background"
                    autoFocus
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactType">Tipo de Contato</Label>
                  <Select
                    value={contactType}
                    onValueChange={setContactType}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Selecione o tipo de contato" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactTypesDB.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="occupation">Ocupação</Label>
                    <Input
                      id="occupation"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="bg-background"
                      placeholder="Baixista, Produtor, DJ..."
                      list="occupation-suggestions"
                    />
                    <datalist id="occupation-suggestions">
                      <option value="Vocalista" />
                      <option value="Guitarrista" />
                      <option value="Baixista" />
                      <option value="Baterista" />
                      <option value="Produtor Musical" />
                      <option value="DJ" />
                      <option value="Tecladista" />
                      <option value="Violonista" />
                      <option value="Empresário" />
                    </datalist>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="company">Empresa/Banda</Label>
                    <Input
                      id="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="bg-background"
                      placeholder="Nome da banda, empresa, local..."
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-background resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'music' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Instrumentos</h3>
                  </div>
                  
                  {instruments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {instruments.map((instrument, index) => (
                        <Badge key={index} variant="outline" className="pl-2 flex items-center gap-1 bg-background/80">
                          {instrument}
                          <Button
                            type="button"
                            variant="ghost" 
                            size="sm"
                            className="h-5 w-5 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                            onClick={() => removeInstrument(instrument)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-end gap-2">
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="newInstrument">Adicionar Instrumento</Label>
                      <Input
                        id="newInstrument"
                        value={newInstrument}
                        onChange={(e) => setNewInstrument(e.target.value)}
                        className="bg-background"
                        placeholder="Digite o instrumento..."
                        list="instruments-suggestions"
                      />
                      <datalist id="instruments-suggestions">
                        {musicInstrumentsDB.map((instrument, idx) => (
                          <option key={idx} value={instrument} />
                        ))}
                      </datalist>
                    </div>
                    
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={addInstrument}
                      disabled={!newInstrument}
                      className="mb-[1px]"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span className="sr-only">Adicionar</span>
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Gêneros Musicais</h3>
                  </div>
                  
                  {genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {genres.map((genre, index) => (
                        <Badge key={index} variant="outline" className="pl-2 flex items-center gap-1 bg-background/80">
                          {genre}
                          <Button
                            type="button"
                            variant="ghost" 
                            size="sm"
                            className="h-5 w-5 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                            onClick={() => removeGenre(genre)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-end gap-2">
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="newGenre">Adicionar Gênero</Label>
                      <Input
                        id="newGenre"
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        className="bg-background"
                        placeholder="Digite o gênero musical..."
                        list="genres-suggestions"
                      />
                      <datalist id="genres-suggestions">
                        {musicGenresDB.map((genre, idx) => (
                          <option key={idx} value={genre} />
                        ))}
                      </datalist>
                    </div>
                    
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={addGenre}
                      disabled={!newGenre}
                      className="mb-[1px]"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span className="sr-only">Adicionar</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'social' && (
              <div className="space-y-6">
                {/* Seção de Redes Sociais */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Redes Sociais</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Instagram */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="instagram" 
                          checked={socialMedia.instagram.enabled}
                          onCheckedChange={(checked) => 
                            handleSocialMediaChange('instagram', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="instagram" className="font-medium cursor-pointer">
                          Instagram
                        </Label>
                      </div>
                      {socialMedia.instagram.enabled && (
                        <Input
                          value={socialMedia.instagram.url}
                          onChange={(e) => handleSocialMediaChange('instagram', 'url', e.target.value)}
                          placeholder="https://instagram.com/usuario"
                          className="flex-1"
                        />
                      )}
                    </div>
                    
                    {/* Facebook */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="facebook" 
                          checked={socialMedia.facebook.enabled}
                          onCheckedChange={(checked) => 
                            handleSocialMediaChange('facebook', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="facebook" className="font-medium cursor-pointer">
                          Facebook
                        </Label>
                      </div>
                      {socialMedia.facebook.enabled && (
                        <Input
                          value={socialMedia.facebook.url}
                          onChange={(e) => handleSocialMediaChange('facebook', 'url', e.target.value)}
                          placeholder="https://facebook.com/pagina"
                          className="flex-1"
                        />
                      )}
                    </div>
                    
                    {/* YouTube */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="youtube" 
                          checked={socialMedia.youtube.enabled}
                          onCheckedChange={(checked) => 
                            handleSocialMediaChange('youtube', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="youtube" className="font-medium cursor-pointer">
                          YouTube
                        </Label>
                      </div>
                      {socialMedia.youtube.enabled && (
                        <Input
                          value={socialMedia.youtube.url}
                          onChange={(e) => handleSocialMediaChange('youtube', 'url', e.target.value)}
                          placeholder="https://youtube.com/canal"
                          className="flex-1"
                        />
                      )}
                    </div>
                    
                    {/* TikTok */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="tiktok" 
                          checked={socialMedia.tiktok.enabled}
                          onCheckedChange={(checked) => 
                            handleSocialMediaChange('tiktok', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="tiktok" className="font-medium cursor-pointer">
                          TikTok
                        </Label>
                      </div>
                      {socialMedia.tiktok.enabled && (
                        <Input
                          value={socialMedia.tiktok.url}
                          onChange={(e) => handleSocialMediaChange('tiktok', 'url', e.target.value)}
                          placeholder="https://tiktok.com/@usuario"
                          className="flex-1"
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Seção de Plataformas de Streaming */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Plataformas de Streaming</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Spotify */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="spotify" 
                          checked={streamingPlatforms.spotify.enabled}
                          onCheckedChange={(checked) => 
                            handleStreamingChange('spotify', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="spotify" className="font-medium cursor-pointer">
                          Spotify
                        </Label>
                      </div>
                      {streamingPlatforms.spotify.enabled && (
                        <Input
                          value={streamingPlatforms.spotify.url}
                          onChange={(e) => handleStreamingChange('spotify', 'url', e.target.value)}
                          placeholder="https://open.spotify.com/artist/..."
                          className="flex-1"
                        />
                      )}
                    </div>
                    
                    {/* Apple Music */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="appleMusic" 
                          checked={streamingPlatforms.appleMusic.enabled}
                          onCheckedChange={(checked) => 
                            handleStreamingChange('appleMusic', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="appleMusic" className="font-medium cursor-pointer">
                          Apple Music
                        </Label>
                      </div>
                      {streamingPlatforms.appleMusic.enabled && (
                        <Input
                          value={streamingPlatforms.appleMusic.url}
                          onChange={(e) => handleStreamingChange('appleMusic', 'url', e.target.value)}
                          placeholder="https://music.apple.com/artist/..."
                          className="flex-1"
                        />
                      )}
                    </div>
                    
                    {/* Deezer */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="deezer" 
                          checked={streamingPlatforms.deezer.enabled}
                          onCheckedChange={(checked) => 
                            handleStreamingChange('deezer', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="deezer" className="font-medium cursor-pointer">
                          Deezer
                        </Label>
                      </div>
                      {streamingPlatforms.deezer.enabled && (
                        <Input
                          value={streamingPlatforms.deezer.url}
                          onChange={(e) => handleStreamingChange('deezer', 'url', e.target.value)}
                          placeholder="https://www.deezer.com/artist/..."
                          className="flex-1"
                        />
                      )}
                    </div>
                    
                    {/* SoundCloud */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="soundcloud" 
                          checked={streamingPlatforms.soundcloud.enabled}
                          onCheckedChange={(checked) => 
                            handleStreamingChange('soundcloud', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="soundcloud" className="font-medium cursor-pointer">
                          SoundCloud
                        </Label>
                      </div>
                      {streamingPlatforms.soundcloud.enabled && (
                        <Input
                          value={streamingPlatforms.soundcloud.url}
                          onChange={(e) => handleStreamingChange('soundcloud', 'url', e.target.value)}
                          placeholder="https://soundcloud.com/..."
                          className="flex-1"
                        />
                      )}
                    </div>
                    
                    {/* Amazon Music */}
                    <div className="flex items-start space-x-3">
                      <div className="flex h-5 items-center space-x-2">
                        <Checkbox 
                          id="amazonMusic" 
                          checked={streamingPlatforms.amazonMusic.enabled}
                          onCheckedChange={(checked) => 
                            handleStreamingChange('amazonMusic', 'enabled', checked === true)
                          }
                        />
                        <Label htmlFor="amazonMusic" className="font-medium cursor-pointer">
                          Amazon Music
                        </Label>
                      </div>
                      {streamingPlatforms.amazonMusic.enabled && (
                        <Input
                          value={streamingPlatforms.amazonMusic.url}
                          onChange={(e) => handleStreamingChange('amazonMusic', 'url', e.target.value)}
                          placeholder="https://music.amazon.com/artists/..."
                          className="flex-1"
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Seção de Links Personalizados */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Outros Links</h3>
                  </div>
                  
                  {socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {socialLinks
                        .filter(link => 
                          !['instagram', 'facebook', 'youtube', 'tiktok', 'spotify', 'deezer', 'applemusic', 'soundcloud', 'amazonmusic']
                            .includes(link.platform.toLowerCase())
                        )
                        .map((link, index) => (
                          <Badge key={index} variant="outline" className="pl-2 flex items-center gap-1 bg-background/80">
                            {getSocialIcon(link.platform)}
                            <span className="max-w-[150px] truncate">{link.platform}</span>
                            <Button
                              type="button"
                              variant="ghost" 
                              size="sm"
                              className="h-5 w-5 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                              onClick={() => removeSocialLink(index)}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Remover</span>
                            </Button>
                          </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-end gap-2">
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="socialPlatform">Plataforma</Label>
                      <Input
                        id="socialPlatform"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        className="bg-background"
                        placeholder="Bandcamp, SoundBetter..."
                        list="platform-suggestions"
                      />
                      <datalist id="platform-suggestions">
                        {[...socialNetworksDB, ...platformsDB]
                          .filter(platform => 
                            !['Instagram', 'Facebook', 'YouTube', 'TikTok', 'Spotify', 'Deezer', 'Apple Music', 'SoundCloud', 'Amazon Music']
                              .includes(platform)
                          )
                          .map((platform, idx) => (
                            <option key={idx} value={platform} />
                        ))}
                      </datalist>
                    </div>
                    
                    <div className="grid gap-2 flex-1">
                      <Label htmlFor="socialUrl">URL</Label>
                      <Input
                        id="socialUrl"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="bg-background"
                        placeholder="https://..."
                      />
                    </div>
                    
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={addSocialLink}
                      disabled={!newPlatform || !newUrl}
                      className="mb-[1px]"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span className="sr-only">Adicionar</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Adicionar Contato'}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkingDialog;
