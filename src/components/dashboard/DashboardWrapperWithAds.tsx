
import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import AdBanner from '../ads/AdBanner';

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
      </div>
      
      {showAds && <AdBanner location="bottom" />}
    </>
  );
};

export default DashboardWrapperWithAds;
