
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NetworkingContact } from '@/types/networking';
import { getContact, fetchContacts } from '@/services/networking/contactOperations';
import { useContactMutations } from '@/hooks/networking';
import { SocialMediaLink } from '@/components/dialogs/networking/types';

export function useNetworking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: contacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['networking-contacts'],
    queryFn: fetchContacts,
    staleTime: 15000, // data stays fresh for 15 seconds
  });

  const { 
    addContact, 
    updateContact, 
    deleteContact 
  } = useContactMutations(queryClient, toast, getContact);
  
  return {
    contacts,
    isLoading,
    error,
    refetch,
    getContact,
    addContact,
    updateContact,
    deleteContact
  };
}

// Re-export the NetworkingContact type for backward compatibility
export type { NetworkingContact };
