
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/subscription';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ThemeToggle from '@/components/profile/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscription();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast({
        title: "Sessão encerrada",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: "Não foi possível encerrar sua sessão. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 shadow-light dark:shadow-none">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <div className="mr-2 font-bold text-foreground">Minha Agenda</div>
          {isPro && (
            <div className="rounded-sm bg-gradient-to-r from-amber-400 to-amber-600 px-1.5 py-0.5 text-[0.65rem] font-bold text-black dark:from-amber-300 dark:to-amber-500">
              PRO
            </div>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-3">
          <nav className="flex items-center gap-1">
            {/* Botão de notificações */}
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full hover:bg-accent dark:hover:bg-accent/20 theme-transition"
              aria-label="Notificações"
            >
              <Bell className="h-[1.2rem] w-[1.2rem] dark:text-[#BB86FC] dark:icon-glow" />
              <span className="sr-only">Notificações</span>
            </Button>
            
            {/* Botão de tema - agora com estilo conforme especificação */}
            <ThemeToggle />
            
            {/* Menu de perfil refinado */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-accent dark:hover:bg-accent/20 h-9 w-9 p-0.5 ml-1 theme-transition"
                >
                  <ProfileAvatar className="h-full w-full transition-transform hover:scale-105" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 shadow-light dark:shadow-dark">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/subscriptions')} className="cursor-pointer">
                  Assinatura
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
