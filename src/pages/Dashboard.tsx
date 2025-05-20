
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import EventDialog from '@/components/EventDialog';
import { useToast } from '@/hooks/use-toast';
import FloatingActions from '@/components/dashboard/FloatingActions';
import { useCalendarEvents } from '@/hooks';
import { useRepertoire } from '@/hooks/useRepertoire';
import { useNetworking } from '@/hooks/useNetworking';
import { useQuery } from '@tanstack/react-query';
import DashboardWrapperWithAds from '@/components/dashboard/DashboardWrapperWithAds';
import { useSubscription } from '@/contexts/subscription';
import RepertoireDialog from '@/components/dialogs/RepertoireDialog';
import NetworkingDialog from '@/components/dialogs/NetworkingDialog';

const Dashboard: React.FC = () => {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [financeDialogOpen, setFinanceDialogOpen] = useState(false);
  const [repertoireDialogOpen, setRepertoireDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  // Get events
  const { events, isLoading: eventsLoading, refetch: refetchEvents } = useCalendarEvents();
  
  // Get repertoire
  const { repertoire, isLoading: repertoireLoading, refetch: refetchRepertoire } = useRepertoire();
  
  // Get networking contacts
  const { contacts, isLoading: contactsLoading, refetch: refetchContacts } = useNetworking();
  
  // Get financial transactions
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

  const handleNewEvent = () => {
    setEventDialogOpen(true);
  };

  const handleNewFinance = () => {
    setFinanceDialogOpen(true);
  };
  
  const handleNewRepertoire = () => {
    setRepertoireDialogOpen(true);
    setActiveTab('repertoire');
  };
  
  const handleNewContact = () => {
    setContactDialogOpen(true);
    setActiveTab('network');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/80">
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-6">
            <WelcomeCard onNewEvent={handleNewEvent} />
            
            <DashboardTabs 
              initialTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </div>
        </div>
      </main>

      {/* Floating action button with menu */}
      <FloatingActions 
        onAddEvent={handleNewEvent}
        onAddFinance={handleNewFinance}
        onAddRepertoire={handleNewRepertoire}
        onAddContact={handleNewContact}
        eventsCount={events.length}
        financesCount={finances.length}
        repertoireCount={repertoire.length}
        contactsCount={contacts.length}
      />
      
      <EventDialog 
        open={eventDialogOpen} 
        onOpenChange={setEventDialogOpen} 
        onEventUpdated={() => {
          refetchEvents();
          toast({
            title: "Evento criado",
            description: "O evento foi adicionado à sua agenda."
          });
        }}
      />
      
      <RepertoireDialog
        open={repertoireDialogOpen}
        onOpenChange={setRepertoireDialogOpen}
      />
      
      <NetworkingDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
      />
    </div>
  );
};

export default Dashboard;
