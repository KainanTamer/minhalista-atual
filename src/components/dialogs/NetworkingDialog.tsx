
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNetworking } from '@/hooks/useNetworking';
import { PlusCircle, Trash2, Link as LinkIcon, Instagram, Youtube, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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
  const [activeTab, setActiveTab] = useState<'personal' | 'social'>('personal');
  
  // Estado para as redes sociais específicas
  const [socialMedia, setSocialMedia] = useState({
    instagram: { enabled: false, url: '' },
    facebook: { enabled: false, url: '' },
    youtube: { enabled: false, url: '' }
  });
  
  // Estado para plataformas de streaming
  const [streamingPlatforms, setStreamingPlatforms] = useState({
    spotify: { enabled: false, url: '' },
    deezer: { enabled: false, url: '' }
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
          
          // Inicializar redes sociais com valores existentes
          const socialMediaTemp = { ...socialMedia };
          const streamingTemp = { ...streamingPlatforms };
          
          if (contact.contact_social_media && contact.contact_social_media.length > 0) {
            setSocialLinks(contact.contact_social_media || []);
            
            // Preencher informações de redes sociais específicas
            contact.contact_social_media.forEach((social: SocialMediaLink) => {
              const platform = social.platform.toLowerCase();
              if (platform === 'instagram' || platform === 'facebook' || platform === 'youtube') {
                socialMediaTemp[platform as keyof typeof socialMediaTemp] = {
                  enabled: true,
                  url: social.url
                };
              }
              else if (platform === 'spotify' || platform === 'deezer') {
                streamingTemp[platform as keyof typeof streamingTemp] = {
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
        allSocialLinks.push({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          url: data.url
        });
      }
    });
    
    // Adicionar outros links personalizados
    socialLinks.forEach(link => {
      const platform = link.platform.toLowerCase();
      if (!['instagram', 'facebook', 'youtube', 'spotify', 'deezer'].includes(platform)) {
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
      contact_social_media: allSocialLinks
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
    setSocialMedia({
      instagram: { enabled: false, url: '' },
      facebook: { enabled: false, url: '' },
      youtube: { enabled: false, url: '' }
    });
    setStreamingPlatforms({
      spotify: { enabled: false, url: '' },
      deezer: { enabled: false, url: '' }
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
          onValueChange={(value) => setActiveTab(value as 'personal' | 'social')}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="social">Redes Sociais</TabsTrigger>
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
            
            {activeTab === 'social' && (
              <div className="space-y-6">
                {/* Seção de Redes Sociais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Redes Sociais</h3>
                  
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
                  </div>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Salvar redes sociais atualizadas para socialLinks
                      const updatedSocialLinks = [...socialLinks];
                      Object.entries(socialMedia).forEach(([platform, data]) => {
                        if (data.enabled && data.url) {
                          const index = updatedSocialLinks.findIndex(
                            link => link.platform.toLowerCase() === platform.toLowerCase()
                          );
                          if (index >= 0) {
                            updatedSocialLinks[index].url = data.url;
                          } else {
                            updatedSocialLinks.push({
                              platform: platform.charAt(0).toUpperCase() + platform.slice(1),
                              url: data.url
                            });
                          }
                        }
                      });
                      setSocialLinks(updatedSocialLinks);
                    }}
                  >
                    Salvar Redes Sociais
                  </Button>
                </div>
                
                <Separator />
                
                {/* Seção de Plataformas de Streaming */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Plataformas de Streaming</h3>
                  
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
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Salvar plataformas atualizadas para socialLinks
                      const updatedSocialLinks = [...socialLinks];
                      Object.entries(streamingPlatforms).forEach(([platform, data]) => {
                        if (data.enabled && data.url) {
                          const index = updatedSocialLinks.findIndex(
                            link => link.platform.toLowerCase() === platform.toLowerCase()
                          );
                          if (index >= 0) {
                            updatedSocialLinks[index].url = data.url;
                          } else {
                            updatedSocialLinks.push({
                              platform: platform.charAt(0).toUpperCase() + platform.slice(1),
                              url: data.url
                            });
                          }
                        }
                      });
                      setSocialLinks(updatedSocialLinks);
                    }}
                  >
                    Salvar Plataformas
                  </Button>
                </div>
                
                <Separator />
                
                {/* Seção de Links Personalizados */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Outros Links</h3>
                  
                  {socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {socialLinks
                        .filter(link => 
                          !['instagram', 'facebook', 'youtube', 'spotify', 'deezer']
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
                        placeholder="TikTok, SoundCloud..."
                        list="platform-suggestions"
                      />
                      <datalist id="platform-suggestions">
                        {[...socialNetworksDB, ...platformsDB]
                          .filter(platform => 
                            !['Instagram', 'Facebook', 'YouTube', 'Spotify', 'Deezer']
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
