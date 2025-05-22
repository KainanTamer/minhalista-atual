
import React from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Sparkles } from 'lucide-react';

const ProUpgradeCard: React.FC = () => {
  return (
    <div className="text-center py-10 px-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-100 dark:border-purple-800/30">
      <div className="mb-3">
        <div className="bg-primary/10 p-3 rounded-full inline-block mb-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Recomendações Inteligentes</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Atualize para o plano Pro e descubra artistas compatíveis com seu perfil, 
          baseado em gêneros musicais, instrumentos e localização.
        </p>
      </div>
      <Button 
        variant="default" 
        className="mt-2 bg-gradient-to-r from-primary to-purple-600"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Upgrade para Pro
      </Button>
    </div>
  );
};

export default ProUpgradeCard;
