
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
import TransactionHistory from '@/components/transactions/TransactionHistory';
import { Card } from '@/components/ui/card';
import DashboardWrapperWithAds from '@/components/dashboard/DashboardWrapperWithAds';
import { useSubscription } from '@/contexts/subscription';

const Dashboard: React.FC = () => {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [financeDialogOpen, setFinanceDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  // Get events for count
  const { events, isLoading: eventsLoading, refetch: refetchEvents } = useCalendarEvents();
  
  // Get financial transactions for count
  const { data: finances = [], isLoading: financesLoading } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async () => {
      try {
        // Simulation of data until the real API is implemented
        return [];
      } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }
    }
  });

  // Collect all transactions from different sections
  const allTransactions = [
    // Events transactions
    ...events.map(event => ({
      id: event.id,
      description: `Evento "${event.title}" criado`,
      timestamp: new Date(event.created_at),
      status: 'completed' as const,
      type: 'add' as const
    })),
    
    // Finance transactions (placeholder)
    ...finances.map(finance => ({
      id: finance.id,
      description: `Transação financeira adicionada`,
      timestamp: new Date(),
      status: 'completed' as const,
      type: 'add' as const
    })),
    
    // Placeholder for repertoire and network transactions
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

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
        <DashboardWrapperWithAds>
          <div className="flex flex-col gap-6">
            <WelcomeCard onNewEvent={handleNewEvent} />
            
            {allTransactions.length > 0 && (
              <Card className="p-4 shadow-sm bg-background/90 border-muted animate-fade-in">
                <TransactionHistory 
                  transactions={allTransactions.slice(0, 5)} 
                  sectionName="Recentes"
                  compact={true}
                />
              </Card>
            )}
            
            <DashboardTabs 
              initialTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </div>
        </DashboardWrapperWithAds>
      </main>

      {/* Floating action button with menu */}
      <FloatingActions 
        onAddEvent={handleNewEvent}
        onAddFinance={handleNewFinance}
        eventsCount={events.length}
        financesCount={finances.length}
        repertoireCount={3} // Placeholder until real implementation
        contactsCount={2} // Placeholder until real implementation 
      />
      
      <EventDialog 
        open={eventDialogOpen} 
        onOpenChange={setEventDialogOpen} 
        onEventUpdated={() => {
          // Update calendar
          refetchEvents();
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
