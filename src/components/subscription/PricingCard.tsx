
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubscriptionPlan } from '@/contexts/SubscriptionContext';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  isRecommended?: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  disabled?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isCurrentPlan,
  isRecommended = false,
  onSelectPlan,
  disabled = false
}) => {
  const formattedPrice = plan.price === 0 
    ? 'Grátis'
    : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(plan.price);

  return (
    <Card className={cn(
      "flex flex-col border-2 h-full transition-all",
      isCurrentPlan ? "border-primary shadow-lg" : 
      isRecommended ? "border-green-500 shadow-lg" : "border-border"
    )}>
      {isCurrentPlan && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          Seu Plano Atual
        </div>
      )}
      
      {!isCurrentPlan && isRecommended && (
        <div className="bg-green-500 text-white text-center py-1 text-sm font-medium">
          Recomendado
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{formattedPrice}</span>
          {plan.price > 0 && <span className="text-muted-foreground">/mês</span>}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
          
          {plan.name === "Básico" && (
            <li className="flex items-start mt-4 pt-4 border-t border-border">
              <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">
                Inclui anúncios e limitações na quantidade de eventos, transações financeiras e contatos de networking.
              </span>
            </li>
          )}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelectPlan(plan)}
          disabled={disabled || (isCurrentPlan && plan.price > 0)}
          variant={isCurrentPlan ? "outline" : isRecommended ? "default" : "secondary"}
          className={cn(
            "w-full",
            isRecommended && !isCurrentPlan ? "bg-green-500 hover:bg-green-600" : ""
          )}
        >
          {isCurrentPlan ? 'Plano Atual' : plan.price === 0 ? 'Plano Gratuito' : 'Assinar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
