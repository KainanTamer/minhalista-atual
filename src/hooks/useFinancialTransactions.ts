
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  createFinancialTransaction, 
  updateFinancialTransaction, 
  deleteFinancialTransaction, 
  FinancialTransactionInsert,
  FinancialTransaction 
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useFinancialTransactions = (
  onSuccess?: () => void,
  onClose?: () => void
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: any, transaction?: FinancialTransaction) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para registrar transações.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const isEditing = !!transaction;
    let previousData: any = null;

    try {
      const transactionData: FinancialTransactionInsert = {
        description: values.description,
        transaction_type: values.transaction_type,
        category: values.category,
        amount: parseFloat(values.amount),
        transaction_date: values.transaction_date,
        notes: values.notes || null,
        user_id: user.id
      };

      // Store the previous data for possible rollback
      previousData = queryClient.getQueryData(['financial-transactions']);
      
      if (isEditing && transaction) {
        // For editing, update the local transaction
        queryClient.setQueryData(['financial-transactions'], (old: any) => {
          return old?.map((item: any) => 
            item.id === transaction.id ? { ...item, ...transactionData } : item
          );
        });
        
        const updatedTransaction = await updateFinancialTransaction(transaction.id, transactionData);
        toast({
          title: "Transação atualizada",
          description: "A transação foi atualizada com sucesso.",
        });
        
        // Update specific transaction in the cache
        queryClient.setQueryData(['financial-transactions', transaction.id], updatedTransaction);
      } else {
        // For new transaction, create a temporary ID
        const tempId = `temp-${Date.now()}`;
        const tempTransaction = {
          id: tempId,
          ...transactionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Add to local cache
        queryClient.setQueryData(['financial-transactions'], (old: any) => {
          return [tempTransaction, ...(old || [])];
        });
        
        const newTransaction = await createFinancialTransaction(transactionData);
        toast({
          title: "Transação registrada",
          description: "A transação foi registrada com sucesso.",
        });
        
        // Replace temp transaction with real one
        queryClient.setQueryData(['financial-transactions'], (old: any) => {
          return old?.map((item: any) => 
            item.id === tempId ? newTransaction : item
          );
        });
      }
      
      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      
      if (onClose) onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      // Revert optimistic update
      if (previousData) {
        queryClient.setQueryData(['financial-transactions'], previousData);
      }
      
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (transaction?: FinancialTransaction) => {
    if (!transaction || !window.confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    setIsSubmitting(true);
    let previousData: any = null;
    
    try {
      // Optimistic update - remove from local cache
      previousData = queryClient.getQueryData(['financial-transactions']);
      queryClient.setQueryData(['financial-transactions'], (old: any) => {
        return old?.filter((item: any) => item.id !== transaction.id);
      });
      
      await deleteFinancialTransaction(transaction.id);
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      });
      
      if (onClose) onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      // Revert optimistic update
      if (previousData) {
        queryClient.setQueryData(['financial-transactions'], previousData);
      }
      
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    handleDelete,
    isSubmitting
  };
};

export default useFinancialTransactions;
