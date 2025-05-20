
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RepertoireItem {
  id: string;
  user_id: string;
  title: string;
  artist?: string;
  genre?: string;
  key?: string;
  bpm?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useRepertoire() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: repertoire = [], isLoading, error, refetch } = useQuery({
    queryKey: ['repertoire'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('repertoire')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Error fetching repertoire:', error);
        return [];
      }
    },
    // Add these configs to improve performance
    staleTime: 30000, // data stays fresh for 30 seconds
    refetchOnMount: true, 
    refetchOnWindowFocus: true
  });
  
  const addMutation = useMutation({
    mutationFn: async (newItem: Omit<RepertoireItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('repertoire')
        .insert([{
          ...newItem,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (newItem) => {
      // Optimistic update - update the cache immediately
      queryClient.setQueryData(['repertoire'], (oldData: RepertoireItem[] | undefined) => {
        return [newItem, ...(oldData || [])];
      });
      queryClient.invalidateQueries({ queryKey: ['repertoire'] });
      toast({
        title: "Música adicionada",
        description: "A música foi adicionada ao seu repertório."
      });
    },
    onError: (error) => {
      console.error('Error adding repertoire item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a música ao repertório.",
        variant: "destructive"
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<RepertoireItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('repertoire')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (updatedItem) => {
      // Optimistic update
      queryClient.setQueryData(['repertoire'], (oldData: RepertoireItem[] | undefined) => {
        return oldData?.map(item => item.id === updatedItem.id ? updatedItem : item) || [];
      });
      queryClient.invalidateQueries({ queryKey: ['repertoire'] });
      toast({
        title: "Música atualizada",
        description: "As alterações foram salvas com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error updating repertoire item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a música.",
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('repertoire')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      // Optimistic update
      queryClient.setQueryData(['repertoire'], (oldData: RepertoireItem[] | undefined) => {
        return oldData?.filter(item => item.id !== deletedId) || [];
      });
      queryClient.invalidateQueries({ queryKey: ['repertoire'] });
      toast({
        title: "Música removida",
        description: "A música foi removida do seu repertório."
      });
    },
    onError: (error) => {
      console.error('Error deleting repertoire item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a música.",
        variant: "destructive"
      });
    }
  });

  return {
    repertoire,
    isLoading,
    error,
    refetch,
    addRepertoireItem: addMutation.mutate,
    updateRepertoireItem: updateMutation.mutate,
    deleteRepertoireItem: deleteMutation.mutate
  };
}
