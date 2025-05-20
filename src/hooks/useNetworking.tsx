import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SocialMediaLink } from '@/components/dialogs/NetworkingDialog';

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
}

export function useNetworking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: contacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['networking-contacts'],
    queryFn: async () => {
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
    },
    staleTime: 15000, // data stays fresh for 15 seconds
  });

  const getContact = async (id: string) => {
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
  
  const addContact = useMutation({
    mutationFn: async (contactData: Omit<NetworkingContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { contact_social_media, ...contactFields } = contactData;
      
      // Create optimistic contact for immediate UI update
      const tempId = `temp-${Date.now()}`;
      const optimisticContact = {
        id: tempId,
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...contactFields,
        contact_social_media: contact_social_media || []
      };
      
      // Add the optimistic contact to the cache
      queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
        return [optimisticContact, ...(oldData || [])];
      });
      
      // Insert the contact
      const { data: newContact, error: contactError } = await supabase
        .from('networking_contacts')
        .insert([{
          ...contactFields,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
      
      if (contactError) throw contactError;
      
      // Insert social media links if any
      if (contact_social_media && contact_social_media.length > 0) {
        const socialLinksWithContactId = contact_social_media.map(link => ({
          ...link,
          contact_id: newContact.id
        }));
        
        const { error: socialError } = await supabase
          .from('contact_social_media')
          .insert(socialLinksWithContactId);
        
        if (socialError) throw socialError;
      }
      
      // Fetch the created contact with its social media links
      const completeContact = await getContact(newContact.id);
      return completeContact;
    },
    onSuccess: (newContact) => {
      if (newContact) {
        // Update the query data with the real contact (replacing the temp one)
        queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
          return oldData?.map(contact => 
            contact.id.startsWith('temp-') ? newContact : contact
          ) || [];
        });
        
        toast({
          title: "Contato adicionado",
          description: "O contato foi adicionado à sua rede."
        });
      }
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
    },
    onError: (error) => {
      console.error('Error adding contact:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o contato.",
        variant: "destructive"
      });
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
    }
  });

  const updateContact = useMutation({
    mutationFn: async (variables: { contactId: string; contactData: Partial<NetworkingContact> }) => {
      const { contactId, contactData } = variables;
      const { contact_social_media, ...contactFields } = contactData;
      
      // Save the current state for rollback
      const previousData = queryClient.getQueryData(['networking-contacts']);
      
      // Optimistically update the UI
      queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
        return oldData?.map(contact => {
          if (contact.id === contactId) {
            return { 
              ...contact, 
              ...contactFields,
              contact_social_media: contact_social_media || contact.contact_social_media
            };
          }
          return contact;
        }) || [];
      });
      
      // Update the contact
      const { error: contactError } = await supabase
        .from('networking_contacts')
        .update(contactFields)
        .eq('id', contactId);
      
      if (contactError) throw contactError;
      
      // Handle social media links if provided
      if (contact_social_media !== undefined) {
        // Delete existing social media links
        const { error: deleteError } = await supabase
          .from('contact_social_media')
          .delete()
          .eq('contact_id', contactId);
        
        if (deleteError) throw deleteError;
        
        // Insert new social media links if any
        if (contact_social_media && contact_social_media.length > 0) {
          const socialLinksWithContactId = contact_social_media.map(link => ({
            ...link,
            contact_id: contactId
          }));
          
          const { error: socialError } = await supabase
            .from('contact_social_media')
            .insert(socialLinksWithContactId);
          
          if (socialError) throw socialError;
        }
      }
      
      // Return the updated contact
      const updatedContact = await getContact(contactId);
      return updatedContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
      toast({
        title: "Contato atualizado",
        description: "As informações do contato foram atualizadas."
      });
    },
    onError: (error, _, context: any) => {
      console.error('Error updating contact:', error);
      // Revert optimistic update
      if (context.previousData) {
        queryClient.setQueryData(['networking-contacts'], context.previousData);
      }
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o contato.",
        variant: "destructive"
      });
    }
  });

  const deleteContact = useMutation({
    mutationFn: async (contactId: string) => {
      // Save current data for rollback
      const previousData = queryClient.getQueryData(['networking-contacts']);
      
      // Optimistically update UI
      queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
        return oldData?.filter(contact => contact.id !== contactId) || [];
      });
      
      // Delete the contact (cascades to social media links due to foreign key constraint)
      const { error } = await supabase
        .from('networking_contacts')
        .delete()
        .eq('id', contactId);
        
      if (error) throw error;
      return contactId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
      toast({
        title: "Contato removido",
        description: "O contato foi removido da sua rede."
      });
    },
    onError: (error, _, context: any) => {
      console.error('Error deleting contact:', error);
      // Revert optimistic update
      queryClient.setQueryData(['networking-contacts'], context.previousData);
      toast({
        title: "Erro",
        description: "Não foi possível remover o contato.",
        variant: "destructive"
      });
    }
  });

  return {
    contacts,
    isLoading,
    error,
    refetch,
    getContact,
    addContact: addContact.mutate,
    updateContact: (contactId: string, contactData: Partial<NetworkingContact>) => 
      updateContact.mutate({ contactId, contactData }),
    deleteContact: deleteContact.mutate
  };
}
