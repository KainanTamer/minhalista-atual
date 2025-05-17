
import { useNavigate } from 'react-router-dom';
import { Menu, X, MusicIcon, LogOut, User, Moon, Sun, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/toast';

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Você saiu com sucesso',
        description: 'Até breve!',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: 'Erro ao sair',
        description: 'Ocorreu um problema ao tentar sair. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo e nome do aplicativo */}
        <div className="flex items-center" onClick={() => navigate('/')} role="button" tabIndex={0}>
          <MusicIcon className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-bold">Minha Agenda</span>
        </div>

        {/* Menu para desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/subscriptions')}>
                Assinaturas
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Menu do usuário</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/subscriptions')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Assinaturas</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? (
                      <>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Modo claro</span>
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Modo escuro</span>
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/signup')}>Criar conta</Button>
            </>
          )}
        </div>

        {/* Botão do menu mobile */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Menu mobile quando aberto */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4">
            {user ? (
              <div className="flex flex-col space-y-3">
                <Button variant="ghost" onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                  Perfil
                </Button>
                <Button variant="ghost" onClick={() => { navigate('/subscriptions'); setMobileMenuOpen(false); }}>
                  Assinaturas
                </Button>
                <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Button variant="ghost" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                  Entrar
                </Button>
                <Button onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>
                  Criar conta
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
