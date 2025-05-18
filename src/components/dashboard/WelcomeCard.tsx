
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, User } from 'lucide-react';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const WelcomeCard: React.FC<{ onNewEvent: () => void }> = ({ onNewEvent }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const formattedToday = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTodayCapitalized = formattedToday.charAt(0).toUpperCase() + formattedToday.slice(1);
  
  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle>Bem-vindo{user?.user_metadata?.first_name ? `, ${user.user_metadata.first_name}` : ' de volta, Músico'}</CardTitle>
        <CardDescription>
          {formattedTodayCapitalized}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Button className="flex items-center gap-2" onClick={onNewEvent}>
            <PlusCircle size={18} />
            Novo Evento
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 md:flex hidden" 
            onClick={navigateToProfile}
          >
            <User size={18} />
            Editar Perfil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
