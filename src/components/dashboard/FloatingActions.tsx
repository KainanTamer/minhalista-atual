
import React, { useState } from 'react';
import { Plus, X, Settings, Calendar, Music, Banknote, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/contexts/subscription';
import PlanLimitModal from '../subscription/PlanLimitModal';

type ActionType = 'event' | 'finance' | 'repertoire' | 'contact';

interface FloatingActionsProps {
  onAddEvent?: () => void;
  onAddFinance?: () => void;
  onAddRepertoire?: () => void;
  onAddContact?: () => void;
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
  contactsCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [limitType, setLimitType] = useState<ActionType | null>(null);
  const navigate = useNavigate();
  const { subscriptionStatus, checkLimit } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';

  const toggleMenu = () => setIsOpen(!isOpen);
  const goToSettings = () => navigate('/settings');

  const handleAction = (type: ActionType) => {
    // Primeiro verificar limite
    let canProceed = true;
    let currentCount = 0;
    let maxCount = 0;

    if (!isPro) {
      switch (type) {
        case 'event':
          currentCount = eventsCount;
          maxCount = subscriptionStatus.limits.events;
          canProceed = checkLimit('events', eventsCount);
          break;
        case 'finance':
          currentCount = financesCount;
          maxCount = subscriptionStatus.limits.finances;
          canProceed = checkLimit('finances', financesCount);
          break;
        case 'repertoire':
          currentCount = repertoireCount;
          maxCount = subscriptionStatus.limits.repertoire;
          canProceed = checkLimit('repertoire', repertoireCount);
          break;
        case 'contact':
          currentCount = contactsCount;
          maxCount = subscriptionStatus.limits.networking;
          canProceed = checkLimit('networking', contactsCount);
          break;
      }
    }

    if (!canProceed) {
      setLimitType(type);
      setLimitModalOpen(true);
      setIsOpen(false);
      return;
    }

    // Se passou na verificação de limite, proceder com a ação
    switch (type) {
      case 'event':
        onAddEvent?.();
        break;
      case 'finance':
        onAddFinance?.();
        break;
      case 'repertoire':
        onAddRepertoire?.();
        break;
      case 'contact':
        onAddContact?.();
        break;
    }
    setIsOpen(false);
  };

  const getFeatureNameByType = (type: ActionType | null): string => {
    switch (type) {
      case 'event': return 'eventos';
      case 'finance': return 'transações financeiras';
      case 'repertoire': return 'repertório';
      case 'contact': return 'networking';
      default: return '';
    }
  };

  const getCurrentCountByType = (type: ActionType | null): number => {
    switch (type) {
      case 'event': return eventsCount;
      case 'finance': return financesCount;
      case 'repertoire': return repertoireCount;
      case 'contact': return contactsCount;
      default: return 0;
    }
  };

  const getMaxCountByType = (type: ActionType | null): number => {
    if (!type) return 0;
    
    switch (type) {
      case 'event': return subscriptionStatus.limits.events;
      case 'finance': return subscriptionStatus.limits.finances;
      case 'repertoire': return subscriptionStatus.limits.repertoire;
      case 'contact': return subscriptionStatus.limits.networking;
      default: return 0;
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Botão de configurações */}
        <Button
          onClick={goToSettings}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full shadow-lg p-3 h-12 w-12"
          size="icon"
        >
          <Settings size={20} />
        </Button>

        {/* Menu de ações flutuante */}
        {isOpen && (
          <div className="flex flex-col-reverse gap-2 mb-2">
            {onAddEvent && (
              <Button
                onClick={() => handleAction('event')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center gap-2 px-4"
                size="sm"
              >
                <Calendar size={16} />
                <span>Novo Evento</span>
              </Button>
            )}

            {onAddFinance && (
              <Button
                onClick={() => handleAction('finance')}
                className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center gap-2 px-4"
                size="sm"
              >
                <Banknote size={16} />
                <span>Nova Transação</span>
              </Button>
            )}

            {onAddRepertoire && (
              <Button
                onClick={() => handleAction('repertoire')}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center gap-2 px-4"
                size="sm"
              >
                <Music size={16} />
                <span>Novo Repertório</span>
              </Button>
            )}

            {onAddContact && (
              <Button
                onClick={() => handleAction('contact')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center gap-2 px-4"
                size="sm"
              >
                <Users size={16} />
                <span>Novo Contato</span>
              </Button>
            )}
          </div>
        )}

        {/* Botão principal para abrir/fechar menu */}
        <Button
          onClick={toggleMenu}
          className={cn(
            "rounded-full shadow-lg p-3 h-14 w-14 transition-all",
            isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
          )}
          size="icon"
        >
          {isOpen ? <X size={24} /> : <Plus size={24} />}
        </Button>
      </div>

      {/* Modal de limite de plano */}
      <PlanLimitModal
        open={limitModalOpen}
        onOpenChange={setLimitModalOpen}
        feature={getFeatureNameByType(limitType)}
        currentCount={getCurrentCountByType(limitType)}
        maxCount={getMaxCountByType(limitType)}
      />
    </>
  );
};

export default FloatingActions;
