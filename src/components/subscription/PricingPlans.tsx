
import React, { useState } from 'react';
import PricingCard from './PricingCard';
import { useSubscription, SubscriptionPlan } from '@/contexts/SubscriptionContext';
import { toast } from '@/hooks/toast';

const PricingPlans: React.FC = () => {
  const { plans, plansLoading, subscriptionStatus, createCheckoutSession } = useSubscription();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    // Se for o plano gratuito, não fazemos nada
    if (plan.price === 0) {
      toast({
        title: 'Plano Básico',
        description: 'Você já está usando o plano básico gratuito.'
      });
      return;
    }
    
    if (processingPlanId) return;
    
    try {
      setProcessingPlanId(plan.id);
      
      const checkoutUrl = await createCheckoutSession(plan.stripe_price_id);
      
      if (checkoutUrl) {
        // Abrir a sessão de checkout do Stripe em uma nova aba
        window.open(checkoutUrl, '_blank');
        
        // Informar o usuário sobre o processo
        toast({
          title: 'Checkout em andamento',
          description: 'Completando o checkout na nova aba. Você será redirecionado após o pagamento.'
        });
      }
    } catch (error) {
      console.error('Erro ao processar plano:', error);
      toast({
        title: 'Erro ao processar plano',
        description: 'Não foi possível iniciar o processo de checkout. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (plansLoading) {
    return (
      <div className="flex justify-center py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {[1, 2].map(i => (
            <div key={i} className="h-[400px] rounded-lg border-2 border-border/30 animate-pulse bg-muted/20" />
          ))}
        </div>
      </div>
    );
  }

  // Organizar os planos - gratuito primeiro, depois pagos
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);
  
  if (sortedPlans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum plano disponível no momento. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {sortedPlans.map(plan => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={subscriptionStatus.subscription_tier === plan.name}
            isRecommended={plan.name === "Pro"}
            onSelectPlan={handleSelectPlan}
            disabled={processingPlanId !== null}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
