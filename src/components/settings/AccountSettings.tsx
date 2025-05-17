
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return (
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
  );
};

export default AccountSettings;
