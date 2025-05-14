
import React from 'react';
import Header from '@/components/Header';
import LoginForm from '@/components/LoginForm';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block mb-8 text-sm text-muted-foreground hover:text-primary">
            ← Voltar para a página inicial
          </Link>
          
          <LoginForm />
        </div>
      </main>
    </div>
  );
};

export default Login;
