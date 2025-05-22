
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface NetworkHeaderProps {
  onAddContact: () => void;
  onClearAllContacts: () => void;
  hasContacts: boolean;
}

const NetworkHeader: React.FC<NetworkHeaderProps> = ({ 
  onAddContact, 
  onClearAllContacts, 
  hasContacts 
}) => {
  return (
    <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
      <div>
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
          Networking Artístico
        </CardTitle>
        <CardDescription>
          Conecte-se com artistas, produtores e venues
        </CardDescription>
      </div>
      <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline"
              size="sm"
              disabled={!hasContacts}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              Limpar tudo
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover todos os contatos?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Todos os contatos serão permanentemente removidos da sua rede.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onClearAllContacts} className="bg-destructive text-destructive-foreground">
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddContact}
          className="group hover:bg-primary/20 hover:text-primary transition-colors ml-auto sm:ml-0"
        >
          <PlusCircle className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" />
          Novo artista
        </Button>
      </div>
    </CardHeader>
  );
};

export default NetworkHeader;
