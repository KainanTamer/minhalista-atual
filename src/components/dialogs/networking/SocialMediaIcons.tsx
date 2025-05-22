
import React from 'react';
import { Instagram, Youtube, Twitter, Facebook, Music, LinkIcon, Spotify, AtSign } from 'lucide-react';

export const getSocialIcon = (platform: string): React.ReactNode => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-4 w-4" />;
    case 'youtube':
    case 'youtubemusic':
    case 'youtube music':
      return <Youtube className="h-4 w-4" />;
    case 'twitter':
    case 'x':
      return <Twitter className="h-4 w-4" />;
    case 'facebook':
      return <Facebook className="h-4 w-4" />;
    case 'tiktok':
      return <AtSign className="h-4 w-4" />;
    case 'spotify':
      return <Spotify className="h-4 w-4" />;
    case 'apple music':
    case 'applemusic':
    case 'deezer':
    case 'soundcloud':  
    case 'amazonmusic':
    case 'amazon music':
    case 'tidal':
      return <Music className="h-4 w-4" />;
    default:
      return <LinkIcon className="h-4 w-4" />;
  }
};
