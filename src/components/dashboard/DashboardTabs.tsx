
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Music, User, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from '@/components/calendar';
import FinancesTab from '@/components/tabs/FinancesTab';
import RepertoireTab from '@/components/tabs/RepertoireTab';
import NetworkTab from '@/components/tabs/NetworkTab';
import { useSubscription } from '@/contexts/subscription';
import { Badge } from '@/components/ui/badge';
import { useCalendarEvents } from '@/hooks';
import { cn } from '@/lib/utils';

interface DashboardTabsProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  initialTab = 'agenda',
  onTabChange 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { subscriptionStatus } = useSubscription();
  const { events } = useCalendarEvents();
  
  // Count today's events
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.start_time);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  // Simulated counts - in a real implementation, these would come from API calls
  const repertoireCount = 3;
  const contactsCount = 2;
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs defaultValue={initialTab} value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4 flex overflow-x-auto pb-1 w-full justify-start lg:justify-center gap-1 md:gap-2">
        <TabsTrigger 
          value="agenda" 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm",
            activeTab === 'agenda' && "font-medium"
          )}
        >
          <CalendarIcon size={16} className="md:mr-1" /> 
          <span className="hidden md:inline">Agenda</span>
          {todayEvents.length > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {todayEvents.length}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="finances" 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm",
            activeTab === 'finances' && "font-medium"
          )}
        >
          <BarChart size={16} className="md:mr-1" />
          <span className="hidden md:inline">Finanças</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="repertoire" 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm",
            activeTab === 'repertoire' && "font-medium"
          )}
        >
          <Music size={16} className="md:mr-1" />
          <span className="hidden md:inline">Repertório</span>
          {repertoireCount > 0 && (
            <Badge variant="outline" className="ml-1 h-5 px-1 rounded-full flex items-center justify-center text-xs">
              {repertoireCount}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="network" 
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm",
            activeTab === 'network' && "font-medium"
          )}
        >
          <User size={16} className="md:mr-1" />
          <span className="hidden md:inline">Networking</span>
          {contactsCount > 0 && (
            <Badge variant="outline" className="ml-1 h-5 px-1 rounded-full flex items-center justify-center text-xs">
              {contactsCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="agenda" className="space-y-4 animate-fade-in">
        <div className="flex justify-center px-0 sm:px-2">
          <Calendar className="w-full" />
        </div>
      </TabsContent>
      
      <TabsContent value="finances" className="animate-fade-in">
        <FinancesTab />
      </TabsContent>
      
      <TabsContent value="repertoire" className="animate-fade-in">
        <RepertoireTab />
      </TabsContent>
      
      <TabsContent value="network" className="animate-fade-in">
        <NetworkTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
