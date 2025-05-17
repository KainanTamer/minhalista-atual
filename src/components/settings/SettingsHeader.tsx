
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SettingsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-background border-b px-4 py-3 sticky top-0 z-10">
      <div className="container mx-auto flex items-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-full hover:bg-accent transition-colors mr-4"
          aria-label="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-bold text-lg">Configurações</h1>
      </div>
    </header>
  );
};

export default SettingsHeader;
