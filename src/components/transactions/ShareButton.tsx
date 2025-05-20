
import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ShareButtonProps {
  sectionName: string;
  onShare: (email: string) => Promise<void>;
}

const ShareButton: React.FC<ShareButtonProps> = ({ sectionName, onShare }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleShare = async () => {
    if (!email) {
      setError('Insira um email válido');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await onShare(email);
      setIsDialogOpen(false);
      setEmail('');
    } catch (err) {
      setError('Erro ao compartilhar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button
        variant="outline"
        className="border-primary/30 text-primary hover:bg-primary/5"
        onClick={() => setIsDialogOpen(true)}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Compartilhar {sectionName}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar {sectionName}</DialogTitle>
            <DialogDescription>
              {sectionName === 'Agenda' ? 'Compartilhe sua agenda com outras pessoas. Elas terão acesso somente para visualização.' :
               sectionName === 'Finanças' ? 'Compartilhe seus registros financeiros com outras pessoas. Elas terão acesso somente para visualização.' :
               sectionName === 'Repertório' ? 'Compartilhe seu repertório musical com outras pessoas. Elas terão acesso somente para visualização.' :
               'Compartilhe seus contatos profissionais com outras pessoas. Elas terão acesso somente para visualização.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email para compartilhar</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleShare}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Compartilhar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareButton;
