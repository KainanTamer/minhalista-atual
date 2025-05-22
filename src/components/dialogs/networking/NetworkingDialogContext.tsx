
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNetworking } from '@/hooks/useNetworking';
import { SocialMediaLink, SocialMediaState, ContactFormState } from './types';

interface NetworkingDialogContextProps {
  // Form state
  formState: ContactFormState;
  // Form state setters
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setOccupation: (occupation: string) => void;
  setCompany: (company: string) => void;
  setNotes: (notes: string) => void;
  setContactType: (contactType: string) => void;
  
  // Tab management
  activeTab: 'personal' | 'social' | 'music';
  setActiveTab: (tab: 'personal' | 'social' | 'music') => void;
  
  // Instruments management
  newInstrument: string;
  setNewInstrument: (instrument: string) => void;
  addInstrument: () => void;
  removeInstrument: (instrument: string) => void;
  setInstruments: (instruments: string[]) => void;
  
  // Genres management
  newGenre: string;
  setNewGenre: (genre: string) => void;
  addGenre: () => void;
  removeGenre: (genre: string) => void;
  setGenres: (genres: string[]) => void;
  
  // Social media management
  newPlatform: string;
  setNewPlatform: (platform: string) => void;
  newUrl: string;
  setNewUrl: (url: string) => void;
  addSocialLink: () => void;
  removeSocialLink: (index: number) => void;
  handleSocialMediaChange: (platform: string, field: 'enabled' | 'url', value: boolean | string) => void;
  handleStreamingChange: (platform: string, field: 'enabled' | 'url', value: boolean | string) => void;
  
  // Dialog state
  isEditing: boolean;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  
  // Dialog actions
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

const initialSocialMedia: SocialMediaState = {
  instagram: { enabled: false, url: '' },
  facebook: { enabled: false, url: '' },
  youtube: { enabled: false, url: '' },
  tiktok: { enabled: false, url: '' },
  twitter: { enabled: false, url: '' }
};

const initialStreamingPlatforms: SocialMediaState = {
  spotify: { enabled: false, url: '' },
  deezer: { enabled: false, url: '' },
  appleMusic: { enabled: false, url: '' },
  soundcloud: { enabled: false, url: '' },
  amazonMusic: { enabled: false, url: '' },
  youtubeMusic: { enabled: false, url: '' }
};

const initialFormState: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  occupation: '',
  company: '',
  notes: '',
  contactType: 'músico',
  instruments: [],
  genres: [],
  socialLinks: [],
  socialMedia: initialSocialMedia,
  streamingPlatforms: initialStreamingPlatforms
};

const NetworkingDialogContext = createContext<NetworkingDialogContextProps | undefined>(undefined);

export const NetworkingDialogProvider: React.FC<{
  children: React.ReactNode;
  contactId?: string;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}> = ({ children, contactId, onOpenChange, onSave }) => {
  const { addContact, updateContact, getContact } = useNetworking();
  
  // Form state
  const [name, setName] = useState(initialFormState.name);
  const [email, setEmail] = useState(initialFormState.email);
  const [phone, setPhone] = useState(initialFormState.phone);
  const [occupation, setOccupation] = useState(initialFormState.occupation);
  const [company, setCompany] = useState(initialFormState.company);
  const [notes, setNotes] = useState(initialFormState.notes);
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(initialFormState.socialLinks);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'social' | 'music'>('personal');
  
  // Fields for musicians
  const [contactType, setContactType] = useState<string>(initialFormState.contactType);
  const [instruments, setInstruments] = useState<string[]>(initialFormState.instruments);
  const [genres, setGenres] = useState<string[]>(initialFormState.genres);
  const [newInstrument, setNewInstrument] = useState('');
  const [newGenre, setNewGenre] = useState('');
  
  // State for specific social networks
  const [socialMedia, setSocialMedia] = useState(initialFormState.socialMedia);
  
  // State for streaming platforms
  const [streamingPlatforms, setStreamingPlatforms] = useState(initialFormState.streamingPlatforms);
  
  const formState: ContactFormState = {
    name,
    email,
    phone,
    occupation,
    company,
    notes,
    contactType,
    instruments,
    genres,
    socialLinks,
    socialMedia,
    streamingPlatforms
  };
  
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
          
          // Load musician-specific fields
          setContactType(contact.contact_type || 'músico');
          setInstruments(contact.instrument || []);
          setGenres(contact.musical_genre || []);
          
          // Initialize social networks with existing values
          const socialMediaTemp = { ...initialSocialMedia };
          const streamingTemp = { ...initialStreamingPlatforms };
          
          if (contact.contact_social_media && contact.contact_social_media.length > 0) {
            setSocialLinks(contact.contact_social_media || []);
            
            // Fill specific social network information
            contact.contact_social_media.forEach((social: SocialMediaLink) => {
              const platform = social.platform.toLowerCase();
              if (platform === 'instagram' || platform === 'facebook' || 
                  platform === 'youtube' || platform === 'tiktok' ||
                  platform === 'twitter') {
                socialMediaTemp[platform as keyof typeof socialMediaTemp] = {
                  enabled: true,
                  url: social.url
                };
              }
              else if (platform === 'spotify' || platform === 'deezer' || 
                       platform === 'applemusic' || platform === 'soundcloud' || 
                       platform === 'amazonmusic' || platform === 'youtubemusic') {
                const key = platform === 'applemusic' ? 'appleMusic' : 
                           platform === 'amazonmusic' ? 'amazonMusic' :
                           platform === 'youtubemusic' ? 'youtubeMusic' : platform;
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
    
    loadContact();
  }, [contactId, getContact]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Prepare social network links combining specific and generic ones
    const allSocialLinks: SocialMediaLink[] = [];
    
    // Add specific social networks
    Object.entries(socialMedia).forEach(([platform, data]) => {
      if (data.enabled && data.url) {
        allSocialLinks.push({
          platform: platform.charAt(0).toUpperCase() + platform.slice(1),
          url: data.url
        });
      }
    });
    
    // Add streaming platforms
    Object.entries(streamingPlatforms).forEach(([platform, data]) => {
      if (data.enabled && data.url) {
        const platformName = platform === 'appleMusic' ? 'AppleMusic' : 
                             platform === 'amazonMusic' ? 'AmazonMusic' :
                             platform === 'youtubeMusic' ? 'YouTubeMusic' :
                             platform.charAt(0).toUpperCase() + platform.slice(1);
        allSocialLinks.push({
          platform: platformName,
          url: data.url
        });
      }
    });
    
    // Add other custom links
    socialLinks.forEach(link => {
      const platform = link.platform.toLowerCase();
      if (!['instagram', 'facebook', 'youtube', 'tiktok', 'twitter', 
            'spotify', 'deezer', 'applemusic', 'soundcloud', 
            'amazonmusic', 'youtubemusic'].includes(platform)) {
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
      // Musician-specific fields
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
    setSocialMedia(initialSocialMedia);
    setStreamingPlatforms(initialStreamingPlatforms);
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
  
  const handleSocialMediaChange = (platform: string, field: 'enabled' | 'url', value: boolean | string) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const handleStreamingChange = (platform: string, field: 'enabled' | 'url', value: boolean | string) => {
    setStreamingPlatforms(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  return (
    <NetworkingDialogContext.Provider
      value={{
        formState,
        setName,
        setEmail,
        setPhone,
        setOccupation,
        setCompany,
        setNotes,
        setContactType,
        activeTab,
        setActiveTab,
        newInstrument,
        setNewInstrument,
        addInstrument,
        removeInstrument,
        setInstruments,
        newGenre,
        setNewGenre,
        addGenre,
        removeGenre,
        setGenres,
        newPlatform,
        setNewPlatform,
        newUrl,
        setNewUrl,
        addSocialLink,
        removeSocialLink,
        handleSocialMediaChange,
        handleStreamingChange,
        isEditing,
        isSaving,
        setIsSaving,
        handleSubmit,
        resetForm
      }}
    >
      {children}
    </NetworkingDialogContext.Provider>
  );
};

export const useNetworkingDialog = () => {
  const context = useContext(NetworkingDialogContext);
  if (context === undefined) {
    throw new Error('useNetworkingDialog must be used within a NetworkingDialogProvider');
  }
  return context;
};
