
import React, { useState } from 'react';
import { Share2, CopyIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ShareButtonProps {
  sectionName: string;
  sectionId?: string;
  onShare?: (email: string) => Promise<void>;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  sectionName,
  sectionId,
  onShare
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleShare = async () => {
    if (onShare && email) {
      try {
        setIsLoading(true);
        await onShare(email);
        setEmail('');
        setIsDialogOpen(false);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const copyShareLink = () => {
    // Gera um link de compartilhamento (pode ser personalizado conforme necessário)
    const shareLink = `${window.location.origin}/share/${sectionName.toLowerCase()}/${sectionId || ''}`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <Share2 className="h-4 w-4" />
        Compartilhar {sectionName}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Compartilhar {sectionName}</DialogTitle>
            <DialogDescription>
              Compartilhe seus dados de {sectionName.toLowerCase()} com outros usuários ou copie o link para acesso direto.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-4 md:col-span-1">
                Link:
              </span>
              <div className="flex gap-2 col-span-4 md:col-span-3">
                <Input
                  readOnly
                  value={`${window.location.origin}/share/${sectionName.toLowerCase()}/${sectionId || ''}`}
                  className="col-span-3"
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  onClick={copyShareLink}
                >
                  {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium col-span-4 md:col-span-1">
                Por email:
              </span>
              <div className="col-span-4 md:col-span-3">
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleShare} disabled={!email || isLoading}>
              {isLoading ? "Enviando..." : "Enviar convite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareButton;
