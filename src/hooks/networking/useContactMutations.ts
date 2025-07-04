
import { useMutation, QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NetworkingContact } from '@/types/networking';
import { SocialMediaLink } from '@/components/dialogs/networking/types';
import type { Toast } from '@/hooks/networking/types';

export function useContactMutations(
  queryClient: QueryClient, 
  toast: Toast,
  getContact: (id: string) => Promise<NetworkingContact | null>
) {
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
      
      // Add the optimistic contact to the cache with animation classes
      queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
        return [
          { ...optimisticContact, className: 'animate-fade-in' }, 
          ...(oldData?.map(contact => ({ ...contact })) || [])
        ];
      });
      
      try {
        // Extract musician-specific fields to add as separate columns
        const { contact_type, musical_genre, instrument, ...basicContactFields } = contactFields;
        
        // Insert the contact
        const { data: newContact, error: contactError } = await supabase
          .from('networking_contacts')
          .insert([{
            ...basicContactFields,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();
        
        if (contactError) throw contactError;

        // If we have musician-specific fields, update the contact with them
        if (contact_type || musical_genre || instrument) {
          const updates: any = {};
          
          // Add contact metadata to a separate metadata field for now
          // This is a workaround until we can alter the table schema
          updates.notes = JSON.stringify({
            ...(newContact.notes ? JSON.parse(newContact.notes) : {}),
            contact_type,
            musical_genre,
            instrument
          });
          
          const { error: updateError } = await supabase
            .from('networking_contacts')
            .update(updates)
            .eq('id', newContact.id);
            
          if (updateError) console.warn("Could not update contact with additional fields:", updateError);
        }
        
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
      } catch (error) {
        console.error("Error in contact creation:", error);
        throw error;
      }
    },
    onSuccess: (newContact) => {
      if (newContact) {
        // Update the query data with the real contact (replacing the temp one)
        queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
          return oldData?.map(contact => 
            contact.id.startsWith('temp-') ? { ...newContact, className: 'animate-fade-in' } : contact
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
      
      // Optimistically update the UI with animation
      queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
        return oldData?.map(contact => {
          if (contact.id === contactId) {
            return { 
              ...contact, 
              ...contactFields,
              contact_social_media: contact_social_media || contact.contact_social_media,
              className: 'animate-pulse'
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
    onSuccess: (updatedContact) => {
      // Remove animation class and update data
      queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
        return oldData?.map(contact => {
          if (contact.id === updatedContact?.id) {
            return { ...updatedContact };
          }
          return contact;
        }) || [];
      });
      
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
      
      // Optimistically update UI with fade-out animation
      queryClient.setQueryData(['networking-contacts'], (oldData: NetworkingContact[] | undefined) => {
        return oldData?.map(contact => {
          if (contact.id === contactId) {
            return { ...contact, className: 'animate-fade-out pointer-events-none opacity-50' };
          }
          return contact;
        }) || [];
      });
      
      // Short delay to allow animation to play
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Now remove from UI
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
    addContact: addContact.mutate,
    updateContact: (contactId: string, contactData: Partial<NetworkingContact>) => 
      updateContact.mutate({ contactId, contactData }),
    deleteContact: deleteContact.mutate
  };
}
