
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Mic, Music } from 'lucide-react';

interface MusicInfoTabProps {
  instruments: string[];
  setInstruments: (instruments: string[]) => void;
  newInstrument: string;
  setNewInstrument: (instrument: string) => void;
  addInstrument: () => void;
  removeInstrument: (instrument: string) => void;
  genres: string[];
  setGenres: (genres: string[]) => void;
  newGenre: string;
  setNewGenre: (genre: string) => void;
  addGenre: () => void;
  removeGenre: (genre: string) => void;
  musicInstrumentsDB: string[];
  musicGenresDB: string[];
}

export const MusicInfoTab: React.FC<MusicInfoTabProps> = ({
  instruments, setInstruments,
  newInstrument, setNewInstrument,
  addInstrument, removeInstrument,
  genres, setGenres,
  newGenre, setNewGenre,
  addGenre, removeGenre,
  musicInstrumentsDB, musicGenresDB
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Instrumentos</h3>
        </div>
        
        {instruments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {instruments.map((instrument, index) => (
              <Badge key={index} variant="outline" className="pl-2 flex items-center gap-1 bg-background/80">
                {instrument}
                <Button
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                  onClick={() => removeInstrument(instrument)}
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
            <Label htmlFor="newInstrument">Adicionar Instrumento</Label>
            <Input
              id="newInstrument"
              value={newInstrument}
              onChange={(e) => setNewInstrument(e.target.value)}
              className="bg-background"
              placeholder="Digite o instrumento..."
              list="instruments-suggestions"
            />
            <datalist id="instruments-suggestions">
              {musicInstrumentsDB.map((instrument, idx) => (
                <option key={idx} value={instrument} />
              ))}
            </datalist>
          </div>
          
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={addInstrument}
            disabled={!newInstrument}
            className="mb-[1px]"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Adicionar</span>
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Gêneros Musicais</h3>
        </div>
        
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {genres.map((genre, index) => (
              <Badge key={index} variant="outline" className="pl-2 flex items-center gap-1 bg-background/80">
                {genre}
                <Button
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full"
                  onClick={() => removeGenre(genre)}
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
            <Label htmlFor="newGenre">Adicionar Gênero</Label>
            <Input
              id="newGenre"
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              className="bg-background"
              placeholder="Digite o gênero musical..."
              list="genres-suggestions"
            />
            <datalist id="genres-suggestions">
              {musicGenresDB.map((genre, idx) => (
                <option key={idx} value={genre} />
              ))}
            </datalist>
          </div>
          
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={addGenre}
            disabled={!newGenre}
            className="mb-[1px]"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Adicionar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
