
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
}
