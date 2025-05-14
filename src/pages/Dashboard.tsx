import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import EventDialog from '@/components/EventDialog';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const { toast } = useToast();

  const handleNewEvent = () => {
    setEventDialogOpen(true);
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
