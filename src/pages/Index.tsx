
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Button from '@/components/Button';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent={true} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="welcome-illustration mb-6">
              {/* Minimalist square calendar */}
              <svg className="w-full max-w-[200px] mx-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* Calendar outer square */}
                <rect x="10" y="20" width="80" height="70" fill="none" stroke="currentColor" strokeWidth="2" rx="4" />
                {/* Calendar header bar */}
                <rect x="10" y="20" width="80" height="15" fill="none" stroke="currentColor" strokeWidth="2" rx="4" />
                {/* Calendar days */}
                <line x1="25" y1="20" x2="25" y2="90" stroke="currentColor" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="90" stroke="currentColor" strokeWidth="1" />
                <line x1="55" y1="20" x2="55" y2="90" stroke="currentColor" strokeWidth="1" />
                <line x1="70" y1="20" x2="70" y2="90" stroke="currentColor" strokeWidth="1" />
                <line x1="85" y1="20" x2="85" y2="90" stroke="currentColor" strokeWidth="1" />
                {/* Calendar rows */}
                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
                <line x1="10" y1="65" x2="90" y2="65" stroke="currentColor" strokeWidth="1" />
                <line x1="10" y1="80" x2="90" y2="80" stroke="currentColor" strokeWidth="1" />
                {/* Small circle for current day */}
                <circle cx="62" cy="57" r="4" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Minha Agenda
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              O aplicativo completo para músicos gerenciarem shows, finanças e rede de contatos. Tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Comece agora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-secondary">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Feito para músicos</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Agenda Inteligente</h3>
                <p className="text-muted-foreground">Organize ensaios, shows e gravações em um único lugar.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Contratos Digitais</h3>
                <p className="text-muted-foreground">Crie e gerencie contratos profissionais com facilidade.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Gestão Financeira</h3>
                <p className="text-muted-foreground">Controle receitas, despesas e notas fiscais em um painel intuitivo.</p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Networking</h3>
                <p className="text-muted-foreground">Conecte-se com outros músicos e expanda sua rede profissional.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Minha Agenda. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
