
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNetworking } from '@/hooks/useNetworking';
import { PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SocialMediaInput {
  platform: string;
  url: string;
}

interface NetworkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NetworkingDialog: React.FC<NetworkingDialogProps> = ({ open, onOpenChange }) => {
  const { addContact } = useNetworking();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [socialMedia, setSocialMedia] = useState<SocialMediaInput[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // First add the contact
    const result = await addContact({
      name,
      email,
      phone,
      occupation,
      company,
      notes
    });
    
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setOccupation('');
    setCompany('');
    setNotes('');
    setSocialMedia([]);
    setNewPlatform('');
    setNewUrl('');
  };
  
  const addSocialMediaField = () => {
    if (newPlatform && newUrl) {
      setSocialMedia([...socialMedia, { platform: newPlatform, url: newUrl }]);
      setNewPlatform('');
      setNewUrl('');
    }
  };
  
  const removeSocialMedia = (index: number) => {
    const updatedSocialMedia = [...socialMedia];
    updatedSocialMedia.splice(index, 1);
    setSocialMedia(updatedSocialMedia);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Contato</DialogTitle>
          <DialogDescription>
            Adicione um novo contato à sua rede de networking.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="occupation">Ocupação</Label>
                <Input
                  id="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="company">Empresa/Banda</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Redes Sociais</Label>
              {socialMedia.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {socialMedia.map((social, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {social.platform}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSocialMedia(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Plataforma"
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value)}
                  className="flex-grow-0 w-1/3"
                />
                <Input
                  placeholder="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSocialMediaField}
                  className="shrink-0"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkingDialog;
