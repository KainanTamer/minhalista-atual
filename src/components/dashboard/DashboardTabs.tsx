
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
      <TabsList className="mb-6 flex overflow-x-auto pb-2 w-full justify-start md:justify-center gap-2">
        <TabsTrigger value="agenda" className="flex items-center gap-1 px-4 py-2">
          <CalendarIcon size={18} /> 
          Agenda
        </TabsTrigger>
        <TabsTrigger value="finances" className="flex items-center gap-1 px-4 py-2">
          <BarChart size={18} />
          Finanças
        </TabsTrigger>
        <TabsTrigger value="repertoire" className="flex items-center gap-1 px-4 py-2">
          <Music size={18} />
          Repertório
        </TabsTrigger>
        <TabsTrigger value="network" className="flex items-center gap-1 px-4 py-2">
          <User size={18} />
          Networking
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="agenda" className="space-y-4 animate-fade-in">
        <div className="flex justify-center">
          <Calendar className="w-full max-w-4xl" />
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
