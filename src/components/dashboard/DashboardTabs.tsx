
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
      <TabsList className="mb-4 flex overflow-x-auto pb-2 w-full justify-start md:justify-center">
        <TabsTrigger value="agenda" className="flex items-center gap-1">
          <CalendarIcon size={16} /> 
          Agenda
        </TabsTrigger>
        <TabsTrigger value="finances" className="flex items-center gap-1">
          <BarChart size={16} />
          Finanças
        </TabsTrigger>
        <TabsTrigger value="repertoire" className="flex items-center gap-1">
          <Music size={16} />
          Repertório
        </TabsTrigger>
        <TabsTrigger value="network" className="flex items-center gap-1">
          <User size={16} />
          Networking
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="agenda" className="space-y-4 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-3">
          <Calendar className="md:col-span-2 bg-background rounded-lg shadow-sm border" />
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
