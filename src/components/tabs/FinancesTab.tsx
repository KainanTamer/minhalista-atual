
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/toast';
import { Trash2, Lock, Crown, PlusCircle, DollarSign, Filter, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useSubscription } from '@/contexts/subscription';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFinancialTransactions, deleteFinancialTransaction } from '@/services/api';
import FinancialTransactionDialog from '@/components/FinancialTransactionDialog';
import ConfirmModal from '@/components/ui/confirm-modal';
import PlanLimitModal from '@/components/subscription/PlanLimitModal';
import LimitsInfo from '@/components/dashboard/LimitsInfo';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const FinancesTab: React.FC = () => {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<'all' | 'receita' | 'despesa'>('all');
  const [search, setSearch] = useState('');
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
        .neq('id', '00000000-0000-0000-0000-000000000000');
        
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
    await deleteAllMutation.mutateAsync();
  };

  const handleAddTransaction = () => {
    if (!isPro && !checkLimit('finances', transactions.length)) {
      setIsPlanLimitModalOpen(true);
      return;
    }
    setIsTransactionDialogOpen(true);
  };

  // Calculate financial summary
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'receita')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'despesa')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Filter transactions based on type and search
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = selectedTransactionType === 'all' || transaction.transaction_type === selectedTransactionType;
    const matchesSearch = transaction.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <LimitsInfo type="finances" currentCount={transactions.length} />
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-500/10 border-green-500/30 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600">Receitas</p>
                <p className="text-2xl font-bold mt-1">R$ {totalIncome.toFixed(2)}</p>
              </div>
              <div className="bg-green-500/20 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-500/10 border-red-500/30 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-red-600">Despesas</p>
                <p className="text-2xl font-bold mt-1">R$ {totalExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-red-500/20 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`${balance >= 0 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-amber-500/10 border-amber-500/30'} shadow-sm hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">{balance >= 0 ? 'Saldo' : 'Déficit'}</p>
                <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                  R$ {Math.abs(balance).toFixed(2)}
                </p>
              </div>
              <div className={`${balance >= 0 ? 'bg-blue-500/20' : 'bg-amber-500/20'} p-2 rounded-full`}>
                <BarChart2 className={`h-5 w-5 ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md bg-card/90 backdrop-blur-sm border border-border/50 transition-all hover:shadow-lg">
        <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              Finanças
            </CardTitle>
            <CardDescription>
              Gerencie suas receitas e despesas
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isPro && (
              <div className="text-sm text-muted-foreground mr-2 bg-background/70 rounded-full px-3 py-0.5 flex items-center">
                <span className="font-medium">{transactions.length}</span>
                <span className="mx-1">/</span>
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
              className="group hover:bg-primary/20 hover:text-primary transition-colors"
            >
              <PlusCircle className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
              Nova transação
              {!isPro && !checkLimit('finances', transactions.length) && (
                <Lock className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pb-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filtrar transações..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-background/50"
              />
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={selectedTransactionType}
              onValueChange={(v) => setSelectedTransactionType(v as 'all' | 'receita' | 'despesa')} 
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="receita">Receitas</TabsTrigger>
                <TabsTrigger value="despesa">Despesas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-background/30 rounded-lg">
              Nenhuma transação financeira encontrada.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className={`bg-muted/30 hover:bg-background/50 transition-colors cursor-pointer`}>
                  <CardContent className="p-3 flex flex-col sm:flex-row justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={transaction.transaction_type === 'receita' ? 'default' : 'destructive'} className="px-1.5 py-0.5">
                          {transaction.transaction_type === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </div>
                      <p className="font-medium mt-1">{transaction.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className={`font-bold ${transaction.transaction_type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {parseFloat(transaction.amount.toString()).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        
        {transactions.length > 0 && (
          <CardFooter className="pt-4 pb-4">
            <div className="w-full flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive/10 group transition-all"
                onClick={handleDeleteAll}
              >
                <Trash2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Limpar Transações
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
      <FinancialTransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
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
