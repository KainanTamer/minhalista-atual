
import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/contexts/subscription';
import { AlertCircle, ArrowRight, Crown, Lock } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import UsageLimitBar from '@/components/subscription/UsageLimitBar';

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
  const isNearLimit = limit > 0 && currentCount >= limit * 0.8 && currentCount < limit;
  const remaining = limit - currentCount;
  
  if (isLimitReached) {
    return (
      <Alert variant="destructive" className="mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center">
            Limite atingido
            <Lock className="ml-2 h-4 w-4" />
          </AlertTitle>
        </div>
        <AlertDescription className="space-y-2">
          <p>Você atingiu o limite de {limit} {getLimitTypeName(type)} do plano Básico.</p>
          <UsageLimitBar current={currentCount} limit={limit} isPro={false} />
          <Button asChild variant="outline" size="sm" className="mt-3 w-full sm:w-auto">
            <Link to="/subscriptions" className="flex items-center">
              Assinar plano Pro <Crown className="ml-2 h-4 w-4 text-primary" />
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isNearLimit) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Limite próximo</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Você tem apenas {remaining} {getLimitTypeName(type)} restantes no plano Básico.</p>
          <UsageLimitBar current={currentCount} limit={limit} isPro={false} />
          <Link to="/subscriptions" className="mt-2 inline-block text-primary font-medium hover:underline">
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
