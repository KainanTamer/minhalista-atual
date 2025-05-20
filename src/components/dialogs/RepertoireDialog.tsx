
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRepertoire, RepertoireItem } from '@/hooks/useRepertoire';
import { Music } from 'lucide-react';

interface RepertoireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  editItem?: RepertoireItem | null;
}

const RepertoireDialog: React.FC<RepertoireDialogProps> = ({ open, onOpenChange, onSave, editItem }) => {
  const { addRepertoireItem, updateRepertoireItem } = useRepertoire();
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [key, setKey] = useState('');
  const [bpm, setBpm] = useState<number | string>('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Set form data if editing an existing item
  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title || '');
      setArtist(editItem.artist || '');
      setGenre(editItem.genre || '');
      setKey(editItem.key || '');
      setBpm(editItem.bpm || '');
      setNotes(editItem.notes || '');
    } else {
      resetForm();
    }
  }, [editItem, open]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const itemData = {
      title,
      artist,
      genre,
      key,
      bpm: bpm ? Number(bpm) : undefined,
      notes
    };
    
    if (editItem) {
      updateRepertoireItem({ id: editItem.id, ...itemData });
    } else {
      addRepertoireItem(itemData);
    }
    
    setTimeout(() => {
      setIsSaving(false);
      resetForm();
      onOpenChange(false);
      if (onSave) onSave();
    }, 300);
  };
  
  const resetForm = () => {
    setTitle('');
    setArtist('');
    setGenre('');
    setKey('');
    setBpm('');
    setNotes('');
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            {editItem ? 'Editar Música' : 'Adicionar ao Repertório'}
          </DialogTitle>
          <DialogDescription>
            {editItem ? 'Edite os detalhes da música no seu repertório.' : 'Adicione uma nova música ao seu repertório.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Nome da música *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nome da música"
                required
                className="bg-background"
                autoComplete="off"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="artist">Artista</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Nome do artista"
                className="bg-background"
                autoComplete="off"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="genre">Gênero</Label>
                <Input
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="Pop, Rock, Jazz..."
                  className="bg-background"
                  list="genre-suggestions"
                  autoComplete="off"
                />
                <datalist id="genre-suggestions">
                  <option value="Rock" />
                  <option value="Pop" />
                  <option value="Jazz" />
                  <option value="Blues" />
                  <option value="Clássico" />
                  <option value="Samba" />
                  <option value="MPB" />
                  <option value="Eletrônica" />
                  <option value="Rap" />
                  <option value="Reggae" />
                </datalist>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="key">Tom</Label>
                <Input
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="C, Am, G..."
                  className="bg-background"
                  list="key-suggestions"
                  autoComplete="off"
                />
                <datalist id="key-suggestions">
                  <option value="C" />
                  <option value="D" />
                  <option value="E" />
                  <option value="F" />
                  <option value="G" />
                  <option value="A" />
                  <option value="B" />
                  <option value="Cm" />
                  <option value="Dm" />
                  <option value="Em" />
                </datalist>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bpm">BPM</Label>
              <Input
                id="bpm"
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                placeholder="120"
                min="1"
                max="300"
                className="bg-background"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas ou comentários sobre a música..."
                className="bg-background resize-none"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Salvando...' : editItem ? 'Salvar alterações' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RepertoireDialog;
