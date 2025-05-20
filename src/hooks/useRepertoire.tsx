
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
    staleTime: 15000, // data stays fresh for 15 seconds
    refetchOnMount: true, 
    refetchOnWindowFocus: true
  });
  
  const addMutation = useMutation({
    mutationFn: async (newItem: Omit<RepertoireItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      // Immediately update UI with optimistic update
      const optimisticItem = {
        id: `temp-${Date.now()}`,
        user_id: (await supabase.auth.getUser()).data.user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...newItem,
      };
      
      // Optimistically add item to cache before API call
      queryClient.setQueryData(['repertoire'], (oldData: RepertoireItem[] | undefined) => {
        return [optimisticItem, ...(oldData || [])];
      });
      
      // Actual API call
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
    onSuccess: (newItem, _, context) => {
      // Update query data with real item
      queryClient.setQueryData(['repertoire'], (oldData: RepertoireItem[] | undefined) => {
        // Replace the optimistic item with the real one
        return (oldData || []).map(item => 
          item.id.startsWith('temp-') ? newItem : item
        );
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
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['repertoire'] });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<RepertoireItem> & { id: string }) => {
      // Optimistically update UI
      queryClient.setQueryData(['repertoire'], (oldData: RepertoireItem[] | undefined) => {
        return oldData?.map(item => item.id === id ? { ...item, ...updateData } : item) || [];
      });
      
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
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['repertoire'] });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Optimistic update
      queryClient.setQueryData(['repertoire'], (oldData: RepertoireItem[] | undefined) => {
        return oldData?.filter(item => item.id !== id) || [];
      });
      
      const { error } = await supabase
        .from('repertoire')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
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
      // Revert optimistic update
      queryClient.invalidateQueries({ queryKey: ['repertoire'] });
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
