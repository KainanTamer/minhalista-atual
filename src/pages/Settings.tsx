
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Share, 
  Moon, 
  Sun, 
  Bell, 
  BellOff,
  Lock,
  Key,
  Languages
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [language, setLanguage] = useState('pt');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: value === 'pt' ? 'Idioma alterado' : 'Language changed',
      description: value === 'pt' ? 'O idioma foi alterado para Português' : 'Language has been changed to English',
    });
  };
  
  const handleDeleteAccount = async () => {
    try {
      // Aqui você implementaria a lógica real para excluir a conta
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso."
      });
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir conta",
        description: "Não foi possível excluir sua conta. Tente novamente."
      });
    }
  };
  
  const handleShareApp = () => {
    // Aqui você implementaria a lógica de compartilhamento
    // Por enquanto, apenas mostramos um toast
    navigator.share?.({
      title: 'Minha Agenda Musical',
      text: 'Organize sua carreira musical com este aplicativo incrível!',
      url: window.location.origin,
    }).catch(() => {
      // Fallback se a Web Share API não estiver disponível
      toast({
        title: "Link copiado!",
        description: "O link do aplicativo foi copiado para a área de transferência.",
      });
    });
  };
  
  return (
    <div className="min-h-screen bg-secondary/50">
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
      
      <main className="container mx-auto py-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Aplicativo */}
          <Card className="p-5">
            <h2 className="text-xl font-semibold mb-4">Aplicativo</h2>
            
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
          </Card>
          
          {/* Notificações */}
          <Card className="p-5">
            <h2 className="text-xl font-semibold mb-4">Notificações</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                )}
                <span>Lembretes de notificação</span>
              </div>
              <Switch 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </Card>
          
          {/* Conta */}
          <Card className="p-5">
            <h2 className="text-xl font-semibold mb-4">Conta</h2>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={() => navigate('/change-password')}>
                <Key className="w-5 h-5" /> 
                <span>Alterar senha</span>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={() => navigate('/subscriptions')}>
                <Lock className="w-5 h-5" /> 
                <span>Entrar para o Pro</span>
              </Button>
              
              <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={() => {
                toast({
                  title: "Verificando compras",
                  description: "Consultando suas compras anteriores..."
                })
              }}>
                <Lock className="w-5 h-5" /> 
                <span>Restaurar compras</span>
              </Button>
            </div>
          </Card>
          
          {/* Compartilhar */}
          <Card className="p-5">
            <h2 className="text-xl font-semibold mb-4">Compartilhar</h2>
            
            <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={handleShareApp}>
              <Share className="w-5 h-5" /> 
              <span>Compartilhar o aplicativo</span>
            </Button>
          </Card>
          
          {/* Excluir conta */}
          <Card className="p-5 border-destructive">
            <h2 className="text-xl font-semibold text-destructive mb-4">Excluir conta</h2>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full flex items-center justify-start gap-2">
                  <Trash2 className="w-5 h-5" /> 
                  <span>Excluir minha conta</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos 
                    dos nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Sim, excluir minha conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
