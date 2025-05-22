
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tag, MapPin, Mail, Phone, Music, Sparkles } from 'lucide-react';
import { NetworkingContact } from '@/hooks/useNetworking';
import { SocialMediaLink } from '@/components/dialogs/networking/types';
import { getSocialIcon, getPlatformColor, formatPlatformName } from '@/components/dialogs/networking/SocialMediaIcons';

interface ContactCardProps {
  contact: NetworkingContact;
  onEdit: (id: string) => void;
  similarContacts?: NetworkingContact[];
  isPro?: boolean;
  activeTab?: string;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onEdit, 
  similarContacts = [], 
  isPro = false,
  activeTab = 'all'
}) => {
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
  
  return (
    <Card 
      key={contact.id} 
      className="bg-background/50 hover:bg-background/70 transition-all cursor-pointer overflow-hidden group"
      onClick={() => onEdit(contact.id)}
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
        {isPro && activeTab === 'recommended' && similarContacts.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Similar a:
            </p>
            <div className="flex flex-wrap gap-1">
              {similarContacts.map((similar) => (
                <Badge key={similar.id} variant="outline" className="text-xs" onClick={(e) => {
                  e.stopPropagation();
                  onEdit(similar.id);
                }}>
                  {similar.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactCard;
