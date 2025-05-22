
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NetworkingContact } from '@/hooks/useNetworking';
import { SocialMediaLink } from '@/components/dialogs/networking/types';
import { getSocialIcon } from '@/components/dialogs/networking/SocialMediaIcons';

interface ContactListProps {
  contact: NetworkingContact;
  onEdit: (id: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contact, onEdit }) => {
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

  return (
    <div
      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-background cursor-pointer"
      onClick={() => onEdit(contact.id)}
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-primary/20 text-primary">
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium">{contact.artist_name || contact.name}</div>
          {contact.contact_type && (
            <Badge 
              variant="outline" 
              className={`ml-2 px-2 py-0 h-5 text-xs ${getContactTypeColor(contact.contact_type)}`}
            >
              {contact.contact_type}
            </Badge>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground truncate">
          {contact.occupation || contact.company || 'Sem detalhes adicionais'}
        </div>
      </div>
      
      <div className="flex items-center gap-1.5">
        {contact.contact_social_media && contact.contact_social_media.slice(0, 3).map((social: SocialMediaLink, index: number) => (
          <a 
            key={index} 
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-muted rounded-full transition-colors"
            title={social.platform}
            onClick={(e) => e.stopPropagation()}
          >
            {getSocialIcon(social.platform)}
          </a>
        ))}
        
        {contact.musical_genre && contact.musical_genre.length > 0 && (
          <Badge variant="outline" className="ml-1">
            {contact.musical_genre[0]}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ContactList;
