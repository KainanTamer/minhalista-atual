
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-2">
        {theme === 'light' ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-blue-400" />
        )}
        <Label htmlFor="darkmode" className="text-sm font-medium">
          {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        </Label>
      </div>
      <Switch 
        id="darkmode" 
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-blue-600"
      />
    </div>
  );
};

export default ThemeToggle;
