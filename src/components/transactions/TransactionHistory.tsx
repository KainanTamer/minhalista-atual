
import React, { useState } from 'react';
import { Check, Clock, X, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export type TransactionStatus = 'completed' | 'pending' | 'canceled';
export type TransactionType = 'add' | 'update' | 'delete' | 'share';

export interface Transaction {
  id: string;
  description: string;
  timestamp: Date;
  status: TransactionStatus;
  type: TransactionType;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  sectionName: string;
  maxItems?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  sectionName,
  maxItems = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (transactions.length === 0) {
    return null;
  }

  // Ordenar transações por data (mais recentes primeiro)
  const sortedTransactions = [...transactions].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  // Limitar número de itens se não estiver expandido
  const displayTransactions = isOpen 
    ? sortedTransactions 
    : sortedTransactions.slice(0, maxItems);

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'canceled':
        return <X className="h-4 w-4 text-destructive" />;
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return diffMins <= 1 ? 'agora mesmo' : `há ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-muted/50 rounded-md p-2 mb-4 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center text-muted-foreground">
          Atividades Recentes em {sectionName}
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">{isOpen ? 'Fechar' : 'Expandir'} histórico</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <div className="mt-1">
        {displayTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="py-2 flex items-center justify-between border-t border-border/30 first:border-t-0 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-background p-1">
                {getStatusIcon(transaction.status)}
              </div>
              <div>
                <p className="text-sm">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">{formatTimestamp(transaction.timestamp)}</p>
              </div>
            </div>
            {transaction.type === 'share' && (
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Share2 className="h-3.5 w-3.5" />
                <span className="sr-only">Compartilhar</span>
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <CollapsibleContent>
        {sortedTransactions.length > maxItems && (
          <div className="pt-2 text-center border-t border-border/30 mt-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setIsOpen(false)}>
              Mostrar menos
            </Button>
          </div>
        )}
      </CollapsibleContent>
      
      {!isOpen && sortedTransactions.length > maxItems && (
        <div className="pt-2 text-center border-t border-border/30 mt-2">
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => setIsOpen(true)}>
            Ver todas ({sortedTransactions.length})
          </Button>
        </div>
      )}
    </Collapsible>
  );
};

export default TransactionHistory;
