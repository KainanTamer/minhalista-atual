
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Music, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import MusicScheduleLogo from '@/components/MusicScheduleLogo';
import ThemeToggle from '@/components/profile/ThemeToggle';

const Index: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const features = [
    {
      icon: <Calendar className={`h-8 w-8 ${theme === 'dark' ? 'text-[#BB86FC] icon-glow' : 'text-[#4361EE]'}`} />,
      title: 'Agenda de Eventos',
      description: 'Organize todos seus shows, ensaios e compromissos em um só lugar.',
    },
    {
      icon: <DollarSign className={`h-8 w-8 ${theme === 'dark' ? 'text-[#BB86FC] icon-glow' : 'text-[#4361EE]'}`} />,
      title: 'Controle Financeiro',
      description: 'Gerencie pagamentos, cachês e despesas de forma simples e eficiente.',
    },
    {
      icon: <Music className={`h-8 w-8 ${theme === 'dark' ? 'text-[#BB86FC] icon-glow' : 'text-[#4361EE]'}`} />,
      title: 'Repertório Musical',
      description: 'Crie e organize seu repertório para cada evento e ocasião.',
    },
    {
      icon: <Users className={`h-8 w-8 ${theme === 'dark' ? 'text-[#BB86FC] icon-glow' : 'text-[#4361EE]'}`} />,
      title: 'Networking',
      description: 'Mantenha contatos com outros músicos, produtores e contratantes.',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col theme-transition">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-10">
        {/* Hero Section com botão de tema */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex justify-center relative mb-8">
            <MusicScheduleLogo className={`w-48 h-48 mb-4 ${theme === 'dark' ? 'filter brightness-110' : ''}`} />
            {/* Botão para alternar tema */}
            <div className="absolute top-0 right-0">
              <ThemeToggle />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-[#E9ECEF]">
            Gerencie sua agenda musical com facilidade
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Organize eventos, finanças e repertório em um só lugar, 
            criado especialmente para músicos e profissionais da música.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Button asChild size="lg" className="gap-2 action-button">
                <Link to="/dashboard">
                  Ir para o Dashboard <ArrowRight size={18} />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="action-button">
                  <Link to="/login">Fazer login</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-[#4361EE] text-[#4361EE] dark:border-[#BB86FC] dark:text-[#BB86FC]">
                  <Link to="/signup">Criar conta</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="w-full max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 dark:text-[#E9ECEF]">
            Tudo o que você precisa em um só aplicativo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg border border-[#E9ECEF] dark:border-[#333333] bg-card shadow-card-light dark:shadow-card-dark theme-transition">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2 dark:text-[#E9ECEF]">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="w-full max-w-3xl mx-auto text-center">
          <div className="bg-primary/5 border border-primary/20 dark:bg-accent/5 dark:border-accent/20 rounded-lg p-8 theme-transition">
            <h2 className="text-2xl font-bold mb-4 dark:text-[#E9ECEF]">Pronto para organizar sua carreira musical?</h2>
            <p className="mb-6 text-muted-foreground">
              Comece gratuitamente e atualize para o plano Pro quando precisar de mais recursos.
            </p>
            <Button asChild size="lg" className="action-button">
              <Link to="/subscriptions">Ver planos de assinatura</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-[#E9ECEF] dark:border-[#333333] theme-transition">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Minha Agenda Musical</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
