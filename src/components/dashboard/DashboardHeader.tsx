
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

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

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
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
  );
};

// Missing import at the top of the file
import { Music } from 'lucide-react';

export default DashboardHeader;
