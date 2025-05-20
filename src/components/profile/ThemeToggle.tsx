
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="rounded-full h-8 w-8 theme-transition"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-primary/90 transition-transform hover:scale-110" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-foreground transition-transform hover:scale-110" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Mudar para modo {theme === 'dark' ? 'claro' : 'escuro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
