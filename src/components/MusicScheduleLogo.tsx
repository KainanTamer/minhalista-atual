
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar } from 'lucide-react';

const MusicScheduleLogo: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  return (
    <div className={`relative flex flex-col items-center ${className || 'w-24 h-24'}`}>
      {/* Calendário estilizado */}
      <div className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md border-2 border-primary p-1`}>
        {/* Parte superior do calendário com os dias da semana */}
        <div className={`absolute top-0 left-0 right-0 h-5 ${isDarkMode ? 'bg-gray-700' : 'bg-primary/10'} rounded-t-md flex justify-center items-center`}>
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <span key={i} className="text-[0.5rem] mx-1 font-bold text-primary">
              {day}
            </span>
          ))}
        </div>
        
        {/* Ícone de calendário */}
        <div className="pt-5 pb-1">
          <Calendar className={`w-full h-full ${isDarkMode ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
        
        {/* Título da agenda abaixo do ícone */}
        <div className={`text-center text-xs font-medium ${isDarkMode ? 'text-primary-foreground' : 'text-primary'} mb-1`}>
          AGENDA
        </div>
      </div>
      
      {/* Nota musical */}
      <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-primary/10'} flex items-center justify-center border border-primary`}>
        <span className="text-primary text-lg">♪</span>
      </div>
    </div>
  );
};

export default MusicScheduleLogo;
