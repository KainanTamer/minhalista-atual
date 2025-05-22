
export interface SocialMediaLink {
  platform: string;
  url: string;
}

export interface SocialMediaState {
  [key: string]: {
    enabled: boolean;
    url: string;
  };
}

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  occupation: string;
  company: string;
  notes: string;
  contactType: string;
  instruments: string[];
  genres: string[];
  socialLinks: SocialMediaLink[];
  socialMedia: SocialMediaState;
  streamingPlatforms: SocialMediaState;
  // Campos adicionais para artistas
  artisticName?: string;
  mainGenre?: string;
  profilePicture?: string;
}

export type SocialNetworkType = 'social' | 'streaming' | 'other';

export interface SocialNetwork {
  name: string;
  type: SocialNetworkType;
  icon: string;
  placeholder: string;
}
