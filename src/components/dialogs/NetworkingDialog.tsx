
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNetworking } from '@/hooks/useNetworking';
import { DialogTabs } from './networking/DialogTabs';
import { PersonalInfoTab } from './networking/PersonalInfoTab';
import { MusicInfoTab } from './networking/MusicInfoTab';
import { SocialMediaTab } from './networking/SocialMediaTab';
import { getSocialIcon } from './networking/SocialMediaIcons';
import { platformsDB, socialNetworksDB, musicInstrumentsDB, musicGenresDB, contactTypesDB } from './networking/constants';

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
  
  // Campos para músicos
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
        
        <DialogTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'personal' && (
            <PersonalInfoTab 
              name={name} 
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              occupation={occupation}
              setOccupation={setOccupation}
              company={company}
              setCompany={setCompany}
              notes={notes}
              setNotes={setNotes}
              contactType={contactType}
              setContactType={setContactType}
              contactTypesDB={contactTypesDB}
            />
          )}
          
          {activeTab === 'music' && (
            <MusicInfoTab 
              instruments={instruments}
              setInstruments={setInstruments}
              newInstrument={newInstrument}
              setNewInstrument={setNewInstrument}
              addInstrument={addInstrument}
              removeInstrument={removeInstrument}
              genres={genres}
              setGenres={setGenres}
              newGenre={newGenre}
              setNewGenre={setNewGenre}
              addGenre={addGenre}
              removeGenre={removeGenre}
              musicInstrumentsDB={musicInstrumentsDB}
              musicGenresDB={musicGenresDB}
            />
          )}
          
          {activeTab === 'social' && (
            <SocialMediaTab 
              socialMedia={socialMedia}
              handleSocialMediaChange={handleSocialMediaChange}
              streamingPlatforms={streamingPlatforms}
              handleStreamingChange={handleStreamingChange}
              socialLinks={socialLinks}
              newPlatform={newPlatform}
              setNewPlatform={setNewPlatform}
              newUrl={newUrl}
              setNewUrl={setNewUrl}
              addSocialLink={addSocialLink}
              removeSocialLink={removeSocialLink}
              getSocialIcon={getSocialIcon}
              socialNetworksDB={socialNetworksDB}
              platformsDB={platformsDB}
            />
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
      </DialogContent>
    </Dialog>
  );
};

export default NetworkingDialog;
