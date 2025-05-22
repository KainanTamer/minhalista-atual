
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
    
    // Parse musician-specific fields from notes if they exist
    let enrichedContact: NetworkingContact = { 
      ...contact, 
      contact_type: undefined,
      musical_genre: undefined,
      instrument: undefined
    };
    
    if (contact.notes) {
      try {
        const parsedNotes = JSON.parse(contact.notes);
        if (parsedNotes.contact_type) enrichedContact.contact_type = parsedNotes.contact_type;
        if (parsedNotes.musical_genre) enrichedContact.musical_genre = parsedNotes.musical_genre;
        if (parsedNotes.instrument) enrichedContact.instrument = parsedNotes.instrument;
      } catch (e) {
        // If notes is not valid JSON, just use it as-is
        console.log("Notes is not in JSON format, using as plain text");
      }
    }
    
    return { ...enrichedContact, contact_social_media: socialMedia || [] };
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
    
    // For each contact, get their social media links and parse musician fields
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
        
        // Parse musician-specific fields from notes if they exist
        let enrichedContact: NetworkingContact = { 
          ...contact, 
          contact_type: undefined,
          musical_genre: undefined,
          instrument: undefined
        };
        
        if (contact.notes) {
          try {
            const parsedNotes = JSON.parse(contact.notes);
            if (parsedNotes.contact_type) enrichedContact.contact_type = parsedNotes.contact_type;
            if (parsedNotes.musical_genre) enrichedContact.musical_genre = parsedNotes.musical_genre;
            if (parsedNotes.instrument) enrichedContact.instrument = parsedNotes.instrument;
          } catch (e) {
            // If notes is not valid JSON, just use it as-is
          }
        }
        
        return { ...enrichedContact, contact_social_media: socialMedia || [] };
      })
    );
    
    return contactsWithSocial || [];
  } catch (error) {
    console.error('Error fetching networking contacts:', error);
    return [];
  }
};
