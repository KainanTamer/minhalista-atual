
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/subscription';
import { Button } from '@/components/ui/button';
import { UserCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ThemeToggle from '@/components/profile/ThemeToggle';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <div className="mr-1 font-bold">MusicSchedule</div>
          {isPro && (
            <div className="rounded-sm bg-gradient-to-r from-amber-400 to-amber-600 px-1.5 py-0.5 text-[0.65rem] font-bold text-black">
              PRO
            </div>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {}} 
              className={cn(
                "rounded-full hover:bg-accent",
              )}
            >
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Notificações</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/profile')} 
              className={cn(
                "rounded-full hover:bg-accent",
              )}
            >
              <ProfileAvatar className="h-8 w-8" />
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
