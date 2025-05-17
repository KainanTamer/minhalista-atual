
import React from 'react';
import { useSubscription } from '@/contexts/subscription';
import AdBanner from '../ads/AdBanner';

interface AdWrapperProps {
  children: React.ReactNode;
  showTopAd?: boolean;
  showBottomAd?: boolean;
  showSidebarAd?: boolean;
}

const AdWrapper: React.FC<AdWrapperProps> = ({ 
  children, 
  showTopAd = true, 
  showBottomAd = true,
  showSidebarAd = false
}) => {
  const { subscriptionStatus } = useSubscription();
  const isPro = subscriptionStatus.subscription_tier === 'Pro';
  
  if (isPro) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col w-full">
      {showTopAd && <AdBanner location="top" />}
      
      <div className="flex flex-grow">
        {showSidebarAd && (
          <div className="hidden lg:block w-64 flex-shrink-0 mr-4">
            <AdBanner location="sidebar" />
          </div>
        )}
        
        <div className="flex-grow">
          {children}
        </div>
      </div>
      
      {showBottomAd && <AdBanner location="bottom" />}
    </div>
  );
};

export default AdWrapper;
