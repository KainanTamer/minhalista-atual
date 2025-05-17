
import { SubscriptionLimits } from './types';

export function checkLimit(
  type: 'events' | 'finances' | 'repertoire' | 'networking',
  currentCount: number,
  limits: SubscriptionLimits
): boolean {
  const limit = limits[type];
  
  // Se o limite for -1, significa que é ilimitado
  if (limit === -1) {
    return true;
  }
  
  // Se o limite for um número positivo, verificar se o usuário já atingiu o limite
  return currentCount < limit;
}

export function getDefaultLimits(): SubscriptionLimits {
  return {
    events: 5,
    finances: 5,
    repertoire: 5,
    networking: 5,
    showAds: true
  };
}

export function getPlanLimits(planName: string | null): SubscriptionLimits {
  if (planName === "Pro") {
    return {
      events: -1, // unlimited
      finances: -1, // unlimited
      repertoire: -1, // unlimited
      networking: -1, // unlimited
      showAds: false
    };
  }
  return getDefaultLimits(); // Basic plan or no plan
}
