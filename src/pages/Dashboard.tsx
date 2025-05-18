
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import EventDialog from '@/components/EventDialog';
import { useToast } from '@/hooks/use-toast';
import FloatingActions from '@/components/dashboard/FloatingActions';
import { useCalendarEvents } from '@/hooks';
import { useQuery } from '@tanstack/react-query';

const Dashboard: React.FC = () => {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [financeDialogOpen, setFinanceDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Obter eventos para contagem
  const { events, isLoading: eventsLoading } = useCalendarEvents();
  
  // Obter transações financeiras para contagem
  const { data: finances = [], isLoading: financesLoading } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async () => {
      try {
        // Simulação de dados até que a API real seja implementada
        return [];
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
        return [];
      }
    }
  });

  const handleNewEvent = () => {
    setEventDialogOpen(true);
  };

  const handleNewFinance = () => {
    setFinanceDialogOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <WelcomeCard onNewEvent={handleNewEvent} />
          
          <DashboardTabs 
            initialTab={activeTab} 
            onTabChange={handleTabChange} 
          />
        </div>
      </main>

      {/* Botão flutuante com menu de ações */}
      <FloatingActions 
        onAddEvent={handleNewEvent}
        onAddFinance={handleNewFinance}
        eventsCount={events.length}
        financesCount={finances.length}
        repertoireCount={3} // Placeholder até implementação real
        contactsCount={2} // Placeholder até implementação real
      />
      
      <EventDialog 
        open={eventDialogOpen} 
        onOpenChange={setEventDialogOpen} 
        onEventUpdated={() => {
          // Atualizar agenda
          toast({
            title: "Evento criado",
            description: "O evento foi adicionado à sua agenda."
          });
        }}
      />
    </div>
  );
};

export default Dashboard;
