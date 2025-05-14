
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="darkmode">Modo escuro</Label>
      <Switch 
        id="darkmode" 
        checked={theme === 'dark'}
        onCheckedChange={toggleTheme}
      />
    </div>
  );
};

export default ThemeToggle;
