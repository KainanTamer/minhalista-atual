
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/toast';
import Header from '@/components/Header';
import PricingPlans from '@/components/subscription/PricingPlans';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import { useSubscription } from '@/contexts/SubscriptionContext';

const Subscriptions: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { refreshSubscriptionStatus } = useSubscription();

  useEffect(() => {
    // Não redirecionar enquanto estiver carregando
    if (loading) return;

    // Redirecionar para login se não estiver autenticado
    if (!user) {
      navigate('/login', { state: { from: '/subscriptions' } });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Verificar parâmetros de URL para status de pagamento
    const searchParams = new URLSearchParams(window.location.search);
    const paymentStatus = searchParams.get('payment');

    if (paymentStatus === 'success') {
      // Atualizar status após pagamento bem-sucedido
      refreshSubscriptionStatus();
      toast({
        title: 'Pagamento processado com sucesso!',
        description: 'Sua assinatura está sendo ativada.',
      });
      // Limpar parâmetros da URL
      navigate('/subscriptions', { replace: true });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: 'Pagamento cancelado',
        description: 'Você pode tentar novamente quando quiser.',
        variant: 'destructive'
      });
      // Limpar parâmetros da URL
      navigate('/subscriptions', { replace: true });
    }
  }, [navigate, refreshSubscriptionStatus]);

  // Mostrar indicador de carregamento enquanto verifica o estado de autenticação
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Escolha seu plano</h1>
            <p className="text-muted-foreground">
              Selecione o plano que melhor atende às suas necessidades
            </p>
          </div>
          
          {/* Status da assinatura atual */}
          <SubscriptionStatus />
          
          {/* Lista de planos */}
          <PricingPlans />
          
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>Todos os planos incluem pagamento seguro e renovação automática</p>
            <p className="mt-2">
              Você pode cancelar ou modificar sua assinatura a qualquer momento
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscriptions;
