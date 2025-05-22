
import React from 'react';
import { Instagram, Youtube, Twitter, Facebook, Music, LinkIcon } from 'lucide-react';

export const getSocialIcon = (platform: string): React.ReactNode => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'youtube':
      return <Youtube className="h-4 w-4" />;
    case 'twitter':
      return <Twitter className="h-4 w-4" />;
    case 'facebook':
      return <Facebook className="h-4 w-4" />;
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
