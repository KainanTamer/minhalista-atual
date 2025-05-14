
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, Calendar, Moon, Sun } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  transparent?: boolean;
  showMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false, showMenu = true }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
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

  return (
    <header className={`w-full py-4 px-4 ${transparent ? 'absolute top-0 left-0 z-10' : 'border-b'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" onClick={handleLogoClick} className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <Calendar size={16} />
          </div>
          Minha Agenda
        </a>
        
        {showMenu && (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-medium">
                    <User size={16} />
                    {user.user_metadata.first_name || user.email}
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium">
                    Entrar
                  </Link>
                  <Link to="/signup" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md">
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
            
            <Sheet>
              <SheetTrigger className="block md:hidden p-2">
                <Menu size={20} />
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="text-lg font-medium">
                    Início
                  </Link>
                  
                  {user ? (
                    <>
                      <Link to="/dashboard" className="text-lg font-medium">
                        Dashboard
                      </Link>
                      <Link to="/profile" className="text-lg font-medium">
                        Perfil
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-lg font-medium text-left"
                      >
                        <LogOut size={18} />
                        Sair
                      </button>
                      <div className="flex items-center gap-2 mt-4">
                        <button 
                          onClick={toggleTheme}
                          className="flex items-center gap-2 text-lg font-medium"
                        >
                          {theme === 'dark' ? (
                            <>
                              <Sun size={18} />
                              Modo claro
                            </>
                          ) : (
                            <>
                              <Moon size={18} />
                              Modo escuro
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="text-lg font-medium">
                        Entrar
                      </Link>
                      <Link to="/signup" className="text-lg font-medium">
                        Cadastrar
                      </Link>
                      <div className="flex items-center gap-2 mt-4">
                        <button 
                          onClick={toggleTheme}
                          className="flex items-center gap-2 text-lg font-medium"
                        >
                          {theme === 'dark' ? (
                            <>
                              <Sun size={18} />
                              Modo claro
                            </>
                          ) : (
                            <>
                              <Moon size={18} />
                              Modo escuro
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
