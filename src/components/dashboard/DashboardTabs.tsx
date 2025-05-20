
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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs defaultValue={initialTab} value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4 flex overflow-x-auto pb-1 w-full justify-start lg:justify-center gap-1 md:gap-2 bg-background/50 p-1.5 rounded-full shadow-sm border border-border/40">
        <TabsTrigger 
          value="agenda" 
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-full transition-all",
            activeTab === 'agenda' 
              ? "bg-primary/20 text-primary shadow-sm" 
              : "hover:bg-accent/80 hover:text-accent-foreground"
          )}
        >
          <CalendarIcon size={18} className="md:mr-1" /> 
          <span className="hidden md:inline">Agenda</span>
          {todayEvents.length > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary/90 text-primary-foreground">
              {todayEvents.length}
            </Badge>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="finances" 
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-full transition-all",
            activeTab === 'finances' 
              ? "bg-primary/20 text-primary shadow-sm" 
              : "hover:bg-accent/80 hover:text-accent-foreground"
          )}
        >
          <BarChart size={18} className="md:mr-1" />
          <span className="hidden md:inline">Finanças</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="repertoire" 
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-full transition-all",
            activeTab === 'repertoire' 
              ? "bg-primary/20 text-primary shadow-sm" 
              : "hover:bg-accent/80 hover:text-accent-foreground"
          )}
        >
          <Music size={18} className="md:mr-1" />
          <span className="hidden md:inline">Repertório</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="network" 
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-full transition-all",
            activeTab === 'network' 
              ? "bg-primary/20 text-primary shadow-sm" 
              : "hover:bg-accent/80 hover:text-accent-foreground"
          )}
        >
          <User size={18} className="md:mr-1" />
          <span className="hidden md:inline">Networking</span>
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
