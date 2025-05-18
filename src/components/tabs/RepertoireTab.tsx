
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
  const { toast } = useToast();
  const { subscriptionStatus, checkLimit } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  // Simula obtenção de dados do repertório
  useEffect(() => {
    // Simula o número de itens no repertório - substituir por consulta real
    setRepertoireCount(3);
  }, []);

  const handleDeleteAll = async () => {
    try {
      // Implemente a lógica para excluir todo o repertório
      // await supabase.from('repertoire').delete().eq('user_id', user.id);
      
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
      
      <ConfirmModal
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
        onConfirm={handleDeleteAll}
        title="Deletar todo o repertório"
        description="Tem certeza que deseja excluir TODAS as músicas do seu repertório? Essa ação não pode ser desfeita."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        destructive={true}
      />
      
      <PlanLimitModal
        open={isPlanLimitModalOpen}
        onOpenChange={setIsPlanLimitModalOpen}
        feature="repertório"
      />
    </div>
  );
};

export default RepertoireTab;
