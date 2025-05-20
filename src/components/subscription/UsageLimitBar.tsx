
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Crown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface UsageLimitBarProps {
  current: number;
  limit: number;
  isPro: boolean;
  label?: string;
}

const UsageLimitBar: React.FC<UsageLimitBarProps> = ({ 
  current, 
  limit, 
  isPro,
  label
}) => {
  // Se for plano Pro, não mostra barra de progresso
  if (isPro) {
    return (
      <div className="flex items-center text-sm text-primary font-medium">
        <Crown className="h-4 w-4 mr-1.5 text-primary" />
        <span>Ilimitado</span>
      </div>
    );
  }
  
  // Calcular porcentagem
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80 && percentage < 100;
  const isAtLimit = percentage >= 100;
  
  // Determinar cor da barra de progresso
  const progressClass = cn(
    "h-2.5 transition-all",
    isAtLimit ? "bg-destructive" : isNearLimit ? "bg-orange-500" : "bg-primary"
  );

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {label && `${label}: `}
          <span className={cn(
            "font-medium",
            isNearLimit ? "text-orange-500" : isAtLimit ? "text-destructive" : "text-foreground"
          )}>
            {current}
          </span>
          <span>/</span>
          <span>{limit}</span>
          
          {(isNearLimit || isAtLimit) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-1 inline-flex">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isNearLimit ? 'Seu limite está próximo de ser atingido' : 'Você atingiu o limite do plano básico'}
              </TooltipContent>
            </Tooltip>
          )}
        </span>
        {isNearLimit && !isAtLimit && (
          <span className="text-orange-500 text-xs font-medium">80% usado</span>
        )}
        {isAtLimit && (
          <span className="text-destructive text-xs font-medium">Limite atingido</span>
        )}
      </div>
      <Progress
        value={percentage}
        className="bg-secondary h-2.5 w-full"
        indicatorClassName={progressClass}
      />
    </div>
  );
};

export default UsageLimitBar;
