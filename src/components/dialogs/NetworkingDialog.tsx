
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNetworking } from '@/hooks/useNetworking';
import { PlusCircle, Trash2, Link as LinkIcon, Instagram, Youtube, Music } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface SocialMediaLink {
  platform: string;
  url: string;
}

interface NetworkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  contactId?: string;
}

const NetworkingDialog: React.FC<NetworkingDialogProps> = ({ open, onOpenChange, onSave, contactId }) => {
  const { addContact, updateContact, getContact } = useNetworking();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const loadContact = async () => {
      if (contactId) {
        const contact = await getContact(contactId);
        if (contact) {
          setName(contact.name || '');
          setEmail(contact.email || '');
          setPhone(contact.phone || '');
          setOccupation(contact.occupation || '');
          setCompany(contact.company || '');
          setNotes(contact.notes || '');
          setSocialLinks(contact.contact_social_media || []);
          setIsEditing(true);
        }
      } else {
        resetForm();
        setIsEditing(false);
      }
    };
    
    if (open) {
      loadContact();
    }
  }, [contactId, open, getContact]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const contactData = {
      name,
      email,
      phone,
      occupation,
      company,
      notes,
      contact_social_media: socialLinks
    };
    
    try {
      if (isEditing && contactId) {
        await updateContact(contactId, contactData);
      } else {
        await addContact(contactData);
      }
      
      if (onSave) onSave();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setOccupation('');
    setCompany('');
    setNotes('');
    setSocialLinks([]);
    setNewPlatform('');
    setNewUrl('');
  };
  
  const addSocialLink = () => {
    if (newPlatform && newUrl) {
      setSocialLinks([...socialLinks, { platform: newPlatform, url: newUrl }]);
      setNewPlatform('');
      setNewUrl('');
    }
  };
  
  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'spotify':
        return <Music className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Contato' : 'Adicionar Novo Contato'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do contato em sua rede.' 
              : 'Adicione um novo contato à sua rede de networking.'}
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
                className="bg-background"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="occupation">Ocupação</Label>
                <Input
                  id="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="bg-background"
                  placeholder="Baixista, Produtor, DJ..."
                  list="occupation-suggestions"
                />
                <datalist id="occupation-suggestions">
                  <option value="Vocalista" />
                  <option value="Guitarrista" />
                  <option value="Baixista" />
                  <option value="Baterista" />
                  <option value="Produtor Musical" />
                  <option value="DJ" />
                  <option value="Tecladista" />
                  <option value="Violonista" />
                  <option value="Empresário" />
                </datalist>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="company">Empresa/Banda</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-background"
                  placeholder="Nome da banda, empresa, local..."
                />
              </div>
            </div>
            
            {/* Social media links */}
            <div className="grid gap-3">
              <Label>Redes Sociais</Label>
              
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {socialLinks.map((link, index) => (
                    <Badge key={index} variant="outline" className="pl-2 flex items-center gap-1 bg-background/80">
                      {getSocialIcon(link.platform)}
                      <span className="max-w-[150px] truncate">{link.platform}</span>
                      <Button
                        type="button"
                        variant="ghost" 
                        size="sm"
                        className="h-5 w-5 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                        onClick={() => removeSocialLink(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Remover</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="socialPlatform">Plataforma</Label>
                  <Input
                    id="socialPlatform"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="bg-background"
                    placeholder="Instagram, YouTube, Spotify..."
                    list="platform-suggestions"
                  />
                  <datalist id="platform-suggestions">
                    <option value="Instagram" />
                    <option value="YouTube" />
                    <option value="Spotify" />
                    <option value="Twitter" />
                    <option value="Facebook" />
                    <option value="SoundCloud" />
                    <option value="TikTok" />
                  </datalist>
                </div>
                
                <div className="grid gap-2 flex-1">
                  <Label htmlFor="socialUrl">URL</Label>
                  <Input
                    id="socialUrl"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="bg-background"
                    placeholder="https://..."
                  />
                </div>
                
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={addSocialLink}
                  disabled={!newPlatform || !newUrl}
                  className="mb-[1px]"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Adicionar</span>
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-background resize-none"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Adicionar Contato'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NetworkingDialog;
