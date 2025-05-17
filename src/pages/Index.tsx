
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Gerencie sua agenda musical com facilidade
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Organize eventos, finanças e repertório em um só lugar, 
            criado especialmente para músicos e profissionais da música.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Button asChild size="lg" className="gap-2">
                <Link to="/dashboard">
                  Ir para o Dashboard <ArrowRight size={18} />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/login">Fazer login</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/signup">Criar conta</Link>
                </Button>
              </>
            )}
          </div>
          
          <div className="mt-10">
            <Link 
              to="/subscriptions" 
              className="text-primary hover:underline font-medium"
            >
              Ver planos de assinatura
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Minha Agenda Musical</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
