
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Calendar from '@/components/Calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  BarChart, 
  Music, 
  Play, 
  PlusCircle, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Calendar as CalendarIcon
} from 'lucide-react';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Importar os novos componentes para as abas
import FinancesTab from '@/components/tabs/FinancesTab';
import RepertoireTab from '@/components/tabs/RepertoireTab';
import NetworkTab from '@/components/tabs/NetworkTab';
import EventDialog from '@/components/EventDialog';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('agenda');
  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  const formattedToday = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTodayCapitalized = formattedToday.charAt(0).toUpperCase() + formattedToday.slice(1);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNewEvent = () => {
    setEventDialogOpen(true);
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/50">
      {/* Header */}
      <header className="bg-background border-b px-4 py-3 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="font-bold text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <Music size={16} />
              </div>
              Minha Agenda
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
              onClick={handleSignOut}
              className="p-2 rounded-full hover:bg-accent transition-colors md:flex items-center gap-1 hidden"
              aria-label="Sair"
            >
              <LogOut size={18} />
              <span className="text-sm">Sair</span>
            </button>

            <button
              onClick={navigateToProfile}
              className="flex items-center gap-2"
            >
              <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="Avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.user_metadata?.first_name?.[0]?.toUpperCase() || 'M'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline-block">
                {user?.user_metadata?.first_name || 'Perfil'}
              </span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          {/* Welcome Card */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Bem-vindo{user?.user_metadata?.first_name ? `, ${user.user_metadata.first_name}` : ' de volta, Músico'}</CardTitle>
              <CardDescription>
                {formattedTodayCapitalized}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button className="flex items-center gap-2" onClick={handleNewEvent}>
                  <PlusCircle size={18} />
                  Novo Evento
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 md:flex hidden" 
                  onClick={navigateToProfile}
                >
                  <User size={18} />
                  Editar Perfil
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 md:flex hidden"
                  onClick={() => toast({
                    title: "Em breve",
                    description: "Configurações avançadas serão implementadas em breve."
                  })}
                >
                  <Settings size={18} />
                  Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <Tabs defaultValue="agenda" value={activeTab} onValueChange={handleTabChange}>
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
