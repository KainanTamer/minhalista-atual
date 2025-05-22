
import { NetworkingContact } from '@/hooks/useNetworking';

// Get similar contacts based on shared genres
export const getSimilarContacts = (contacts: NetworkingContact[], contactId: string): NetworkingContact[] => {
  const currentContact = contacts.find(c => c.id === contactId);
  if (!currentContact || !currentContact.musical_genre) return [];
  
  return contacts.filter(c => 
    c.id !== contactId && 
    c.musical_genre && 
    currentContact.musical_genre?.some(genre => c.musical_genre?.includes(genre))
  ).slice(0, 3);
};

// Filter contacts based on search and active tab
export const filterContacts = (
  contacts: NetworkingContact[], 
  search: string, 
  activeTab: string
): NetworkingContact[] => {
  return contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(search.toLowerCase()) || 
                          (contact.occupation && contact.occupation.toLowerCase().includes(search.toLowerCase())) ||
                          (contact.company && contact.company.toLowerCase().includes(search.toLowerCase())) ||
                          (contact.musical_genre && contact.musical_genre.some(genre => 
                            genre.toLowerCase().includes(search.toLowerCase())
                          )) ||
                          (contact.instrument && contact.instrument.some(instrument => 
                            instrument.toLowerCase().includes(search.toLowerCase())
                          ));
    
    // Apply category filter if not showing all
    if (activeTab === 'musicians') {
      return matchesSearch && (
        contact.contact_type === 'músico' || 
        contact.contact_type === 'banda' ||
        (contact.occupation && ['baixista', 'vocalista', 'baterista', 'guitarrista'].some(
          role => contact.occupation?.toLowerCase().includes(role.toLowerCase())
        ))
      );
    } else if (activeTab === 'producers') {
      return matchesSearch && (
        contact.contact_type === 'produtor' || 
        (contact.occupation && contact.occupation.toLowerCase().includes('produtor'))
      );
    } else if (activeTab === 'venues') {
      return matchesSearch && (
        contact.contact_type === 'casa de shows' ||
        ['venue', 'casa', 'teatro', 'bar', 'local'].some(
          term => contact.company?.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else if (activeTab === 'recommended') {
      // Simple recommendation logic - contacts with similar genres or instruments
      const userGenres = contact.musical_genre || [];
      const userInstruments = contact.instrument || [];
      
      return matchesSearch && contacts.some(otherContact => 
        otherContact.id !== contact.id && (
          (otherContact.musical_genre && contact.musical_genre && 
            otherContact.musical_genre.some(genre => contact.musical_genre?.includes(genre))) ||
          (otherContact.instrument && contact.instrument &&
            otherContact.instrument.some(instrument => contact.instrument?.includes(instrument)))
        )
      );
    }
    
    return matchesSearch;
  });
};
