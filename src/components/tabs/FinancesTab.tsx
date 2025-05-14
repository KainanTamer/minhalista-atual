
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, PlusCircle, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { getFinancialTransactions, FinancialTransaction } from '@/services/api';
import FinancialTransactionDialog from '@/components/FinancialTransactionDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const FinancesTab: React.FC = () => {
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | undefined>(undefined);
  const { toast } = useToast();

  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: getFinancialTransactions,
  });

  const { data: balanceData, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['financial-balance'],
    queryFn: async () => {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('get_financial_balance', {
        user_uuid: user.id
      });
      
      if (error) throw error;
      return data || 0;
    }
  });

  const handleAddTransaction = () => {
    setSelectedTransaction(undefined);
    setTransactionDialogOpen(true);
  };

  const handleTransactionClick = (transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  const calculateMonthlyTotals = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const income = monthTransactions
      .filter(t => t.transaction_type === 'receita')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const expenses = monthTransactions
      .filter(t => t.transaction_type === 'despesa')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    return { income, expenses, balance: income - expenses };
  };

  const monthlyTotals = calculateMonthlyTotals();
  
  const getTransactionTypeClass = (type: string) => {
    return type === 'receita' 
      ? 'bg-green-100 dark:bg-green-900 border-l-4 border-l-green-500' 
      : 'bg-red-100 dark:bg-red-900 border-l-4 border-l-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Finanças</h2>
        <Button onClick={handleAddTransaction} className="flex items-center gap-2">
          <PlusCircle size={18} />
          Nova Transação
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingBalance ? (
              <div className="h-8 animate-pulse bg-muted rounded"></div>
            ) : (
              <div className="text-2xl font-bold">
                R$ {balanceData.toFixed(2).replace('.', ',')}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Receitas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              R$ {monthlyTotals.income.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Despesas do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              R$ {monthlyTotals.expenses.toFixed(2).replace('.', ',')}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 animate-pulse bg-muted rounded"></div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">Nenhuma transação registrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors hover:opacity-90 ${getTransactionTypeClass(transaction.transaction_type)}`}
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{transaction.description}</h4>
                    <span className="font-bold">
                      {transaction.transaction_type === 'receita' ? '+' : '-'}
                      R$ {Number(transaction.amount).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {format(new Date(transaction.transaction_date), "dd 'de' MMMM", { locale: ptBR })}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-background/50">
                      {transaction.category === 'show' ? 'Show' :
                       transaction.category === 'venda_merch' ? 'Merchandise' :
                       transaction.category === 'equipamento' ? 'Equipamento' :
                       transaction.category === 'transporte' ? 'Transporte' :
                       transaction.category === 'estudio' ? 'Estúdio' :
                       transaction.category === 'marketing' ? 'Marketing' : 'Outro'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <FinancialTransactionDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        transaction={selectedTransaction}
        onTransactionUpdated={() => refetch()}
      />
    </div>
  );
};

export default FinancesTab;
