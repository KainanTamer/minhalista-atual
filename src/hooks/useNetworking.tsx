
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast';

export interface NetworkContact {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  occupation?: string;
  company?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMediaLink {
  id: string;
  contact_id: string;
  platform: string;
  url: string;
  created_at: string;
}

export function useNetworking() {
  const queryClient = useQueryClient();
  
  const { data: contacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['networking-contacts'],
    queryFn: async () => {
      try {
        // Using any to bypass TypeScript error until Supabase types are updated
        const { data, error } = await (supabase as any)
          .from('networking_contacts')
          .select('*, contact_social_media(*)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
      }
    }
  });
  
  const addContactMutation = useMutation({
    mutationFn: async (newContact: Omit<NetworkContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      // Using any to bypass TypeScript error until Supabase types are updated
      const { data, error } = await (supabase as any)
        .from('networking_contacts')
        .insert([{
          ...newContact,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
      toast({
        title: "Contato adicionado",
        description: "O contato foi adicionado à sua rede."
      });
    },
    onError: (error) => {
      console.error('Error adding contact:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o contato.",
        variant: "destructive"
      });
    }
  });
  
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<NetworkContact> & { id: string }) => {
      // Using any to bypass TypeScript error until Supabase types are updated
      const { data, error } = await (supabase as any)
        .from('networking_contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
      toast({
        title: "Contato atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o contato.",
        variant: "destructive"
      });
    }
  });
  
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      // Using any to bypass TypeScript error until Supabase types are updated
      const { error } = await (supabase as any)
        .from('networking_contacts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
      toast({
        title: "Contato removido",
        description: "O contato foi removido da sua rede."
      });
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o contato.",
        variant: "destructive"
      });
    }
  });

  // Social Media Links
  const addSocialMediaMutation = useMutation({
    mutationFn: async (newLink: Omit<SocialMediaLink, 'id' | 'created_at'>) => {
      // Using any to bypass TypeScript error until Supabase types are updated
      const { data, error } = await (supabase as any)
        .from('contact_social_media')
        .insert([newLink])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
    },
    onError: (error) => {
      console.error('Error adding social media link:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o link de rede social.",
        variant: "destructive"
      });
    }
  });
  
  const deleteSocialMediaMutation = useMutation({
    mutationFn: async (id: string) => {
      // Using any to bypass TypeScript error until Supabase types are updated
      const { error } = await (supabase as any)
        .from('contact_social_media')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networking-contacts'] });
    },
    onError: (error) => {
      console.error('Error deleting social media link:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o link de rede social.",
        variant: "destructive"
      });
    }
  });

  return {
    contacts,
    isLoading,
    error,
    refetch,
    addContact: addContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    addSocialMedia: addSocialMediaMutation.mutate,
    deleteSocialMedia: deleteSocialMediaMutation.mutate
  };
}
