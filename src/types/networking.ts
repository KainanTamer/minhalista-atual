
import { SocialMediaLink } from '@/components/dialogs/networking/types';

export interface NetworkingContact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  occupation?: string;
  company?: string;
  notes?: string;
  contact_social_media?: SocialMediaLink[];
  created_at: string;
  updated_at: string;
  contact_type?: string;
  musical_genre?: string[];
  instrument?: string[];
  artist_name?: string;
  className?: string; // Used for animations
}
