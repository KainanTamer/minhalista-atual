
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock, Rocket } from 'lucide-react';

interface PlanLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
  currentCount?: number;
  maxCount?: number;
}

const PlanLimitModal: React.FC<PlanLimitModalProps> = ({ 
  open, 
  onOpenChange,
  feature,
  currentCount,
  maxCount
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/subscriptions');
    onOpenChange(false);
  };

  const percentage = maxCount && currentCount 
    ? Math.min((currentCount / maxCount) * 100, 100) 
    : 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Limite do plano atingido
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <div className="mt-2 mb-4 flex flex-col gap-2">
              <p>
                Você atingiu o limite do seu plano Básico{feature ? ` para ${feature}` : ''}! 
                <Rocket className="inline-block ml-1 h-4 w-4" />
              </p>
              
              {currentCount !== undefined && maxCount !== undefined && (
                <div className="space-y-1.5 mt-2">
                  <div className="flex justify-between text-sm">
                    <span>Limite do plano</span>
                    <span className="font-medium">
                      {currentCount}/{maxCount}
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="bg-secondary h-2"
                    indicatorClassName="bg-destructive h-2" 
                  />
                </div>
              )}
              
              <p className="mt-3">
                Faça upgrade para o plano Pro para liberar recursos ilimitados.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="bg-primary" onClick={handleUpgrade}>
            Fazer Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanLimitModal;
