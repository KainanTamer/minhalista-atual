
import React from 'react';

const MusicScheduleLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative ${className || 'w-24 h-24'}`}>
      {/* Agenda quadrada minimalista */}
      <div className="absolute inset-0 bg-white rounded-md border-2 border-primary shadow-md flex flex-col">
        {/* Espiral superior da agenda */}
        <div className="h-3 bg-primary/20 flex justify-center items-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-2 w-2 mx-0.5 rounded-full bg-primary" />
          ))}
        </div>
        
        {/* Linhas representando conteúdo da agenda */}
        <div className="flex-grow p-2 flex flex-col justify-start gap-1">
          <div className="h-1 w-3/4 bg-gray-300 rounded" />
          <div className="h-1 w-1/2 bg-gray-300 rounded" />
          <div className="h-1 w-2/3 bg-gray-300 rounded" />
          
          {/* Ícone musical estilizado */}
          <div className="flex justify-center items-center flex-grow">
            <div className="text-primary text-xl">♪</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicScheduleLogo;
