
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface NetworkSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isPro: boolean;
}

const NetworkSearch: React.FC<NetworkSearchProps> = ({
  search,
  onSearchChange,
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  isPro
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-3 mb-4 items-start sm:items-center">
      <div className="flex flex-col sm:flex-row w-full gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar artistas, produtores..." 
            value={search} 
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-background/50"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex bg-muted rounded-md border overflow-hidden">
            <Button
              variant="ghost" 
              size="sm"
              className={`rounded-none px-2 py-1 h-8 ${viewMode === 'grid' ? 'bg-background' : ''}`}
              onClick={() => onViewModeChange('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-none px-2 py-1 h-8 ${viewMode === 'list' ? 'bg-background' : ''}`}
              onClick={() => onViewModeChange('list')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className={`${isMobile ? 'grid grid-cols-3 mb-1' : 'grid grid-cols-5'} w-full`}>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="musicians">Músicos</TabsTrigger>
          <TabsTrigger value="producers">Produtores</TabsTrigger>
          
          {/* In mobile, move these to second row */}
          {!isMobile && (
            <>
              <TabsTrigger value="venues">Locais</TabsTrigger>
              <TabsTrigger value="recommended" className="relative">
                <span className="relative">
                  Recomendados
                  <span className="absolute -top-2 -right-2">
                    <Badge className="bg-primary text-[10px] h-4 w-4 p-0 flex items-center justify-center">
                      {isPro ? '✨' : '🔒'}
                    </Badge>
                  </span>
                </span>
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        {/* Second row of tabs for mobile only */}
        {isMobile && (
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="venues">Locais</TabsTrigger>
            <TabsTrigger value="recommended" className="relative">
              <span className="relative">
                Recomendados
                <span className="absolute -top-2 -right-2">
                  <Badge className="bg-primary text-[10px] h-4 w-4 p-0 flex items-center justify-center">
                    {isPro ? '✨' : '🔒'}
                  </Badge>
                </span>
              </span>
            </TabsTrigger>
          </TabsList>
        )}
      </Tabs>
    </div>
  );
};

export default NetworkSearch;
