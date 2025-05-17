
import React, { useState } from 'react';
import { Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

const AppSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [language, setLanguage] = useState('pt');
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: value === 'pt' ? 'Idioma alterado' : 'Language changed',
      description: value === 'pt' ? 'O idioma foi alterado para Português' : 'Language has been changed to English',
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Languages className="w-5 h-5 text-muted-foreground" />
          <span>Idioma</span>
        </div>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt">Português</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-blue-300" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
          <span>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
        </div>
        <Switch 
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
        />
      </div>
    </div>
  );
};

export default AppSettings;
