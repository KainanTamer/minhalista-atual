
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SubscriptionPlan } from '@/contexts/SubscriptionContext';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  disabled?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isCurrentPlan,
  onSelectPlan,
  disabled = false
}) => {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(plan.price);

  return (
    <Card className={cn(
      "flex flex-col border-2 h-full transition-all",
      isCurrentPlan ? "border-primary shadow-lg" : "border-border"
    )}>
      {isCurrentPlan && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          Seu Plano Atual
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{formattedPrice}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onSelectPlan(plan)}
          disabled={disabled || isCurrentPlan}
          variant={isCurrentPlan ? "outline" : "default"}
          className="w-full"
        >
          {isCurrentPlan ? 'Plano Atual' : 'Assinar'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
