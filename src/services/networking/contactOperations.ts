
import { supabase } from '@/integrations/supabase/client';
import { NetworkingContact } from '@/types/networking';

export const getContact = async (id: string): Promise<NetworkingContact | null> => {
  try {
    // Get contact details
    const { data: contact, error: contactError } = await supabase
      .from('networking_contacts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (contactError) throw contactError;
    
    // Get social media links for the contact
    const { data: socialMedia, error: socialError } = await supabase
      .from('contact_social_media')
      .select('*')
      .eq('contact_id', id);
    
    if (socialError) throw socialError;
    
    return { ...contact, contact_social_media: socialMedia || [] };
  } catch (error) {
    console.error('Error fetching contact:', error);
    return null;
  }
};

export const fetchContacts = async (): Promise<NetworkingContact[]> => {
  try {
    // Get all contacts
    const { data: contactsData, error: contactsError } = await supabase
      .from('networking_contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (contactsError) throw contactsError;
    
    // For each contact, get their social media links
    const contactsWithSocial = await Promise.all(
      contactsData.map(async (contact) => {
        const { data: socialMedia, error: socialError } = await supabase
          .from('contact_social_media')
          .select('*')
          .eq('contact_id', contact.id);
        
        if (socialError) {
          console.error('Error fetching social media for contact:', socialError);
          return { ...contact, contact_social_media: [] };
        }
        
        return { ...contact, contact_social_media: socialMedia || [] };
      })
    );
    
    return contactsWithSocial || [];
  } catch (error) {
    console.error('Error fetching networking contacts:', error);
    return [];
  }
};
