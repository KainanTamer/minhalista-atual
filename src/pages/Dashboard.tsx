
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import EventDialog from '@/components/EventDialog';
import { useToast } from '@/hooks/use-toast';
import { Settings, X } from 'lucide-react';
import ThemeToggle from '@/components/profile/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Dashboard: React.FC = () => {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agenda');
  const { toast } = useToast();

  const handleNewEvent = () => {
    setEventDialogOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
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
      
      {/* Botão de configurações flutuante */}
      <button
        onClick={toggleSettings}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Configurações"
      >
        <Settings size={24} />
      </button>
      
      {/* Painel lateral de configurações */}
      <div className={`fixed top-0 right-0 h-full bg-background border-l border-border w-80 transform transition-transform duration-300 ease-in-out shadow-xl z-40 ${settingsOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Configurações</h2>
            <Button variant="ghost" size="icon" onClick={toggleSettings} aria-label="Fechar configurações">
              <X size={18} />
            </Button>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-6 flex-grow">
            <div>
              <h3 className="text-sm font-medium mb-3">Aparência</h3>
              <div className="space-y-2">
                <ThemeToggle />
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h3 className="text-sm font-medium mb-3">Notificações</h3>
              <div className="flex items-center justify-between">
                <label htmlFor="emailNotif" className="text-sm text-muted-foreground">Notificações por e-mail</label>
                <input type="checkbox" id="emailNotif" className="toggle" />
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h3 className="text-sm font-medium mb-3">Privacidade</h3>
              <div className="text-sm text-muted-foreground">
                <p>Configurações de privacidade e dados serão implementadas em breve.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button variant="outline" className="w-full" onClick={() => {
              toast({
                title: "Configurações salvas",
                description: "Suas preferências foram atualizadas com sucesso."
              });
              setSettingsOpen(false);
            }}>
              Salvar preferências
            </Button>
          </div>
        </div>
      </div>
      
      {/* Overlay para fechar as configurações ao clicar fora */}
      {settingsOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30" 
          onClick={toggleSettings}
          aria-hidden="true"
        />
      )}
      
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
