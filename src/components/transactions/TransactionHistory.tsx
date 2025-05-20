
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock, Check, AlertTriangle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
type TransactionType = 'add' | 'update' | 'delete' | 'share';

interface Transaction {
  id: string;
  description: string;
  timestamp: Date;
  status: TransactionStatus;
  type: TransactionType;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  sectionName: string;
  compact?: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions, 
  sectionName,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (transactions.length === 0) {
    return null;
  }
  
  const displayedTransactions = isExpanded ? transactions : transactions.slice(0, compact ? 3 : 5);
  
  const getTransactionIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <Check className="h-3.5 w-3.5 text-green-500" />;
      case 'pending':
        return <Clock className="h-3.5 w-3.5 text-amber-500" />;
      case 'failed':
        return <AlertTriangle className="h-3.5 w-3.5 text-red-500" />;
      case 'cancelled':
        return <X className="h-3.5 w-3.5 text-gray-500" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };
  
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500 text-white">Concluído</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Cancelado</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("space-y-3", compact ? "text-sm" : "")}>
      <div className="flex items-center justify-between">
        <h3 className={cn(
          "font-medium flex items-center gap-1.5",
          compact ? "text-sm" : "text-base"
        )}>
          <Clock className={cn("text-muted-foreground", compact ? "h-4 w-4" : "h-5 w-5")} />
          {compact ? `Atividades Recentes` : `Histórico de ${sectionName}`}
        </h3>
        {transactions.length > (compact ? 3 : 5) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>Mostrar menos <ChevronUp className="h-3 w-3 ml-1" /></>
            ) : (
              <>Ver tudo <ChevronDown className="h-3 w-3 ml-1" /></>
            )}
          </Button>
        )}
      </div>
      
      <div className={cn(
        "space-y-1.5 rounded-md border", 
        compact ? "max-h-[110px] overflow-y-auto p-2" : "p-3"
      )}>
        {displayedTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="flex items-center gap-2 py-1.5 group animate-fade-in"
          >
            <div className="flex-shrink-0">
              {getTransactionIcon(transaction.status)}
            </div>
            
            <div className="flex-grow min-w-0">
              <p className="text-sm truncate">{transaction.description}</p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(transaction.timestamp, { 
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
            
            {!compact && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {getStatusBadge(transaction.status)}
              </div>
            )}
          </div>
        ))}
        
        {displayedTransactions.length === 0 && (
          <div className="py-2 text-center text-muted-foreground text-sm">
            Nenhuma atividade recente
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
