
import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/confirm-modal';
import { useSubscription } from '@/contexts/subscription';
import PlanLimitModal from '@/components/subscription/PlanLimitModal';
import UsageLimitBar from '@/components/subscription/UsageLimitBar';
import { cn } from '@/lib/utils';

interface CancelAllButtonProps {
  onConfirm: () => Promise<void>;
  itemCount: number;
  sectionName: string;
  limitType: 'events' | 'finances' | 'repertoire' | 'networking';
  cancellationsUsed: number;
}

const CancelAllButton: React.FC<CancelAllButtonProps> = ({
  onConfirm,
  itemCount,
  sectionName,
  limitType,
  cancellationsUsed
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPlanLimitOpen, setIsPlanLimitOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { subscriptionStatus, checkLimit } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  // Limite máximo de cancelamentos para plano básico
  const MAX_CANCELLATIONS = 5;
  
  const handleClick = () => {
    if (itemCount === 0) {
      return; // Não fazer nada se não houver itens
    }
    
    // Verificar se o usuário não é Pro e já atingiu o limite de cancelamentos
    if (!isPro && cancellationsUsed >= MAX_CANCELLATIONS) {
      setIsPlanLimitOpen(true);
      return;
    }
    
    setIsConfirmOpen(true);
  };
  
  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 items-end">
        {!isPro && (
          <div className="w-full max-w-xs">
            <UsageLimitBar 
              current={cancellationsUsed} 
              limit={MAX_CANCELLATIONS} 
              isPro={isPro} 
              label="Cancelamentos em massa"
            />
          </div>
        )}
        
        <Button
          variant="outline"
          className={cn(
            "border-destructive text-destructive hover:bg-destructive/10",
            (itemCount === 0 || (cancellationsUsed >= MAX_CANCELLATIONS && !isPro)) && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleClick}
          disabled={itemCount === 0 || (cancellationsUsed >= MAX_CANCELLATIONS && !isPro) || isLoading}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir {sectionName === 'Agenda' ? 'Todos os Eventos' : 
                   sectionName === 'Finanças' ? 'Todas as Transações' :
                   sectionName === 'Repertório' ? 'Todo o Repertório' :
                   'Todos os Contatos'}
        </Button>
      </div>
      
      <ConfirmModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirm}
        title={`Excluir tudo em ${sectionName}`}
        description={`Tem certeza que deseja excluir TODOS os itens em ${sectionName.toLowerCase()}? Essa ação não pode ser desfeita.`}
        confirmLabel="Confirmar"
        cancelLabel="Voltar"
        destructive={true}
      />
      
      <PlanLimitModal
        open={isPlanLimitOpen}
        onOpenChange={setIsPlanLimitOpen}
        feature="cancelamentos em massa"
      />
    </>
  );
};

export default CancelAllButton;
