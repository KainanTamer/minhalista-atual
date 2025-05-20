
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/subscription';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
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
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <div className="mr-1 font-bold">Minha Lista</div>
          {isPro && (
            <div className="rounded-sm bg-gradient-to-r from-amber-400 to-amber-600 px-1.5 py-0.5 text-[0.65rem] font-bold text-black">
              PRO
            </div>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {}} 
              className="rounded-md hover:bg-accent"
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notificações</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')} 
              className="rounded-md hover:bg-accent"
            >
              <Settings className="h-4 w-4" />
              <span className="sr-only">Configurações</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme} 
              className="rounded-md hover:bg-accent"
              title="Mudar tema"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-md hover:bg-accent h-8 w-8"
                >
                  <ProfileAvatar className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
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
