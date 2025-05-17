import React from 'react';
import { useSubscription } from '@/contexts/subscription';

interface AdBannerProps {
  location?: 'top' | 'bottom' | 'sidebar';
}

const AdBanner: React.FC<AdBannerProps> = ({ location = 'top' }) => {
  const { subscriptionStatus } = useSubscription();
  
  // Não mostrar anúncios para usuários do plano Pro
  if (subscriptionStatus.subscription_tier === 'Pro') {
    return null;
  }
  
  // Simular diferentes tipos de anúncios baseados na localização
  const adContent = {
    top: {
      message: "Atualize para o Pro e remova todos os anúncios!",
      style: "w-full bg-slate-100 text-center py-2 text-sm border-b"
    },
    bottom: {
      message: "Acesso ilimitado a todas as funcionalidades. Assine o Pro hoje!",
      style: "w-full bg-slate-100 text-center py-2 text-sm border-t"
    },
    sidebar: {
      message: "Remova esta publicidade e tenha funcionalidades ilimitadas com o Plano Pro!",
      style: "p-3 bg-slate-100 rounded-lg text-sm mb-3 border"
    }
  };
  
  const { message, style } = adContent[location];
  
  return (
    <div className={style}>
      <div className="flex items-center justify-center gap-2">
        <span className="px-1.5 py-0.5 bg-gray-200 text-xs rounded">Anúncio</span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default AdBanner;
