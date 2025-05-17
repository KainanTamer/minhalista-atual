
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Plus } from 'lucide-react';

const MusicScheduleLogo: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <div className={`relative ${className || 'w-24 h-24'}`}>
      {/* Calendário estilizado similar à imagem de referência */}
      <div className={`relative aspect-square ${isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border-2 shadow-md flex flex-col`}>
        {/* Parte superior do calendário com os 3 "ganchos" */}
        <div className={`relative h-[15%] ${isDarkMode ? 'bg-gray-700' : 'bg-primary/10'} rounded-t-md flex justify-center items-start border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center mx-3">
              <div className={`h-3 w-0.5 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
              <div className={`h-2 w-2 rounded-full ${isDarkMode ? 'border-gray-500' : 'border-gray-400'} border`}></div>
            </div>
          ))}
        </div>
        
        {/* Corpo do calendário com os "dias" */}
        <div className="grid grid-cols-4 grid-rows-3 gap-1 p-2 flex-grow">
          {[...Array(11)].map((_, i) => (
            <div key={i} className={`${isDarkMode ? 'border-gray-600' : 'border-gray-300'} border rounded-sm`}></div>
          ))}
        </div>
      </div>
      
      {/* Círculo com símbolo de mais, similar à imagem */}
      <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} flex items-center justify-center border-2 shadow-sm`}>
        <Plus className={`h-5 w-5 ${isDarkMode ? 'text-primary-foreground' : 'text-primary'}`} />
      </div>
      
      {/* Texto "AGENDA" abaixo do calendário */}
      <div className={`absolute -bottom-7 left-0 right-0 text-center text-xs font-bold ${isDarkMode ? 'text-primary-foreground' : 'text-primary'}`}>
        AGENDA
      </div>
    </div>
  );
};

export default MusicScheduleLogo;
