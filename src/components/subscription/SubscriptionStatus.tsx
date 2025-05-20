
import React from 'react';
import { ArrowRight, CalendarIcon, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/contexts/subscription';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const SubscriptionStatus: React.FC = () => {
  const { subscriptionStatus, openCustomerPortal } = useSubscription();
  const { toast } = useToast();
  
  const handleManageSubscription = async () => {
    const url = await openCustomerPortal();
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const url = await openCustomerPortal();
      if (url) {
        window.open(url, '_blank');
        toast({
          title: "Redirecionando para o portal de assinatura",
          description: "Você será redirecionado para cancelar sua assinatura.",
        });
      }
    } catch (error) {
      console.error("Erro ao abrir portal de assinatura:", error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de assinatura. Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  };

  // Formatar data de expiração, se disponível
  const expirationDate = subscriptionStatus.subscription_end 
    ? format(new Date(subscriptionStatus.subscription_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : 'Data não disponível';

  return (
    <Card className={`mb-6 ${subscriptionStatus.subscription_tier === 'Pro' ? 'border border-primary/20 bg-primary/5' : ''}`}>
      <CardHeader>
        <CardTitle className="text-lg">
          {subscriptionStatus.subscription_tier === 'Pro' ? 'Sua Assinatura' : 'Plano Atual'}
        </CardTitle>
        <CardDescription>
          {subscriptionStatus.subscription_tier === 'Pro' 
            ? 'Detalhes da sua assinatura atual' 
            : 'Você está usando o plano básico gratuito'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium">Plano atual</p>
            <p className={`font-semibold ${subscriptionStatus.subscription_tier === 'Pro' ? 'text-primary' : ''}`}>
              {subscriptionStatus.subscription_tier || 'Básico'}
            </p>
          </div>
          
          {subscriptionStatus.subscription_tier === 'Pro' && (
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span className="font-medium">Renovação</span>
              </div>
              <p className="text-sm">{expirationDate}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className={subscriptionStatus.subscription_tier === 'Pro' ? "flex gap-2 flex-col sm:flex-row" : ""}>
        {subscriptionStatus.subscription_tier === 'Pro' ? (
          <>
            <Button
              onClick={handleManageSubscription}
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              Gerenciar Assinatura
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                >
                  Cancelar Assinatura
                  <XCircle className="ml-2 h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar Assinatura Pro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você está prestes a cancelar sua assinatura. Você continuará tendo acesso aos recursos Pro até o final do período atual.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive hover:bg-destructive/90">
                    Confirmar Cancelamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button
            onClick={() => window.location.href = '/subscriptions'}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            Assinar plano Pro
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionStatus;
