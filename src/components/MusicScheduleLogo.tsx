
import React from 'react';

const MusicScheduleLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className || 'w-24 h-24'}`}>
      {/* Agenda quadrada minimalista */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-lg border-2 border-primary shadow-md flex flex-col">
        {/* Espiral superior da agenda */}
        <div className="h-4 bg-primary/10 flex justify-center items-center">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-2 w-2 mx-0.5 rounded-full bg-primary" />
          ))}
        </div>
        
        {/* Conteúdo da agenda */}
        <div className="flex-grow p-2 flex flex-col justify-between">
          {/* Título do mês */}
          <div className="text-center text-xs font-medium text-primary mb-1">AGENDA</div>
          
          {/* Linhas representando conteúdo da agenda */}
          <div className="space-y-2">
            <div className="h-1 w-3/4 bg-primary/30 rounded" />
            <div className="h-1 w-2/3 bg-primary/20 rounded" />
            <div className="h-1 w-1/2 bg-primary/30 rounded" />
          </div>
          
          {/* Ícone musical estilizado */}
          <div className="flex justify-center items-center py-2">
            <div className="text-primary text-xl">♪</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicScheduleLogo;
