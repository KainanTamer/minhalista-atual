
import React from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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

const DeleteAccountSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  
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
  
  return (
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
  );
};

export default DeleteAccountSettings;
