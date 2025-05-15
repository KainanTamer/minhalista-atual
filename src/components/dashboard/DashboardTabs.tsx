
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Music, User, Calendar as CalendarIcon } from 'lucide-react';
import Calendar from '@/components/calendar';
import FinancesTab from '@/components/tabs/FinancesTab';
import RepertoireTab from '@/components/tabs/RepertoireTab';
import NetworkTab from '@/components/tabs/NetworkTab';

interface DashboardTabsProps {
  initialTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  initialTab = 'agenda',
  onTabChange 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs defaultValue={initialTab} value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4 flex overflow-x-auto pb-1 w-full justify-start lg:justify-center gap-1 md:gap-2">
        <TabsTrigger value="agenda" className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm">
          <CalendarIcon size={16} className="md:mr-1" /> 
          <span className="hidden md:inline">Agenda</span>
        </TabsTrigger>
        <TabsTrigger value="finances" className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm">
          <BarChart size={16} className="md:mr-1" />
          <span className="hidden md:inline">Finanças</span>
        </TabsTrigger>
        <TabsTrigger value="repertoire" className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm">
          <Music size={16} className="md:mr-1" />
          <span className="hidden md:inline">Repertório</span>
        </TabsTrigger>
        <TabsTrigger value="network" className="flex items-center gap-1 px-3 py-1.5 md:px-4 md:py-2 text-sm">
          <User size={16} className="md:mr-1" />
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
