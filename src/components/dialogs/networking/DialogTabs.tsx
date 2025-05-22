
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DialogTabsProps {
  activeTab: 'personal' | 'social' | 'music';
  setActiveTab: (tab: 'personal' | 'social' | 'music') => void;
}

export const DialogTabs: React.FC<DialogTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Tabs
      defaultValue="personal"
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as 'personal' | 'social' | 'music')}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="personal">Informações</TabsTrigger>
        <TabsTrigger value="music">Música</TabsTrigger>
        <TabsTrigger value="social">Redes</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
