
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/toast';
import { Trash2, Lock, Crown, PlusCircle, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/subscription';
import ConfirmModal from '@/components/ui/confirm-modal';
import PlanLimitModal from '@/components/subscription/PlanLimitModal';
import LimitsInfo from '@/components/dashboard/LimitsInfo';
import { supabase } from '@/integrations/supabase/client';
import TransactionHistory from '@/components/transactions/TransactionHistory';
import CancelAllButton from '@/components/transactions/CancelAllButton';
import ShareButton from '@/components/transactions/ShareButton';

// Componente temporário - substitua pelo seu componente real
const RepertoireList = () => (
  <div className="text-center py-8 text-muted-foreground">
    Funcionalidade de repertório em desenvolvimento.
  </div>
);

const RepertoireTab: React.FC = () => {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const [repertoireCount, setRepertoireCount] = useState(0);
  const [cancellationsUsed, setCancellationsUsed] = useState(0);
  const { toast } = useToast();
  const { subscriptionStatus, checkLimit } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  // Simula obtenção de dados do repertório
  useEffect(() => {
    // Simula o número de itens no repertório - substituir por consulta real
    setRepertoireCount(3);
  }, []);

  // Simular o histórico de transações (em um caso real, isso viria da API)
  const transactionHistory = [
    {
      id: '1',
      description: 'Música "Garota de Ipanema" adicionada',
      timestamp: new Date(Date.now() - 1 * 60000), // 1 minuto atrás
      status: 'completed' as const,
      type: 'add' as const
    },
    {
      id: '2',
      description: 'Música "Hey Jude" adicionada',
      timestamp: new Date(Date.now() - 3 * 3600000), // 3 horas atrás
      status: 'completed' as const,
      type: 'add' as const
    },
    {
      id: '3',
      description: 'Música "Imagine" adicionada',
      timestamp: new Date(Date.now() - 1 * 86400000), // 1 dia atrás
      status: 'completed' as const,
      type: 'add' as const
    }
  ];

  const handleDeleteAll = async () => {
    try {
      // Implemente a lógica para excluir todo o repertório
      // await supabase.from('repertoire').delete().eq('user_id', user.id);
      
      // Se não for Pro, incrementar contador de cancelamentos
      if (!isPro) {
        setCancellationsUsed(prev => prev + 1);
      }
      
      toast({
        title: "Sucesso!",
        description: "Todo o repertório foi excluído.",
      });
      setRepertoireCount(0);
    } catch (error) {
      console.error("Erro ao excluir o repertório:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o repertório. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleAddToRepertoire = () => {
    if (!isPro && !checkLimit('repertoire', repertoireCount)) {
      setIsPlanLimitModalOpen(true);
      return;
    }
    // Adicionar música ao repertório (implementar diálogo/formulário)
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Adicionar música ao repertório será implementado em breve.",
    });
  };

  // Verificação de 80% do limite atingido
  useEffect(() => {
    if (!isPro) {
      const limit = subscriptionStatus.limits.repertoire;
      if (limit > 0 && repertoireCount >= limit * 0.8 && repertoireCount < limit) {
        toast({
          title: "Limite próximo",
          description: `Você já usou ${repertoireCount}/${limit} músicas disponíveis no seu plano.`,
        });
      }
    }
  }, [repertoireCount, subscriptionStatus.limits.repertoire, isPro, toast]);

  return (
    <div className="space-y-4">
      <LimitsInfo type="repertoire" currentCount={repertoireCount} />
      
      {transactionHistory.length > 0 && (
        <TransactionHistory 
          transactions={transactionHistory}
          sectionName="Repertório"
        />
      )}

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Repertório</CardTitle>
            <CardDescription>
              Gerencie suas músicas e setlists
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isPro && (
              <div className="text-sm text-muted-foreground mr-2">
                <span className="font-medium">{repertoireCount}</span>
                <span>/</span>
                <span>{subscriptionStatus.limits.repertoire === -1 ? '∞' : subscriptionStatus.limits.repertoire}</span>
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
              onClick={handleAddToRepertoire}
              disabled={!isPro && !checkLimit('repertoire', repertoireCount)}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Nova música
              {!isPro && !checkLimit('repertoire', repertoireCount) && (
                <Lock className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RepertoireList />
          
          {repertoireCount > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
              <ShareButton 
                sectionName="Repertório"
                onShare={async (email) => {
                  toast({
                    title: "Link compartilhado",
                    description: `Um convite foi enviado para ${email}.`
                  });
                }}
              />
              
              <CancelAllButton
                onConfirm={handleDeleteAll}
                itemCount={repertoireCount}
                sectionName="Repertório"
                limitType="repertoire"
                cancellationsUsed={cancellationsUsed}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <PlanLimitModal
        open={isPlanLimitModalOpen}
        onOpenChange={setIsPlanLimitModalOpen}
        feature="repertório"
      />
    </div>
  );
};

export default RepertoireTab;
