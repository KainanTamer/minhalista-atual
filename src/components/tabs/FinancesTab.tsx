import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/toast';
import { Trash2, Lock, Crown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/subscription';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFinancialTransactions, deleteFinancialTransaction } from '@/services/api';
import FinancialTransactionDialog from '@/components/FinancialTransactionDialog';
import ConfirmModal from '@/components/ui/confirm-modal';
import PlanLimitModal from '@/components/subscription/PlanLimitModal';
import LimitsInfo from '@/components/dashboard/LimitsInfo';
import { supabase } from '@/integrations/supabase/client';

const FinancesTab: React.FC = () => {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const { toast } = useToast();
  const { subscriptionStatus, checkLimit } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  const queryClient = useQueryClient();
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: getFinancialTransactions
  });
  
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all transactions
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      toast({
        title: "Sucesso!",
        description: "Todas as transações foram excluídas.",
      });
    },
    onError: (error) => {
      console.error("Erro ao excluir todas as transações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir as transações. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const handleDeleteAll = async () => {
    deleteAllMutation.mutate();
  };

  const handleAddTransaction = () => {
    if (!isPro && !checkLimit('finances', transactions.length)) {
      setIsPlanLimitModalOpen(true);
      return;
    }
    setIsTransactionDialogOpen(true);
  };

  // Verificação de 80% do limite atingido
  useEffect(() => {
    if (!isPro) {
      const limit = subscriptionStatus.limits.finances;
      if (limit > 0 && transactions.length >= limit * 0.8 && transactions.length < limit) {
        toast({
          title: "Limite próximo",
          description: `Você já usou ${transactions.length}/${limit} transações financeiras disponíveis no seu plano.`,
        });
      }
    }
  }, [transactions.length, subscriptionStatus.limits.finances, isPro, toast]);

  return (
    <div className="space-y-4">
      <LimitsInfo type="finances" currentCount={transactions.length} />

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Finanças</CardTitle>
            <CardDescription>
              Gerencie suas receitas e despesas
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isPro && (
              <div className="text-sm text-muted-foreground mr-2">
                <span className="font-medium">{transactions.length}</span>
                <span>/</span>
                <span>{subscriptionStatus.limits.finances === -1 ? '∞' : subscriptionStatus.limits.finances}</span>
                {isPro ? (
                  <Crown className="inline-block ml-1 h-4 w-4 text-primary" />
                ) : (
                  <Lock className="inline-block ml-1 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddTransaction}
              disabled={!isPro && !checkLimit('finances', transactions.length)}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Nova transação
              {!isPro && !checkLimit('finances', transactions.length) && (
                <Lock className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma transação financeira registrada ainda.
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle>{transaction.description}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Valor:</p>
                      <p>R$ {transaction.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data:</p>
                      <p>{new Date(transaction.transaction_date).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {transactions.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setIsDeleteAllDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar Tudo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <FinancialTransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
      />
      
      <ConfirmModal
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
        onConfirm={handleDeleteAll}
        title="Deletar todas as transações"
        description="Tem certeza que deseja excluir TODAS as transações financeiras? Essa ação não pode ser desfeita."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        destructive={true}
      />
      
      <PlanLimitModal
        open={isPlanLimitModalOpen}
        onOpenChange={setIsPlanLimitModalOpen}
        feature="transações financeiras"
      />
    </div>
  );
};

export default FinancesTab;
