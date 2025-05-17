
import React from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ShareSettings = () => {
  const { toast } = useToast();
  
  const handleShareApp = () => {
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
    <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={handleShareApp}>
      <Share className="w-5 h-5" /> 
      <span>Compartilhar o aplicativo</span>
    </Button>
  );
};

export default ShareSettings;
