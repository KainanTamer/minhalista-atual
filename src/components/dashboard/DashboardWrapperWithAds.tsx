
import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import AdBanner from '../ads/AdBanner';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface DashboardWrapperWithAdsProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardWrapperWithAds: React.FC<DashboardWrapperWithAdsProps> = ({ 
  children,
  title
}) => {
  const { subscriptionStatus } = useSubscription();
  const showAds = subscriptionStatus.subscription_tier !== 'Pro';
  
  return (
    <>
      {showAds && <AdBanner location="top" />}
      
      <div className="w-full space-y-4 mb-8">
        {title && <h2 className="text-2xl font-semibold mb-4">{title}</h2>}
        
        {children}
        
        {showAds && (
          <Card className="p-4 mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Remova anúncios e obtenha acesso ilimitado</h3>
                <p className="text-sm text-muted-foreground">
                  Atualize para o plano Pro e aproveite todos os recursos sem limitações.
                </p>
              </div>
              <Button asChild className="whitespace-nowrap">
                <Link to="/subscriptions" className="flex items-center">
                  Assinar plano Pro <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
      
      {showAds && <AdBanner location="bottom" />}
    </>
  );
};

export default DashboardWrapperWithAds;
