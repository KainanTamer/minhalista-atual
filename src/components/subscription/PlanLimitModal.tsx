
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
import { Lock } from 'lucide-react';

interface PlanLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

const PlanLimitModal: React.FC<PlanLimitModalProps> = ({ 
  open, 
  onOpenChange,
  feature
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/subscriptions');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Limite do plano atingido
          </DialogTitle>
          <DialogDescription>
            Você atingiu o limite do seu plano Básico{feature ? ` para ${feature}` : ''}! 🚀
            <br />
            Faça upgrade para o plano Pro para liberar recursos ilimitados.
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
