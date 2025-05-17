
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { AlertCircle, ArrowRight } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

interface LimitsInfoProps {
  type: 'events' | 'finances' | 'repertoire' | 'networking';
  currentCount: number;
}

const LimitsInfo: React.FC<LimitsInfoProps> = ({ type, currentCount }) => {
  const { subscriptionStatus, checkLimit } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  if (isPro) return null;
  
  const limit = subscriptionStatus.limits[type];
  const isLimitReached = !checkLimit(type, currentCount);
  const remaining = limit - currentCount;
  
  if (isLimitReached) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Limite atingido</AlertTitle>
        <AlertDescription className="flex flex-col space-y-2">
          <p>Você atingiu o limite de {limit} {getLimitTypeName(type)} do plano Básico.</p>
          <Button asChild variant="outline" size="sm" className="mt-2 w-full sm:w-auto">
            <Link to="/subscriptions" className="flex items-center">
              Assinar plano Pro <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (remaining <= 2) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Limite próximo</AlertTitle>
        <AlertDescription>
          Você tem apenas {remaining} {getLimitTypeName(type)} restantes no plano Básico. 
          <Link to="/subscriptions" className="ml-1 text-primary font-medium hover:underline">
            Considere assinar o plano Pro para acesso ilimitado.
          </Link>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

// Função auxiliar para obter o nome do tipo de limite
function getLimitTypeName(type: 'events' | 'finances' | 'repertoire' | 'networking'): string {
  switch (type) {
    case 'events':
      return 'eventos';
    case 'finances':
      return 'transações financeiras';
    case 'repertoire':
      return 'músicas no repertório';
    case 'networking':
      return 'contatos';
    default:
      return 'itens';
  }
}

export default LimitsInfo;
