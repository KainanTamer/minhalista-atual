
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/subscription';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ThemeToggle from '@/components/profile/ThemeToggle';
import { useToast } from '@/hooks/use-toast';

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
        
        <div className="flex flex-1 items-center justify-end space-x-1">
          <nav className="flex items-center gap-1.5">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {}} 
              className={cn(
                "rounded-md hover:bg-accent",
              )}
            >
              <Bell className="h-[1.15rem] w-[1.15rem]" />
              <span className="sr-only">Notificações</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')} 
              className={cn(
                "rounded-md hover:bg-accent",
              )}
            >
              <Settings className="h-[1.15rem] w-[1.15rem]" />
              <span className="sr-only">Configurações</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout} 
              className={cn(
                "rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive",
              )}
            >
              <LogOut className="h-[1.15rem] w-[1.15rem]" />
              <span className="sr-only">Logout</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/profile')} 
              className={cn(
                "rounded-md hover:bg-accent",
              )}
            >
              <ProfileAvatar className="h-7 w-7" />
              <span className="sr-only">Perfil</span>
            </Button>
            
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
