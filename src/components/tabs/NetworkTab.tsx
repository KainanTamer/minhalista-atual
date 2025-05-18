import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/toast';
import { Trash2, Lock, Crown, PlusCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/subscription';
import ConfirmModal from '@/components/ui/confirm-modal';
import PlanLimitModal from '@/components/subscription/PlanLimitModal';
import LimitsInfo from '@/components/dashboard/LimitsInfo';
import { supabase } from '@/integrations/supabase/client';

// Componente temporário - substitua pelo seu componente real
const NetworkList = () => (
  <div className="text-center py-8 text-muted-foreground">
    Funcionalidade de networking em desenvolvimento.
  </div>
);

const NetworkTab: React.FC = () => {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  const [contactsCount, setContactsCount] = useState(0);
  const { toast } = useToast();
  const { subscriptionStatus, checkLimit } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  // Simula obtenção de dados de contatos
  useEffect(() => {
    // Simula o número de contatos - substituir por consulta real
    setContactsCount(2);
  }, []);

  const handleDeleteAll = async () => {
    try {
      // Implemente a lógica para excluir todos os contatos
      // await supabase.from('connections').delete().eq('follower_id', user.id);
      
      toast({
        title: "Sucesso!",
        description: "Todos os contatos foram excluídos.",
      });
      setContactsCount(0);
    } catch (error) {
      console.error("Erro ao excluir os contatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir os contatos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleAddContact = () => {
    if (!isPro && !checkLimit('networking', contactsCount)) {
      setIsPlanLimitModalOpen(true);
      return;
    }
    // Adicionar contato (implementar diálogo/formulário)
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Adicionar contato será implementado em breve.",
    });
  };

  // Verificação de 80% do limite atingido
  useEffect(() => {
    if (!isPro) {
      const limit = subscriptionStatus.limits.networking;
      if (limit > 0 && contactsCount >= limit * 0.8 && contactsCount < limit) {
        toast({
          title: "Limite próximo",
          description: `Você já usou ${contactsCount}/${limit} contatos disponíveis no seu plano.`,
        });
      }
    }
  }, [contactsCount, subscriptionStatus.limits.networking, isPro, toast]);

  return (
    <div className="space-y-4">
      <LimitsInfo type="networking" currentCount={contactsCount} />

      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl">Networking</CardTitle>
            <CardDescription>
              Gerencie seus contatos profissionais
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!isPro && (
              <div className="text-sm text-muted-foreground mr-2">
                <span className="font-medium">{contactsCount}</span>
                <span>/</span>
                <span>{subscriptionStatus.limits.networking === -1 ? '∞' : subscriptionStatus.limits.networking}</span>
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
              onClick={handleAddContact}
              disabled={!isPro && !checkLimit('networking', contactsCount)}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Novo contato
              {!isPro && !checkLimit('networking', contactsCount) && (
                <Lock className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <NetworkList />
          
          {contactsCount > 0 && (
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
        title="Deletar todos os contatos"
        description="Tem certeza que deseja excluir TODOS os contatos? Essa ação não pode ser desfeita."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        destructive={true}
      />
      
      <PlanLimitModal
        open={isPlanLimitModalOpen}
        onOpenChange={setIsPlanLimitModalOpen}
        feature="networking"
      />
    </div>
  );
};

export default NetworkTab;
