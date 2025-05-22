
import React from 'react';
import { Instagram, Youtube, Twitter, Facebook, Music, LinkIcon, AtSign } from 'lucide-react';

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
      return <Music className="h-4 w-4" />;
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

// Function to validate streaming URLs
export const validateSocialUrl = (platform: string, url: string): boolean => {
  if (!url) return true; // Empty URLs are valid (optional field)
  
  const patterns: Record<string, RegExp> = {
    spotify: /^https:\/\/(open\.spotify\.com|spotify\.com)/i,
    youtube: /^https:\/\/(www\.)?(youtube\.com|youtu\.be)/i,
    instagram: /^https:\/\/(www\.)?instagram\.com/i,
    facebook: /^https:\/\/(www\.)?facebook\.com/i,
    twitter: /^https:\/\/(www\.)?(twitter\.com|x\.com)/i,
    tiktok: /^https:\/\/(www\.)?tiktok\.com/i,
    soundcloud: /^https:\/\/(www\.)?soundcloud\.com/i,
    applemusic: /^https:\/\/music\.apple\.com/i,
    deezer: /^https:\/\/(www\.)?deezer\.com/i,
    amazonmusic: /^https:\/\/music\.amazon\./i,
  };
  
  const key = platform.toLowerCase().replace(/\s/g, '');
  const pattern = patterns[key];
  
  return pattern ? pattern.test(url) : true; // If no pattern is defined, consider it valid
};

// Format a platform name for display
export const formatPlatformName = (platform: string): string => {
  const platformMap: Record<string, string> = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    youtubemusic: 'YouTube Music',
    twitter: 'Twitter',
    x: 'X (Twitter)',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    spotify: 'Spotify',
    applemusic: 'Apple Music',
    deezer: 'Deezer',
    soundcloud: 'SoundCloud',
    amazonmusic: 'Amazon Music',
    tidal: 'Tidal'
  };
  
  const key = platform.toLowerCase().replace(/\s/g, '');
  return platformMap[key] || platform;
};

// Get platform color for styling
export const getPlatformColor = (platform: string): string => {
  switch (platform.toLowerCase().replace(/\s/g, '')) {
    case 'instagram':
      return 'from-purple-500 to-pink-500';
    case 'youtube':
    case 'youtubemusic':
      return 'from-red-500 to-red-600';
    case 'twitter':
    case 'x':
      return 'from-blue-400 to-blue-500';
    case 'facebook':
      return 'from-blue-600 to-blue-700';
    case 'tiktok':
      return 'from-black to-gray-800';
    case 'spotify':
      return 'from-green-500 to-green-600';
    case 'applemusic':
      return 'from-pink-500 to-red-500';
    case 'deezer':
      return 'from-purple-600 to-indigo-600';
    case 'soundcloud':
      return 'from-orange-500 to-orange-600';
    case 'amazonmusic':
      return 'from-blue-800 to-blue-900';
    case 'tidal':
      return 'from-black to-gray-800';
    default:
      return 'from-gray-500 to-gray-600';
  }
};
