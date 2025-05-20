
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, DollarSign, Music, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSubscription } from '@/contexts/subscription';
import { useToast } from '@/hooks/use-toast';

interface FloatingActionsProps {
  onAddEvent: () => void;
  onAddFinance: () => void;
  onAddRepertoire: () => void;
  onAddContact: () => void;
  eventsCount?: number;
  financesCount?: number;
  repertoireCount?: number;
  contactsCount?: number;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  onAddEvent,
  onAddFinance,
  onAddRepertoire,
  onAddContact,
  eventsCount = 0,
  financesCount = 0,
  repertoireCount = 0,
  contactsCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { subscriptionStatus, checkLimit } = useSubscription();
  const { toast } = useToast();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  const canAddEvent = isPro || checkLimit('events', eventsCount);
  const canAddFinance = isPro || checkLimit('finances', financesCount);
  const canAddRepertoire = isPro || checkLimit('repertoire', repertoireCount);
  const canAddContact = isPro || checkLimit('networking', contactsCount);
  
  const handleAction = (action: () => void, canAdd: boolean, feature: string) => {
    if (canAdd) {
      action();
    } else {
      toast({
        title: "Limite atingido",
        description: `Você atingiu o limite de ${feature} no plano gratuito. Faça upgrade para o plano Pro.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg p-3 h-14 w-14" 
            onClick={() => setIsOpen(true)}
          >
            <PlusCircle className="h-7 w-7" />
            <span className="sr-only">Adicionar</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-2 mr-2">
          <DropdownMenuItem 
            onClick={() => handleAction(onAddEvent, canAddEvent, "eventos")}
            className="flex items-center cursor-pointer"
            disabled={!canAddEvent}
          >
            <Calendar className="mr-2 h-4 w-4 text-blue-500" />
            <span>Novo Evento</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => handleAction(onAddFinance, canAddFinance, "transações financeiras")}
            className="flex items-center cursor-pointer"
            disabled={!canAddFinance}
          >
            <DollarSign className="mr-2 h-4 w-4 text-green-500" />
            <span>Nova Transação</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => handleAction(onAddRepertoire, canAddRepertoire, "músicas no repertório")}
            className="flex items-center cursor-pointer"
            disabled={!canAddRepertoire}
          >
            <Music className="mr-2 h-4 w-4 text-purple-500" />
            <span>Nova Música</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => handleAction(onAddContact, canAddContact, "contatos no networking")}
            className="flex items-center cursor-pointer"
            disabled={!canAddContact}
          >
            <Users className="mr-2 h-4 w-4 text-amber-500" />
            <span>Novo Contato</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FloatingActions;
